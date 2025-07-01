<template>
  <div class="full-height-container">
    <el-row class="tac full-height">
      <el-col :span="24" class="full-height">
        <header class="header" ref="header">
          <img src="../assets/platform_logo2.png" alt="Logo" class="logo"/>
        </header>
        <!-- 将动态计算的高度传递给el-menu的style -->
        <el-menu
            default-active="首页"
            class="el-menu-vertical-demo full-height"
            :style="{ height: menuHeight + 'px', overflowY: 'auto' }"
            @open="handleOpen"
            @close="handleClose"
            background-color="#D9EEDD"
            text-color="#3A5D3D"
            active-text-color="#FFA500">
          <template v-for="item in menuData">
            <router-link :to="'/farmer' + item.path" style="text-decoration: none;">
              <el-menu-item :key="item.name" :index="item.name">
                <component :is="item.icon" style="width: 20px; height: 20px; margin-right: 8px"/>
                <span slot="title">{{ item.name }}</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuData: [
        {path: "", name: "首页", icon: "House"},
        {path: "/purchases", name: "采购", icon: "ShoppingCart"},
        {path: "/orders", name: "订单", icon: "Tickets"},
        {path: "/messages", name: "消息", icon: "ChatDotRound"},
        {path: "/planting", name: "种植", icon: "Guide"},
        {path: "/share", name: "分享", icon: "Notification"},
        {path: "/questions", name: "提问", icon: "School"}
      ],
      menuHeight: 0 // 初始化菜单高度
    }
  },
  mounted() {
    this.calculateMenuHeight();
    // 监听窗口大小变化以调整高度
    window.addEventListener('resize', this.calculateMenuHeight);
  },
  beforeUnmount() {
    // 清理监听器
    window.removeEventListener('resize', this.calculateMenuHeight);
  },
  methods: {
    calculateMenuHeight() {
      const headerElement = this.$refs.header; // 获取header
      const headerHeight = headerElement ? headerElement.clientHeight : 0; // 获取header的高度
      this.menuHeight = window.innerHeight - headerHeight ; // 计算el-menu的高度
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  }
}
</script>

<style scoped>
.full-height-container {
  height: 100vh; /* 全屏高度 */
  margin: 0;
  padding: 0;
  position: relative; /* 为绝对定位的子元素提供基准 */
}

.el-menu-vertical-demo {
  border-right: none;
  overflow-y: auto; /* 允许滚动 */
  /* 自定义滚动条样式 */
}

/* 隐藏滚动条 */
.el-menu-vertical-demo::-webkit-scrollbar {
  width: 0; /* 禁用水平滚动条 */
  height: 0; /* 禁用垂直滚动条 */
}

.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 20px;
  background-color: #D9EEDD;
  border-bottom: 0px solid #eaeaea;
}

.logo {
  width: 100px;
  height: auto;
}

/* 菜单项 */
.el-menu-vertical-demo {
  font-size: 18px; /* 设置菜单项字体大小 */
}


</style>