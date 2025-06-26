<template>
  <div class="register-container">
    <div class="form-content">
      <h1>注册</h1>
      <form @submit.prevent="handleRegister" id="registerForm">
        <div class="input-group">
          <label for="username">用户名:</label>
          <input type="text" v-model="userData.username" required />
        </div>
        <div class="input-group">
          <label for="password">密码:</label>
          <input type="password" v-model="userData.password" required />
        </div>
        <div class="input-group">
          <label for="role">角色:</label>
          <select v-model="userData.role" required>
            <option value="">选择角色</option>
            <option value="farmer">农户</option>
            <option value="expert">专家</option>
            <option value="buyer">买家</option>
          </select>
        </div>
        <div class="input-group">
          <label for="phone">电话:</label>
          <input type="tel" v-model="userData.phone" required />
        </div>
        <div class="address-group">
          <div class="address-input">
            <label for="province">省份:</label>
            <input type="text" v-model="userData.province" required />
          </div>
          <div class="address-input">
            <label for="city">城市:</label>
            <input type="text" v-model="userData.city" required />
          </div>
          <div class="address-input">
            <label for="district">区县:</label>
            <input type="text" v-model="userData.district" required />
          </div>
        </div>
        <div class="input-group">
          <label for="address_detail">详细地址:</label>
          <input type="text" v-model="userData.address_detail" required />
        </div>
        <button type="submit">注册</button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
      <p>已有账号? <router-link to="/login">登录</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 定义用户数据和错误信息的响应式变量
const userData = ref({
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

// 定义 API 请求的函数
const apiRequest = async (url, method = 'POST', data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data); // 转换为 JSON
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '请求失败');
    }
    return await response.json(); // 返回 JSON 格式的响应
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
};

// 处理用户注册
const handleRegister = async () => {
  try {
    const response = await apiRequest('/api/register', 'POST', userData.value);
    alert('注册成功，请登录');
    router.push('/login'); // 注册成功后跳转到登录页面
  } catch (err) {
    error.value = err.message; // 显示错误信息
  }
};
</script>

<style scoped>
.register-container {
  font-family: Arial, sans-serif;
  min-height: 100vh; /* 填满整个视口 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background-color: #e6f9e6; /* 浅绿背景色 */
}

.form-content {
  max-width: 600px; /* 最大宽度 */
  width: 100%; /* 适应宽度 */
  padding: 40px;
  background-color: #ffffff; /* 白色背景 */
  border-radius: 20px; /* 圆角 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

h1 {
  text-align: center; /* 标题居中 */
  margin-bottom: 10px; /* 增加标题与下方内容的距离 */
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-group {
  display: flex;
  flex-direction: column; /* 垂直排列标签和输入框 */
}

.address-group {
  display: flex; /* 水平排列 */
  gap: 20px; /* 输入框之间的间距 */
}

.address-input {
  font-size: 16px;
  max-width: 175px; /* 最大宽度 */
}

input, select {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc; /* 边框 */
  border-radius: 5px; /* 圆角 */
  flex: 1; /* 输入框自适应宽度 */
}

button {
  padding: 10px;
  background: #4CAF50; /* 按钮颜色 */
  color: white; /* 按钮文字颜色 */
  border: none; /* 去掉边框 */
  border-radius: 5px; /* 圆角 */
  cursor: pointer; /* 指针样式 */
}

.error {
  color: red;
}
</style>