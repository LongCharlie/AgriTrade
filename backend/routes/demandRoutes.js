const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { ROLES } = authMiddleware;

// 采购商发布需求
router.post('/demands', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.BUYER]), async (req, res) => {
  const { product_name, quantity, delivery_city } = req.body;
  const buyerId = req.user.userId;
  const result = await require('../model').query(
    'INSERT INTO purchase_demands (buyer_id, product_name, quantity) VALUES ($1, $2, $3) RETURNING *',
    [buyerId, product_name, quantity]
  );
  res.status(201).json(result.rows[0]);
});

// 农户申请供货
router.post('/applications', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.FARMER]), async (req, res) => {
  const { demand_id, quantity, price, record_id, province } = req.body;
  const farmerId = req.user.userId;
  const result = await require('../model').query(
    'INSERT INTO purchase_applications (demand_id, farmer_id, quantity, price, record_id, province) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [demand_id, farmerId, quantity, price, record_id, province]
  );
  res.status(201).json(result.rows[0]);
});

// 获取所有采购需求
router.get('/demands/all', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const demands = await require('../model').getPurchaseDemands();
    const formattedDemands = demands.map(d => ({
      ...d,
      // location: d.location.replace('POINT(', '').replace(')', '').split(' ')
    }));
    res.json(formattedDemands);
  } catch (error) {
    console.error('获取采购需求失败:', error);
    res.status(500).json({ error: '获取采购需求失败' });
  }
});

// 获取农户报价信息
router.get('/quotes', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.FARMER]), async (req, res) => {
  try {
    const applications = await require('../model').getFarmerApplications(req.user.userId);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: '获取报价信息失败' });
  }
});

