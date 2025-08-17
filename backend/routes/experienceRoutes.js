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

// 发布评论
router.post('/experiences/:id/comments', 
  authMiddleware.authenticateToken,
  async (req, res) => {
    try {
      const { content } = req.body;
      const userId = req.user.userId;
      const experienceId = req.params.id;

      // 验证内容非空
      if (!content) {
        return res.status(400).json({ error: '评论内容不能为空' });
      }

      const newComment = await require('../model').createComment(
        experienceId,
        userId,
        content
      );
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: '发布评论失败' });
    }
  }
);

// 获取经验分享作者信息
router.get('/experiences/:id/author', async (req, res) => {
  try {
    const author = await require('../model').getAuthorInfoByExperience(req.params.id);
    if (!author) {
      return res.status(404).json({ error: '未找到该经验分享' });
    }
    res.json({
      username: author.username,
      avatarUrl: author.avatar_url
    });
  } catch (error) {
    res.status(500).json({ error: '获取作者信息失败' });
  }
});

// 获取所有经验分享（带作者信息）
router.get('/experience', async (req, res) => {
  try {
    const experiences = await require('../model').getAllExperiencesWithAuthor();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: '获取经验列表失败' });
  }
});

// 获取经验分享详情
router.get('/experience/:id', async (req, res) => {
  try {
    const experienceId = req.params.id;
    
    // 获取经验详情
    const experience = await require('../model').query(
      `SELECT 
        e.*,
        u.username as author_name,
        u.avatar_url as author_avatar,
        CASE WHEN u.avatar_url IS NOT NULL 
             THEN CONCAT('/uploads/avatars/', u.avatar_url) 
             ELSE NULL 
        END as author_avatar_url
      FROM experiences e
      LEFT JOIN users u ON e.user_id = u.user_id
      WHERE e.experience_id = $1 AND e.audit_status = 'approved'`,
      [experienceId]
    );

    if (experience.rows.length === 0) {
      return res.status(404).json({ error: '经验分享不存在或未通过审核' });
    }

    // 获取该经验的评论
    const comments = await require('../model').getExperienceComments(experienceId);

    // 返回经验详情和评论
    res.json({
      ...experience.rows[0],
      comments: comments
    });

  } catch (error) {
    console.error('获取经验详情失败:', error);
    res.status(500).json({ error: '获取经验详情失败，请稍后再试' });
  }
});

module.exports = router;