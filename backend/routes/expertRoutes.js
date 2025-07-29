const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { ROLES } = authMiddleware;

// 专家信息更新
router.patch('/expert/profile', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.EXPERT]), async (req, res) => {
  try {
    const expertId = req.user.userId;
    const { real_name, title, institution, expertise, bio } = req.body;
    // 获取当前专家信息
    const currentExpert = await require('../model').getExpertById(expertId);
    if (!currentExpert) {
      return res.status(404).json({ error: '专家信息未找到' });
    }
    // 构建更新字段和值
    const updates = {};
    const fieldsToUpdate = ['real_name', 'title', 'institution', 'expertise', 'bio'];
    fieldsToUpdate.forEach(field => {
      // 检查字段是否需要更新（新值不为空且与当前值不同）
      if (require('../model').checkFieldNeedsUpdate(currentExpert[field], req.body[field])) {
        updates[field] = req.body[field];
      }
    });
    // 如果没有可更新的字段
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        error: '没有可更新的字段', 
        message: '提供的字段值与当前值相同或为空' 
      });
    }
    // 执行更新
    const updatedExpert = await require('../model').updateExpertProfile(expertId, updates);
    res.json({
      message: '专家信息更新成功',
      expert: updatedExpert
    });
  } catch (error) {
    console.error('更新专家信息错误:', error);
    res.status(500).json({ error: '服务器错误', details: error.message });
  }
});

// 专家详情接口
router.get('/experts/:id', async (req, res) => {
  const expertId = req.params.id;
  const result = await require('../model').query(` 
      SELECT 
        e.*, 
        u.*,
        c.*
      FROM experts e
      JOIN users u ON e.expert_id = u.user_id
      LEFT JOIN certificates c ON e.expert_id = c.expert_id
      WHERE e.expert_id = $1
      `,
      [expertId]
  );
  res.json(result.rows[0]);
});

// 专家排名接口
router.get('/expert-rankings', async (req, res) => {
  const rankings = await require('../model').query(`
    SELECT e.*, u.avatar_url
    FROM experts e
    JOIN users u ON e.expert_id = u.user_id
    ORDER BY e.answer_count DESC;
  `);
  res.json(rankings.rows);
});

// 获取专家最近的回答
router.get('/answers/recent', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.EXPERT]), async (req, res) => {
  const expertId = req.user.userId;
  try {
    const result = await require('../model').query(`
      SELECT a.*, q.title 
      FROM answers a
      JOIN questions q ON a.question_id = q.question_id
      WHERE a.expert_id = $1
      ORDER BY a.answered_at DESC
      LIMIT 5
    `, [expertId]);
    res.json(result.rows);
  } catch (error) {
    console.error('获取最近回答失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;