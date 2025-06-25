<template>
  <div class="login-container">
    <h1>BBB登录</h1>
    <form @submit.prevent="handleLogin" id="loginForm">
      <div>
        <label for="username">用户名:</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">登录</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
    <p>还没有账号? <router-link to="/register">注册</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  apiRequest,
  saveUserToStorage,
} from '../utils/authExport.js';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await apiRequest('/api/login', 'POST', {
      username: username.value,
      password: password.value
    });

    // 保存用户信息
    const currentUser = {
      token: response.token,
      username: response.user.username,
      role: response.user.role,
      userId: response.user.id
    };
    saveUserToStorage(currentUser); // 保存用户数据到本地存储

    // 跳转到首页
    router.push('/index'); // 跳转到首页
  } catch (err) {
    error.value = err.message; // 显示错误信息
  }
};
</script>

<style scoped>
.login-container {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 8px;
  font-size: 16px;
}

button {
  padding: 10px;
  background: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.error {
  color: red;
}
</style>