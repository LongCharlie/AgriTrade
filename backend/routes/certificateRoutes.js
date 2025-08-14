const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/authMiddleware');
const { ROLES } = authMiddleware;

// 创建证书图片上传目录
const certUploadDir = path.join(__dirname, '../uploads/certificates');
if (!fs.existsSync(certUploadDir)) {
  fs.mkdirSync(certUploadDir, { recursive: true });
}

// 配置multer
const certStorage = multer.diskStorage({
  destination: certUploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

const uploadCertImage = multer({
  storage: certStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB限制
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'), false);
    }
  }
});

// 专家上传证书（带图片）
router.post('/certificates', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.EXPERT]),
  uploadCertImage.single('certificate_image'),
  async (req, res) => {
    try {
      const expertId = req.user.userId;
      const { 
        certificate_name,
        obtain_time, 
        level, 
        valid_period, 
        authorizing_unit, 
        description 
      } = req.body;
      
      // 获取上传的图片文件名
      const certificate_image = req.file ? req.file.filename : null;

      const result = await require('../model').query(
        `INSERT INTO certificates 
        (expert_id, certificate_name, certificate_image, obtain_time, level, 
         valid_period, authorizing_unit, description, status, is_audited) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'valid', 'pending') 
        RETURNING *`,
        [
          expertId,
          certificate_name,
          certificate_image,
          obtain_time, 
          level, 
          valid_period, 
          authorizing_unit, 
          description
        ]
      );
      
      res.status(201).json({
        success: true,
        certificate: result.rows[0],
        imageUrl: certificate_image ? `/uploads/certificates/${certificate_image}` : null
      });
    } catch (error) {
      console.error('证书上传失败:', error);
      res.status(500).json({ 
        success: false,
        error: '证书上传失败: ' + error.message 
      });
    }
  }
);

// 证书审核（管理员）
router.patch('/certificates/:id/approve', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.ADMIN]), 
  async (req, res) => {
    try {
      const { decision, audited_reason } = req.body;
      const adminId = req.user.userId;
      
      if (!['approved', 'rejected'].includes(decision)) {
        return res.status(400).json({ error: '无效的审核决定' });
      }
      
      const result = await require('../model').query(
        `UPDATE certificates 
         SET is_audited = $1, 
             audited_by = $2, 
             audited_at = NOW(),
             audited_reason = $3
         WHERE certificate_id = $4
         RETURNING *`,
        [decision, adminId, audited_reason, req.params.id]
      );
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: '证书未找到' });
      }
      
      res.json({ 
        success: true,
        certificate: result.rows[0]
      });
    } catch (error) {
      console.error('证书审核失败:', error);
      res.status(500).json({ 
        success: false,
        error: '证书审核失败' 
      });
    }
  }
);

// 获取专家证书（带图片URL）
router.get('/certificates/my', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.EXPERT]), 
  async (req, res) => {
    const expertId = req.user.userId;
    try {
      const result = await require('../model').query(
        `SELECT 
          certificate_id,
          certificate_name,
          certificate_image,
          obtain_time,
          level,
          valid_period,
          authorizing_unit,
          description,
          status,
          is_audited,
          audited_reason,
          audited_by,
          audited_at,
          CASE WHEN certificate_image IS NOT NULL 
               THEN CONCAT('/uploads/certificates/', certificate_image) 
               ELSE NULL 
          END as image_url
        FROM certificates 
        WHERE expert_id = $1
        ORDER BY obtain_time DESC`,
        [expertId]
      );
      res.json({
        success: true,
        certificates: result.rows
      });
    } catch (error) {
      console.error('获取证书失败:', error);
      res.status(500).json({ 
        success: false,
        error: '获取证书失败' 
      });
    }
  }
);


