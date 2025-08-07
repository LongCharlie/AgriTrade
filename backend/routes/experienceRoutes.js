const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { ROLES } = authMiddleware;

// 发布经验分享（需审核）
router.post('/experiences', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.userId;
    // 输入验证
    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容不能为空' });
    }
    const result = await require('../model').query(
      'INSERT INTO experiences (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, content]
    );
    res.status(201).json({
      message: '经验提交成功，等待审核',
      experience: result.rows[0]
    });
  } catch (error) {
    console.error('发布经验失败:', error);
    res.status(500).json({ error: '发布失败，请稍后再试' });
  }
});

// 审核经验（管理员）
router.patch('/experiences/:id/approve', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    // 检查经验是否存在
    const experience = await require('../model').query(
      'SELECT * FROM experiences WHERE experience_id = $1',
      [id]
    );
    if (experience.rows.length === 0) {
      return res.status(404).json({ error: '经验不存在' });
    }
    await require('../model').query(
      'UPDATE experiences SET audit_status = $1 WHERE experience_id = $2',
      ['approved', id]
    );
    res.json({ 
      message: '审核通过',
      experience_id: id
    });
  } catch (error) {
    console.error('审核经验失败:', error);
    res.status(500).json({ error: '审核失败' });
  }
});

module.exports = router;