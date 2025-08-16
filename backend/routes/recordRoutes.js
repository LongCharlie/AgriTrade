const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { ROLES } = authMiddleware;

// 新增种植记录接口
router.post('/planting-records', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.FARMER]), async (req, res) => {
  const { product_name, province} = req.body;
  const farmerId = req.user.userId;
  const record = await require('../model').query(
    'INSERT INTO planting_records (farmer_id, product_name, province) VALUES ($1,$2,$3) RETURNING *',
    [farmerId, product_name, province]
  );
  res.status(201).json(record.rows[0]);
});

// 获取农户种植记录
router.get('/growth-records', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.FARMER]), async (req, res) => {
  try {
    const farmerId = req.user.userId;
    const records = await require('../model').getPlantingRecordsByFarmerId(farmerId);
    res.json(records);
  } catch (error) {
    console.error('获取种植记录失败:', error);
    res.status(500).json({ error: '获取种植记录失败' });
  }
});

// 买家获取特定种植记录详情
router.get('/planting-record/:record_id',
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.BUYER]),
  async (req, res) => {
    try {
      const record = await require('../model').getPlantingRecordById(req.params.record_id);
      // const activities = await require('../model').getFarmingActivitiesByRecordId(req.params.recordId);
        res.json(record);
    } catch (error) {
      console.error('获取种植记录详情失败:', error);
      if (error.message === '种植记录不存在或无权访问') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: '获取种植记录详情失败' });
      }
    }
  }
);

// 修改种植记录
router.patch('/planting-records/:id/status', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.FARMER]), async (req, res) => {
  try {
    const recordId = parseInt(req.params.id);
    const newStatus = 'harvested'; 
    const record = await require('../model').query(
      'SELECT * FROM planting_records WHERE record_id = $1 AND farmer_id = $2',
      [recordId, req.user.userId]
    );
    if (record.rows.length === 0) {
      return res.status(404).json({ error: '无权修改此种植记录' });
    }
    const updatedRecord = await require('../model').updatePlantingRecordStatus(recordId, newStatus);
    res.json(updatedRecord);
  } catch (error) {
    console.error('修改种植状态失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除种植记录
router.delete('/growth-records/:record_id', 
  authMiddleware.authenticateToken,
  authMiddleware.checkRole([ROLES.FARMER]),
  async (req, res) => {
    try {
      const recordId = parseInt(req.params.record_id);
      await require('../model').deletePlantingRecord(recordId, req.user.userId);
      res.status(204).json({ message: '种植记录删除成功' });
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
);

// 获取地区订单
router.get('/orders/province', 
  authMiddleware.authenticateToken,
  authMiddleware.checkRole([ROLES.FARMER]),
  async (req, res) => {
    try {
      // 从用户信息中获取所在省份
      const farmer = await require('../model').getUserById(req.user.userId);
      const province = farmer.province;
      if (!province) {
        return res.status(400).json({ error: '用户省份信息未完善' });
      }
      const orders = await require('../model').getProvinceOrders(province);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: '获取订单数据失败' });
    }
  }
);

// 更新物流信息
router.patch('/orders/:id/logistics', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.FARMER]), 
  async (req, res) => {
    const { tracking_number, carrier } = req.body;
    await require('../model').query(
      'UPDATE orders SET tracking_number = $1, pu = $2 WHERE order_id = $3',
      [tracking_number, carrier, req.params.id]
    );
    res.json({ message: '物流信息更新成功' });
});

module.exports = router;