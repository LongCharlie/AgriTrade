<template>
  <div class="home-page">
    <!-- 背景装饰元素 -->
    <div class="bg-decorations">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <!-- 导航栏 - 玻璃拟态效果 -->
    <header class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <img src="../assets/platform_logo2.png" alt="Logo" class="logo-image" />
          <span class="logo-text"></span>
          <span class="logo-dot"></span>
        </div>
        <!--        <div class="logo">-->
<!--          <span class="logo-text">YunLink</span>-->
<!--          <span class="logo-dot"></span>-->
<!--        </div>-->
        <nav class="nav-links">
          <a href="#" class="nav-link active">首页</a>
          <a href="#" class="nav-link">商品</a>
          <a href="#" class="nav-link">须知</a>
          <a href="#" class="nav-link">更多</a>
        </nav>
        <div class="nav-actions">
          <el-button @click="goToLogin" type="text" class="login-btn">登录</el-button>
          <el-button @click="goToRegister" type="text" class="login-btn">注册</el-button>
<!--          <el-button type="success" round class="signup-btn">-->
<!--            <span>Get Started</span>-->
<!--            <el-icon><ArrowRight /></el-icon>-->
<!--          </el-button>-->
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="main-content">
      <!-- 英雄区域 -->
      <section class="hero-section">
        <div class="hero-content">
<!--          <div class="hero-badge">-->
<!--            <span>v2.0 Released</span>-->
<!--            <el-icon><CaretRight /></el-icon>-->
<!--          </div>-->
          <h1 class="hero-title">
            <span class="title-line">耘联</span>
            <span class="title-line">农产品直销平台<span class="title-highlight"></span></span>
          </h1>
          <p class="hero-subtitle">
            连接优质农户与消费者，去除中间商，
            提供新鲜、健康、可溯源的当季农产品。我们严格筛选合作农户，确保每一份产品
            都符合高标准品质要求，让您足不出户即可享受田间地头的自然美味。
          </p>
          <div class="hero-actions">
            <el-button type="success" size="large" round class="primary-action">
              预览商品
              <template #icon>
                <el-icon><Search /></el-icon>
              </template>
            </el-button>
            <el-button type="text" size="large" class="secondary-action">
              视频介绍
              <el-icon><VideoPlay /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="visual-container glassmorphism">
            <div class="visual-content">
              <div class="card-preview card-1">
                <div class="card-header"></div>
                <div class="card-body">
                  <img src="../assets/welcome_card1.jpg" alt="Card 1 Image" class="card-image" />
                </div>
                <div class="card-footer"></div>
              </div>
              <div class="card-preview card-2">
                <div class="card-header"></div>
                <div class="card-body">
                  <img src="../assets/welcome_card2.jpg" alt="Card 2 Image" class="card-image" />
                </div>
                <div class="card-footer"></div>
              </div>
              <div class="floating-element el-1"></div>
              <div class="floating-element el-2"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 特性展示 -->
      <section class="features-section">
        <div class="section-header">
          <div class="section-tag">平台特色</div>
          <h2 class="section-title">为什么选择耘联？</h2>
<!--          <p class="section-subtitle">Crafted with attention to detail for an unparalleled design experience</p>-->
          <p class="section-subtitle">以细致入微的匠心打造，成就无与伦比的用户体验</p>
        </div>

        <div class="features-grid">
          <div class="feature-card glassmorphism" v-for="(feature, index) in features" :key="index">
            <div class="feature-icon" :style="{ backgroundColor: feature.color }">
              <component :is="feature.icon" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div class="feature-link">
              <span>更多</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </section>

      <!-- 数据统计 -->
      <section class="stats-section glassmorphism">
        <div class="stat-item" v-for="stat in stats" :key="stat.value">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-main">
          <div class="footer-brand">
            <div class="logo">
              <span class="logo-text">耘联</span>
              <span class="logo-dot"></span>
            </div>
            <p class="footer-description">
              优质农产品直销平台
            </p>
            <div class="social-links">
              <a href="#" class="social-link"><el-icon><ChatDotRound /></el-icon></a>
              <a href="#" class="social-link"><el-icon><Share /></el-icon></a>
              <a href="#" class="social-link"><el-icon><Star /></el-icon></a>
            </div>
          </div>
          <div class="footer-links">
            <div class="link-group" v-for="group in footerLinks" :key="group.title">
              <h4 class="link-group-title">{{ group.title }}</h4>
              <a v-for="link in group.links" :key="link" href="#" class="link-item">{{ link }}</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="copyright">© 2025 上海大学 YunLink团队 | 让新鲜从田间直达您家</div>
          <div class="legal-links">
            <a href="#">隐私保护协议</a>
            <a href="#">用户服务协议</a>
            <a href="#">数据偏好设置</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'; // 引入 Vue Router

