// model.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//上传头像 更新用户信息
const updateUserAvatar = async (userId, avatarUrl) => {
  try {
    // 删除旧头像
    const oldAvatarResult = await pool.query(
      'SELECT avatar_url FROM users WHERE user_id = $1',
      [userId]
    );
    if (oldAvatarResult.rows[0]?.avatar_url) {
      const oldFilePath = path.join(__dirname, 'uploads', 'avatars', oldAvatarResult.rows[0].avatar_url);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }
    // 更新数据库
    const result = await pool.query(
      'UPDATE users SET avatar_url = $1 WHERE user_id = $2 RETURNING avatar_url',
      [avatarUrl, userId]
    );
    if (!result.rows.length) {
      throw new Error('用户不存在');
    }
    return `/uploads/avatars/${result.rows[0].avatar_url}`;
  } catch (error) {
    throw new Error(`更新头像失败: ${error.message}`);
  }
};

// 数据库连接配置
const pool = new Pool({
  user: 'postgres',
  host: '22.tcp.cpolar.top',
  database: 'agriculture db',
  password: '12345678',
  port: 14963,
  ssl: false,
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

// 获取用户详细信息
const getUserById = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};

// 获取专家详细信息（包括专家表的信息）
const getExpertDetails = async (expertId) => {
  const userResult = await pool.query(
    'SELECT * FROM users WHERE user_id = $1',
    [expertId]
  );
  
  const expertResult = await pool.query(
    'SELECT * FROM experts WHERE expert_id = $1',
    [expertId]
  );
  
  return {
    ...userResult.rows[0],
    ...expertResult.rows[0]
  };
};

// 更新用户基本信息
const updateUserProfile = async (userId, updates) => {
  const fields = Object.keys(updates);
  if (fields.length === 0) {
    throw new Error('没有可更新的字段');
  }

  const setClause = fields
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');
  
  const values = fields.map(key => updates[key]);
  values.push(userId);

  const queryText = `UPDATE users SET ${setClause} WHERE user_id = $${values.length} RETURNING *`;
  
  const result = await pool.query(queryText, values);
  return result.rows[0];
};

const updatePlantingRecordStatus = async (recordId, status) => {
  const result = await pool.query(
    'UPDATE planting_records SET growth_status = $1 WHERE record_id = $2 RETURNING *',
    [status, recordId]
  );
  return result.rows[0];
};

const getAgricultureCount = async () => {
  const { rows } = await pool.query(`
    SELECT COUNT(DISTINCT product_name) AS count 
    FROM planting_records
  `);
  return parseInt(rows[0].count);
};

const getFarmerCount = async () => {
  const { rows } = await pool.query(`
    SELECT COUNT(*) AS count 
    FROM users 
    WHERE role = 'farmer'
  `);
  return parseInt(rows[0].count);
};

const getExpertCount = async () => {
  const { rows } = await pool.query(`
    SELECT COUNT(*) AS count 
    FROM experts
  `);
  return parseInt(rows[0].count);
};

const getPlantingRecordsByFarmerId = async (farmerId) => {
  const { rows } = await pool.query(`
    SELECT 
      record_id,
      product_name,
      province,
      growth_status,
      TO_CHAR(created_at, 'YYYY/MM/DD') AS created_at
    FROM planting_records
    WHERE farmer_id = $1
    ORDER BY created_at DESC
  `, [farmerId]);
  return rows;
};

const getProvinceOrders = async (province) => {
  const { rows } = await pool.query(`
    SELECT 
      o.order_id,
      d.product_name,
      o.quantity,
      o.price,
      TO_CHAR(o.created_at, 'YYYY-MM-DD') AS created_at,
      o.status
    FROM purchase_applications o
    JOIN purchase_demands d ON o.demand_id = d.demand_id
    WHERE o.province = $1
    ORDER BY o.created_at DESC
  `, [province]);
  return rows;
};

const deletePlantingRecord = async (recordId, farmerId) => {
  const { rowCount } = await pool.query(`
    DELETE FROM planting_records 
    WHERE record_id = $1 AND farmer_id = $2
    RETURNING record_id
  `, [recordId, farmerId]);
  
  if (rowCount === 0) {
    throw new Error('记录不存在或无权删除');
  }
};

const getPurchaseDemands = async () => {
  const { rows } = await pool.query(`
    SELECT 
      d.demand_id,
      d.product_name,
      d.quantity,
      d.buyer_id,
      u.username AS buyerName,
      d.delivery_city AS address,
      TO_CHAR(d.updated_at, 'YYYY-MM-DD HH24:MI:SS') AS updated_at
    FROM purchase_demands d
    JOIN users u ON d.buyer_id = u.user_id
    ORDER BY d.updated_at DESC
  `);
  return rows;
};

const getFarmerApplications = async (farmerId) => {
  const { rows } = await pool.query(`
    SELECT 
      application_id,
      demand_id,
      record_id,
      quantity,
      price,
      province
    FROM purchase_applications
    WHERE farmer_id = $1
    ORDER BY created_at DESC
  `, [farmerId]);
  return rows;
};

const updateApplication = async (applicationId, farmerId, data) => {
  const { record_id, quantity, price, province } = data;
  
  const recordCheck = await pool.query(`
    SELECT 1 FROM planting_records 
    WHERE record_id = $1 AND farmer_id = $2
  `, [record_id, farmerId]);
  
  if (recordCheck.rows.length === 0) {
    throw new Error('无效的种植记录ID');
  }

  const { rows } = await pool.query(`
    UPDATE purchase_applications
    SET 
      record_id = $1,
      quantity = $2,
      price = $3,
      province = $4
    WHERE application_id = $5 AND farmer_id = $6
    RETURNING *
  `, [record_id, quantity, price, province, applicationId, farmerId]);

  if (rows.length === 0) {
    throw new Error('申请不存在或无权修改');
  }
  return rows[0];
};

// 导出所有数据库操作方法
module.exports = {
  checkUserExists,
  createUser,
  createQuestion,
  getQuestions,
  updateUserProfile,
  getQuestionById,
  updateQuestionStatus,
  updateExpertProfile,
  createExpert,
  getProductPrice,
  getUserByUsername,
  comparePassword,
  generateToken,
  checkFieldNeedsUpdate,
  getExpertDetails,
  getExpertById,
  getUserById,
  updateUserAvatar,
  getAgricultureCount,
  getFarmerCount,
  getExpertCount,
  getPlantingRecordsByFarmerId,
  getProvinceOrders,
  deletePlantingRecord,
  getPurchaseDemands,
  getFarmerApplications,
  updateApplication,
  // 也可以导出原始的query方法以便特殊查询使用
  query: (text, params) => pool.query(text, params),
};