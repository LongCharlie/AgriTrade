<template>
  <div class="register-container">
    <div class="form-content">
      <h1>注册</h1>
      <form @submit.prevent="handleRegister" id="registerForm">
        <div class="input-group">
          <label for="username">用户名:</label>
          <input type="text" v-model="registerStore.username" required />
        </div>
        <div class="input-group">
          <label for="password">密码:</label>
          <input type="password" v-model="registerStore.password" required />
        </div>
        <div class="input-group">
          <label for="role">角色:</label>
          <select v-model="registerStore.role" required>
            <option value="">选择角色</option>
            <option value="farmer">农户</option>
            <option value="expert">专家</option>
            <option value="buyer">买家</option>
          </select>
        </div>
        <div class="input-group">
          <label for="phone">电话:</label>
          <input type="tel" v-model="registerStore.phone" required />
        </div>
        <div class="input-group">
          <label for="address">地址:</label>
          <el-cascader
              size="large"
              :options="pcaTextArr"
              v-model="selectedOptions"
              @change="handleAddressChange"
              :placeholder="'请选择省、市、区'"
              clearable
          />
          <span v-if="!addressSelected" class="error">地址为必选项</span>
        </div>
        <div class="input-group">
          <label for="address_detail">详细地址:</label>
          <input type="text" v-model="registerStore.address_detail" required />
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
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useRegisterStore } from '../stores/register';
import axios from 'axios';
import { pcaTextArr } from 'element-china-area-data';

const registerStore = useRegisterStore();
const error = ref('');
const router = useRouter();
const selectedOptions = ref([]);
const addressSelected = ref(false); // 记录地址选择状态

const handleAddressChange = (value) => {
  // 确保 value 是定义的，并且是一个数组
  if (Array.isArray(value) && value.length === 3) {
    registerStore.province = value[0];
    registerStore.city = value[1];
    registerStore.district = value[2];
    addressSelected.value = true; // 地址已选择
  } else {
    // When address is cleared or invalid
    registerStore.province = ''; // Reset these values to empty
    registerStore.city = '';
    registerStore.district = '';
    addressSelected.value = false; // 地址未选择状态
  }
};

const handleRegister = async () => {
  console.log("注册函数被调用"); // 调试信息

  // 检查地址是否被选择
  if (!addressSelected.value) {
    error.value = '地址是必选项，请选择地址';
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/api/register', {
      username: registerStore.username,
      password: registerStore.password,
      role: registerStore.role,
      phone: registerStore.phone,
      province: registerStore.province,
      city: registerStore.city,
      district: registerStore.district,
      address_detail: registerStore.address_detail
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || '注册失败');
    }
    alert('注册成功，请登录');
    router.push('/login');
  } catch (err) {
    console.log('报错' + `err`); // 打印错误以便调试
    error.value = err.response.data;
  }
};

onBeforeRouteLeave((to, from, next) => {
  registerStore.$reset();
  next();
});
</script>

<style scoped>
.register-container {
  font-family: Arial, sans-serif;
  min-height: 97vh; /* 填满整个视口 */
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