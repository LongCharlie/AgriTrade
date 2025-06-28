<template>
  <div class="app">
    <!-- 左侧导航栏 -->
    <SideBarNav @navigate="handleNavigation"></SideBarNav>
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 路由视图 - 动态内容区域 -->
      <router-view @add-purchase="goToAddPurchase"></router-view>
    </div>
  </div>
</template>

<script>
import SideBarNav from '@/components/merchantCommonAside.vue'

export default {
  name: 'MainLayout',
  components: {
    SideBarNav
  },
  methods: {
    // 处理侧边栏导航
    handleNavigation(path) {
      switch(path) {
        case 'home':
          this.$router.push('/');
          break;
        case 'orders':
          this.$router.push('/order');
          break;
        case 'purchases':
          this.$router.push('/purchases');
          break;
      }
    },
    
    // 处理采购页面跳转到新增采购
    goToAddPurchase() {
      this.$router.push('/addPurchase');
    }
  }
}
</script>

<style scoped>
.app {
  display: flex;
  background-color: #b9eeb7ad;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  margin: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0);
}
</style>