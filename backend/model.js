// model.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// 数据库连接配置
const pool = new Pool({
  user: 'postgres',
  host: '22.tcp.cpolar.top',
  database: 'agriculture db',
  password: '12345678',
  port: 11731,
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

// 新增的更新用户头像函数
const updateUserAvatar = async (userId, avatarFilename) => {
  try {
    // 获取旧头像文件名
    const oldAvatarResult = await pool.query(
      'SELECT avatar_url FROM users WHERE user_id = $1',
      [userId]
    );
    
    const oldAvatar = oldAvatarResult.rows[0]?.avatar_url;
    
    // 更新数据库中的头像URL
    const result = await pool.query(
      'UPDATE users SET avatar_url = $1 WHERE user_id = $2 RETURNING avatar_url',
      [avatarFilename, userId]
    );
    
    if (!result.rows.length) {
      throw new Error('用户不存在');
    }
    
    // 返回新的头像URL路径
    return `/uploads/avatars/${result.rows[0].avatar_url}`;
  } catch (error) {
    throw new Error(`更新头像失败: ${error.message}`);
  }
};


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

// 添加回答图片
const addAnswerImages = async (answerId, imageUrls) => {
  const query = `
    INSERT INTO answer_images (answer_id, image_url)
    VALUES ${imageUrls.map((_, i) => `($1, $${i + 2})`).join(', ')}
    RETURNING *
  `;
  const values = [answerId, ...imageUrls];
  const result = await pool.query(query, values);
  return result.rows;
};

// 获取回答图片
const getAnswerImages = async (answerId) => {
  const result = await pool.query(
    'SELECT * FROM answer_images WHERE answer_id = $1 AND is_deleted = false ORDER BY created_at',
    [answerId]
  );
  return result.rows;
};

const createExpert = async (expertData) => {
  const {
    expert_id,
    real_name,
    title,
    institution,
    expertise,
    bio
  } = expertData;
  
  await pool.query(
    `INSERT INTO experts (
      expert_id,
      real_name,
      title,
      institution,
      expertise,
      bio,
      answer_count
    ) VALUES ($1, $2, $3, $4, $5, $6, 0)`,
    [expert_id, real_name, title, institution, expertise, bio]
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

// 创建回答
const createAnswer = async (questionId, expertId, content) => {
  const result = await pool.query(
    `INSERT INTO answers (
      question_id,
      expert_id,
      content
    ) VALUES ($1, $2, $3) RETURNING *`,
    [questionId, expertId, content]
  );
  return result.rows[0];
};

// 获取问题的所有回答
const getAnswersByQuestionId = async (questionId) => {
  const result = await pool.query(
    `SELECT 
      a.*,
      e.real_name as expert_real_name,
      e.title as expert_title,
      u.avatar_url as expert_avatar,
      CASE WHEN u.avatar_url IS NOT NULL 
           THEN CONCAT('/uploads/avatars/', u.avatar_url) 
           ELSE NULL 
      END as expert_avatar_url
    FROM answers a
    LEFT JOIN users u ON a.expert_id = u.user_id
    LEFT JOIN experts e ON a.expert_id = e.expert_id
    WHERE a.question_id = $1
    ORDER BY a.answered_at DESC`,
    [questionId]
  );
  return result.rows.map(row => ({
    ...row,
    expert_info: {
      real_name: row.expert_real_name,
      title: row.expert_title,
      avatar_url: row.expert_avatar_url
    }
  }));
};

// 获取单个回答详情
const getAnswerById = async (answerId) => {
  const result = await pool.query(
    `SELECT 
      a.*,
      u.username as expert_name,
      u.avatar_url as expert_avatar,
      e.title as expert_title,
      e.institution as expert_institution
    FROM answers a
    LEFT JOIN users u ON a.expert_id = u.user_id
    LEFT JOIN experts e ON a.expert_id = e.expert_id
    WHERE a.answer_id = $1`,
    [answerId]
  );
  return result.rows[0];
};

// 更新回答内容
const updateAnswer = async (answerId, expertId, content) => {
  const result = await pool.query(
    `UPDATE answers 
     SET content = $1 
     WHERE answer_id = $2 AND expert_id = $3
     RETURNING *`,
    [content, answerId, expertId]
  );
  return result.rows[0];
};

// // 删除回答
// const deleteAnswer = async (answerId, expertId) => {
//   const { rowCount } = await pool.query(
//     `DELETE FROM answers
//      WHERE answer_id = $1 AND expert_id = $2`,
//     [answerId, expertId]
//   );
//   return rowCount > 0;
// };
// 删除回答
// 删除回答（修改现有方法）
const deleteAnswer = async (answerId, expertId) => {
  const { rowCount } = await pool.query(
    `DELETE FROM answers 
     WHERE answer_id = $1 AND expert_id = $2`,
    [answerId, expertId]
  );

  // 如果成功删除回答，则将专家的回答计数减一
  if (rowCount > 0) {
    await decrementExpertAnswerCount(expertId);
  }

  return rowCount > 0;
};

// 点赞回答
const upvoteAnswer = async (answerId) => {
  const result = await pool.query(
    `UPDATE answers 
     SET upvotes = upvotes + 1 
     WHERE answer_id = $1
     RETURNING upvotes`,
    [answerId]
  );
  return result.rows[0]?.upvotes;
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
  let query = `
    SELECT 
      q.*,
      u.username
    FROM questions q
    LEFT JOIN users u ON q.farmer_id = u.user_id
  `;
  const values = [];
  const conditions = [];
  
  // 添加过滤条件
  if (filter.farmerId) {
    conditions.push(`q.farmer_id = $${values.length + 1}`);
    values.push(filter.farmerId);
  }
  
  if (filter.status) {
    conditions.push(`q.status = $${values.length + 1}`);
    values.push(filter.status);
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' ORDER BY q.created_at DESC';
  
  const result = await pool.query(query, values);
  return result.rows;
};

// 添加问题图片
const addQuestionImages = async (questionId, imageUrls) => {
  const query = `
    INSERT INTO question_images (question_id, image_url)
    VALUES ${imageUrls.map((_, i) => `($1, $${i + 2})`).join(', ')}
    RETURNING *
  `;
  const values = [questionId, ...imageUrls];
  const result = await pool.query(query, values);
  return result.rows;
};

// 获取问题图片
const getQuestionImages = async (questionId) => {
  const result = await pool.query(
    'SELECT * FROM question_images WHERE question_id = $1 AND is_deleted = false ORDER BY created_at',
    [questionId]
  );
  return result.rows;
};

// 删除问题图片
const deleteQuestionImage = async (imageId, questionId) => {
  const result = await pool.query(
    'UPDATE question_images SET is_deleted = 1 WHERE image_id = $1 AND question_id = $2 RETURNING *',
    [imageId, questionId]
  );
  return result.rows[0];
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
      pa.quantity,
      pa.price,
      TO_CHAR(o.created_at, 'YYYY-MM-DD') AS created_at,
      o.status
    FROM orders o
    JOIN purchase_applications pa ON o.application_id = pa.application_id
    JOIN purchase_demands d ON pa.demand_id = d.demand_id
    WHERE pa.province = $1
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
      u.username AS buyername,
      u.province AS address,
      TO_CHAR(d.updated_at, 'YYYY-MM-DD HH24:MI:SS') AS updated_at,
      d.status
    FROM 
      purchase_demands d
    JOIN 
      users u ON d.buyer_id = u.user_id
    WHERE 
      d.status = 'open'
    ORDER BY 
      d.updated_at DESC
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
      province,
      status,
      TO_CHAR(applied_at, 'YYYY-MM-DD HH24:MI:SS') AS applied_at
    FROM purchase_applications
    WHERE farmer_id = $1
    ORDER BY applied_at DESC
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

// 删除证书
const deleteCertificate = async (certificateId) => {
  await pool.query(
    'DELETE FROM certificates WHERE certificate_id = $1',
    [certificateId]
  );
};

// 获取所有经验帖（可筛选状态）
const getAllExperiences = async (auditStatus = null) => {
  let query = `
    SELECT 
      e.*,
      u.username as author_name,
      u.avatar_url as author_avatar
    FROM experiences e
    LEFT JOIN users u ON e.user_id = u.user_id
  `;
  
  const params = [];
  
  if (auditStatus) {
    query += ' WHERE e.audit_status = $1';
    params.push(auditStatus);
  }
  
  query += ' ORDER BY e.created_at DESC';
  
  const { rows } = await pool.query(query, params);
  return rows;
};

// 更新经验帖审核状态
const updateExperienceStatus = async (experienceId, status, adminId) => {
  // 验证状态值是否有效
  const validStatuses = ['pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new Error('无效的审核状态');
  }

  const query = `
    UPDATE experiences
    SET 
      audit_status = $1,
      reviewed_by = $2,
      reviewed_at = NOW()
    WHERE experience_id = $3
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, [status, adminId, experienceId]);
  
  if (rows.length === 0) {
    throw new Error('经验帖不存在');
  }
  
  return rows[0];
};

// 获取管理员视图问题列表
const getAdminQuestions = async () => {
  const query = `
    SELECT q.*, u.user_id
    FROM questions q
    LEFT JOIN users u ON q.farmer_id = u.user_id
  `;
  const { rows } = await pool.query(query);
  return rows;
};

// 获取带用户信息的问题详情
const getQuestionWithUser = async (questionId) => {
  const query = `
    SELECT q.*, u.username, u.user_id
    FROM questions q
    LEFT JOIN users u ON q.farmer_id = u.user_id
    WHERE q.question_id = $1
  `;
  const { rows } = await pool.query(query, [questionId]);
  return rows[0];
};

// 获取问题的所有回答（关联专家信息）
const getAnswersByQuestion = async (questionId) => {
  const query = `
    SELECT a.*, e.real_name 
    FROM answers a
    LEFT JOIN experts e ON a.expert_id = e.expert_id
    WHERE a.question_id = $1
  `;
  const { rows } = await pool.query(query, [questionId]);
  return rows;
};

// 管理员更新问题状态
const updateQuestionStatusAdmin = async ({
  questionId,
  is_deleted,
  delete_reason,
  adminId
}) => {
  const query = `
    UPDATE questions 
    SET 
      is_deleted = $1,
      delete_reason = $2,
      deleted_by = $3,
      deleted_at = NOW()
    WHERE question_id = $4
  `;
  await pool.query(query, [
    is_deleted,
    delete_reason,
    adminId,
    questionId
  ]);
};

// // 删除回答
// const deleteAnswer = async (answerId) => {
//   await pool.query(
//     'DELETE FROM answers WHERE answer_id = $1',
//     [answerId]
//   );
// };

const getCertificatesWithExpertInfo = async () => {
  const query = `
    SELECT c.*, e.real_name, e.title, e.institution 
    FROM certificates c
    LEFT JOIN experts e ON c.expert_id = e.expert_id
  `;
  const { rows } = await pool.query(query);
  return rows;
};

// 处理售后订单审核理由
const resolveAfterSaleOrder = async (orderId, decision, reason) => {
  // 验证decision是否有效
  const validDecisions = ['approve', 'reject'];
  if (!validDecisions.includes(decision)) {
    throw new Error('无效的审核决定，必须是approve或reject');
  }

  // 根据decision设置订单状态
  const newStatus = decision === 'approve' ? 'after_sale_resolved' : 'after_sale_rejected';

  const query = `
    UPDATE orders
    SET 
      status = $1,
      admin_reason = $2,
      resolved_at = NOW(),
      updated_at = NOW()
    WHERE order_id = $3 AND status = 'after_sale_requested'
    RETURNING *
  `;

  const { rows } = await pool.query(query, [newStatus, reason, orderId]);
  
  if (rows.length === 0) {
    throw new Error('订单不存在或当前状态不允许此操作');
  }

  return rows[0];
};

// 获取所有有售后原因的订单详情
const getAfterSaleOrders = async () => {
  const query = `
    SELECT 
      o.order_id,
      d.product_name,
      d.quantity,
      a.price,
      o.farmer_id,
      farmer.username AS farmer_name,
      buyer.province AS delivery_location,
      o.buyer_id,
      buyer.username AS buyer_name,
      buyer.phone,
      TO_CHAR(o.created_at, 'YYYY-MM-DD') AS created_at,
      o.status,
      o.after_sale_reason,
      o.after_sale_reason_images,
      o.admin_reason
    FROM orders o
    JOIN purchase_applications a ON o.application_id = a.application_id
    JOIN purchase_demands d ON a.demand_id = d.demand_id
    JOIN users farmer ON o.farmer_id = farmer.user_id
    JOIN users buyer ON o.buyer_id = buyer.user_id
    WHERE o.after_sale_reason IS NOT NULL
    ORDER BY o.created_at DESC
  `;
  
  const { rows } = await pool.query(query);
  return rows;
};

// 获取所有非管理员用户
const getAllUsers = async () => {
  const { rows } = await pool.query(`
    SELECT 
      user_id,
      username,
      role,
      phone,
      province,
      city,
      district,
      address_detail,
      avatar_url,
      TO_CHAR(join_date, 'YYYY-MM-DD HH24:MI:SS') AS join_date
    FROM users
    WHERE role != 'admin'
    ORDER BY join_date DESC
  `);
  return rows;
};

// 删除用户
const deleteUser = async (userId) => {
  // 先检查用户是否存在且不是管理员
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('用户不存在');
  }
  if (user.role === 'admin') {
    throw new Error('不能删除管理员用户');
  }
  
  // 删除用户
  await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);
};

// 管理员更新订单状态
const updateOrderStatus = async (orderId, status, adminReason = null) => {
  // 验证状态值是否有效
  const validStatuses = ['pending_shipment', 'shipped', 'completed', 'after_sale_requested', 'after_sale_resolved'];
  if (!validStatuses.includes(status)) {
    throw new Error('无效的订单状态');
  }

  const query = `
    UPDATE orders
    SET 
      status = $1,
      ${status === 'shipped' ? 'shipment_time = NOW(),' : ''}
      ${status === 'completed' ? 'buyer_confirm_time = NOW(),' : ''}
      ${adminReason ? 'admin_reason = $3,' : ''}
      updated_at = NOW()
    WHERE order_id = $2
    RETURNING *
  `;

  const params = [status, orderId];
  if (adminReason) params.push(adminReason);

  const { rows } = await pool.query(query, params);
  
  if (rows.length === 0) {
    throw new Error('订单不存在');
  }

  return rows[0];
};

// 获取订单对应的买家数量
const getOrderBuyerCount = async (orderId) => {
  const query = `
    SELECT 
      COUNT(DISTINCT buyer_id) AS buyer_count
    FROM orders
    WHERE order_id = $1
  `;
  
  const { rows } = await pool.query(query, [orderId]);
  
  if (rows.length === 0) {
    throw new Error('订单不存在');
  }

  return {
    order_id: orderId,
    buyer_count: parseInt(rows[0].buyer_count)
  };
};

// 按周统计订单金额
const getWeeklyOrderSummary = async () => {
  const query = `
    SELECT 
      DATE_TRUNC('week', o.created_at) AS week_start,
      SUM(pa.price * pa.quantity) AS total_amount,
      COUNT(*) AS order_count
    FROM orders o
    JOIN purchase_applications pa ON o.application_id = pa.application_id
    GROUP BY week_start
    ORDER BY week_start DESC
  `;
  
  const { rows } = await pool.query(query);
  return rows;
};

// 按月统计订单金额
const getMonthlyOrderSummary = async () => {
  const query = `
    SELECT 
      DATE_TRUNC('month', o.created_at) AS month_start,
      SUM(pa.price * pa.quantity) AS total_amount,
      COUNT(*) AS order_count
    FROM orders o
    JOIN purchase_applications pa ON o.application_id = pa.application_id
    GROUP BY month_start
    ORDER BY month_start DESC
  `;
  
  const { rows } = await pool.query(query);
  return rows;
};

// 按年统计订单金额
const getYearlyOrderSummary = async () => {
  const query = `
    SELECT 
      DATE_TRUNC('year', o.created_at) AS year_start,
      SUM(pa.price * pa.quantity) AS total_amount,
      COUNT(*) AS order_count
    FROM orders o
    JOIN purchase_applications pa ON o.application_id = pa.application_id
    GROUP BY year_start
    ORDER BY year_start DESC
  `;
  
  const { rows } = await pool.query(query);
  return rows;
};
// 获取经验帖评论（带审核状态过滤）
const getExperienceComments = async (experienceId, status = 'approved') => {
  const query = `
    SELECT 
      c.*,
      u.username as commenter_name,
      u.avatar_url as commenter_avatar
    FROM experience_comments c
    LEFT JOIN users u ON c.user_id = u.user_id
    WHERE c.experience_id = $1
    ${status ? 'AND c.status = $2' : ''}
    ORDER BY c.created_at DESC
  `;
  
  const params = [experienceId];
  if (status) params.push(status);
  
  const { rows } = await pool.query(query, params);
  return rows;
};

// 更新评论审核状态
const updateCommentStatus = async (commentId, status, adminId) => {
  // 验证状态值是否有效
  const validStatuses = ['pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new Error('无效的审核状态');
  }

  const query = `
    UPDATE experience_comments
    SET 
      status = $1,
      reviewed_by = $2,
      reviewed_at = NOW()
    WHERE comment_id = $3
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, [status, adminId, commentId]);
  
  if (rows.length === 0) {
    throw new Error('评论不存在');
  }
  
  return rows[0];
};

// 获取所有待审核评论（管理员用）
const getPendingComments = async () => {
  const query = `
    SELECT 
      c.*,
      u.username as commenter_name,
      e.title as experience_title
    FROM experience_comments c
    LEFT JOIN users u ON c.user_id = u.user_id
    LEFT JOIN experiences e ON c.experience_id = e.experience_id
    WHERE c.status = 'pending'
    ORDER BY c.created_at DESC
  `;
  
  const { rows } = await pool.query(query);
  return rows;
};

// 获取全平台买家总数
const getTotalBuyerCount = async () => {
  const { rows } = await pool.query(`
    SELECT COUNT(*) AS count 
    FROM users 
    WHERE role = 'buyer'
  `);
  return parseInt(rows[0].count);
};

// 管理员更新用户信息
const updateUserProfileAdmin = async (userId, updates) => {
  const fields = Object.keys(updates);
  if (fields.length === 0) {
    throw new Error('没有可更新的字段');
  }

  const setClause = fields
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');
  
  const values = fields.map(key => updates[key]);
  values.push(userId);

  const queryText = `
    UPDATE users 
    SET ${setClause}, updated_at = NOW() 
    WHERE user_id = $${values.length} 
    RETURNING 
      user_id, 
      username, 
      phone, 
      province, 
      city, 
      district, 
      address_detail, 
      avatar_url, 
  `;
  
  const result = await pool.query(queryText, values);
  return result.rows[0];
};

// 获取所有待审核的证书
const getPendingCertificates = async () => {
  const { rows } = await pool.query(`
    SELECT 
      c.*,
      e.real_name,
      e.title,
      e.institution,
      u.username
    FROM certificates c
    JOIN experts e ON c.expert_id = e.expert_id
    JOIN users u ON c.expert_id = u.user_id
    WHERE c.is_audited = 'pending'
    ORDER BY c.created_at DESC
  `);
  return rows;
};

const updateCertificateStatus = async (certificateId, status, adminId, audited_reason = null) => {
  // 验证状态值是否有效
  const validStatuses = ['pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new Error('无效的审核状态');
  }

  let query = `
    UPDATE certificates
    SET 
      is_audited = $1,
      audited_by = $2,
      audited_at = NOW()
  `;
  const params = [status, adminId, certificateId];

  // 如果状态为rejected，添加rejectReason到查询和参数
  if (status === 'rejected') {
    query += `,
      audited_reason = $4
    `;
    params.push(audited_reason);
  }

  query += `
    WHERE certificate_id = $3
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, params);
  
  if (rows.length === 0) {
    throw new Error('证书不存在');
  }
  
  return rows[0];
};

// 获取单个证书详情（带专家信息）
const getCertificateWithExpertInfo = async (certificateId) => {
  const { rows } = await pool.query(`
    SELECT 
      c.*,
      e.real_name,
      e.title,
      e.institution,
      u.username
    FROM certificates c
    JOIN experts e ON c.expert_id = e.expert_id
    JOIN users u ON c.expert_id = u.user_id
    WHERE c.certificate_id = $1
  `, [certificateId]);
  
  if (rows.length === 0) {
    throw new Error('证书不存在');
  }
  
  return rows[0];
};

// 获取种植记录的所有农事活动
const getFarmingActivitiesByRecordId = async (recordId) => {
  const result = await pool.query(
    'SELECT * FROM farming_activities WHERE record_id = $1 ORDER BY activity_date',
    [recordId]
  );
  return result.rows;
};

// 创建新的农事活动
const createFarmingActivity = async (data) => {
  const { record_id, activity_date, activity_type, description, images } = data;
  // 将图片数组转为逗号分隔字符串
  const imageString = images.join(',');
  // activity_date转换没问题，但是存进去还是不对，不用这个了，拿数据用created_at
  const activityDate = new Date(activity_date);
  if (isNaN(activityDate.getTime())) {
    throw new Error('Invalid date format');
  }
  const result = await pool.query(
    `INSERT INTO farming_activities (
      record_id, 
      activity_date, 
      activity_type, 
      description, 
      images
    ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [record_id, activityDate, activity_type, description, imageString]
  );
console.log(result.rows[0]);
  return result.rows[0];
};

const createComment = async (experienceId, userId, content) => {
  const result = await pool.query(
    `INSERT INTO experience_comments (
      experience_id, 
      user_id, 
      content
    ) VALUES ($1, $2, $3) RETURNING *`,
    [experienceId, userId, content]
  );
  return result.rows[0];
};

// 通过经验ID获取作者信息
const getAuthorInfoByExperience = async (experienceId) => {
  const result = await pool.query(
    `SELECT u.username, u.avatar_url
     FROM experiences e
     LEFT JOIN users u ON e.user_id = u.user_id
     WHERE e.experience_id = $1`,
    [experienceId]
  );
  return result.rows[0];
};

// 获取所有经验分享（含作者信息）
const getAllExperiencesWithAuthor = async () => {
  const result = await pool.query(
    `SELECT 
      e.*,
      u.username AS author_name,
      u.avatar_url AS author_avatar
     FROM experiences e
     LEFT JOIN users u ON e.user_id = u.user_id
     WHERE e.audit_status = 'approved'
     ORDER BY e.created_at DESC`
  );
  return result.rows;
};

// 更新订单物流信息
const updateOrderLogisticsInfo = async (orderId, logisticsInfo) => {
  const result = await pool.query(
    'UPDATE orders SET logistics_info = $1 WHERE order_id = $2 RETURNING *',
    [logisticsInfo, orderId]
  );
  return result.rows[0];
};

// 获取农户的所有订单详情
const getFarmerOrders = async (farmerId) => {
  const result = await pool.query(
    `SELECT
      o.order_id,
      o.application_id,
      o.buyer_id,
      u.username AS buyer_name,
      u.phone AS buyer_phone,
      TO_CHAR(o.created_at, 'YYYY-MM-DD') AS created_at,
      o.status,
      o.after_sale_reason,
      o.after_sale_reason_images,
      o.logistics_info,
      a.reason,
      pd.product_name,
      pa.quantity,
      pa.price,
      o.province,
      o.city,
      o.district,
      o.address_detail
     FROM orders o
     LEFT JOIN users u ON o.buyer_id = u.user_id
     LEFT JOIN after_sale_audits a ON o.order_id = a.order_id
     LEFT JOIN purchase_applications pa ON o.application_id = pa.application_id
     LEFT JOIN purchase_demands pd ON pa.demand_id = pd.demand_id
     WHERE o.farmer_id = $1
     ORDER BY o.created_at DESC`,
    [farmerId]
  );
  // console.log(result.rows);
  return result.rows;
};

// 更新订单状态
const updateOrderStatus_farmer = async (orderId, status) => {
  // 定义允许的状态值
  const validStatuses = ['pending_shipment', 'pending', 'shipped', 'completed', 'canceled'];
  if (!validStatuses.includes(status)) {
    throw new Error('无效的状态值');
  }

  const result = await pool.query(
    'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *',
    [status, orderId]
  );
  return result.rows[0];
};

// 获取采购需求的所有申请（带农户信息）
const getDemandApplicationsWithFarmerInfo = async (demandId, buyerId) => {
  // 首先验证该需求确实属于该买家
  const demandCheck = await pool.query(
    'SELECT 1 FROM purchase_demands WHERE demand_id = $1 AND buyer_id = $2',
    [demandId, buyerId]
  );
  
  if (demandCheck.rows.length === 0) {
    throw new Error('采购需求不存在或无权访问');
  }

  const result = await pool.query(
    `SELECT 
      pa.*,
      u.username AS farmer_name,
      u.phone AS farmer_phone,
      u.province AS farmer_province,
      u.city AS farmer_city,
      u.district AS farmer_district,
      CASE WHEN u.avatar_url IS NOT NULL 
           THEN CONCAT('/uploads/avatars/', u.avatar_url) 
           ELSE NULL 
      END AS farmer_avatar_url,
      pr.product_name,
      pr.growth_status,
      TO_CHAR(pa.applied_at, 'YYYY-MM-DD HH24:MI:SS') AS formatted_applied_at
    FROM purchase_applications pa
    JOIN users u ON pa.farmer_id = u.user_id
    LEFT JOIN planting_records pr ON pa.record_id = pr.record_id
    WHERE pa.demand_id = $1
    ORDER BY pa.applied_at DESC`,
    [demandId]
  );
  
  return result.rows;
};

// 获取特定种植记录详情
const getPlantingRecordById = async (recordId) => {
  const { rows } = await pool.query(
    `SELECT
       pr.record_id,
       pr.farmer_id,
       pr.product_name,
       pr.province,
       pr.growth_status,
      u.username AS farmer_name,
      TO_CHAR(pr.created_at, 'YYYY/MM/DD') AS record_created_at
    FROM planting_records pr
    JOIN users u ON pr.farmer_id = u.user_id
    WHERE pr.record_id = $1`,
    [recordId]
  );
  if (rows.length === 0) {
    throw new Error('种植记录不存在或无权访问');
  }
  return rows[0];
};


// const getPlantingRecordsByFarmerId = async (farmerId) => {
//   const { rows } = await pool.query(`
//     SELECT
//       record_id,
//       product_name,
//       province,
//       growth_status,
//       TO_CHAR(created_at, 'YYYY/MM/DD') AS created_at
//     FROM planting_records
//     WHERE farmer_id = $1
//     ORDER BY created_at DESC
//   `, [farmerId]);
//   return rows;
// };

const incrementExpertAnswerCount = async (expertId) => {
  const result = await pool.query(
    'UPDATE experts SET answer_count = COALESCE(answer_count, 0) + 1 WHERE expert_id = $1 RETURNING answer_count',
    [expertId]
  );
  return result.rows[0]?.answer_count;
};

// 增加问题的回答计数
const incrementQuestionAnswerCount = async (questionId) => {
  const result = await pool.query(
    'UPDATE questions SET answer_count = COALESCE(answer_count, 0) + 1 WHERE question_id = $1 RETURNING answer_count',
    [questionId]
  );
  return result.rows[0]?.answer_count;
};

// 减少问题的回答计数
const decrementQuestionAnswerCount = async (questionId) => {
  const result = await pool.query(
    'UPDATE questions SET answer_count = GREATEST(COALESCE(answer_count, 0) - 1 WHERE question_id = $1 RETURNING answer_count',
    [questionId]
  );
  return result.rows[0]?.answer_count;
};


// 减少专家回答计数
const decrementExpertAnswerCount = async (expertId) => {
  const result = await pool.query(
    'UPDATE experts SET answer_count = GREATEST(COALESCE(answer_count, 0) - 1, 0) WHERE expert_id = $1 RETURNING answer_count',
    [expertId]
  );
  return result.rows[0]?.answer_count;
};

// 管理员删除回答（新增方法）
const adminDeleteAnswer = async (answerId) => {
  // 先获取回答信息以获取专家ID
  const answer = await getAnswerById(answerId);
  if (!answer) {
    throw new Error('回答不存在');
  }

  // 删除回答
  const { rowCount } = await pool.query(
    'DELETE FROM answers WHERE answer_id = $1',
    [answerId]
  );

  // 如果成功删除回答，则将专家的回答计数减一
  if (rowCount > 0 && answer.expert_id) {
    await decrementExpertAnswerCount(answer.expert_id);
  }

  return rowCount > 0;
};

const getBuyerDemands = async (buyerId) => {
  const { rows } = await pool.query(`
    SELECT 
      demand_id,
      product_name,
      quantity,
      status,
      TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
      TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS updated_at
    FROM purchase_demands
    WHERE buyer_id = $1
    ORDER BY updated_at DESC
  `, [buyerId]);
  return rows;
};

// 获取会话列表
const getChatList = async (userId) => {
  const query = `
    SELECT 
      c.comm_id AS chat_id,
      CASE 
        WHEN c.sender_id = $1 THEN c.receiver_id
        ELSE c.sender_id
      END AS other_user_id,
      u.username AS other_user_name,
      u.avatar_url AS other_user_avatar,
      c.content AS last_message_content,
      c.sender_id AS last_message_sender_id,
      c.sent_at AS last_message_timestamp
    FROM communications c
    JOIN users u ON 
      (c.sender_id = $1 AND u.user_id = c.receiver_id) OR 
      (c.receiver_id = $1 AND u.user_id = c.sender_id)
    WHERE c.application_id IS NULL
    GROUP BY c.comm_id, other_user_id, u.username, u.avatar_url, c.content, c.sender_id, c.sent_at
    ORDER BY c.sent_at DESC
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows.map(chat => ({
    chat_id: chat.chat_id,
    other_user_id: chat.other_user_id,
    other_user_name: chat.other_user_name,
    other_user_avatar: chat.other_user_avatar ? `/uploads/avatars/${chat.other_user_avatar}` : null,
    last_message: {
      content: chat.last_message_content,
      sender_id: chat.last_message_sender_id,
      timestamp: chat.last_message_timestamp
    }
  }));
};

// 获取消息记录
const getChatMessages = async (chatId) => {
  const query = `
    SELECT 
      comm_id AS message_id,
      sender_id,
      content,
      sent_at AS timestamp,
      CASE 
        WHEN image_path IS NOT NULL THEN 'image'
        ELSE 'text'
      END AS type
    FROM communications
    WHERE comm_id = $1
    ORDER BY sent_at ASC
  `;
  const { rows } = await pool.query(query, [chatId]);
  return rows;
};

// 发送消息
const sendMessage = async (senderId, other_user_id, content, image_url) => {
  const query = `
    INSERT INTO communications 
      (sender_id, receiver_id, content, image_path)
    VALUES ($1, $2, $3, $4)
    RETURNING comm_id, sent_at
  `;
  const { rows } = await pool.query(query, [
    senderId,
    other_user_id,
    content || null,
    image_url || null
  ]);
  return {
    message_id: rows[0].comm_id,
    timestamp: rows[0].sent_at
  };
};

// 导出所有数据库操作方法
module.exports = {
  checkUserExists,
  getTotalBuyerCount,
  decrementExpertAnswerCount,
   getWeeklyOrderSummary,
   getMonthlyOrderSummary,
   adminDeleteAnswer,
   getYearlyOrderSummary,
  createUser,
  getBuyerDemands,
  incrementQuestionAnswerCount,
  decrementQuestionAnswerCount,
  getPendingCertificates,
  updateCertificateStatus,
  getDemandApplicationsWithFarmerInfo,
  getCertificateWithExpertInfo,
  updateOrderStatus,
  updateUserProfileAdmin,
  createQuestion,
  getQuestions,
  updateUserProfile,
  getQuestionById,
  getPlantingRecordById,
  getAllUsers,
  deleteUser,
  getOrderBuyerCount,
  updateQuestionStatus,
  updateExpertProfile,
  createExpert,
  incrementExpertAnswerCount,
  getProductPrice,
  getUserByUsername,
  comparePassword,
  resolveAfterSaleOrder,
  getExperienceComments,
  updateCommentStatus,
  getPendingComments,
  generateToken,
  updateExperienceStatus,
  checkFieldNeedsUpdate,
  getExpertDetails,
  getExpertById,
  getUserById,
  getAllExperiences,
  updateUserAvatar,
  getAgricultureCount,
  getFarmerCount,
  getExpertCount,
  addAnswerImages,
  getAnswerImages,
  getPlantingRecordsByFarmerId,
  getProvinceOrders,
  deletePlantingRecord,
  getPurchaseDemands,
  getFarmerApplications,
  updatePlantingRecordStatus,
  addQuestionImages,
  getQuestionImages,
  deleteQuestionImage,
  createAnswer,
  getAnswersByQuestionId,
  getAnswerById,
  updateAnswer,
  upvoteAnswer,
  updateApplication,
  deleteCertificate,
  getAdminQuestions,
  getQuestionWithUser,
  getAnswersByQuestion,
  updateQuestionStatusAdmin,
  deleteAnswer,
  getAfterSaleOrders,
  getCertificatesWithExpertInfo,
  getFarmingActivitiesByRecordId,
  createFarmingActivity,
  createComment,
  getAuthorInfoByExperience,
  getAllExperiencesWithAuthor,
  updateOrderLogisticsInfo,
  getFarmerOrders,
  updateOrderStatus_farmer,
  getChatList,
  getChatMessages,
  sendMessage,
  // 也可以导出原始的query方法以便特殊查询使用
  query: (text, params) => pool.query(text, params),
};