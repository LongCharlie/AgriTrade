<template>
  <div class="full-height-container">
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

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>
  </div>
</template>

<script>
import profile from '../assets/logo.png'; // 引入默认头像
import { useUserStore } from '../stores/user'; // 导入用户状态 Store
import axios from 'axios';

export default {
  data() {
    return {
      loading: true, // 加载状态
      user: {
        avatar: profile, // 默认用户头像
        name: "默认农户" // 默认用户名
      },
    }
  },
  mounted() {
    this.fetchUserProfile(); // 获取用户信息
  },

  methods: {
    async fetchUserProfile() {
      try {
        const userStore = useUserStore();
        const token = userStore.token; // 从用户存储中获取 token

        const response = await axios.get('http://localhost:3000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}` // 设置 Authorization 头
          }
        });
        console.log('这里是Header//response');
        console.log(response.data);
        const userData = response.data;
        console.log('这里是Header//userData');
        console.log(userData);
        // 更新用户信息
        userStore.userId = userData.user_id;
        userStore.userName = userData.userName;
        userStore.role = userData.role;
        userStore.phone = userData.phone;
        userStore.province = userData.province;
        userStore.city = userData.city;
        userStore.district = userData.district;
        userStore.address_detail = userData.address_detail;
        userStore.avatar_url = userData.avatar_url;

        console.log('这里是Header//userStore');
        console.log(userStore.userId);
        console.log(userStore.username);
        console.log(userStore.role);
        console.log(userStore.phone);
        console.log(userStore.province);
        console.log(userStore.city);
        console.log(userStore.district);
        console.log(userStore.address_detail);
        console.log(userStore.avatar_url);
        // 更新用户显示
        this.user.avatar = userStore.avatar_url;
        this.user.name = userStore.username;

      } catch (error) {
        console.error('获取用户信息失败:', error);
        // 在获取失败时使用默认信息
        this.user.avatar = profile; // 默认头像
        this.user.name = "默认农户超长用户名不全部显示"; // 默认用户名
      } finally {
        this.loading = false; // 加载完成
      }
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

.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  color: #333;
}
</style>