const express = require('express');
const bodyParser = require('body-parser');
const db = require('./model'); // 引入数据库模型
const jwt = require('jsonwebtoken');
const cors = require('cors'); // 引入 CORS 中间件

const app = express();
app.use(cors()); // 允许所有来源的请求
app.use(bodyParser.json());
app.use(express.static('public'));

// 用户注册接口
app.post('/api/register', async (req, res) => {


  const {
    username,
    password,
    role,
    phone,
    province,
    city,
    district,
    address_detail
  } = req.body;

  try {
    // 检查用户名是否已存在
    const userExists = await db.checkUserExists(username);
    if (userExists) {
      return res.status(400).send('用户名已存在');
    }

    // 创建新用户
    const newUser = await db.createUser(req.body);

    // 如果是专家角色，需要在experts表中也创建记录
    if (role === 'expert') {
      await db.createExpert(newUser.user_id);
    }

    res.status(200).send('注册成功');
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).send('注册失败，请稍后再试');
  }
});

//用户登录接口
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. 检查用户是否存在
    const user = await db.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: '用户名或密码不正确' });
    }

    // 2. 验证密码
    const isMatch = await db.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: '用户名或密码不正确' });
    }

    // 3. 生成并返回token
    const token = db.generateToken(user);
    
    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.user_id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '登录失败，请稍后再试' });
  }
});

// 受保护的路由示例 - 需要登录才能访问
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: '这是受保护的内容',
    user: req.user
  });
});

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

// 角色常量（可选）
const ROLES = {
  ADMIN: 'admin',
  EXPERT: 'expert',
  FARMER: 'farmer',
  BUYER: 'buyer'
};

//专家信息更新
app.patch('/api/expert/profile', authenticateToken, checkRole([ROLES.EXPERT]), async (req, res) => {
  try {
    const expertId = req.user.userId;
    const { real_name, title, institution, expertise, bio } = req.body;

    // 获取当前专家信息
    const currentExpert = await db.getExpertById(expertId);
    if (!currentExpert) {
      return res.status(404).json({ error: '专家信息未找到' });
    }

    // 构建更新字段和值
    const updates = {};
    const fieldsToUpdate = ['real_name', 'title', 'institution', 'expertise', 'bio'];
    
    fieldsToUpdate.forEach(field => {
      // 检查字段是否需要更新（新值不为空且与当前值不同）
      if (db.checkFieldNeedsUpdate(currentExpert[field], req.body[field])) {
        updates[field] = req.body[field];
      }
    });

    // 如果没有可更新的字段
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        error: '没有可更新的字段', 
        message: '提供的字段值与当前值相同或为空' 
      });
    }

    // 执行更新
    const updatedExpert = await db.updateExpertProfile(expertId, updates);
    
    res.json({
      message: '专家信息更新成功',
      expert: updatedExpert
    });
    
  } catch (error) {
    console.error('更新专家信息错误:', error);
    res.status(500).json({ error: '服务器错误', details: error.message });
  }
});

// 获取用户个人信息
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;
    
    let userData;
    
    if (role === 'expert') {
      // 专家用户获取更多信息
      userData = await db.getExpertDetails(userId);
    } else {
      // 普通用户
      userData = await db.getUserById(userId);
    }
    
    if (!userData) {
      return res.status(404).json({ error: '用户未找到' });
    }
    
    // 移除敏感信息
    delete userData.password;
    
    res.json(userData);
    
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 更新用户基本信息（所有用户通用）
app.patch('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { phone, province, city, district, address_detail } = req.body;

    // 构建更新字段
    const updates = {};
    const fields = ['phone', 'province', 'city', 'district', 'address_detail'];
    
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // 如果没有可更新的字段
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: '没有提供可更新的字段' });
    }

    // 执行更新
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    
    const values = Object.values(updates);
    values.push(userId);

    const query = `UPDATE users SET ${setClause} WHERE user_id = $${values.length} RETURNING *`;
    const result = await db.query(query, values);

    res.json({
      message: '用户信息更新成功',
      user: result.rows[0]
    });
    
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ error: '更新用户信息失败' });
  }
});