const router = useRouter(); // 使用 router 实例

// 函数用于跳转到登录页面
const goToLogin = () => {
    router.push('/login'); // 跳转到登录页面
  };

// 函数用于跳转到注册页面
const goToRegister = () => {
    router.push('/register'); // 跳转到注册页面
  };

import { ref } from 'vue'
import {
  ArrowRight,
  Search,
  VideoPlay,
  CaretRight,
  ChatDotRound,
  Share,
  Star,
  MagicStick,
  TrendCharts,
  Setting,
  Brush,
  Monitor,
  CollectionTag
} from '@element-plus/icons-vue'

const features = ref([
  {
    icon: MagicStick,
    title: "农户直供",
    description: "直接对接全国优质农户，去除中间环节，确保产品从田间直达商家。",
    color: "rgba(46, 125, 50, 0.1)"
  },
  {
    icon: TrendCharts,
    title: "新鲜溯源",
    description: "每件农产品配备唯一溯源途径，可查询种植、采收、运输全流程信息。",
    color: "rgba(104, 159, 56, 0.1)"
  },
  {
    icon: Setting,
    title: "严选标准",
    description: "采用多项品控指标筛选合作农户，不合格率低于0.5%的行业高标准。",
    color: "rgba(27, 94, 32, 0.1)"
  },
  {
    icon: Brush,
    title: "当季鲜采",
    description: "根据自然节气每日更新产品，所有商品坚持\"当季采摘、次日达\"原则。",
    color: "rgba(67, 160, 71, 0.1)"
  },
  {
    icon: Monitor,
    title: "社区支持",
    description: "首创\"社区集单\"模式，农业专家入驻平台，提供权威问答服务。",
    color: "rgba(129, 199, 132, 0.1)"
  },
  {
    icon: CollectionTag,
    title: "无忧售后",
    description: "坏果包赔、48小时极速退款，并提供农产品存储烹饪指导服务。",
    color: "rgba(76, 175, 80, 0.1)"
  }
])

const stats = ref([
  { value: "70+", label: "农产品" },
  { value: "15+", label: "农户" },
  { value: "4", label: "专家" },
  { value: "100%", label: "满意度" }
])

const footerLinks = ref([
  {
    title: "农产品服务",
    links: ["当季鲜品", "有机专区", "产地直发", "大宗采购"]
  },
  {
    title: "农场资源",
    links: ["合作农户", "种植标准", "溯源系统", "农业技术"]
  },
  {
    title: "关于耘联",
    links: ["平台理念", "品控流程", "联系我们", "招贤纳士"]
  },
  {
    title: "消费者保障",
    links: ["退换政策", "隐私保护", "配送须知", "会员权益"]
  }
])
</script>

<style scoped>
/* 颜色变量 */
:root {
  --primary-50: #e8f5e9;
  --primary-100: #c8e6c9;
  --primary-200: #a5d6a7;
  --primary-300: #81c784;
  --primary-400: #66bb6a;
  --primary-500: #4caf50;
  --primary-600: #43a047;
  --primary-700: #388e3c;
  --primary-800: #2e7d32;
  --primary-900: #1b5e20;

  --dark-900: #121212;
  --dark-800: #1e1e1e;
  --dark-700: #2d2d2d;

  --text-primary: rgba(0, 0, 0, 0.87);
  --text-secondary: rgba(0, 0, 0, 0.6);
  --text-disabled: rgba(0, 0, 0, 0.38);

  --white: #ffffff;
  --white-95: rgba(255, 255, 255, 0.95);
  --white-90: rgba(255, 255, 255, 0.9);
  --white-80: rgba(255, 255, 255, 0.8);
}

