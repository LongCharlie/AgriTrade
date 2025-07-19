<template>
  <div class="purchase-page">
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
          <a @click="goToVisitor" class="nav-link active">采购</a>
          <a @click="goToNotice" class="nav-link">须知</a>
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

    <!-- 采购需求展示区 -->
    <main class="purchase-main">
      <div class="filter-section glassmorphism">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="filter.keyword" placeholder="搜索采购商品..." clearable>
              <template #append>
                <el-button :icon="Search" @click="fetchPurchases" />
              </template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="filter.region" placeholder="全部地区" clearable>
              <el-option
                  v-for="item in regions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select v-model="filter.sort" placeholder="默认排序">
              <el-option label="最新发布" value="newest" />
              <el-option label="需求量大" value="quantity_desc" />
            </el-select>
          </el-col>
        </el-row>
      </div>

      <div class="purchase-list">
        <div
            class="purchase-card glassmorphism"
            v-for="purchase in purchases"
            :key="purchase.demand_id"
        >
          <div class="purchase-header">
            <h3 class="product-name">{{ purchase.product_name }}</h3>
            <div class="purchase-meta">
              <div class="buyer-info">
                <el-icon><User /></el-icon>
                <span>{{ purchase.buyerName }}</span>
              </div>
              <div class="purchase-date">
                <el-icon><Clock /></el-icon>
                <span>{{ purchase.updated_at }}</span>
              </div>
            </div>
          </div>

          <div class="purchase-content">
            <div class="purchase-detail">
              <div class="detail-item">
                <el-icon><Box /></el-icon>
                <span>需求量: {{ purchase.quantity }} kg</span>
              </div>
              <div class="detail-item">
                <el-icon><Location /></el-icon>
                <span>配送至: {{ purchase.address }}</span>
              </div>
            </div>

            <div class="purchase-actions">
              <el-button
                  type="success"
                  plain
                  round
                  @click="showLoginPrompt('查看详情')"
              >
                <el-icon><View /></el-icon>
                查看详情
              </el-button>
              <el-button
                  type="primary"
                  plain
                  round
                  @click="showLoginPrompt('申请供货')"
              >
                <el-icon><EditPen /></el-icon>
                申请供货
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
            background
            layout="prev, pager, next"
            :total="totalPurchases"
            :page-size="pageSize"
            @current-change="handlePageChange"
        />
      </div>
    </main>

    <!-- 登录提示对话框 -->
    <el-dialog
        v-model="showLoginDialog"
        title="温馨提示"
        width="30%"
        center
    >
      <span>{{ loginMessage }}</span>
      <template #footer>
        <el-button @click="showLoginDialog = false">稍后再说</el-button>
        <el-button type="success" @click="goToLogin">立即登录</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user';
