const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// 导入路由模块
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const expertRoutes = require('./routes/expertRoutes');

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 路由挂载
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/expert', expertRoutes); 
app.use('/api/experts', authenticateToken, expertRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});