// 查询各省份作物平均价格
app.get('/api/product-price',authenticateToken, checkRole([ROLES.FARMER,ROLES.BUYER]), async (req, res) => {
  try {
    const { productName, province } = req.query;

    if (!productName || !province) {
      return res.status(400).json({ error: '产品名称和省份参数是必需的' });
    }

    const priceData = await db.getProductPrice(productName, province);

    if (priceData.length === 0) {
      return res.status(404).json({ message: '未找到匹配的数据' });
    }

    res.json({
      product: productName,
      province: province,
      data: priceData,
    });
  } catch (error) {
    console.error('查询错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 农户提问接口
app.post('/api/questions', authenticateToken, checkRole([ROLES.FARMER]), async (req, res) => {
  try {
    const { title, content } = req.body;
    const farmerId = req.user.userId;

    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容是必填项' });
    }

    const newQuestion = await db.createQuestion(farmerId, title, content);
    
    res.status(201).json({
      message: '问题提交成功',
      question: newQuestion
    });
  } catch (error) {
    console.error('提问错误:', error);
    res.status(500).json({ error: '提交问题失败，请稍后再试' });
  }
});

//获取所有问题
app.get('/api/questions/all', authenticateToken,checkRole([ROLES.EXPERT,ROLES.FARMER]), async (req, res) => {
  try {
    const questions = await db.getQuestions({}); // 空对象作为filter获取所有问题
    
    res.json({
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('获取问题列表错误:', error);
    res.status(500).json({ error: '获取问题列表失败' });
  }
});

// 获取问题列表接口
app.get('/api/questions', authenticateToken,checkRole([ROLES.EXPERT,ROLES.FARMER]), async (req, res) => {
  try {
    const filter = {};
    
    // 如果是农户，只获取自己的问题
     if (req.user.role === ROLES.FARMER) {
      filter.farmerId = req.user.userId;
    }
    
    // 可以添加其他过滤条件
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    const questions = await db.getQuestions(filter);
    
    res.json({
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('获取问题列表错误:', error);
    res.status(500).json({ error: '获取问题列表失败' });
  }
});

// 获取单个问题详情
app.get('/api/questions/:id', authenticateToken, async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await db.getQuestionById(questionId);
    
    if (!question) {
      return res.status(404).json({ error: '问题未找到' });
    }
    
    // 检查权限：农户只能查看自己的问题
    if (req.user.role === ROLES.FARMER && question.farmer_id !== req.user.userId) {
      return res.status(403).json({ error: '无权查看此问题' });
    }
    
    res.json(question);
  } catch (error) {
    console.error('获取问题详情错误:', error);
    res.status(500).json({ error: '获取问题详情失败' });
  }
});

// 更新问题状态（关闭问题）
app.patch('/api/questions/:id/status', authenticateToken, checkRole([ROLES.FARMER]), async (req, res) => {
  try {
    const questionId = req.params.id;
    const { status } = req.body;
    const userId = req.user.userId;
    
    if (!status || !['open', 'closed'].includes(status)) {
      return res.status(400).json({ error: '无效的状态值' });
    }
    
    // 首先检查问题是否存在且属于该农户
    const question = await db.getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ error: '问题未找到' });
    }
    
    if (question.farmer_id !== userId) {
      return res.status(403).json({ error: '无权操作此问题' });
    }
    
    const updatedQuestion = await db.updateQuestionStatus(questionId, status);
    
    res.json({
      message: '问题状态更新成功',
      question: updatedQuestion
    });
  } catch (error) {
    console.error('更新问题状态错误:', error);
    res.status(500).json({ error: '更新问题状态失败' });
  }
});

// 专家上传证书
app.post('/api/certificates', authenticateToken, checkRole([ROLES.EXPERT]), async (req, res) => {
  try {
    const { expert_id, obtain_time, level, valid_period } = req.body;
    const result = await db.query(
      'INSERT INTO certificates (expert_id, obtain_time, level, valid_period) VALUES ($1, $2, $3, $4) RETURNING certificate_id',
      [expert_id, obtain_time, level, valid_period]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('证书上传失败:', error);
    res.status(500).json({ error: '证书上传失败' });
  }
});

// 证书审核（管理员）
app.patch('/api/certificates/:id/approve', authenticateToken, checkRole([ROLES.ADMIN]), async (req, res) => {
  try {
    await db.query(
      'UPDATE certificates SET status = $1 WHERE certificate_id = $2',
      ['valid', req.params.id]
    );
    res.json({ message: '证书审核通过' });
  } catch (error) {
    console.error('证书审核失败:', error);
    res.status(500).json({ error: '证书审核失败' });
  }
});

// 发布经验分享（需审核）
app.post('/api/experiences', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.userId;

    // 输入验证
    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容不能为空' });
    }

    const result = await db.query(
      'INSERT INTO experiences (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, content]
    );
    
    res.status(201).json({
      message: '经验提交成功，等待审核',
      experience: result.rows[0]
    });
  } catch (error) {
    console.error('发布经验失败:', error);
    res.status(500).json({ error: '发布失败，请稍后再试' });
  }
});

