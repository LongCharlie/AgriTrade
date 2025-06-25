<template>
  <div class="container">
    <h1>农业咨询平台</h1>

    <div class="user-info" v-if="isAuthenticated">
      欢迎, <span>{{ user.username }}</span> (角色: <span>{{ user.role }}</span>)
      <button @click="logout">退出登录</button>
    </div>

    <div class="nav">
      <router-link v-if="!isAuthenticated" to="/login" class="nav-link">登录</router-link>
      <router-link v-if="!isAuthenticated" to="/register" class="nav-link">注册</router-link>

      <router-link v-if="isAuthenticated" to="/questions/list" class="nav-link">我的问题</router-link>
      <router-link v-if="isAuthenticated" to="/questions/all" class="nav-link">所有问题</router-link>
      <router-link v-if="isAuthenticated" to="/questions/create" class="nav-link">提问</router-link>
      <router-link v-if="isAuthenticated && checkRole(['expert'])" to="/expert-profile" class="nav-link">专家信息</router-link>
      <router-link v-if="isAuthenticated && checkRole(['farmer', 'buyer'])" to="/product-price" class="nav-link">价格查询</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 这里将用于存储用户信息
const user = ref({ username: '', role: '' });
const isAuthenticated = ref(false);
const router = useRouter();

onMounted(() => {
  // 检查用户是否认证
  isAuthenticated.value = checkAuth();
  if (isAuthenticated.value) {
    // 获取用户信息
    const currentUser = getUser(); // 请实现这个函数
    user.value = currentUser;
  }
});

// 检查用户角色
const checkRole = (allowedRoles) => {
  return allowedRoles.includes(user.value.role);
};

// 退出登录
const logout = () => {
  clearUser(); // 请实现这个函数
  router.push('/login'); // 跳转到登录页面
};
</script>

<style scoped>
.container {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 0 auto;
  padding: 20px;
  max-width: 800px;
}

.nav {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.nav-link {
  padding: 8px 15px;
  background: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.nav-link:hover {
  background: #45a049;
}

.user-info {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>