const express = require('express');
const router = express.Router();
const { getChatList, getChatMessages, sendMessage } = require('../model');
const authMiddleware = require('../middleware/authMiddleware');

// 获取会话列表
router.get('/list', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const chats = await getChatList(userId);
    res.json(chats);
  } catch (error) {
    console.error('获取会话列表失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取消息记录
router.get('/:chat_id/messages', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const chatId = req.params.chat_id;
    const messages = await getChatMessages(chatId);
    res.json(messages);
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
    
    const result = await sendMessage(senderId, other_user_id, content, image_url);
    res.json(result);
  } catch (error) {
    console.error('发送消息失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;