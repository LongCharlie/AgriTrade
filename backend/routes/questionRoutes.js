const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { ROLES } = authMiddleware;

// 农户提问接口
router.post('/questions', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.FARMER]), async (req, res) => {
  try {
    const { title, content } = req.body;
    const farmerId = req.user.userId;
    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容是必填项' });
    }
    const newQuestion = await require('../model').createQuestion(farmerId, title, content);
    res.status(201).json({
      message: '问题提交成功',
      question: newQuestion
    });
  } catch (error) {
    console.error('提问错误:', error);
    res.status(500).json({ error: '提交问题失败，请稍后再试' });
  }
});

// 获取所有问题
router.get('/questions/all', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.EXPERT, ROLES.FARMER]), async (req, res) => {
  try {
    const questions = await require('../model').getQuestions({}); // 空对象作为filter获取所有问题
    res.json({
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('获取问题列表错误:', error);
    res.status(500).json({ error: '获取问题列表失败' });
  }
});

// 获取问题列表接口
router.get('/questions', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.EXPERT, ROLES.FARMER]), async (req, res) => {
  try {
    const filter = {};
    // 如果是农户，只获取自己的问题
    if (req.user.role === ROLES.FARMER) {
      filter.farmerId = req.user.userId;
    }
    // 可以添加其他过滤条件
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const questions = await require('../model').getQuestions(filter);
    res.json({
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('获取问题列表错误:', error);
    res.status(500).json({ error: '获取问题列表失败' });
  }
});

// 获取单个问题详情
router.get('/questions/:id', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await require('../model').getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ error: '问题未找到' });
    }
    // 检查权限：农户只能查看自己的问题
    if (req.user.role === ROLES.FARMER && question.farmer_id !== req.user.userId) {
      return res.status(403).json({ error: '无权查看此问题' });
    }
    res.json(question);
  } catch (error) {
    console.error('获取问题详情错误:', error);
    res.status(500).json({ error: '获取问题详情失败' });
  }
});

// 更新问题状态（关闭问题）
router.patch('/questions/:id/status', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.FARMER]), async (req, res) => {
  try {
    const questionId = req.params.id;
    const { status } = req.body;
    const userId = req.user.userId;
    if (!status || !['open', 'closed'].includes(status)) {
      return res.status(400).json({ error: '无效的状态值' });
    }
    // 首先检查问题是否存在且属于该农户
    const question = await require('../model').getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ error: '问题未找到' });
    }
    if (question.farmer_id !== userId) {
      return res.status(403).json({ error: '无权操作此问题' });
    }
    const updatedQuestion = await require('../model').updateQuestionStatus(questionId, status);
    res.json({
      message: '问题状态更新成功',
      question: updatedQuestion
    });
  } catch (error) {
    console.error('更新问题状态错误:', error);
    res.status(500).json({ error: '更新问题状态失败' });
  }
});

module.exports = router;