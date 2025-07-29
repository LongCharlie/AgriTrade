const express = require('express');
const router = express.Router();
const db = require('./model');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

// 用户注册接口
router.post('/register', async (req, res) => {
    const {
      username,
      password,
      role,
      phone,
      province,
      city,
      district,
      address_detail
    } = req.body;
  
    try {
      // 检查用户名是否已存在
      const userExists = await db.checkUserExists(username);
      if (userExists) {
        return res.status(400).send('用户名已存在');
      }
  
      // 创建新用户
      const newUser = await db.createUser(req.body);
  
      // 如果是专家角色，需要在experts表中也创建记录
      if (role === 'expert') {
        await db.createExpert(newUser.user_id);
      }
  
      res.status(200).send('注册成功');
    } catch (error) {
      console.error('注册错误:', error);
      res.status(500).send('注册失败，请稍后再试');
    }
});

// 用户登录接口
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      // 1. 检查用户是否存在
      const user = await db.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: '用户名或密码不正确' });
      }
  
      // 2. 验证密码
      const isMatch = await db.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: '用户名或密码不正确' });
      }
  
      // 3. 生成并返回token
      const token = db.generateToken(user);
      
      res.json({
        message: '登录成功',
        token,
        user: {
          id: user.user_id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error('登录错误:', error);
      res.status(500).json({ error: '登录失败，请稍后再试' });
    }
});

module.exports = router;