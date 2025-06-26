<template>
  <div class="welcome-container">
    <h1>欢迎</h1> <br>
    <button @click="goToLogin">登录</button> <br>
    <button @click="goToRegister">注册</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'; // 引入 Vue Router

const router = useRouter(); // 使用 router 实例

// 函数用于跳转到登录页面
const goToLogin = () => {
  router.push('/login'); // 跳转到登录页面
};

// 函数用于跳转到注册页面
const goToRegister = () => {
  router.push('/register'); // 跳转到注册页面
};
</script>

<style scoped>
.welcome-container {
  text-align: center; /* 居中文本 */
  margin-top: 20px; /* 添加顶部间距 */
}

button {
  padding: 10px 15px; /* 按钮内边距 */
  margin: 5px; /* 按钮间距 */
  background: #4CAF50; /* 按钮背景颜色 */
  color: white; /* 按钮文字颜色 */
  border: none; /* 无边框 */
  border-radius: 4px; /* 圆角 */
  cursor: pointer; /* 鼠标指针形状 */
}

button:hover {
  background: #45a049; /* 悬停颜色 */
}
</style>