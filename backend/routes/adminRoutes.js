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

module.exports = router;