// 删除证书（同时删除图片）
router.delete('/certificates/:id', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.EXPERT]), 
  async (req, res) => {
    const { id } = req.params;
    try {
      // 检查证书是否存在且属于当前专家
      const certResult = await require('../model').query(
        'SELECT certificate_image FROM certificates WHERE certificate_id = $1 AND expert_id = $2',
        [id, req.user.userId]
      );
      
      if (certResult.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: '证书未找到或无权操作' 
        });
      }
      
      // 删除证书图片文件
      if (certResult.rows[0].certificate_image) {
        const imagePath = path.join(certUploadDir, certResult.rows[0].certificate_image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      // 执行删除
      await require('../model').query(
        'DELETE FROM certificates WHERE certificate_id = $1', 
        [id]
      );
      
      res.json({ 
        success: true,
        message: '证书删除成功' 
      });
    } catch (error) {
      console.error('删除证书失败:', error);
      res.status(500).json({ 
        success: false,
        error: '删除证书失败' 
      });
    }
  }
);


// 更新证书（可选图片更新）
router.patch('/certificates/:id', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.EXPERT]),
  uploadCertImage.single('certificate_image'),
  async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
      // 检查证书是否存在且属于当前专家
      const certResult = await require('../model').query(
        'SELECT certificate_image FROM certificates WHERE certificate_id = $1 AND expert_id = $2',
        [id, req.user.userId]
      );
      
      if (certResult.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: '证书未找到或无权操作' 
        });
      }
      
      // 处理图片更新
      let oldImage = certResult.rows[0].certificate_image;
      let newImage = null;
      
      if (req.file) {
        newImage = req.file.filename;
        // 删除旧图片
        if (oldImage) {
          const oldImagePath = path.join(certUploadDir, oldImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }
      
      // 构建更新字段
      const fields = [
        'certificate_name', 
        'obtain_time', 
        'level', 
        'valid_period', 
        'authorizing_unit', 
        'description'
      ];
      
      const updateFields = {};
      fields.forEach(field => {
        if (updates[field] !== undefined) {
          updateFields[field] = updates[field];
        }
      });
      
      // 如果有新图片，添加到更新字段
      if (newImage) {
        updateFields.certificate_image = newImage;
      }
      
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ 
          success: false,
          error: '没有可更新的字段' 
        });
      }
      
      const setClause = Object.keys(updateFields)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');
      
      const values = Object.values(updateFields);
      values.push(id);
      
      const query = `
        UPDATE certificates 
        SET ${setClause}, is_audited = 'pending' 
        WHERE certificate_id = $${values.length} 
        RETURNING *,
          CASE WHEN certificate_image IS NOT NULL 
               THEN CONCAT('/uploads/certificates/', certificate_image) 
               ELSE NULL 
          END as image_url
      `;
      
      const result = await require('../model').query(query, values);
      
      res.json({
        success: true,
        message: '证书更新成功',
        certificate: result.rows[0]
      });
    } catch (error) {
      console.error('更新证书失败:', error);
      res.status(500).json({ 
        success: false,
        error: '更新证书失败' 
      });
    }
  }
);

// 获取单个证书详情（专家自己的证书）
router.get('/certificate/:id', 
  authMiddleware.authenticateToken, 
  authMiddleware.checkRole([ROLES.EXPERT]),
  async (req, res) => {
    const { id } = req.params;
    const expertId = req.user.userId;
    
    try {
      const result = await require('../model').query(
        `SELECT 
          certificate_id,
          certificate_name,
          certificate_image,
          obtain_time,
          level,
          valid_period,
          authorizing_unit,
          description,
          status,
          is_audited,
          audited_reason,
          audited_at,
          CASE WHEN certificate_image IS NOT NULL 
               THEN CONCAT('/uploads/certificates/', certificate_image) 
               ELSE NULL 
          END as image_url
        FROM certificates 
        WHERE certificate_id = $1 AND expert_id = $2`,
        [id, expertId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: '证书未找到或无权访问' 
        });
      }
      
      res.json({
        success: true,
        certificate: result.rows[0]
      });
    } catch (error) {
      console.error('获取证书详情失败:', error);
      res.status(500).json({ 
        success: false,
        error: '获取证书详情失败' 
      });
    }
  }
);

module.exports = router;