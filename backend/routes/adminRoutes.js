// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const model = require('../model');
const authMiddleware = require('../middleware/authMiddleware');

// 管理员权限校验中间件
const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '无管理员权限' });
  }
  next();
};

// 删除证书
router.delete('/certificates/:id', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      await model.deleteCertificate(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// 获取所有提问（关联用户表）
router.get('/questions', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const questions = await model.getAdminQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// 获取单个提问详情（关联用户表）
router.get('/questions/:id', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const question = await model.getQuestionWithUser(req.params.id);
      if (!question) return res.status(404).json({ error: '问题不存在' });
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// 获取提问的所有回答（关联专家表）
router.get('/questions/:id/answers', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const answers = await model.getAnswersByQuestion(req.params.id);
      res.json(answers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// 获取所有有售后原因的订单
router.get('/orders/after-sale', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const orders = await model.getAfterSaleOrders();
      res.json(orders);
    } catch (error) {
      console.error('获取售后订单失败:', error);
      res.status(500).json({ error: '获取售后订单失败' });
    }
});

// 管理员提交售后订单审核理由
router.post('/orders/:order_id/resolved-reason', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const { decision, reason } = req.body;
      const orderId = req.params.order_id;
      
      if (!decision || !reason) {
        return res.status(400).json({ error: '必须提供decision和reason' });
      }

      const updatedOrder = await model.resolveAfterSaleOrder(orderId, decision, reason);
      
      res.json({
        success: true,
        order: {
          order_id: updatedOrder.order_id,
          status: updatedOrder.status,
          admin_reason: updatedOrder.admin_reason,
          resolved_at: updatedOrder.resolved_at
        }
      });
    } catch (error) {
      console.error('处理售后订单失败:', error);
      res.status(500).json({ 
        error: error.message || '处理售后订单失败' 
      });
    }
});

// 获取全平台买家总数
router.get('/statistics/buyer-count', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const result = await model.getTotalBuyerCount();
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('获取买家总数失败:', error);
      res.status(500).json({ 
        error: error.message || '获取买家总数失败' 
      });
    }
});

// 按周统计订单金额
router.get('/week-order-sum', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const summary = await model.getWeeklyOrderSummary();
      
      res.json({
        success: true,
        data: summary.map(item => ({
          period: item.week_start,
          total_amount: parseFloat(item.total_amount),
          order_count: parseInt(item.order_count)
        }))
      });
    } catch (error) {
      console.error('获取周订单统计失败:', error);
      res.status(500).json({ 
        error: error.message || '获取周订单统计失败' 
      });
    }
});

// 按月统计订单金额
router.get('/month-order-sum', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const summary = await model.getMonthlyOrderSummary();
      
      res.json({
        success: true,
        data: summary.map(item => ({
          period: item.month_start,
          total_amount: parseFloat(item.total_amount),
          order_count: parseInt(item.order_count)
        }))
      });
    } catch (error) {
      console.error('获取月订单统计失败:', error);
      res.status(500).json({ 
        error: error.message || '获取月订单统计失败' 
      });
    }
});

// 按年统计订单金额
router.get('/year-order-sum', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const summary = await model.getYearlyOrderSummary();
      
      res.json({
        success: true,
        data: summary.map(item => ({
          period: item.year_start,
          total_amount: parseFloat(item.total_amount),
          order_count: parseInt(item.order_count)
        }))
      });
    } catch (error) {
      console.error('获取年订单统计失败:', error);
      res.status(500).json({ 
        error: error.message || '获取年订单统计失败' 
      });
    }
});

// 管理员更新订单状态
router.patch('/orders/:id/status', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const { status, reason } = req.body;
      const orderId = req.params.id;
      
      if (!status) {
        return res.status(400).json({ error: '必须提供状态值' });
      }

      const updatedOrder = await model.updateOrderStatus(orderId, status, reason);
      
      res.json({
        success: true,
        order: {
          order_id: updatedOrder.order_id,
          status: updatedOrder.status,
          updated_at: updatedOrder.updated_at
        }
      });
    } catch (error) {
      console.error('更新订单状态失败:', error);
      res.status(500).json({ 
        error: error.message || '更新订单状态失败' 
      });
    }
});

