<template>
  <div class="sidebar">
    <!-- LOGO -->
    <div class="logo-container">
      <img src="@/assets/platform_logo.png" alt="系统LOGO" class="logo-image">
    </div>
    <ul class="nav-list">
      <!-- 首页 -->
      <li class="nav-item" 
          :class="{ active: $route.path === '/' }"
          @click="$emit('navigate', 'home')">
        <span>🏠</span> 首页
      </li>
      
      <!-- 订单 -->
      <li class="nav-item" 
          :class="{ active: $route.path === '/order' }"
          @click="$emit('navigate', 'orders')">
        <span>📋</span> 订单
      </li>
      
      <!-- 采购 -->
      <li class="nav-item" 
          :class="{ active: $route.path === '/purchases' || $route.path === '/addPurchase' || $route.path === '/purchaseDetail' }"
          @click="$emit('navigate', 'purchases')">
        <span>🛒</span> 采购
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SideBarNav'
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #b9eeb7ad;
  color: white;
  height: 100vh;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
}

/* 修改LOGO容器样式 */
.logo-container {
  text-align: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

/* 添加LOGO图片样式 */
.logo-image {
  max-width: 100%; /* 确保图片不超过容器宽度 */
  max-height: 80px; /* 控制LOGO高度 */
  object-fit: contain; /* 保持图片比例 */
}

.nav-list {
  list-style: none;
  padding: 0;
  flex-grow: 1; /* 让导航项填充剩余空间 */
}

.nav-item {
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  font-size: 16px;
}

.nav-item span {
  margin-right: 10px;
  font-size: 20px;
}

.nav-item:hover {
  background-color: #65d36bd4;
}

.nav-item.active {
  background-color: #5aab5eb7;
  border-left: 4px solid white;
}
</style>