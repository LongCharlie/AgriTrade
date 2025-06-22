// model.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 数据库连接配置
const pool = new Pool({
  user: 'postgres',
  host: '192.168.31.107',
  database: 'agriculture db',
  password: '12345678',
  port: 5432,
});

// 测试数据库连接
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('数据库连接错误:', err);
  } else {
    console.log('数据库连接成功');
  }
});

// 数据库操作方法
const checkUserExists = async (username) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows.length > 0;
};

const createUser = async (userData) => {
  const {
    username,
    password,
    role,
    phone,
    province,
    city,
    district,
    address_detail
  } = userData;
  //加密code
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await pool.query(
    `INSERT INTO users (
      username, 
      password, 
      role, 
      phone, 
      province, 
      city, 
      district, 
      address_detail
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id`,
    [
      username,
      hashedPassword,
      role,
      phone,
      province,
      city,
      district,
      address_detail
    ]
  );
  return result.rows[0];
};

const createExpert = async (expertId) => {
  await pool.query(
    'INSERT INTO experts (expert_id) VALUES ($1)',
    [expertId]
  );
};

const getUserByUsername = async (username) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0];
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.user_id,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET || 'A7#fK9!zP2@qL5$vE8&rT1*yU3^wX6%', // 建议使用环境变量
    { expiresIn: '1h' }
  );
};

//获取专家id
const getExpertById = async (expertId) => {
  const result = await pool.query(
    'SELECT * FROM experts WHERE expert_id = $1',
    [expertId]
  );
  return result.rows[0];
};

//更新专家信息
const updateExpertProfile = async (expertId, updates) => {
  const fields = Object.keys(updates);
  if (fields.length === 0) {
    throw new Error('没有可更新的字段');
  }

  const setClause = fields
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');
  
  const values = fields.map(key => updates[key]);
  values.push(expertId);

  const queryText = `UPDATE experts SET ${setClause} WHERE expert_id = $${values.length} RETURNING *`;
  
  const result = await pool.query(queryText, values);
  return result.rows[0];
};

//检查字段是否需要更新
const checkFieldNeedsUpdate = (currentValue, newValue) => {
  // 如果新值不为空且与当前值不同，则需要更新
  return newValue !== undefined && newValue !== null && newValue !== '' && newValue !== currentValue;
};

const getProductPrice = async (productName, province) => {
  const query = `
    SELECT 
      product_name,
      province,
      AVG(avg_price) AS average_price
    FROM 
      price_references
    WHERE 
      product_name = $1 AND province = $2
    GROUP BY 
      product_name, province;
  `;
  
  const { rows } = await pool.query(query, [productName, province]);
  return rows;
};

const createQuestion = async (farmerId, title, content) => {
  const result = await pool.query(
    `INSERT INTO questions (
      farmer_id, 
      title, 
      content
    ) VALUES ($1, $2, $3) RETURNING *`,
    [farmerId, title, content]
  );
  return result.rows[0];
};

// 获取问题列表
const getQuestions = async (filter = {}) => {
  let query = 'SELECT * FROM questions';
  const values = [];
  const conditions = [];
  
  // 添加过滤条件
  if (filter.farmerId) {
    conditions.push(`farmer_id = $${values.length + 1}`);
    values.push(filter.farmerId);
  }
  
  if (filter.status) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(filter.status);
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' ORDER BY created_at DESC';
  
  const result = await pool.query(query, values);
  return result.rows;
};

// 获取单个问题详情
const getQuestionById = async (questionId) => {
  const result = await pool.query(
    'SELECT * FROM questions WHERE question_id = $1',
    [questionId]
  );
  return result.rows[0];
};

// 更新问题状态
const updateQuestionStatus = async (questionId, status) => {
  const result = await pool.query(
    'UPDATE questions SET status = $1 WHERE question_id = $2 RETURNING *',
    [status, questionId]
  );
  return result.rows[0];
};

// 导出所有数据库操作方法
module.exports = {
  checkUserExists,
  createUser,
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestionStatus,
  updateExpertProfile,
  createExpert,
  getProductPrice,
  getUserByUsername,
  comparePassword,
  generateToken,
  checkFieldNeedsUpdate,
  getExpertById,
  // 也可以导出原始的query方法以便特殊查询使用
  query: (text, params) => pool.query(text, params),
};