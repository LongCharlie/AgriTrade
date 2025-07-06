<template>
  <div class="product-page">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <img src="../assets/platform_logo2.png" alt="Logo" class="logo-image" />
          <span class="logo-text"></span>
          <span class="logo-dot"></span>
        </div>
        <nav class="nav-links">
          <a href="#" class="nav-link">首页</a>
          <a href="#" class="nav-link active">商品</a>
          <a href="#" class="nav-link">须知</a>
          <a href="#" class="nav-link">更多</a>
        </nav>
        <div class="nav-actions">
          <el-button @click="goToLogin" type="text" class="login-btn">登录</el-button>
          <el-button @click="goToRegister" type="text" class="login-btn">注册</el-button>
        </div>
      </div>
    </header>

    <!-- 商品筛选区 -->
    <section class="filter-section glassmorphism">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="filter.category" placeholder="全部分类" clearable>
            <el-option
                v-for="item in categories"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filter.origin" placeholder="全部产地" clearable>
            <el-option
                v-for="item in origins"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filter.sort" placeholder="默认排序">
            <el-option label="价格从低到高" value="price_asc" />
            <el-option label="价格从高到低" value="price_desc" />
            <el-option label="最新上架" value="newest" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input v-model="filter.keyword" placeholder="搜索商品..." clearable>
            <template #append>
              <el-button :icon="Search" />
            </template>
          </el-input>
        </el-col>
      </el-row>
    </section>

    <!-- 商品展示区 -->
    <main class="product-main">
      <div class="product-grid">
        <div
            class="product-card glassmorphism"
            v-for="product in products"
            :key="product.id"
            @click="showProductDetail(product)"
        >
          <div class="product-badge" v-if="product.isNew">新品</div>
          <div class="product-image-container">
            <img :src="product.image" :alt="product.name" class="product-image" />
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-origin">
              <el-icon><Location /></el-icon>
              <span>{{ product.origin }}</span>
            </div>
            <div class="product-meta">
              <div class="product-price">
                <span class="current-price">¥{{ product.price }}</span>
                <span class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
              </div>
              <div class="product-sales">已售 {{ product.sales }}</div>
            </div>
          </div>
          <div class="product-actions">
            <el-button type="success" plain round @click.stop="showLoginPrompt">
              <el-icon><ShoppingCart /></el-icon>
              加入购物车
            </el-button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
            background
            layout="prev, pager, next"
            :total="100"
            :page-size="12"
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
      <span>登录后即可查看商品详情和购买</span>
      <template #footer>
        <el-button @click="showLoginDialog = false">稍后再说</el-button>
        <el-button type="success" @click="goToLogin">立即登录</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  Location,
  ShoppingCart
} from '@element-plus/icons-vue'

const router = useRouter()

// 筛选条件
const filter = ref({
  category: '',
  origin: '',
  sort: '',
  keyword: ''
})

// 分类选项
const categories = ref([
  { value: 'vegetables', label: '新鲜蔬菜' },
  { value: 'fruits', label: '当季水果' },
  { value: 'grains', label: '五谷杂粮' },
  { value: 'meat', label: '禽畜肉蛋' }
])

// 产地选项
const origins = ref([
  { value: 'shanghai', label: '上海周边' },
  { value: 'yunnan', label: '云南高原' },
  { value: 'shandong', label: '山东基地' },
  { value: 'xinjiang', label: '新疆特产' }
])

// 商品数据
const products = ref([
  {
    id: 1,
    name: '有机小番茄 500g',
    origin: '上海崇明',
    price: 12.8,
    originalPrice: 15.9,
    image: require('@/assets/platform_logo2.png'),
    sales: 235,
    isNew: true
  },
  {
    id: 2,
    name: '云南蓝莓 125g/盒',
    origin: '云南昆明',
    price: 18.5,
    image: require('@/assets/platform_logo2.png'),
    sales: 189
  },
  // 更多商品数据...
])

const showLoginDialog = ref(false)

const showLoginPrompt = () => {
  showLoginDialog.value = true
}

const showProductDetail = (product) => {
  showLoginPrompt()
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.product-page {
  background-color: #f1f8e9;
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

/* 商品网格 */
.product-grid {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

/* 商品卡片 */
.product-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(76, 175, 80, 0.1);
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff5252;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  z-index: 2;
}

.product-image-container {
  height: 200px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.product-origin {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.product-origin .el-icon {
  margin-right: 5px;
  color: #4caf50;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  display: flex;
  align-items: baseline;
}

.current-price {
  font-size: 1.2rem;
  color: #ff5252;
  font-weight: bold;
}

.original-price {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.product-sales {
  font-size: 0.9rem;
  color: #666;
}

.product-actions {
  padding: 0 15px 15px;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-section .el-col {
    margin-bottom: 10px;
    width: 100%;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>