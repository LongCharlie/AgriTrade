<template>
  <div class="header-container">
    <div class="l-content">
      <el-button  @click="handleMenu" type="info" size="small" :style="{ backgroundColor: '#4C9148'}">
        <el-icon><Menu /></el-icon>
      </el-button>
      <span class="text">首页</span>
    </div>
    <div class="r-content">
      <el-dropdown>
    <span class="el-dropdown-link">
      <img class="user" src="../assets/profile.jpg" alt="">
    </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { Menu } from '@element-plus/icons-vue'
export default {
  components: {
    Menu, //register icon
  },
  data(){
    return {}
  },
  methods: {
    handleMenu() {
      this.$store.commit('collapseMenu') //commit to mutation collapseMenu in store
    }
  }
}
</script>

<style lang="less" scoped>

.header-container{
  padding: 0 20px;
  background-color: #C3E6AB;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .l-content{
    .text{
      margin-left: 20px;
      font-size: 16px;
      color: #47543F;
      font-weight: 600;
    }
  }
  .r-content {
    .user{
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
}

</style>