.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #d1e8dc;
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
}

/* 背景装饰元素 */
.bg-decorations {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  //overflow: hidden;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.15;
}

.circle-1 {
  width: 800px;
  height: 800px;
  background: #2e7d32;
  top: -200px;
  right: -200px;
}

.circle-2 {
  width: 400px;
  height: 400px;
  background: #4caf50;
  bottom: -100px;
  left: -100px;
}

.circle-3 {
  width: 600px;
  height: 600px;
  background: #388e3c;
  top: 50%;
  left: 20%;
}

/* 玻璃拟态效果 */
.glassmorphism {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(200, 230, 190, 0.5);
}

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 20px 0;
}

.navbar-container {
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-900);
}

.logo-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-right: 8px;
}

.logo-dot {
  width: 8px;
  height: 8px;
  background: var(--primary-500);
  border-radius: 50%;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--primary-700);
}

.nav-link.active {
  color: var(--primary-700);
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary-500);
  border-radius: 2px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.login-btn {
  color: var(--primary-700);
  font-weight: 500;
}

.signup-btn {
  background: var(--primary-500);
  border: none;
  color: white;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.signup-btn:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.signup-btn .el-icon {
  margin-left: 6px;
}

/* 主要内容 */
.main-content {
  flex: 1;
  padding-top: 120px;
  position: relative;
  z-index: 1;
}

/* 英雄区域 */
.hero-section {
  width: 90%;
  max-width: 1400px;
  margin: 0 auto 120px;
  display: flex;
  align-items: center;
  gap: 80px;
}

.hero-content {
  flex: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(76, 175, 80, 0.1);
  color: var(--primary-700);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 24px;
}

.hero-badge .el-icon {
  font-size: 0.8rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;
  color: var(--dark-900);
}

.title-line {
  display: block;
}

.title-highlight {
  color: var(--primary-700);
  position: relative;
}

.title-highlight::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(76, 175, 80, 0.2);
  z-index: -1;
  border-radius: 4px;
}

.hero-subtitle {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 500px;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.primary-action {
  background: var(--primary-500);
  border: none;
  color: white;
  padding: 14px 28px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.primary-action:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.3);
}

.primary-action .el-icon {
  margin-left: 8px;
}

.secondary-action {
  color: var(--primary-700);
  font-weight: 500;
  padding: 14px 20px;
}

.secondary-action .el-icon {
  margin-left: 8px;
}

.hero-visual {
  flex: 1;
  position: relative;
}

.visual-container {
  width: 100%;
  height: 500px;
  position: relative;
  overflow: hidden;
}

.visual-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.card-preview {
  position: absolute;
  background: var(--white-95);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.card-1 {
  width: 280px;
  height: 340px;
  top: 20px;
  left: 40px;
  transform: rotate(-5deg);
  z-index: 2;
}

.card-2 {
  width: 300px;
  height: 360px;
  bottom: 30px;
  right: 50px;
  transform: rotate(3deg);
  z-index: 1;
}

.card-header {
  height: 40px;
  background: var(--primary-100);
  border-radius: 12px 12px 0 0;
  margin: 0px;
}

.card-body {
  height: calc(100% - 100px); /* 原有高度 */
  background: var(--white);
  margin: 0 12px;
  border-radius: 8px;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  overflow: hidden; /* 防止图片溢出 */
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 自动裁剪并填满容器 */
  display: block;
  border-radius: 8px;
}

.card-footer {
  height: 40px;
  background: var(--white);
  border-radius: 0 0 12px 12px;
  margin: 0px;
}

.floating-element {
  position: absolute;
  border-radius: 8px;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(10px, -10px); }
}