import axios from 'axios'
import {
  Search,
  User,
  Clock,
  Box,
  Location,
  View,
  EditPen
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore();

// 筛选条件
const filter = ref({
  keyword: '',
  region: '',
  sort: ''
})

// 地区选项
const regions = ref([
  { value: 'shanghai', label: '上海' },
  { value: 'jiangsu', label: '江苏' },
  { value: 'zhejiang', label: '浙江' },
  { value: 'anhui', label: '安徽' }
])

// 采购需求数据
const originalPurchases = ref([]);
const purchases = ref([])
const totalPurchases = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

// 登录提示相关
const showLoginDialog = ref(false)
const loginMessage = ref('')

//mock
const simulatedMotableData = {
  data: [
    { demand_id: 21, product_name: '番茄', quantity: 100, buyerName: 'A老板', buyer_id: 7, address: '北京市', updated_at: '2025-07-01 12:30:45.123' },
    { demand_id: 22, product_name: '黄瓜', quantity: 200, buyerName: '老王', buyer_id: 7, address: '河北省', updated_at: '2025-06-02 12:30:45.123' },
    { demand_id: 23, product_name: '萝卜', quantity: 50, buyerName: '孙经理', buyer_id: 7, address: '广东省', updated_at: '202-07-02 12:30:45.123' }
  ]
};

/*
      d.demand_id,
      d.product_name,
      d.quantity,
      d.buyer_id,
      u.username AS buyerName,
      d.delivery_city AS address,
      TO_CHAR(d.updated_at, 'YYYY-MM-DD HH24:MI:SS') AS updated_at
*/
// 获取采购需求数据
const fetchPurchases = async () => {
  const token = userStore.token;
  try {
    //mock
    originalPurchases.value = simulatedMotableData.data;
    // const response = await axios.get('http://localhost:3000/api/demands/all', {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    // originalPurchases.value = response.data;
    applyFilters();
    // response.headers['x-total-count'] 是用来获取 HTTP 响应头中名为 X-Total-Count 的字段值
    //totalPurchases.value = response.headers['x-total-count'] || response.data.length
    totalPurchases.value = originalPurchases.value.length
  } catch (error) {
    console.error('获取采购需求数据失败', error);
    originalPurchases.value = [];
    totalPurchases.value = 0
  }
}

const applyFilters = () => {
  let filtered = [...originalPurchases.value]; //浅拷贝

  // 1. 关键字搜索（按商品名称）
  if (filter.value.keyword) {
    const keyword = filter.value.keyword.toLowerCase();
    filtered = filtered.filter(purchase =>
        purchase.product_name.toLowerCase().includes(keyword)
    );
  }

  // 2. 地区筛选（按配送城市）
  if (filter.value.region) {
    const region = filter.value.region;
    filtered = filtered.filter(purchase => purchase.address.includes(region));
  }

  // 3. 排序
  if (filter.value.sort === 'quantity_desc') {
    // 按需求量从高到低排序
    filtered.sort((a, b) => b.quantity - a.quantity);
  } else if (filter.value.sort === 'newest') {
    // 按更新时间从新到旧排序
    filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  // 分页
  const start = (currentPage.value - 1) * pageSize.value;
  purchases.value = filtered.slice(start, start + pageSize.value);
  totalPurchases.value = filtered.length;
};

// 显示登录提示
const showLoginPrompt = (action) => {
  loginMessage.value = `登录后即可${action}`
  showLoginDialog.value = true
}

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchPurchases()
}

// 导航
const goToWelcom = () => {
  router.push('/')
}

const goToVisitor = () => {
  router.push('/visitor')
}

const goToNotice = () => {
  router.push('/notice')
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

// 监听筛选条件变化
watch(
    () => [filter.value.keyword, filter.value.region, filter.value.sort],
    () => {
      currentPage.value = 1 // 重置为第一页
      applyFilters()
    }
)

// 监听页码变化
watch(currentPage, () => {
  applyFilters()
})

// 初始化加载数据
onMounted(() => {
  fetchPurchases()
})
</script>

<style scoped>
.purchase-page {
  background-color: #d1e8dc;
  min-height: 100vh;
  padding-top: 80px;
}

/* 筛选区 */
.filter-section {
  width: 90%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 12px;
}

/* 采购列表 */
.purchase-list {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 20px;
  padding: 20px 0;
}

/* 采购卡片 */
.purchase-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.purchase-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.purchase-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.product-name {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.purchase-meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
}

.purchase-meta .el-icon {
  margin-right: 5px;
  color: #4caf50;
}

.purchase-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.purchase-detail {
  flex: 1;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #555;
}

.detail-item .el-icon {
  margin-right: 8px;
  color: #4caf50;
}

.purchase-actions {
  display: flex;
  gap: 10px;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .purchase-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .purchase-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .filter-section .el-col {
    margin-bottom: 10px;
    width: 100%;
  }

  .purchase-meta {
    flex-direction: column;
    gap: 5px;
  }
}

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
  transform: scale(1); /* 添加默认缩放 */
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