<template>
  <div class="login-container">
    <div class="form-content">
      <h1>登录</h1>
      <form @submit.prevent="handleLogin" id="loginForm">
        <div class="input-group">
          <label for="username">用户名:</label>
          <input type="text" v-model="username" required />
        </div>
        <div class="input-group">
          <label for="password">密码:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit" class="login-button">登录</button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
      <p>还没有账号? <router-link to="/register">注册</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // 导入 Axios

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

// 处理用户登录
const handleLogin = async () => {
  try {
    // 使用 Axios 进行 API 请求
    const response = await axios.post('http://localhost:3000/api/login', {
      username: username.value,
      password: password.value,
    });

    const currentUser = {
      token: response.data.token,
      username: response.data.user.username,
      role: response.data.user.role,
      userId: response.data.user.id,
    };

    // 路由跳转
    switch (currentUser.role) {
      case 'admin':
        router.push('/admin');
        break;
      case 'farmer':
        router.push('/farmer');
        break;
      case 'expert':
        router.push('/expert');
        break;
      case 'buyer':
        router.push('/buyer');
        break;
      default:
        router.push('/welcome');
    }
  } catch (err) {
    error.value = err.response ? err.response.data.error : '请求失败'; // 获取错误信息
  }
};
</script>

<style scoped>
.login-container {
  font-family: Arial, sans-serif;
  min-height: 100vh; /* 填满整个视口 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background-color: #e6f9e6; /* 浅绿背景色 */
}

.form-content {
  max-width: 400px; /* 最大宽度 */
  width: 100%; /* 适应宽度 */
  padding: 40px;
  background-color: #ffffff; /* 白色背景 */
  border-radius: 20px; /* 圆角 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

h1 {
  text-align: center; /* 标题居中 */
  margin-bottom: 50px; /* 增加标题与下方内容的距离 */
}

.input-group {
  display: flex;
  align-items: center; /* 使标签和输入框在同一行居中 */
  margin-bottom: 15px; /* 输入组之间的间距 */
}

label {
  flex: 0 0 70px; /* 固定标签宽度 */
  margin-right: 0px; /* 标签和输入框之间的间距 */
}

input {
  padding: 10px; /* 输入框内边距 */
  font-size: 16px;
  border: 1px solid #ccc; /* 边框 */
  border-radius: 5px; /* 圆角 */
  flex: 1; /* 输入框自适应宽度 */
}

.login-button {
  width: 100%; /* 按钮宽度填充 */
  padding: 10px;
  background: #4CAF50; /* 按钮颜色 */
  color: white; /* 按钮文字颜色 */
  border: none; /* 去掉边框 */
  border-radius: 5px; /* 圆角 */
  cursor: pointer; /* 指针样式 */
}

.error {
  color: red;
  text-align: center; /* 错误信息居中 */
}
</style>