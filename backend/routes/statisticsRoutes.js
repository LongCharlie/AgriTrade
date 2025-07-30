const express = require('express');
const router = express.Router();

// 获取农产品种类数
router.get('/agriculture-count', async (req, res) => {
  try {
    const count = await require('../model').getAgricultureCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: '获取数据失败' });
  }
});

// 获取农户数量
router.get('/farmer-count', async (req, res) => {
  try {
    const count = await require('../model').getFarmerCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: '获取数据失败' });
  }
});

// 获取专家数量
router.get('/expert-count', async (req, res) => {
  try {
    const count = await require('../model').getExpertCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: '获取数据失败' });
  }
});

module.exports = router;