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

// 商户获取所有订单信息
router.get('/merchant/orders/all', 
  authMiddleware.authenticateToken,
  async (req, res) => {
    try {
      const buyerId = req.user.userId;
      
      const query = `
        SELECT 
          o.order_id,
          d.product_name,
          pa.quantity,
          pa.price,
          u.province AS ship_address,
          farmer.username AS sender,
          farmer.phone AS farmer_phone,
          TO_CHAR(o.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
          o.status
        FROM orders o
        JOIN purchase_applications pa ON o.application_id = pa.application_id
        JOIN purchase_demands d ON pa.demand_id = d.demand_id
        JOIN users farmer ON o.farmer_id = farmer.user_id
        JOIN users u ON o.buyer_id = u.user_id
        WHERE o.buyer_id = $1
        ORDER BY o.created_at DESC
      `;
      
      const { rows } = await pool.query(query, [buyerId]);
      res.json(rows);
    } catch (error) {
      console.error('获取订单信息失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  }
);

// 商户获取待收货订单的物流信息
router.get('/merchant/logistics', 
  authMiddleware.authenticateToken,
  async (req, res) => {
    try {
      const buyerId = req.user.userId;
      
      const query = `
        SELECT 
          o.order_id,
          o.logistics_info,
          d.product_name,
          pa.quantity,
          farmer.username AS farmer_name,
          farmer.phone AS farmer_phone
        FROM orders o
        JOIN purchase_applications pa ON o.application_id = pa.application_id
        JOIN purchase_demands d ON pa.demand_id = d.demand_id
        JOIN users farmer ON o.farmer_id = farmer.user_id
        WHERE o.buyer_id = $1 AND o.status = 'shipped'
        ORDER BY o.shipment_time DESC
      `;
      
      const { rows } = await pool.query(query, [buyerId]);
      res.json(rows);
    } catch (error) {
      console.error('获取物流信息失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  }
);

// 商户获取待审核的售后订单信息
router.get('/merchant/pending-after-sale', 
  authMiddleware.authenticateToken,
  async (req, res) => {
    try {
      const buyerId = req.user.userId;
      
      const query = `
        SELECT 
          o.order_id,
          o.after_sale_reason,
          o.after_sale_reason_images,
          d.product_name,
          pa.quantity,
          pa.price,
          farmer.username AS farmer_name
        FROM orders o
        JOIN purchase_applications pa ON o.application_id = pa.application_id
        JOIN purchase_demands d ON pa.demand_id = d.demand_id
        JOIN users farmer ON o.farmer_id = farmer.user_id
        WHERE o.buyer_id = $1 AND o.status = 'after_sale_requested'
        ORDER BY o.created_at DESC
      `;
      
      const { rows } = await pool.query(query, [buyerId]);
      res.json(rows);
    } catch (error) {
      console.error('获取待审核售后信息失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  }
);

// 商户获取已审核的售后订单信息
router.get('/merchant/reviewed-after-sale', 
  authMiddleware.authenticateToken,
  async (req, res) => {
    try {
      const buyerId = req.user.userId;
      
      const query = `
        SELECT 
          o.order_id,
          o.after_sale_reason,
          o.admin_reason,
          o.status AS final_status,
          d.product_name,
          pa.quantity,
          pa.price,
          farmer.username AS farmer_name,
          TO_CHAR(o.resolved_at, 'YYYY-MM-DD HH24:MI:SS') AS reviewed_at
        FROM orders o
        JOIN purchase_applications pa ON o.application_id = pa.application_id
        JOIN purchase_demands d ON pa.demand_id = d.demand_id
        JOIN users farmer ON o.farmer_id = farmer.user_id
        WHERE o.buyer_id = $1 AND o.status IN ('after_sale_resolved', 'after_sale_rejected')
        ORDER BY o.resolved_at DESC
      `;
      
      const { rows } = await pool.query(query, [buyerId]);
      res.json(rows);
    } catch (error) {
      console.error('获取已审核售后信息失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  }
);

// 买家申请售后
router.post('/:id/after-sale', 
  authMiddleware.authenticateToken,
  async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { reason, images } = req.body;
      const buyerId = req.user.userId;

      // 验证必填字段
      if (!reason) {
        return res.status(400).json({ error: '售后原因不能为空' });
      }

      // 验证订单是否存在且属于当前买家
      const orderCheck = await pool.query(
        'SELECT 1 FROM orders WHERE order_id = $1 AND buyer_id = $2',
        [orderId, buyerId]
      );

      if (orderCheck.rows.length === 0) {
        return res.status(404).json({ error: '订单不存在或无权操作' });
      }

      // 更新订单状态和售后信息
      const result = await pool.query(
        `UPDATE orders 
         SET 
           status = 'after_sale_requested',
           after_sale_reason = $1,
           after_sale_reason_images = $2,
           updated_at = NOW()
         WHERE order_id = $3
         RETURNING *`,
        [reason, images.join(','), orderId]
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error('申请售后失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  }
);

// 买家确认收货
router.post('/:id/confirm', 
  authMiddleware.authenticateToken,
  async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const buyerId = req.user.userId;

      // 验证订单是否存在且属于当前买家
      const orderCheck = await pool.query(
        'SELECT 1 FROM orders WHERE order_id = $1 AND buyer_id = $2 AND status = $3',
        [orderId, buyerId, 'shipped']
      );

      if (orderCheck.rows.length === 0) {
        return res.status(404).json({ 
          error: '订单不存在、无权操作或订单状态不符合确认收货条件' 
        });
      }

      // 更新订单状态为已完成
      const result = await pool.query(
        `UPDATE orders 
         SET 
           status = 'completed',
           buyer_confirm_time = NOW(),
           updated_at = NOW()
         WHERE order_id = $1
         RETURNING *`,
        [orderId]
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error('确认收货失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  }
);

module.exports = router;