const express = require('express');
const router = express.Router();
const { updateOrderLogisticsInfo } = require('../model');
const { getFarmerOrders } = require('../model');
const { updateOrderStatus_farmer } = require('../model');
const authMiddleware = require('../middleware/authMiddleware');

// 更新物流信息
router.patch('/:id/logistics', 
  authMiddleware.authenticateToken,
  async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const logisticsInfo = req.body.logistics_info;

      // 验证必填字段
      if (!logisticsInfo) {
        return res.status(400).json({ error: '物流信息不能为空' });
      }

      // 更新数据库
      const updatedOrder = await updateOrderLogisticsInfo(orderId, logisticsInfo);

      if (!updatedOrder) {
        return res.status(404).json({ error: '订单不存在' });
      }

      res.json(updatedOrder);
    } catch (error) {
      console.error('更新物流信息失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  }
);

// 获取农户所有订单
router.get('/all', 
  authMiddleware.authenticateToken,
  async (req, res) => {
    try {
      const farmerId = req.user.userId; // 当前用户是农户
      const orders = await getFarmerOrders(farmerId);
      const formattedOrders = orders;

      res.json(formattedOrders);
    } catch (error) {
      console.error('获取订单失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  }
);

// 修改订单状态
router.post('/:order_id/status', 
  authMiddleware.authenticateToken,
  async (req, res) => {
    try {
      const orderId = parseInt(req.params.order_id);
      const newStatus = req.body.status;
      // 验证必填字段
      if (!newStatus) {
        return res.status(400).json({ error: '缺少状态参数' });
      }
      // 更新数据库
      const updatedOrder = await updateOrderStatus_farmer(orderId, newStatus);

      if (!updatedOrder) {
        return res.status(404).json({ error: '订单不存在' });
      }
      res.json(updatedOrder);
    } catch (error) {
      console.error('修改订单状态失败:', error);
      if (error.message === '无效的状态值') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: '服务器错误' });
      }
    }
  }
);


module.exports = router;