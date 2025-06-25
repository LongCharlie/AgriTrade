<template>
  <div class="register-container">
    <h1>注册</h1>
    <form @submit.prevent="handleRegister" id="registerForm">
      <div>
        <label for="username">用户名:</label>
        <input type="text" v-model="user.username" required />
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="password" v-model="user.password" required />
      </div>
      <div>
        <label for="role">角色:</label>
        <select v-model="user.role" required>
          <option value="">选择角色</option>
          <option value="farmer">农户</option>
          <option value="expert">专家</option>
          <option value="buyer">买家</option>
        </select>
      </div>
      <div>
        <label for="phone">电话:</label>
        <input type="tel" v-model="user.phone" required />
      </div>
      <div>
        <label for="province">省份:</label>
        <input type="text" v-model="user.province" required />
      </div>
      <div>
        <label for="city">城市:</label>
        <input type="text" v-model="user.city" required />
      </div>
      <div>
        <label for="district">区县:</label>
        <input type="text" v-model="user.district" required />
      </div>
      <div>
        <label for="address_detail">详细地址:</label>
        <input type="text" v-model="user.address_detail" required />
      </div>
      <button type="submit">注册</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
    <p>已有账号? <router-link to="/login">登录</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const user = ref({
  username: '',
  password: '',
  role: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  address_detail: ''
});

const error = ref('');
const router = useRouter();

const handleRegister = async () => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user.value),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || '注册失败');
    }

    alert('注册成功，请登录');
    router.push('/login'); // 跳转到登录页面
  } catch (err) {
    error.value = err.message; // 设置错误信息以供展示
  }
};
</script>

<style scoped>
.register-container {
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

input, select {
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