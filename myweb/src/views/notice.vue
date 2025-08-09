<template>
  <div class="notice-page">
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
          <a @click="goToWelcom" class="nav-link">首页</a>
<!--          <a @click="goToVisitor" class="nav-link">采购</a>-->
          <a @click="goToNotice" class="nav-link active">须知</a>
          <!--          <a href="#" class="nav-link">更多</a>-->
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
      <!-- 标题区域 -->
      <section class="title-section">
        <h1 class="section-title">平台使用须知</h1>
        <p class="section-subtitle">为确保您获得最佳体验，请仔细阅读以下内容</p>
      </section>

      <!-- 须知内容 -->
      <section class="notice-content glassmorphism">
        <div class="notice-item" v-for="(item, index) in notices" :key="index">
          <div class="notice-header">
            <div class="notice-icon" :style="{ backgroundColor: item.color }">
              <component :is="item.icon" />
            </div>
            <h3>{{ item.title }}</h3>
          </div>
          <div class="notice-body">
            <p v-for="(text, i) in item.content" :key="i">{{ text }}</p>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <!--        <div class="footer-main">-->
        <!--          <div class="footer-brand">-->
        <!--            <div class="logo">-->
        <!--              <span class="logo-text">耘联</span>-->
        <!--              <span class="logo-dot"></span>-->
        <!--            </div>-->
        <!--            <p class="footer-description">-->
        <!--              优质农产品直销平台-->
        <!--            </p>-->
        <!--            <div class="social-links">-->
        <!--              <a href="#" class="social-link"><el-icon><ChatDotRound /></el-icon></a>-->
        <!--              <a href="#" class="social-link"><el-icon><Share /></el-icon></a>-->
        <!--              <a href="#" class="social-link"><el-icon><Star /></el-icon></a>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div class="footer-links">-->
        <!--            <div class="link-group" v-for="group in footerLinks" :key="group.title">-->
        <!--              <h4 class="link-group-title">{{ group.title }}</h4>-->
        <!--              <a v-for="link in group.links" :key="link" href="#" class="link-item">{{ link }}</a>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="footer-bottom">
          <div class="copyright">© 2025 上海大学 YunLink团队 | 让新鲜从田间直达您家</div>
          <!--          <div class="legal-links">-->
          <!--            <a href="#">隐私保护协议</a>-->
          <!--            <a href="#">用户服务协议</a>-->
          <!--            <a href="#">数据偏好设置</a>-->
          <!--          </div>-->
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import {
  Document,
  Warning,
  Goods,
  Money,
  Timer,
  User
} from '@element-plus/icons-vue'

const router = useRouter();

const goToWelcom = () => {
  router.push('/'); // 跳转到登录页面
};

const goToVisitor = () => {
  router.push('/visitor'); // 跳转到登录页面
};

const goToNotice = () => {
  router.push('/notice'); // 跳转到登录页面
};

const goToLogin = () => {
  router.push('/login');
};

const goToRegister = () => {
  router.push('/register');
};

const notices = ref([
  {
    icon: Document,
    title: "注册与使用",
    color: "rgba(46, 125, 50, 0.1)",
    content: [
      "1. 请使用真实信息注册账号",
      "2. 账号仅限本人使用，不得转让或借与他人",
      "3. 请妥善保管账号密码，避免使用简单密码"
    ]
  },
  {
    icon: Warning,
    title: "交易安全",
    color: "rgba(104, 159, 56, 0.1)",
    content: [
      "1. 所有交易请通过平台完成，私下交易不受保护",
      "2. 警惕异常低价商品，谨防诈骗",
      "3. 大额交易请仔细核验"
    ]
  },
  {
    icon: Goods,
    title: "商品说明",
    color: "rgba(27, 94, 32, 0.1)",
    content: [
      "1. 农产品存在自然生长差异，图片仅供参考",
      "2. 为确保农产品新鲜，不支持无理由退换",
      "3. 收到商品请及时验收，有问题尽快反馈"
    ]
  },
  {
    icon: Money,
    title: "支付与退款",
    color: "rgba(67, 160, 71, 0.1)",
    content: [
      "1. 支持微信支付、支付宝和银行卡支付",
      "2. 退款处理时间为1-3个工作日",
      "3. 退款即刻到账，原路返回"
    ]
  },
  {
    icon: Timer,
    title: "配送说明",
    color: "rgba(129, 199, 132, 0.1)",
    content: [
      "1. 默认冷链配送，请确保收货地址有人签收",
      "2. 配送时间一般为下单后1-3天",
      "3. 偏远地区配送可能延迟，请谅解"
    ]
  },
  {
    icon: User,
    title: "售后服务",
    color: "rgba(76, 175, 80, 0.1)",
    content: [
      "1. 质量问题可申请退换货，需提供有效凭证",
      "2. 客服工作时间: 8:00-22:00",
      "3. 投诉建议请通过官方渠道反馈"
    ]
  }
])
</script>

<style scoped>
.notice-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #d1e8dc;
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
}

/* 标题区域 */
.title-section {
  width: 90%;
  max-width: 1400px;
  margin: 0px auto 40px;
  text-align: center;
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

/* 须知内容 */
.notice-content {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 80px;
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.notice-item {
  padding: 25px;
  transition: all 0.3s ease;
}

.notice-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.15);
}

.notice-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(200, 230, 190, 0.5);
}

.notice-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.notice-icon .el-icon {
  font-size: 1.2rem;
  color: var(--primary-700);
}

.notice-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--dark-900);
}

.notice-body p {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 12px;
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
  transition: all 0.3s ease;
  transform: scale(1);
}

.nav-link:hover {
  color: var(--primary-700);
  transform: scale(1.1); /* 悬停时放大 10% */
}

.nav-link.active {
  color: var(--primary-700);
  font-weight: 600;
  transform: scale(1.1); /* 当前页面保持放大效果 */
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