// 审核经验（管理员）
app.patch('/api/experiences/:id/approve', authenticateToken, checkRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查经验是否存在
    const experience = await db.query(
      'SELECT * FROM experiences WHERE experience_id = $1',
      [id]
    );
    if (experience.rows.length === 0) {
      return res.status(404).json({ error: '经验不存在' });
    }

    await db.query(
      'UPDATE experiences SET audit_status = $1 WHERE experience_id = $2',
      ['approved', id]
    );
    
    res.json({ 
      message: '审核通过',
      experience_id: id
    });
  } catch (error) {
    console.error('审核经验失败:', error);
    res.status(500).json({ error: '审核失败' });
  }
});

// 采购商发布需求
app.post('/api/demands', authenticateToken, checkRole([ROLES.BUYER]), async (req, res) => {
  const { product_name, quantity, delivery_city } = req.body;
  const buyerId = req.user.userId;
  
  const result = await db.query(
    'INSERT INTO purchase_demands (buyer_id, product_name, quantity, delivery_city) VALUES ($1, $2, $3, $4) RETURNING *',
    [buyerId, product_name, quantity, delivery_city]
  );
  res.status(201).json(result.rows[0]);
});

// 农户申请供货
app.post('/api/applications', authenticateToken, checkRole([ROLES.FARMER]), async (req, res) => {
  const { demand_id, quantity, price, record_id, province } = req.body;
  const farmerId = req.user.userId;
  
  const result = await db.query(
    'INSERT INTO purchase_applications (demand_id, farmer_id, quantity, price, record_id, province) VALUES ($1, $2, $3, $4) RETURNING *',
    [demand_id, farmerId, quantity, price, record_id, province]
  );
  res.status(201).json(result.rows[0]);
});

// 新增种植记录接口
app.post('/api/planting-records', authenticateToken, checkRole([ROLES.FARMER]), async (req, res) => {
  const { product_name, province} = req.body;
  const farmerId = req.user.userId;
  const record = await db.query(
    'INSERT INTO planting_records (farmer_id, product_name, province) VALUES ($1,$2,$3,$4) RETURNING *',
    [farmerId, product_name, province]
  );
  res.status(201).json(record.rows[0]);
});

// 更新物流信息
app.patch('/api/orders/:id/logistics', checkRole([ROLES.FARMER]), async (req, res) => {
  const { tracking_number, carrier } = req.body;
  await db.query(
    'UPDATE orders SET tracking_number = $1, carrier = $2 WHERE order_id = $3',
    [tracking_number, carrier, req.params.id]
  );
  res.json({ message: '物流信息更新成功' });
});

// 采购沟通接口
app.post('/api/communications', authenticateToken, async (req, res) => {
  const { application_id, content, image } = req.body;
  const newComm = await db.query(
    'INSERT INTO communications (application_id, sender_id, receiver_id, content, image_path) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [application_id, req.user.userId, receiverId, content, image]
  );
  res.status(201).json(newComm.rows[0]);
});

// 价格趋势接口
app.get('/api/price-trends', authenticateToken, checkRole([ROLES.BUYER]), async (req, res) => {
  const { product, province } = req.query;
  const trends = await db.query(`
    SELECT update_date, AVG(avg_price) 
    FROM price_references 
    WHERE product_name = $1 AND province = $2 
    GROUP BY update_date 
    ORDER BY update_date
  `, [product, province]);
  res.json(trends.rows);
});

