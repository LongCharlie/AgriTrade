const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// 获取用户个人信息
router.get('/user/profile', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;
    let userData;
    if (role === 'expert') {
      // 专家用户获取更多信息
      userData = await require('../model').getExpertDetails(userId);
    } else {
      // 普通用户
      userData = await require('../model').getUserById(userId);
    }
    if (!userData) {
      return res.status(404).json({ error: '用户未找到' });
    }
    // 移除敏感信息
    delete userData.password;
    res.json(userData);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 获取用户头像URL
router.get('/user/avatar', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await require('../model').getUserById(userId);
    
    if (!user || !user.avatar_url) {
      return res.status(404).json({ error: '头像未设置' });
    }
    
    res.json({ 
      avatarUrl: `/uploads/avatars/${user.avatar_url}` 
    });
  } catch (error) {
    console.error('获取头像失败:', error);
    res.status(500).json({ error: '获取头像失败' });
  }
});


// 更新用户基本信息（所有用户通用）
router.patch('/user/profile', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { phone, province, city, district, address_detail, avatar_url } = req.body;
    // 构建更新字段
    const updates = {};
    const fields = ['phone', 'province', 'city', 'district', 'address_detail', 'avatar_url'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    // 如果没有可更新的字段
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: '没有提供可更新的字段' });
    }
    // 执行更新
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    const values = Object.values(updates);
    values.push(userId);
    const query = `UPDATE users SET ${setClause} WHERE user_id = $${values.length} RETURNING *`;
    const result = await require('../model').query(query, values);
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