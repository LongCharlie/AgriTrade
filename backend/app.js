const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static('public'));

// 创建回答图片上传目录
const answerImagesDir = path.join(__dirname, 'uploads', 'answer_images');
if (!fs.existsSync(answerImagesDir)) {
  fs.mkdirSync(answerImagesDir, { recursive: true });
}

// 配置multer
const answerImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, answerImagesDir);
  },
  filename: (req, file, cb) => {
    const cleanedName = file.originalname.replace(/[/\\?%*:|"<>]/g, '');
    cb(null, `${uuidv4()}-${cleanedName}`);
  }
});

const uploadAnswerImages = multer({ 
  storage: answerImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('仅支持图片格式'), false);
  }
}).array('images', 5); // 最多5张图片


// 创建上传目录
const uploadDir = [
  path.join(__dirname, 'uploads', 'avatars'),
  path.join(__dirname, 'uploads', 'activity-images')
];
uploadDir.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 用户头像上传配置multer
const avatarStorage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads', 'avatars'), 
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});
// 农事活动图片上传配置multer
const activityImageStorage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads', 'activity-images'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB限制
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'), false);
    }
  }
});

const uploadActivityImages = multer({
  storage: activityImageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB限制
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'), false);
    }
  }
});

// 头像上传路由
app.post('/api/user/avatar', 
  require('./middleware/authMiddleware').authenticateToken,
  uploadAvatar.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: '请上传有效的图片文件' });
      }
      
      const userId = req.user.userId;
      const avatarUrl = await require('./model').updateUserAvatar(userId, req.file.filename);
      
      res.json({ 
        success: true,
        avatarUrl: avatarUrl
      });
    } catch (error) {
      console.error('头像上传失败:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// 新增：农事活动图片上传路由
app.post('/api/uploads/activity-images', 
  require('./middleware/authMiddleware').authenticateToken,
  uploadActivityImages.array('images', 5), // 允许最多5张图片
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: '未上传图片' });
      }
      const imageUrls = req.files.map(file => `${file.filename}`); //  /uploads/activity-images/
      res.json({ images: imageUrls });
    } catch (error) {
      console.error('图片上传失败:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// 应用中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads/question_images', express.static(path.join(__dirname, 'uploads', 'question_images')));
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads', 'avatars')));
app.use('/uploads/certificates', express.static(path.join(__dirname, 'uploads', 'certificates'))); //证书上传图片存储区
// 添加静态文件服务
app.use('/uploads/answer_images', express.static(path.join(__dirname, 'uploads', 'answer_images')));
app.use('/uploads/activity-images', express.static(path.join(__dirname, 'uploads', 'activity-images')));
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
const answerRoutes = require('./routes/answerRoutes');
const farmingActivitiesRoutes = require('./routes/farmingActivities');

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
app.use('/api', adminRoutes);
app.use('/api', answerRoutes);
app.use('/api', farmingActivitiesRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;