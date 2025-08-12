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

module.exports = router;