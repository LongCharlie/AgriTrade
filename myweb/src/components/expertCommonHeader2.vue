<!--<template>-->
<!--  <div class="full-height-container">-->
<!--    &lt;!&ndash; 右上角用户信息 &ndash;&gt;-->
<!--    <el-dropdown>-->
<!--      <div class="user-info" @click="navigateToProfile">-->
<!--        <img :src="user.avatar" alt="User Avatar" class="user-avatar"/>-->
<!--        <span class="user-name">{{ user.name }}</span>-->
<!--      </div>-->
<!--      <template #dropdown>-->
<!--        <el-dropdown-menu>-->
<!--          <el-dropdown-item @click="navigateToProfile">个人中心</el-dropdown-item>-->
<!--          <el-dropdown-item @click="logout">退出</el-dropdown-item>-->
<!--        </el-dropdown-menu>-->
<!--      </template>-->
<!--    </el-dropdown>-->

<!--    &lt;!&ndash; 加载状态 &ndash;&gt;-->
<!--    <div v-if="loading" class="loading">加载中...</div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import profile from '../assets/logo.png'; // 引入默认头像-->
<!--import { useUserStore } from '../stores/user'; // 导入用户状态 Store-->
<!--import axios from 'axios';-->

<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      loading: true, // 加载状态-->
<!--      user: {-->
<!--        avatar: '', // 默认用户头像-->
<!--        name: "" // 默认用户名-->
<!--      },-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    this.fetchUserProfile(); // 获取用户信息-->
<!--  },-->

