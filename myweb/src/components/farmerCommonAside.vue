<template>
  <div class="full-height-container">
    <el-row class="tac full-height">
      <el-col :span="24" class="full-height">
        <header class="header" ref="header">
          <img src="../assets/platform_logo2.png" alt="Logo" class="logo"/>
        </header>
        <el-menu
            :default-active="activeMenuItem"
            class="el-menu-vertical-demo full-height"
            :style="{ height: menuHeight + 'px', overflowY: 'auto' }"
            @open="handleOpen"
            @close="handleClose"
            background-color="#D9EEDD"
            text-color="#3A5D3D"
            :active-text-color="activeTextColor">
          <template v-for="item in menuData" :key="item.name">
            <router-link :to="'/farmer' + item.path" style="text-decoration: none;">
              <el-menu-item :index="item.name">
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
        { path: "", name: "首页", icon: "House" },
        { path: "/purchases", name: "采购", icon: "ShoppingCart" },
        { path: "/orders", name: "订单", icon: "Tickets" },
        { path: "/messages", name: "消息", icon: "ChatDotRound" },
        { path: "/planting", name: "种植", icon: "Guide" },
        { path: "/share", name: "分享", icon: "Notification" },
        { path: "/questions", name: "提问", icon: "School" }
      ],
      menuHeight: 0 // 初始化菜单高度
    }
  },
  computed: {
    // 计算当前活动菜单项
    activeMenuItem() {
      const currentPath = this.$route.path.split('/farmer')[1]; // 获取当前路径

      // 进行匹配
      if (currentPath === '' || currentPath === '/') {
        return '首页';
      } else if (currentPath.startsWith('/purchases')) {
        return '采购';
      } else if (currentPath.startsWith('/orders')) {
        return '订单';
      } else if (currentPath.startsWith('/messages')) {
        return '消息';
      } else if (currentPath.startsWith('/planting')) {
        return '种植';
      } else if (currentPath.startsWith('/share')) {
        return '分享';
      } else if (currentPath.startsWith('/questions')) {
        return '提问';
      } else if (currentPath.startsWith('/profile')) {
        return '';
      }
      return '首页'; // 默认值
    },
    // 根据当前活动菜单项确定 active-text-color
    activeTextColor() {
      return this.activeMenuItem === '' ? '#000000' : '#FFA500';
    }
  },
  mounted() {
    this.calculateMenuHeight();
    window.addEventListener('resize', this.calculateMenuHeight);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.calculateMenuHeight);
  },
  methods: {
    calculateMenuHeight() {
      const headerElement = this.$refs.header;
      const headerHeight = headerElement ? headerElement.clientHeight : 0;
      this.menuHeight = window.innerHeight - headerHeight;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
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