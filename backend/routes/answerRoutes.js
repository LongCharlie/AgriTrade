// routes/answerRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { ROLES } = authMiddleware;

// 管理员删除回答
router.delete('/answers/:id', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const answerId = req.params.id;
    
    // 检查回答是否存在
    const answer = await require('../model').getAnswerById(answerId);
    if (!answer) {
      return res.status(404).json({ error: '回答未找到' });
    }
    
    // 删除回答
    await require('../model').query('DELETE FROM answers WHERE answer_id = $1', [answerId]);
    
    res.json({ message: '回答删除成功' });
  } catch (error) {
    console.error('删除回答错误:', error);
    res.status(500).json({ error: '删除回答失败' });
  }
});

module.exports = router;

// 专家回答问题
router.post('/questions/:id/answers', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.EXPERT]),
  async (req, res) => {
    try {
      const questionId = req.params.id;
      const expertId = req.user.userId;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: '回答内容不能为空' });
      }

      // 检查问题是否存在
      const question = await require('../model').getQuestionById(questionId);
      if (!question) {
        return res.status(404).json({ error: '问题不存在' });
      }

      // 创建回答
      const newAnswer = await require('../model').createAnswer(questionId, expertId, content);
      
      // 更新问题状态为"已解答"
      await require('../model').updateQuestionStatus(questionId, 'answered');

      res.status(201).json({
        message: '回答提交成功',
        answer: newAnswer
      });
    } catch (error) {
      console.error('回答问题错误:', error);
      res.status(500).json({ error: '提交回答失败，请稍后再试' });
    }
  }
);

// 获取问题的所有回答
router.get('/questions/:id/answers', async (req, res) => {
  try {
    const questionId = req.params.id;
    
    // 检查问题是否存在
    const question = await require('../model').getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ error: '问题不存在' });
    }

    const answers = await require('../model').getAnswersByQuestionId(questionId);
    res.json({
      count: answers.length,
      answers
    });
  } catch (error) {
    console.error('获取回答列表错误:', error);
    res.status(500).json({ error: '获取回答列表失败' });
  }
});

// 获取单个回答详情
router.get('/answers/:id', async (req, res) => {
  try {
    const answerId = req.params.id;
    const answer = await require('../model').getAnswerById(answerId);
    
    if (!answer) {
      return res.status(404).json({ error: '回答未找到' });
    }
    
    res.json(answer);
  } catch (error) {
    console.error('获取回答详情错误:', error);
    res.status(500).json({ error: '获取回答详情失败' });
  }
});

// 更新回答
router.patch('/answers/:id', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.EXPERT]),
  async (req, res) => {
    try {
      const answerId = req.params.id;
      const expertId = req.user.userId;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: '回答内容不能为空' });
      }

      const updatedAnswer = await require('../model').updateAnswer(answerId, expertId, content);
      
      if (!updatedAnswer) {
        return res.status(404).json({ error: '回答不存在或无权修改' });
      }

      res.json({
        message: '回答更新成功',
        answer: updatedAnswer
      });
    } catch (error) {
      console.error('更新回答错误:', error);
      res.status(500).json({ error: '更新回答失败' });
    }
  }
);

// 删除回答
router.delete('/answers/:id', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.EXPERT]),
  async (req, res) => {
    try {
      const answerId = req.params.id;
      const expertId = req.user.userId;

      const isDeleted = await require('../model').deleteAnswer(answerId, expertId);
      
      if (!isDeleted) {
        return res.status(404).json({ error: '回答不存在或无权删除' });
      }

      res.json({ message: '回答删除成功' });
    } catch (error) {
      console.error('删除回答错误:', error);
      res.status(500).json({ error: '删除回答失败' });
    }
  }
);

// 点赞回答
router.post('/answers/:id/upvote', async (req, res) => {
  try {
    const answerId = req.params.id;
    const upvotes = await require('../model').upvoteAnswer(answerId);
    
    if (!upvotes) {
      return res.status(404).json({ error: '回答不存在' });
    }

    res.json({ 
      message: '点赞成功',
      upvotes 
    });
  } catch (error) {
    console.error('点赞回答错误:', error);
    res.status(500).json({ error: '点赞失败' });
  }
});

module.exports = router;