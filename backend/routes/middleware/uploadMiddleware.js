// middleware/uploadMiddleware.js
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// 创建回答图片上传目录
const answerImagesDir = path.join(__dirname, '../uploads', 'answer_images');
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

module.exports = {
  uploadAnswerImages,
  answerImagesDir
};