// 专家排名接口
app.get('/api/expert-rankings', async (req, res) => {
  const rankings = await db.query(`
    SELECT e.*, COUNT(a.answer_id) AS answer_count 
    FROM experts e 
    LEFT JOIN answers a ON e.expert_id = a.expert_id 
    GROUP BY e.expert_id 
    ORDER BY answer_count DESC 
    LIMIT 10
  `);
  res.json(rankings.rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 专家详情接口
app.get('/api/experts/:id', async (req, res) => {
  const expertId = req.params.id
  try {
    const result = await db.query(
        'SELECT * FROM experts WHERE expert_id = $1',
        [expertId]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '专家不存在' })
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error('获取专家详情失败:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

//获取专家证书（通过token自动识别当前专家）
app.get('/api/certificates/my', authenticateToken, checkRole([ROLES.EXPERT]), async (req, res) => {
  const expertId = req.user.userId; // 从 token 中获取当前用户ID

  try {
    const result = await db.query(
        'SELECT * FROM certificates WHERE expert_id = $1',
        [expertId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('获取证书失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取专家最近的回答
app.get('/api/answers/recent', authenticateToken, checkRole([ROLES.EXPERT]), async (req, res) => {
  const expertId = req.user.userId;

  try {
    const result = await db.query(`
      SELECT a.*, q.title 
      FROM answers a
      JOIN questions q ON a.question_id = q.question_id
      WHERE a.expert_id = $1
      ORDER BY a.answered_at DESC
      LIMIT 5
    `, [expertId]);

    res.json(result.rows);
  } catch (error) {
    console.error('获取最近回答失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除证书
app.delete('/api/certificates/:id', authenticateToken, checkRole([ROLES.EXPERT]), async (req, res) => {
  const { id } = req.params;

  try {
    // 检查证书是否存在
    const certResult = await db.query('SELECT * FROM certificates WHERE certificate_id = $1 AND expert_id = $2', [
      id,
      req.user.userId
    ]);

    if (certResult.rows.length === 0) {
      return res.status(404).json({ error: '证书未找到或无权操作' });
    }

    // 执行删除
    await db.query('DELETE FROM certificates WHERE certificate_id = $1', [id]);

    res.json({ message: '证书删除成功' });
  } catch (error) {
    console.error('删除证书失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新证书
app.patch('/api/certificates/:id', authenticateToken, checkRole([ROLES.EXPERT]), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // 检查证书是否存在且属于当前专家
    const certResult = await db.query('SELECT * FROM certificates WHERE certificate_id = $1 AND expert_id = $2', [
      id,
      req.user.userId
    ]);

    if (certResult.rows.length === 0) {
      return res.status(404).json({ error: '证书未找到或无权操作' });
    }

    // 构建 SQL 更新语句
    const fields = ['obtain_time', 'level', 'valid_period', 'authorizing_unit', 'description'];
    const updateFields = {};

    fields.forEach(field => {
      if (updates[field] !== undefined) {
        updateFields[field] = updates[field];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: '没有可更新的字段' });
    }

    const setClause = Object.keys(updateFields)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');

    const values = Object.values(updateFields);
    values.push(id);

    const query = `UPDATE certificates SET ${setClause} WHERE certificate_id = $${values.length} RETURNING *`;

    const result = await db.query(query, values);

    res.json({
      message: '证书更新成功',
      certificate: result.rows[0]
    });
  } catch (error) {
    console.error('更新证书失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

//修改种植记录
app.patch('/api/planting-records/:id/status', authenticateToken, checkRole([ROLES.FARMER]), async (req, res) => {
  try {
    const recordId = parseInt(req.params.id);
    const newStatus = 'harvested'; 
    
    const record = await db.query(
      'SELECT * FROM planting_records WHERE record_id = $1 AND farmer_id = $2',
      [recordId, req.user.userId]
    );
    if (record.rows.length === 0) {
      return res.status(404).json({ error: '无权修改此种植记录' });
    }
    
    const updatedRecord = await db.updatePlantingRecordStatus(recordId, newStatus);
    res.json(updatedRecord);
  } catch (error) {
    console.error('修改种植状态失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

