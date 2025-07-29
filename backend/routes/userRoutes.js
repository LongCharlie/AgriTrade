const express = require('express');
const router = express.Router();
const db = require('./model');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware'); 
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('仅支持图片格式'));
  }
});

router.post('/upload', authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        const userId = req.user.userId;
        const avatarUrl = req.file.filename; 
        const newAvatarUrl = await db.updateUserAvatar(userId, avatarUrl); 
        res.json({ avatarUrl: newAvatarUrl });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 获取用户信息（补充专家信息逻辑）
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;
    
    let userData;
    if (role === 'expert') {
      userData = await db.getExpertDetails(userId); 
    } else {
      userData = await db.getUserById(userId);
    }
    
    if (!userData) {
      return res.status(404).json({ error: '用户未找到' });
    }
    delete userData.password;
    res.json(userData);
    
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 更新用户信息
router.patch('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const allowedFields = ['phone', 'province', 'city', 'district', 'address_detail', 'avatar_url'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: '没有可更新的字段' });
    }
    
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    const values = [...Object.values(updates), userId];
    
    const query = `UPDATE users SET ${setClause} WHERE user_id = $${values.length} RETURNING *`;
    const result = await db.query(query, values);
    
    res.json({
      message: '用户信息更新成功',
      user: result.rows[0]
    });
    
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ error: '更新用户信息失败' });
  }
});

module.exports = router;