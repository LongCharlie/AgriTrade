<template>
  <div :class="['sidebar', isCollapsed ? 'collapsed' : '']">
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
      
      <!-- 采购 -->
      <li class="nav-item" 
          :class="{ active: $route.path === '/purchases' || $route.path === '/addPurchase' || $route.path === '/purchaseDetail' }"
          @click="$emit('navigate', 'purchases')">
        <span>🛒</span> 采购
      </li>

      <!-- 订单 -->
      <li class="nav-item" 
          :class="{ active: $route.path === '/order' }"
          @click="$emit('navigate', 'orders')">
        <span>📋</span> 订单
      </li>

      <!-- 消息 -->
      <li class="nav-item" 
          :class="{ active: $route.path === '/merchantMessage' }"
          @click="$emit('navigate', 'MerchantMessage')">
        <span>✉️</span> 消息
      </li>
      
      <!-- 我的 -->
      <li class="nav-item" 
          :class="{ active: $route.path === '/MerchantHome' }"
          @click="$emit('navigate', 'MerchantHome')">
        <span>👤</span> 我的
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SideBarNav',
  props: {
    isCollapsed: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 100px;
  background-color: #b9eeb7ad;
  color: black;
  height: 100vh;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

/* 侧边栏折叠样式 */
.sidebar.collapsed {
  width: 60px; /* 折叠后的宽度 */
  overflow: hidden;
}

/* 折叠时只显示图标 */
.sidebar.collapsed .nav-item span {
  margin-right: 0;
}

.sidebar.collapsed .nav-item span::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 70px;
  background: white;
  color: black;
  padding: 5px 10px;
  border-radius: 3px;
  display: none;
}

.sidebar.collapsed .nav-item:hover span::after {
  display: block;
}

/* LOGO容器样式 */
.logo-container {
  text-align: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

/* LOGO图片样式 */
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