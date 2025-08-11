const express = require('express');
const router = express.Router();
const { 
  getFarmingActivitiesByRecordId, 
  createFarmingActivity 
} = require('../model');

// 获取种植记录历史活动
router.get('/historical-activity/:recordId', async (req, res) => {
  try {
    const activities = await getFarmingActivitiesByRecordId(req.params.recordId);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: '获取农事活动失败', details: err.message });
  }
});

// 新增农事活动
router.post('/planting-activities', async (req, res) => {
  try {
    const newActivity = await createFarmingActivity(req.body);
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(400).json({ error: '创建农事活动失败', details: err.message });
  }
});

module.exports = router;