.el-1 {
  width: 80px;
  height: 80px;
  background: rgba(129, 199, 132, 0.3);
  top: 100px;
  right: 20px;
  transform: rotate(45deg);
}

.el-2 {
  width: 60px;
  height: 60px;
  background: rgba(76, 175, 80, 0.2);
  bottom: 100px;
  left: 30px;
  transform: rotate(20deg);
}

/* 特性区域 */
.features-section {
  width: 90%;
  max-width: 1400px;
  margin: 0 auto 120px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-tag {
  display: inline-block;
  color: var(--primary-700);
  background: rgba(76, 175, 80, 0.1);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--dark-900);
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  padding: 32px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.1);
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.feature-icon .el-icon {
  font-size: 1.8rem;
  color: var(--primary-700);
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--dark-900);
}

.feature-description {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--primary-700);
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
}

.feature-link .el-icon {
  transition: transform 0.3s ease;
}

.feature-link:hover .el-icon {
  transform: translateX(4px);
}

/* 数据统计 */
.stats-section {
  width: 90%;
  max-width: 1000px;
  margin: 0 auto 120px;
  padding: 60px 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
}

.stat-item {
  padding: 20px;
}

.stat-value {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-700);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 页脚 */
.footer {
  background: var(--dark-800);
  color: var(--white-80);
  padding-top: 100px;
}

.footer-content {
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-main {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 80px;
  margin-bottom: 60px;
}

.footer-brand {
  max-width: 300px;
}

.footer-description {
  margin: 20px 0;
  line-height: 1.7;
  color: var(--white-80);
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  color: var(--white-80);
  transition: color 0.3s ease;
}

.social-link:hover {
  color: var(--primary-300);
}

.social-link .el-icon {
  font-size: 1.2rem;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 40px;
}

.link-group-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--white);
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}

.link-item {
  display: block;
  color: var(--white-80);
  margin-bottom: 12px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-item:hover {
  color: var(--primary-300);
}

.footer-bottom {
  border-top: 1px solid var(--dark-700);
  padding: 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  font-size: 0.9rem;
  color: var(--white-80);
}

.legal-links {
  display: flex;
  gap: 20px;
}

.legal-links a {
  color: var(--white-80);
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.legal-links a:hover {
  color: var(--primary-300);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .hero-section {
    flex-direction: column;
    gap: 60px;
  }

  .hero-content {
    text-align: center;
  }

  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .visual-container {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .nav-links {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .stats-section {
    grid-template-columns: 1fr 1fr;
  }
}

</style>


<!--<template>-->
<!--  <div class="welcome-container">-->
<!--    <h1>欢迎</h1> <br>-->
<!--    <button @click="goToLogin">登录</button> <br>-->
<!--    <button @click="goToRegister">注册</button>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { useRouter } from 'vue-router'; // 引入 Vue Router-->

<!--const router = useRouter(); // 使用 router 实例-->

<!--// 函数用于跳转到登录页面-->
<!--const goToLogin = () => {-->
<!--  router.push('/login'); // 跳转到登录页面-->
<!--};-->

<!--// 函数用于跳转到注册页面-->
<!--const goToRegister = () => {-->
<!--  router.push('/register'); // 跳转到注册页面-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.welcome-container {-->
<!--  text-align: center; /* 居中文本 */-->
<!--  margin-top: 20px; /* 添加顶部间距 */-->
<!--}-->

<!--button {-->
<!--  padding: 10px 15px; /* 按钮内边距 */-->
<!--  margin: 5px; /* 按钮间距 */-->
<!--  background: #4CAF50; /* 按钮背景颜色 */-->
<!--  color: white; /* 按钮文字颜色 */-->
<!--  border: none; /* 无边框 */-->
<!--  border-radius: 4px; /* 圆角 */-->
<!--  cursor: pointer; /* 鼠标指针形状 */-->
<!--}-->

<!--button:hover {-->
<!--  background: #45a049; /* 悬停颜色 */-->
<!--}-->
<!--</style>-->