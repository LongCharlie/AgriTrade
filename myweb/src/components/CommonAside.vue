<template>
  <div class="full-height-container">
    <el-row class="tac full-height">
      <el-col :span="24" class="full-height">
        <header class="header">
          <img src="../assets/platform_logo.png" alt="Logo" class="logo"/>
        </header>
        <el-menu
            default-active="首页"
            class="el-menu-vertical-demo full-height"
            @open="handleOpen"
            @close="handleClose"
            background-color="#C3E6AB"
            text-color="#47543F"
            active-text-color="#EFCA00">
          <el-menu-item v-for="item in menuData" :key="item.name" :index="item.name">
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
          path: "/",
          name: "首页",
          icon: "House", // 对应 <house />
          url: "Home/Home",
        },
        {
          path: "/rank",
          name: "排行榜",
          icon: "DataLine", // 对应 <data-line />
          url: "Rank/Rank",
        },
        {
          path: "/cert",
          name: "知识认证",
          icon: "EditPen", // 对应 <edit-pen />
          url: "Cert/Cert",
        },
        {
          path: "/ques",
          name: "解答问题",
          icon: "QuestionFilled", // 对应 <question-filled />
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
    }
  }
}
</script>

<style scoped>
.full-height-container {
  height: 100vh;
  margin: 0;
  padding: 0;
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
   background-color: #C3E6AB;
   border-bottom: 1px solid #eaeaea;
 }

.logo {
  width: 100px;
  height: auto;
}
</style>