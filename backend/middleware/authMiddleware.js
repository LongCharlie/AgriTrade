const jwt = require('jsonwebtoken');
const db = require('../model');

// JWT认证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }
  jwt.verify(token, process.env.JWT_SECRET || 'A7#fK9!zP2@qL5$vE8&rT1*yU3^wX6%', (err, user) => {
    if (err) {
      return res.status(403).json({ error: '无效的令牌' });
    }
    req.user = user;
    next();
  });
}

function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: '未认证' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: '无权访问此资源' });
    }
    next();
  };
}

// 角色常量
const ROLES = {
  ADMIN: 'admin',
  EXPERT: 'expert',
  FARMER: 'farmer',
  BUYER: 'buyer'
};

module.exports = {
  authenticateToken,
  checkRole,
  ROLES
};