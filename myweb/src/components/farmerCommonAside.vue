<template>
  <div class="full-height-container">
    <el-row class="tac full-height">
      <el-col :span="24" class="full-height">
        <header class="header">
          <img src="../assets/platform_logo.png" alt="Logo" class="logo"/>
        </header>
        <el-menu
            default-active="我的主页"
            class="el-menu-vertical-demo full-height"
            @open="handleOpen"
            @close="handleClose"
            background-color="#D9EEDD"
            text-color="#3A5D3D"
            active-text-color="#FFDA44">
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
          path: "/home",
          name: "我的主页",
          icon: "House", // 对应 <house />
          url: "Home/Home",
        },
        {
          path: "/purchases",
          name: "查看采购",
          icon: "ShoppingCart", // 对应 <shopping-cart />
          url: "Purchases/Purchases",
        },
        {
          path: "/records",
          name: "种植记录",
          icon: "Plant", // 对应 <plant />
          url: "Records/Records",
        },
        {
          path: "/questions",
          name: "发布提问",
          icon: "QuestionFilled", // 对应 <question-filled />
          url: "Questions/Questions",
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
  background-color: #D9EEDD;
  border-bottom: 1px solid #eaeaea;
}

.logo {
  width: 100px;
  height: auto;
}
</style>