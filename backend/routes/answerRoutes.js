// routes/answerRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { ROLES } = authMiddleware;

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// 创建回答图片上传目录
const answerImagesDir = path.join(__dirname, '../uploads', 'answer_images');
if (!fs.existsSync(answerImagesDir)) {
  fs.mkdirSync(answerImagesDir, { recursive: true });
}

// 配置multer
const answerImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, answerImagesDir);
  },
  filename: (req, file, cb) => {
    const cleanedName = file.originalname.replace(/[/\\?%*:|"<>]/g, '');
    cb(null, `${uuidv4()}-${cleanedName}`);
  }
});

const uploadAnswerImages = multer({ 
  storage: answerImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('仅支持图片格式'), false);
  }
}).array('images', 5); // 最多5张图片

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

// routes/answerRoutes.js
router.post('/questions/:id/answers', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.EXPERT]),
  (req, res) => {
    uploadAnswerImages(req, res, async (err) => {
      try {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        
        const questionId = req.params.id;
        const expertId = req.user.userId;
        const { content } = req.body;

        if (!content) {
          if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
              fs.unlinkSync(path.join(answerImagesDir, file.filename));
            });
          }
          return res.status(400).json({ error: '回答内容不能为空' });
        }

        const question = await require('../model').getQuestionById(questionId);
        if (!question) {
          if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
              fs.unlinkSync(path.join(answerImagesDir, file.filename));
            });
          }
          return res.status(404).json({ error: '问题不存在' });
        }

        // 创建回答
        const newAnswer = await require('../model').createAnswer(questionId, expertId, content);
        
        // 增加专家回答数
        await require('../model').incrementExpertAnswerCount(expertId);
        
        // 保存图片信息
        if (req.files && req.files.length > 0) {
          const imageUrls = req.files.map(file => file.filename);
          await require('../model').addAnswerImages(newAnswer.answer_id, imageUrls);
        }

        res.status(201).json({
          message: '回答提交成功',
          answer: newAnswer
        });
      } catch (error) {
        console.error('回答问题错误:', error);
        if (req.files && req.files.length > 0) {
          req.files.forEach(file => {
            fs.unlinkSync(path.join(answerImagesDir, file.filename));
          });
        }
        res.status(500).json({ error: '提交回答失败，请稍后再试' });
      }
    });
  }
);

// 获取问题的所有回答
router.get('/question/:id/answers', async (req, res) => {
  try {
    const questionId = req.params.id;
    
    // 检查问题是否存在
    const question = await require('../model').getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ 
        success: false,
        error: '问题不存在' 
      });
    }

    // 修改查询以包含专家详细信息
    const answers = await require('../model').query(
      `SELECT 
        a.*,
        e.real_name as expert_real_name,
        e.title as expert_title,
        u.avatar_url as expert_avatar,
        CASE WHEN u.avatar_url IS NOT NULL 
             THEN CONCAT('/uploads/avatars/', u.avatar_url) 
             ELSE NULL 
        END as expert_avatar_url
      FROM answers a
      LEFT JOIN users u ON a.expert_id = u.user_id
      LEFT JOIN experts e ON a.expert_id = e.expert_id
      WHERE a.question_id = $1
      ORDER BY a.answered_at DESC`,
      [questionId]
    );

    res.json({
      success: true,
      count: answers.rows.length,
      answers: answers.rows.map(answer => ({
        ...answer,
        expert_info: {
          real_name: answer.expert_real_name,
          title: answer.expert_title,
          avatar_url: answer.expert_avatar_url
        }
      }))
    });
  } catch (error) {
    console.error('获取回答列表错误:', error);
    res.status(500).json({ 
      success: false,
      error: '获取回答列表失败' 
    });
  }
});



// 获取单个回答详情（包含图片）
router.get('/answers/:id', async (req, res) => {
  try {
    const answerId = req.params.id;
    const answer = await require('../model').getAnswerById(answerId);
    
    if (!answer) {
      return res.status(404).json({ error: '回答未找到' });
    }
    
    // 获取回答图片
    const images = await require('../model').getAnswerImages(answerId);
    
    res.json({
      ...answer,
      images: images.map(img => ({
        id: img.image_id,
        url: `/uploads/answer_images/${img.image_url}`
      }))
    });
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
<<<<<<< HEAD
router.delete('/answer/:id',
=======
router.delete('/answer/:id', 
>>>>>>> 28da22c6b1ae88a086f5916583a63be90f091691
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