<template>
  <div ref="vantaBg" class="vanta-container">
    <div class="logo-container">
      <img src="@/assets/platform_logo2.png" alt="Logo" class="logo" />
    </div>
    <div class="content-overlay">
<!--      <h1>耘联农产品平台</h1>-->
    </div>
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

<script>
import * as THREE from 'three'
import GLOBE from 'vanta/dist/vanta.globe.min'

export default {
  data() {
    return {
      vantaEffect: null
    }
  },
  mounted() {
    this.vantaEffect = GLOBE({
      el: this.$refs.vantaBg,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x41743b,  // 绿色主题
      backgroundColor: 0xd1e8dc  // 浅绿背景
    })
  },
  beforeUnmount() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy()
    }
  }
}
</script>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '../stores/user'; // 导入用户状态 Store

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const userStore = useUserStore(); // 使用用户 Store

// 处理用户登录
const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      username: username.value,
      password: password.value,
    });

    // 更新用户 Store 的状态
    userStore.token = response.data.token;
    userStore.username = response.data.user.username;
    userStore.role = response.data.user.role;
    userStore.userId = response.data.user.id;
    // console.log(userStore.token);
    // 路由跳转
    switch (userStore.role) {
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
        router.push('/merchant');
        break;
      default:
        router.push('/welcome');
    }
  } catch (err) {
    error.value = err.response ? err.response.data.error : '请求失败';
  }
};
</script>

<style>
.vanta-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.content-overlay {
  position: relative;
  z-index: 1;
  color: white;
  padding: 20px;
}

.form-content {
  max-width: 400px;
  width: 100%;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 20px; /* 圆角 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 50%;
  left: 220px;
  transform: translateY(-50%);
  z-index: 2;
}

h1 {
  text-align: center;
  margin-bottom: 50px;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

label {
  flex: 0 0 70px;
  margin-right: 0px;
}

input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  flex: 1;
}

.login-button {
  width: 100%;
  padding: 10px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.error {
  color: red;
  text-align: center;
}

.logo-container {
  position: absolute;
  top: 12px;
  left: 62px;
  z-index: 3;
}

.logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

</style>
