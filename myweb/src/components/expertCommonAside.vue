<template>
  <div class="full-height-container">
    <el-row class="tac full-height">
      <el-col :span="24" class="full-height">
        <header class="header">
          <img v-if="!isCollapse" src="../assets/platform_logo2.png" alt="Logo" class="logo"/>
        </header>
        <el-menu
            default-active="首页"
            class="el-menu-vertical-demo full-height"
            @open="handleOpen"
            @close="handleClose"
            :collapse="isCollapse"
            background-color="#D9EEDD"
            text-color="#47543F"
            active-text-color="#EFCA00">
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
    }
  },
}
</script>

<style lang="less" scoped>
.full-height-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.tac {
  flex: 1;
  overflow: hidden;
}

.full-height {
  height: 100%;
}

.el-menu-vertical-demo {
  border-right: none;
}

.header {
   display: flex;
   align-items: center;
   justify-content: flex-start;
   padding: 10px 20px;
   background-color: #D9EEDD;
 }

.logo {
  width: 100px;
  height: auto;
}
</style>