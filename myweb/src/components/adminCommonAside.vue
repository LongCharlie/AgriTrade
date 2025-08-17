<template>
  <div class="full-height-container">
    <el-row class="tac full-height">
      <el-col :span="24" class="full-height">
        <header class="header" ref="header">
          <img src="../assets/platform_logo2.png" alt="Logo" class="logo" />
        </header>
        <el-menu
            :default-active="activeMenuItem"
            class="el-menu-vertical-demo full-height"
            :style="{ overflowY: 'auto' }"
            @open="handleOpen"
            @close="handleClose"
            background-color="#D9EEDD"
            text-color="#3A5D3D"
            :active-text-color="activeTextColor"
        >
          <template v-for="item in menuData" :key="item.name">
            <router-link :to="'/admin' + item.path" style="text-decoration: none;">
              <el-menu-item :index="item.name">
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
        { path: "", name: "首页" },
        { path: "/user", name: "用户管理" },
        { path: "/data", name: "数据统计" },
        { path: "/orders", name: "售后审核" },
        { path: "/cert", name: "证书审核" },
        { path: "/ques", name: "提问/回答删除" },
        { path: "/share", name: "经验分享审核" },
        { path: "/shareComment", name: "经验分享评论审核" }
      ],
      // menuHeight: 0 // 初始化菜单高度
    };
  },
  computed: {
    // 计算当前活动菜单项
    activeMenuItem() {
      const currentPath = this.$route.path.split('/admin')[1]; // 获取当前路径

      // 进行匹配
      if (currentPath === '' || currentPath === '/') {
        return '首页';
      } else if (currentPath.startsWith('/user')) {
        return '用户管理';
      } else if (currentPath.startsWith('/data')) {
        return '数据统计';
      } else if (currentPath.startsWith('/orders')) {
        return '售后审核';
      } else if (currentPath.startsWith('/cert')) {
        return '证书审核';
      } else if (currentPath.startsWith('/ques')) {
        return '提问/回答删除';
      } else if (currentPath.startsWith('/answer')) {
        return '提问/回答删除';
      } else if (currentPath.startsWith('/share')) {
        return '经验分享审核';
      } else if (currentPath.startsWith('/shareComment')) {
        return '经验分享评论审核';
      }
      return '首页'; // 默认值
    },
    // 根据当前活动菜单项确定 active-text-color
    activeTextColor() {
      return this.activeMenuItem === '' ? '#000000' : '#FFA500';
    }
  },
  mounted() {
    // this.calculateMenuHeight();
    // window.addEventListener('resize', this.throttle(this.calculateMenuHeight, 100));
  },
  beforeUnmount() {
    // window.removeEventListener('resize', this.throttle(this.calculateMenuHeight, 100));
  },
  methods: {
    // calculateMenuHeight() {
    //   const headerElement = this.$refs.header;
    //   const headerHeight = headerElement ? headerElement.clientHeight : 0;
    //   this.menuHeight = window.innerHeight - headerHeight;
    // },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // throttle(func, limit) {
    //   let lastFunc;
    //   let lastRan;
    //   return function() {
    //     const context = this;
    //     const args = arguments;
    //     if (!lastRan) {
    //       func.apply(context, args);
    //       lastRan = Date.now();
    //     } else {
    //       clearTimeout(lastFunc);
    //       lastFunc = setTimeout(function() {
    //         if ((Date.now() - lastRan) >= limit) {
    //           func.apply(context, args);
    //           lastRan = Date.now();
    //         }
    //       }, limit - (Date.now() - lastRan));
    //     }
    //   };
    // }
  }
}
</script>

<style scoped>
.full-height-container {
  height: 100vh; /* 全屏高度 */
  margin: 0;
  padding: 0;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 180px;     /* 侧栏宽度 */
  z-index: 100;     /* 确保在内容之上 */
}

.el-menu-vertical-demo {
  border-right: none;
  overflow-y: auto; /* 允许滚动 */
  height: calc(100vh - 70px);
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