// 删除回答
router.delete('/answers/:id', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      await model.deleteAnswer(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// 更新提问状态（关闭/打开）
router.patch('/questions/:id/status', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const { is_deleted, delete_reason } = req.body;
      await model.updateQuestionStatusAdmin({
        questionId: req.params.id,
        is_deleted,
        delete_reason,
        adminId: req.user.userId
      });
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// 获取所有用户列表（不包括管理员）
router.get('/users', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const users = await model.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// 删除用户
router.delete('/users/:id', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const userId = req.params.id;
      // 检查要删除的用户是否是管理员
      const user = await model.getUserById(userId);
      if (user && user.role === 'admin') {
        return res.status(403).json({ error: '不能删除管理员用户' });
      }
      
      await model.deleteUser(userId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// 获取所有证书
router.get('/certificates', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const certificates = await model.getCertificatesWithExpertInfo();
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// 获取单个用户详情
router.get('/users/:id', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await model.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      
      // 如果是管理员用户，且请求者不是超级管理员，则拒绝访问
      if (user.role === 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ error: '无权查看管理员信息' });
      }
      
      // 格式化返回数据
      const userData = {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
        phone: user.phone,
        province: user.province,
        city: user.city,
        district: user.district,
        address_detail: user.address_detail,
        avatar_url: user.avatar_url,
        join_date: user.join_date
      };
      
      res.json(userData);
    } catch (error) {
      console.error('获取用户详情错误:', error);
      res.status(500).json({ error: '获取用户详情失败' });
    }
});

// 获取所有经验帖（可按状态筛选）
router.get('/experiences', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const { status } = req.query;
      const experiences = await model.getAllExperiences(status);
      res.json(experiences);
    } catch (error) {
      console.error('获取经验帖失败:', error);
      res.status(500).json({ error: error.message || '获取经验帖失败' });
    }
});

// 更新经验帖审核状态
router.patch('/experiences/:id/status', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;
      const experienceId = req.params.id;
      
      if (!status) {
        return res.status(400).json({ error: '必须提供状态值' });
      }

      const updatedExperience = await model.updateExperienceStatus(
        experienceId, 
        status, 
        req.user.userId
      );
      
      res.json({
        success: true,
        experience: {
          experience_id: updatedExperience.experience_id,
          audit_status: updatedExperience.audit_status,
          reviewed_at: updatedExperience.reviewed_at
        }
      });
    } catch (error) {
      console.error('更新经验帖状态失败:', error);
      res.status(500).json({ 
        error: error.message || '更新经验帖状态失败' 
      });
    }
});

// 获取经验帖评论（管理员可查看所有状态）
router.get('/experiences/:id/comments', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const { status } = req.query;
      const comments = await model.getExperienceComments(req.params.id, status);
      res.json(comments);
    } catch (error) {
      console.error('获取评论失败:', error);
      res.status(500).json({ error: error.message || '获取评论失败' });
    }
});

// 获取所有待审核评论
router.get('/comments/pending', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const comments = await model.getPendingComments();
      res.json(comments);
    } catch (error) {
      console.error('获取待审核评论失败:', error);
      res.status(500).json({ error: error.message || '获取待审核评论失败' });
    }
});

// 更新评论审核状态
router.patch('/comments/:id/status', 
  authMiddleware.authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;
      const commentId = req.params.id;
      
      if (!status) {
        return res.status(400).json({ error: '必须提供状态值' });
      }

      const updatedComment = await model.updateCommentStatus(
        commentId, 
        status, 
        req.user.userId
      );
      
      res.json({
        success: true,
        comment: {
          comment_id: updatedComment.comment_id,
          status: updatedComment.status,
          reviewed_at: updatedComment.reviewed_at
        }
      });
    } catch (error) {
      console.error('更新评论状态失败:', error);
      res.status(500).json({ 
        error: error.message || '更新评论状态失败' 
      });
    }
});
module.exports = router;