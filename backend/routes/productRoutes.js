const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { ROLES } = authMiddleware;

router.get('/product-price', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.FARMER, ROLES.BUYER]), async (req, res) => {
  try {
    const { productName, province } = req.query;
    if (!productName || !province) {
      return res.status(400).json({ error: '产品名称和省份参数是必需的' });
    }

    const priceData = await require('../model').getProductPrice(productName, province);

    res.status(200).json({
      product: productName,
      province: province,
      data: priceData,
      message: priceData.length === 0 ? '暂无价格数据' : '查询成功'
    });
  } catch (error) {
    console.error('查询错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 价格趋势接口
router.get('/price-trends', authMiddleware.authenticateToken, authMiddleware.checkRole([ROLES.BUYER]), async (req, res) => {
  const { product, province } = req.query;
  const trends = await require('../model').query(`
    SELECT update_date, AVG(avg_price) 
    FROM price_references 
    WHERE product_name = $1 AND province = $2 
    GROUP BY update_date 
    ORDER BY update_date
  `, [product, province]);
  res.json(trends.rows);
});

module.exports = router;