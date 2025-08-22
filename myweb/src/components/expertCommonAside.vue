<template>
  <div class="full-height-container">
    <el-row class="tac full-height">
      <el-col :span="24" class="full-height">
        <header class="header">
          <img v-if="!isCollapse" src="../assets/platform_logo2.png" alt="Logo" class="logo"/>
        </header>
<!--        default-active="首页"-->
<!--        active-text-color="#EFCA00">-->
        <el-menu
            :default-active="activeMenuItem"
            class="el-menu-vertical-demo full-height"
            @open="handleOpen"
            @close="handleClose"
            :collapse="isCollapse"
            background-color="#D9EEDD"
            text-color="#47543F"
            :active-text-color="activeTextColor">
          <el-menu-item @click="clickMenu(item)" v-for="item in menuData" :key="item.name" :index="item.name">
            <component :is="item.icon" style="width: 20px; height: 20px; margin-right: 8px" />
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
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
        {
          path: "/expert/home",
          name: "首页",
          icon: "House",
          url: "Home/Home",
        },
        {
          path: "/expert/rank",
          name: "排行榜",
          icon: "DataLine",
          url: "Rank/Rank",
        },
        {
          path: "/expert/cert",
          name: "知识认证",
          icon: "EditPen",
          url: "Cert/Cert",
        },
        {
          path: "/expert/ques",
          name: "解答问题",
          icon: "QuestionFilled",
          url: "Ques/Ques",
        }
      ]
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    clickMenu(item) {
      //current route inconsistent with jump route
      if (this.$route.path !== item.path && !(this.$route.path == '/home' && item.path == '/')) {
        this.$router.push(item.path);
      }
    }
  },
  computed: {
    isCollapse() {
      return this.$store.state.tab.isCollapse; //gain the collapse state in store
    },
    activeMenuItem() {
      const currentPath = this.$route.path.split('/expert')[1];
      if (currentPath === '' || currentPath === '/home') {
        return '首页';
      } else if (currentPath.startsWith('/rank')) {
        return '排行榜';
      } else if (currentPath.startsWith('/cert')) {
        return '知识认证';
      } else if (currentPath.startsWith('/ques') || currentPath.startsWith('/answer')) {
        return '解答问题';
      } else if (currentPath.startsWith('/profile') || currentPath.startsWith('/detail')) {
        return '';
      }
      return '首页';
    },
    activeTextColor() {
      return this.activeMenuItem === '' ? '#000000' : '#EFCA00';
    }
  },
}
</script>

<style lang="less" scoped>
/* 修改容器样式 */
.full-height-container {
  position: fixed;  /* 添加固定定位 */
  left: 0;
  top: 0;       /* 顶栏高度(与header高度一致) */
  bottom: 0;
  width: 220px;     /* 侧栏宽度 */
  z-index: 100;     /* 确保在内容之上 */
  background-color: #D9EEDD;
  //overflow-y: auto; /* 允许侧栏内容滚动 */
}

/* 移除原有高度设置 */
.tac {
  /* 移除 flex: 1 和 overflow: hidden */
  width: 100%;
}

/* 菜单高度调整 */
.el-menu-vertical-demo {
  height: calc(100vh - 70px); /* 视口高度减去顶栏高度 */
  border-right: none;
}

/* 头部logo样式调整 */
.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 20px;
  background-color: #D9EEDD;
  position: sticky; /* 使logo在侧栏滚动时保持可见 */
  top: 0;
  z-index: 110;     /* 高于菜单项 */
}

.logo {
  width: 100px;
  height: auto;
}
</style>
