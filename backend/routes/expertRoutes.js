const express = require('express');
const router = express.Router();
const db = require('./model');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

// 专家信息更新（保持不变）
router.patch('/profile', authenticateToken, checkRole(['expert']), async (req, res) => {
    try {
      const expertId = req.user.userId;
      const { real_name, title, institution, expertise, bio } = req.body;
  
      // 获取当前专家信息
      const currentExpert = await db.getExpertById(expertId);
      if (!currentExpert) {
        return res.status(404).json({ error: '专家信息未找到' });
      }
  
      // 构建更新字段和值
      const updates = {};
      const fieldsToUpdate = ['real_name', 'title', 'institution', 'expertise', 'bio'];
      
      fieldsToUpdate.forEach(field => {
        // 检查字段是否需要更新（新值不为空且与当前值不同）
        if (db.checkFieldNeedsUpdate(currentExpert[field], req.body[field])) {
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
      const updatedExpert = await db.updateExpertProfile(expertId, updates);
      
      res.json({
        message: '专家信息更新成功',
        expert: updatedExpert
      });
      
    } catch (error) {
      console.error('更新专家信息错误:', error);
      res.status(500).json({ error: '服务器错误', details: error.message });
    }
});

// 证书上传
router.post('/certificates', authenticateToken, checkRole(['expert']), async (req, res) => {
  try {
    const { expert_id, obtain_time, level, valid_period, authorizing_unit, description } = req.body;
    const defaultStatus = 'valid';
    const result = await db.query(
      `INSERT INTO certificates 
       (expert_id, obtain_time, level, valid_period, authorizing_unit, description, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING certificate_id`,
      [expert_id, obtain_time, level, valid_period, authorizing_unit, description, defaultStatus]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('证书上传失败:', error);
    res.status(500).json({ error: '证书上传失败' });
  }
});

module.exports = router;