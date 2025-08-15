const express = require('express');
const router = express.Router();
const { pool } = require('../model');
const authMiddleware = require('../middleware/authMiddleware');

// 获取会话列表
router.get('/list', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    // 查询当前用户参与的所有会话
    const query = `
      SELECT 
        c.comm_id AS chat_id,
        CASE 
          WHEN c.sender_id = $1 THEN c.receiver_id
          ELSE c.sender_id
        END AS other_user_id,
        u.username AS other_user_name,
        u.avatar_url AS other_user_avatar,
        c.content AS last_message_content,
        c.sender_id AS last_message_sender_id,
        c.sent_at AS last_message_timestamp
      FROM communications c
      JOIN users u ON 
        (c.sender_id = $1 AND u.user_id = c.receiver_id) OR 
        (c.receiver_id = $1 AND u.user_id = c.sender_id)
      WHERE c.application_id IS NULL
      GROUP BY c.comm_id, other_user_id, u.username, u.avatar_url, c.content, c.sender_id, c.sent_at
      ORDER BY c.sent_at DESC
    `;
    
    const { rows } = await pool.query(query, [userId]);
    const formattedChats = rows.map(chat => ({
      chat_id: chat.chat_id,
      other_user_id: chat.other_user_id,
      other_user_name: chat.other_user_name,
      other_user_avatar: chat.other_user_avatar ? `/uploads/avatars/${chat.other_user_avatar}` : null,
      last_message: {
        content: chat.last_message_content,
        sender_id: chat.last_message_sender_id,
        timestamp: chat.last_message_timestamp
      }
    }));
    
    res.json(formattedChats);
  } catch (error) {
    console.error('获取会话列表失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取消息记录
router.get('/:chat_id/messages', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const chatId = req.params.chat_id;
    
    const query = `
      SELECT 
        comm_id AS message_id,
        sender_id,
        content,
        sent_at AS timestamp,
        CASE 
          WHEN image_path IS NOT NULL THEN 'image'
          ELSE 'text'
        END AS type
      FROM communications
      WHERE comm_id = $1
      ORDER BY sent_at ASC
    `;
    
    const { rows } = await pool.query(query, [chatId]);
    
    res.json(rows);
  } catch (error) {
    console.error('获取消息记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 发送消息（文本/图片）
router.post('/send', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const { content, other_user_id, image_url } = req.body;
    const senderId = req.user.userId;
    
    if (!content && !image_url) {
      return res.status(400).json({ error: '消息内容或图片不能为空' });
    }
    
    const query = `
      INSERT INTO communications 
        (sender_id, receiver_id, content, image_path)
      VALUES ($1, $2, $3, $4)
      RETURNING comm_id, sent_at
    `;
    
    const { rows } = await pool.query(query, [
      senderId,
      other_user_id,
      content || null,
      image_url || null
    ]);
    
    res.json({
      message_id: rows[0].comm_id,
      timestamp: rows[0].sent_at
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;