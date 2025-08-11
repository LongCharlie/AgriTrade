<template>
  <div class="header-container">
    <div class="l-content">
      <el-button  @click="handleMenu" type="info" size="small" :style="{ backgroundColor: '#4C9148'}">
        <el-icon><Menu /></el-icon>
      </el-button>
      <!--      <span class="text">首页</span>-->
    </div>
    <div class="r-content">
      <el-dropdown>
    <span class="el-dropdown-link">
      <img class="user" src="../assets/profile.jpg" alt="">
    </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="navigateToProfile">个人中心</el-dropdown-item>
            <el-dropdown-item @click="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { Menu } from '@element-plus/icons-vue'
import {useUserStore} from "@/stores/user";
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
    },
    navigateToProfile() {
      this.$router.push('/expert/profile');
    },
    logout() {
      const userStore = useUserStore(); // 使用用户状态 Store
      userStore.$reset(); // 重置用户 Store 数据
      this.$router.push('/login'); // 跳转回登录页面
    }
  }
}
</script>

<style lang="less" scoped>
.header-container{
  position: fixed; /* 添加固定定位 */
  top: 0;
  left: 220px;
  right: 0;
  padding: 0 20px;
  background-color: #C8DBCC;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 200; /* 确保在侧栏上方 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */

  .l-content{
    .text{
      margin-left: 20px;
      font-size: 16px;
      color: #D6EBDA;
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

