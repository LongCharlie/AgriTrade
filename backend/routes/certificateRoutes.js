const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { ROLES } = authMiddleware;

// 专家上传证书
router.post('/certificates', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.EXPERT]), async (req, res) => {
  try {
    const { expert_id, obtain_time, level, valid_period, authorizing_unit, description } = req.body;
    const defaultStatus = 'valid'; // 默认证书状态
    const result = await require('../model').query(
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

// 证书审核（管理员）
router.patch('/certificates/:id/approve', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.ADMIN]), async (req, res) => {
  try {
    await require('../model').query(
      'UPDATE certificates SET status = $1 WHERE certificate_id = $2',
      ['valid', req.params.id]
    );
    res.json({ message: '证书审核通过' });
  } catch (error) {
    console.error('证书审核失败:', error);
    res.status(500).json({ error: '证书审核失败' });
  }
});

// 获取专家证书
router.get('/certificates/my', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.EXPERT]), async (req, res) => {
  const expertId = req.user.userId;
  try {
    const result = await require('../model').query(
        'SELECT * FROM certificates WHERE expert_id = $1',
        [expertId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('获取证书失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除证书
router.delete('/certificates/:id', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.EXPERT]), async (req, res) => {
  const { id } = req.params;
  try {
    // 检查证书是否存在
    const certResult = await require('../model').query('SELECT * FROM certificates WHERE certificate_id = $1 AND expert_id = $2', [
      id,
      req.user.userId
    ]);
    if (certResult.rows.length === 0) {
      return res.status(404).json({ error: '证书未找到或无权操作' });
    }
    // 执行删除
    await require('../model').query('DELETE FROM certificates WHERE certificate_id = $1', [id]);
    res.json({ message: '证书删除成功' });
  } catch (error) {
    console.error('删除证书失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新证书
router.patch('/certificates/:id', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.EXPERT]), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    // 检查证书是否存在且属于当前专家
    const certResult = await require('../model').query('SELECT * FROM certificates WHERE certificate_id = $1 AND expert_id = $2', [
      id,
      req.user.userId
    ]);
    if (certResult.rows.length === 0) {
      return res.status(404).json({ error: '证书未找到或无权操作' });
    }
    // 构建 SQL 更新语句
    const fields = ['obtain_time', 'level', 'valid_period', 'authorizing_unit', 'description'];
    const updateFields = {};
    fields.forEach(field => {
      if (updates[field] !== undefined) {
        updateFields[field] = updates[field];
      }
    });
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: '没有可更新的字段' });
    }
    const setClause = Object.keys(updateFields)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');
    const values = Object.values(updateFields);
    values.push(id);
    const query = `UPDATE certificates SET ${setClause} WHERE certificate_id = $${values.length} RETURNING *`;
    const result = await require('../model').query(query, values);
    res.json({
      message: '证书更新成功',
      certificate: result.rows[0]
    });
  } catch (error) {
    console.error('更新证书失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;