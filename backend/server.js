const express = require('express');
const bodyParser = require('body-parser');
const db = require('./model'); // 引入数据库模型
const jwt = require('jsonwebtoken');

const app = express();
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});