// 修改报价
router.post('/applications-modify', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.FARMER]), async (req, res) => {
  try {
    const { application_id, record_id, quantity, price, province } = req.body;
    const updatedApp = await require('../model').updateApplication(
      application_id,
      req.user.userId,
      { record_id, quantity, price, province }
    );
    res.json({
      message: '报价修改成功',
      application: updatedApp
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 采购沟通接口
router.post('/communications', authMiddleware.authenticateToken, async (req, res) => {
  const { application_id, content, image } = req.body;
  // 注意：原代码中receiverId未定义，这里保持原样
  const receiverId = null;
  const newComm = await require('../model').query(
    'INSERT INTO communications (application_id, sender_id, receiver_id, content, image_path) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [application_id, req.user.userId, receiverId, content, image]
  );
  res.status(201).json(newComm.rows[0]);
});

// 买家获取采购需求的所有申请（带农户信息）
router.get('/demands/:demandId/applications', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.BUYER]), 
  async (req, res) => {
    try {
      const { demandId } = req.params;
      const buyerId = req.user.userId;
      
      // 首先验证该需求确实属于该买家
      const demandCheck = await require('../model').query(
        'SELECT 1 FROM purchase_demands WHERE demand_id = $1 AND buyer_id = $2',
        [demandId, buyerId]
      );
      
      if (demandCheck.rows.length === 0) {
        return res.status(403).json({ 
          success: false,
          error: '采购需求不存在或无权访问' 
        });
      }

// 买家通过申请并创建订单
router.post('/applications/:applicationId/accept', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.BUYER]),
  async (req, res) => {
    try {
      const { applicationId } = req.params;
      const buyerId = req.user.userId;

      // 开始事务
      await pool.query('BEGIN');

      // 1. 获取申请信息并验证买家权限
      const applicationResult = await pool.query(`
        SELECT pa.*, pd.buyer_id
        FROM purchase_applications pa
        JOIN purchase_demands pd ON pa.demand_id = pd.demand_id
        WHERE pa.application_id = $1
      `, [applicationId]);

      if (applicationResult.rows.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ error: '申请不存在' });
      }

      const application = applicationResult.rows[0];
      
      // 验证当前用户是该需求的所有者
      if (application.buyer_id !== buyerId) {
        await pool.query('ROLLBACK');
        return res.status(403).json({ error: '无权操作此申请' });
      }

      // 2. 拒绝该需求的其他所有申请
      await pool.query(`
        UPDATE purchase_applications
        SET status = 'rejected'
        WHERE demand_id = $1 AND application_id != $2
      `, [application.demand_id, applicationId]);

      // 3. 更新当前申请状态为已接受
      await pool.query(`
        UPDATE purchase_applications
        SET status = 'accepted'
        WHERE application_id = $1
      `, [applicationId]);

      // 4. 创建订单
      const orderResult = await pool.query(`
        INSERT INTO orders (
          farmer_id,
          buyer_id,
          application_id,
          status,
          province,
          city,
          district,
          address_detail
        ) VALUES (
          $1, $2, $3, 'pending_shipment',
          (SELECT province FROM users WHERE user_id = $2),
          (SELECT city FROM users WHERE user_id = $2),
          (SELECT district FROM users WHERE user_id = $2),
          (SELECT address_detail FROM users WHERE user_id = $2)
        ) RETURNING *
      `, [application.farmer_id, buyerId, applicationId]);

      // 5. 更新需求状态为已完成
      await pool.query(`
        UPDATE purchase_demands
        SET status = 'completed'
        WHERE demand_id = $1
      `, [application.demand_id]);

      // 提交事务
      await pool.query('COMMIT');

      res.status(201).json({
        success: true,
        order: orderResult.rows[0],
        message: '申请已接受，订单已创建'
      });

    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('接受申请失败:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// 买家关闭采购需求
router.post('/demands/:demandId/close', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.BUYER]),
  async (req, res) => {
    try {
      const { demandId } = req.params;
      const buyerId = req.user.userId;
      // 验证需求存在且属于当前买家
      const demandCheck = await pool.query(`
        SELECT 1 FROM purchase_demands 
        WHERE demand_id = $1 AND buyer_id = $2 AND status = 'open'
      `, [demandId, buyerId]);

      if (demandCheck.rows.length === 0) {
        return res.status(404).json({ 
          error: '采购需求不存在或已关闭，或您无权操作' 
        });
      }

      // 开始事务
      await pool.query('BEGIN');

      // 1. 拒绝所有关联的申请
      await pool.query(`
        UPDATE purchase_applications
        SET status = 'rejected'
        WHERE demand_id = $1
      `, [demandId]);

      // 2. 关闭需求
      const result = await pool.query(`
        UPDATE purchase_demands
        SET status = 'closed'
        WHERE demand_id = $1
        RETURNING *
      `, [demandId]);

      await pool.query('COMMIT');

      res.json({
        success: true,
        demand: result.rows[0],
        message: '采购需求已关闭'
      });

    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('关闭采购需求失败:', error);
      res.status(500).json({ error: error.message });
    }
  }
);


// 获取申请详情
const applications = await require('../model').query(
      `SELECT 
        pa.application_id,
        pa.quantity,
        pa.price,
        pa.province AS shipping_location,
        TO_CHAR(pa.applied_at, 'YYYY-MM-DD HH24:MI:SS') AS applied_time,
        u.username AS farmer_name,
        u.province AS farmer_province,
        u.city AS farmer_city,
        pr.product_name,
        pr.growth_status,
        CASE 
          WHEN u.avatar_url IS NOT NULL 
          THEN CONCAT('/uploads/avatars/', u.avatar_url) 
          ELSE NULL 
        END AS farmer_avatar
      FROM purchase_applications pa
      JOIN users u ON pa.farmer_id = u.user_id
      LEFT JOIN planting_records pr ON pa.record_id = pr.record_id
      WHERE pa.demand_id = $1
      ORDER BY pa.applied_at DESC`,
      [demandId]
    );
      
    res.json({
      success: true,
      data: applications.rows
    });
    } catch (error) {
      console.error('获取采购申请失败:', error);
      res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
  }
);

// 获取当前买家的采购需求列表
router.get('/buyer/demands', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.BUYER]), 
  async (req, res) => {
    try {
      const buyerId = req.user.userId;
      const demands = await require('../model').getBuyerDemands(buyerId);
      
      res.json({
        success: true,
        data: demands
      });
    } catch (error) {
      console.error('获取采购需求列表失败:', error);
      res.status(500).json({ 
        success: false,
        error: '获取采购需求列表失败' 
      });
    }
  }
);

module.exports = router;