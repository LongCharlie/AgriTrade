const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 创建上传目录
const uploadDir = path.join(__dirname, 'uploads', 'avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

// 应用中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 引入路由
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const expertRoutes = require('./routes/expertRoutes');
const questionRoutes = require('./routes/questionRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const productRoutes = require('./routes/productRoutes');
const demandRoutes = require('./routes/demandRoutes');
const recordRoutes = require('./routes/recordRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const adminRoutes = require('./routes/adminRoutes');

// 挂载路由
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', expertRoutes);
app.use('/api', questionRoutes);
app.use('/api', certificateRoutes);
app.use('/api', experienceRoutes);
app.use('/api', productRoutes);
app.use('/api', demandRoutes);
app.use('/api', recordRoutes);
app.use('/api', statisticsRoutes);
app.use('/api/admin', adminRoutes);

// 文件上传处理
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const cleanedName = file.originalname.replace(/[/\\?%*:|"<>]/g, '');
    cb(null, `${uuidv4()}-${cleanedName}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('仅支持图片格式'));
  }
});

// 上传头像路由
app.post('/api/upload', 
  require('./middleware/authMiddleware').authenticateToken, 
  upload.single('avatar'), 
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const avatarUrl = req.file.filename; 
      const newAvatarUrl = await require('./model').updateUserAvatar(userId, avatarUrl); 
      res.json({ avatarUrl: newAvatarUrl });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;