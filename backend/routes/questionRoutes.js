const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { ROLES } = authMiddleware;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// 创建问题图片上传目录
const questionImagesDir = path.join(__dirname, '../uploads', 'question_images');
if (!fs.existsSync(questionImagesDir)) {
  fs.mkdirSync(questionImagesDir, { recursive: true });
}

// 配置multer
const questionImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, questionImagesDir);
  },
  filename: (req, file, cb) => {
    const cleanedName = file.originalname.replace(/[/\\?%*:|"<>]/g, '');
    cb(null, `${uuidv4()}-${cleanedName}`);
  }
});

const uploadQuestionImages = multer({ 
  storage: questionImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('仅支持图片格式'));
  }
}).array('images', 5); // 最多5张图片

// 管理员删除问题
router.delete('/questions/:id', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const questionId = req.params.id;
    
    // 获取问题详情以检查是否存在
    const question = await require('../model').getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ error: '问题未找到' });
    }
    
    // 获取问题相关的图片
    const images = await require('../model').getQuestionImages(questionId);
    
    // 删除数据库中的问题记录
    await require('../model').query('DELETE FROM questions WHERE question_id = $1', [questionId]);
    
    // 删除问题相关的图片文件
    if (images && images.length > 0) {
      images.forEach(img => {
        try {
          fs.unlinkSync(path.join(questionImagesDir, img.image_url));
        } catch (err) {
          console.error(`删除图片文件失败: ${img.image_url}`, err);
        }
      });
    }
    
    // 删除问题相关的图片记录
    await require('../model').query('DELETE FROM question_images WHERE question_id = $1', [questionId]);
    
    // 删除问题相关的回答
    await require('../model').query('DELETE FROM answers WHERE question_id = $1', [questionId]);
    
    res.json({ message: '问题删除成功' });
  } catch (error) {
    console.error('删除问题错误:', error);
    res.status(500).json({ error: '删除问题失败' });
  }
});

// 修改后的农户提问接口
router.post('/questions', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.FARMER]), (req, res) => {
  uploadQuestionImages(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      const { title, content } = req.body;
      const farmerId = req.user.userId;
      
      if (!title || !content) {
        // 如果有上传的图片但验证失败，删除已上传的图片
        if (req.files && req.files.length > 0) {
          req.files.forEach(file => {
            fs.unlinkSync(path.join(questionImagesDir, file.filename));
          });
        }
        return res.status(400).json({ error: '标题和内容是必填项' });
      }
      
      // 创建问题
      const newQuestion = await require('../model').createQuestion(farmerId, title, content);
      
      // 如果有上传的图片，保存图片信息
      if (req.files && req.files.length > 0) {
        const imageUrls = req.files.map(file => file.filename);
        await require('../model').addQuestionImages(newQuestion.question_id, imageUrls);
      }
      
      res.status(201).json({
        message: '问题提交成功',
        question: newQuestion
      });
    } catch (error) {
      console.error('提问错误:', error);
      // 如果出现错误，删除已上传的图片
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          fs.unlinkSync(path.join(questionImagesDir, file.filename));
        });
      }
      res.status(500).json({ error: '提交问题失败，请稍后再试' });
    }
  });
});

// 获取所有问题
router.get('/questions/all', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.EXPERT, ROLES.FARMER,ROLES.ADMIN]), async (req, res) => {
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
    
    // 获取问题图片
    const images = await require('../model').getQuestionImages(questionId);
    
    res.json({
      ...question,
      images: images.map(img => ({
        id: img.image_id,
        url: `/uploads/question_images/${img.image_url}`
      }))
    });
  } catch (error) {
    console.error('获取问题详情错误:', error);
    res.status(500).json({ error: '获取问题详情失败' });
  }
});

// 更新问题状态（关闭问题）
router.patch('/questions/:id/status', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.FARMER,ROLES.ADMIN]), async (req, res) => {
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
    if (question.farmer_id !== userId && userId !== 39) {
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

// 删除问题图片
router.delete('/questions/:id/images/:imageId', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.FARMER]), async (req, res) => {
  try {
    const questionId = req.params.id;
    const imageId = req.params.imageId;
    const userId = req.user.userId;
    
    // 首先检查问题是否存在且属于该农户
    const question = await require('../model').getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ error: '问题未找到' });
    }
    if (question.farmer_id !== userId) {
      return res.status(403).json({ error: '无权操作此问题' });
    }
    
    // 删除图片
    const deletedImage = await require('../model').deleteQuestionImage(imageId, questionId);
    if (!deletedImage) {
      return res.status(404).json({ error: '图片未找到' });
    }
    
    // 删除实际文件
    fs.unlinkSync(path.join(questionImagesDir, deletedImage.image_url));
    
    res.json({ message: '图片删除成功' });
  } catch (error) {
    console.error('删除问题图片错误:', error);
    res.status(500).json({ error: '删除图片失败' });
  }
});

module.exports = router;