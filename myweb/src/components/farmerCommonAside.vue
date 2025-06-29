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
    <!-- 右上角用户信息 -->
    <el-dropdown>
    <div class="user-info" @click="navigateToProfile">
      <img :src="user.avatar" alt="User Avatar" class="user-avatar"/>
      <span class="user-name">{{ user.name }}</span>
    </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="navigateToProfile">个人中心</el-dropdown-item>
          <el-dropdown-item @click="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import profile from '../assets/logo.png'; // 引入头像
import { useUserStore } from '../stores/user'; // 导入用户状态 Store

export default {
  data() {
    return {
      user: {
        avatar: profile, // 用户头像
        name: "农户1超长用户名不全部显示" // 用户名
      },
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
    navigateToProfile() {
      this.$router.push('/farmer/profile'); // 跳转到用户个人主页
    },
    logout() {
      const userStore = useUserStore(); // 使用用户状态 Store
      userStore.$reset(); // 重置用户 Store 数据
      this.$router.push('/login'); // 跳转回登录页面
    }
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
  border-bottom: 1px solid #eaeaea;
}

.logo {
  width: 100px;
  height: auto;
}

/* 菜单项 */
.el-menu-vertical-demo {
  font-size: 18px; /* 设置菜单项字体大小 */
}


/* 用户信息样式 */
.user-info {
  position: fixed; /* 使用fixed以固定在全局右上角 */
  top: 20px; /* 距离顶部10px */
  right: 80px; /* 距离右侧80px */
  display: flex;
  align-items: center;
  cursor: pointer; /* 鼠标指针为手型 */
  z-index: 1000; /* 确保在上层 */
}

.user-avatar {
  width: 50px; /* 用户头像大小 */
  height: 50px;
  border-radius: 50%; /* 圆形头像 */
  margin-right: 10px; /* 头像和名字之间的间距 */
  border: 1px solid #D0D0D0; /* 添加浅灰色边框 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* 添加阴影效果，仅作为视觉增强 */
}

.user-name {
  color: #3A5D3D; /* 用户名颜色 */
  font-size: 18px; /* 设置字体大小，您可以根据需要调整 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 超出部分用省略号表示 */
  max-width: 100px; /* 控制最大宽度，以便文字过长时能够展示省略号 */
}

</style>