<!--  methods: {-->
<!--    async fetchUserProfile() {-->
<!--      try {-->
<!--        const userStore = useUserStore();-->
<!--        const token = userStore.token; // 从用户存储中获取 token-->

<!--        const response = await axios.get('http://localhost:3000/api/user/profile', {-->
<!--          headers: {-->
<!--            'Authorization': `Bearer ${token}` // 设置 Authorization 头-->
<!--          }-->
<!--        });-->
<!--        console.log('这里是Header//response');-->
<!--        console.log(response.data);-->
<!--        const userData = response.data;-->
<!--        console.log('这里是Header//userData');-->
<!--        console.log(userData);-->
<!--        // 更新用户信息-->
<!--        userStore.userId = userData.user_id;-->
<!--        userStore.userName = userData.userName;-->
<!--        userStore.role = userData.role;-->
<!--        userStore.phone = userData.phone;-->
<!--        userStore.province = userData.province;-->
<!--        userStore.city = userData.city;-->
<!--        userStore.district = userData.district;-->
<!--        userStore.address_detail = userData.address_detail;-->
<!--        userStore.avatar_url = "http://localhost:3000/uploads/avatars/" + userData.avatar_url;-->

<!--        console.log('这里是Header//userStore');-->
<!--        console.log(userStore.userId);-->
<!--        console.log(userStore.username);-->
<!--        console.log(userStore.role);-->
<!--        console.log(userStore.phone);-->
<!--        console.log(userStore.province);-->
<!--        console.log(userStore.city);-->
<!--        console.log(userStore.district);-->
<!--        console.log(userStore.address_detail);-->
<!--        console.log(userStore.avatar_url);-->
<!--        // 更新用户显示-->
<!--        this.user.avatar = userStore.avatar_url;-->
<!--        this.user.name = userStore.username;-->

<!--      } catch (error) {-->
<!--        console.error('获取用户信息失败:', error);-->
<!--        // 在获取失败时使用默认信息-->
<!--        this.user.avatar = ''; // 默认头像-->
<!--        this.user.name = ""; // 默认用户名-->
<!--      } finally {-->
<!--        this.loading = false; // 加载完成-->
<!--      }-->
<!--    },-->
<!--    navigateToProfile() {-->
<!--      this.$router.push('/expert/profile'); // 跳转到用户个人主页-->
<!--    },-->
<!--    logout() {-->
<!--      const userStore = useUserStore(); // 使用用户状态 Store-->
<!--      userStore.$reset(); // 重置用户 Store 数据-->
<!--      this.$router.push('/login'); // 跳转回登录页面-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.full-height-container {-->
<!--  height: 100vh; /* 全屏高度 */-->
<!--  margin: 0;-->
<!--  padding: 0;-->
<!--  position: relative; /* 为绝对定位的子元素提供基准 */-->
<!--}-->
<!--/* 用户信息样式 */-->
<!--.user-info {-->
<!--  position: fixed; /* 使用fixed以固定在全局右上角 */-->
<!--  top: 20px; /* 距离顶部10px */-->
<!--  right: 80px; /* 距离右侧80px */-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  cursor: pointer; /* 鼠标指针为手型 */-->
<!--  z-index: 1000; /* 确保在上层 */-->
<!--}-->

<!--.user-avatar {-->
<!--  width: 50px; /* 用户头像大小 */-->
<!--  height: 50px;-->
<!--  border-radius: 50%; /* 圆形头像 */-->
<!--  margin-right: 10px; /* 头像和名字之间的间距 */-->
<!--  border: 1px solid #D0D0D0; /* 添加浅灰色边框 */-->
<!--  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* 添加阴影效果，仅作为视觉增强 */-->
<!--}-->
<!--.user-name {-->
<!--  color: #3A5D3D; /* 用户名颜色 */-->
<!--  font-size: 18px; /* 设置字体大小，您可以根据需要调整 */-->
<!--  white-space: nowrap; /* 不换行 */-->
<!--  overflow: hidden; /* 超出部分隐藏 */-->
<!--  text-overflow: ellipsis; /* 超出部分用省略号表示 */-->
<!--  max-width: 100px; /* 控制最大宽度，以便文字过长时能够展示省略号 */-->
<!--}-->

<!--.loading {-->
<!--  position: fixed;-->
<!--  top: 50%;-->
<!--  left: 50%;-->
<!--  transform: translate(-50%, -50%);-->
<!--  font-size: 18px;-->
<!--  color: #333;-->
<!--}-->
<!--</style>-->

<template>
  <div class="header-container">
    <!-- 左侧内容 -->
    <div class="l-content">
      <el-icon @click="handleMenu">
        <Menu />
      </el-icon>
      <span class="text">专家系统</span>
    </div>

    <!-- 右侧用户信息 -->
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
import { Menu } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import axios from 'axios';

export default {
  components: {
    Menu,
  },
  data() {
    return {
      user: {
        avatar: '', // 默认用户头像
        name: "" // 默认用户名
      },
      loading: true
    }
  },
  mounted() {
    this.fetchUserProfile(); // 获取用户信息
  },
  methods: {
    handleMenu() {
      this.$store.commit('collapseMenu');
    },

    async fetchUserProfile() {
      try {
        const userStore = useUserStore();
        const token = userStore.token;

        const response = await axios.get('http://localhost:3000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const userData = response.data;

        // 更新用户存储
        userStore.userId = userData.user_id;
        userStore.username = userData.username;
        userStore.role = userData.role;
        userStore.phone = userData.phone;
        userStore.province = userData.province;
        userStore.city = userData.city;
        userStore.district = userData.district;
        userStore.address_detail = userData.address_detail;
        userStore.avatar_url = "http://localhost:3000/uploads/avatars/" + userData.avatar_url;
        // 仅当用户是专家时更新专家字段
        if (userData.role === 'expert') {
          userStore.real_name = userData.real_name || '';
          userStore.title = userData.title || '';
          userStore.institution = userData.institution || '';
          userStore.expertise = userData.expertise || '';
          userStore.bio = userData.bio || '';
          userStore.answer_count = userData.answer_count || 0;
          userStore.expert_rank = userData.expert_rank || 0;
        } else {
          // 清除非专家用户的专家字段（安全措施）
          userStore.real_name = '';
          userStore.title = '';
          userStore.institution = '';
          userStore.expertise = '';
          userStore.bio = '';
          userStore.answer_count = 0;
          userStore.expert_rank = 0;
        }

        // 更新显示数据
        this.user.avatar = userStore.avatar_url;
        this.user.name = userStore.username;

      } catch (error) {
        console.error('获取用户信息失败:', error);
        // 使用默认信息
        this.user.avatar = '';
        this.user.name = "";
      } finally {
        this.loading = false;
      }
    },

    navigateToProfile() {
      this.$router.push('/expert/profile');
    },

    logout() {
      const userStore = useUserStore();
      userStore.$reset();
      this.$router.push('/login');
    }
  }
}
</script>

<style lang="less" scoped>
.header-container{
  position: fixed;
  top: 0;
  left: 220px;
  right: 0;
  padding: 0 20px;
  background-color: #C8DBCC;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 200;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .l-content{
    display: flex;
    align-items: center;

    .el-icon {
      font-size: 24px;
      cursor: pointer;
    }

    .text{
      margin-left: 20px;
      font-size: 16px;
      color: #3A5D3D;
      font-weight: 600;
    }
  }

  /* 用户信息样式 - 与农户保持一致 */
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    border: 1px solid #D0D0D0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .user-name {
    color: #3A5D3D;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }
}
</style>