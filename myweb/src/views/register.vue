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
import { useRouter, onBeforeRouteLeave } from 'vue-router'; // 导入 onBeforeRouteLeave
import { useRegisterStore } from '../stores/register'; // 导入 Pinia Store
import axios from 'axios'; // 引入 Axios
import { pcaTextArr } from 'element-china-area-data'; // 引入省市区数据

const registerStore = useRegisterStore(); // 使用注册 Store
const error = ref('');
const router = useRouter();
const selectedOptions = ref([]); // 用于存储地址选择

// 处理地址选择变化
const handleAddressChange = (value) => {
  if (value.length === 3) {
    registerStore.province = value[0]; // 赋值省
    registerStore.city = value[1]; // 赋值市
    registerStore.district = value[2]; // 赋值区
  } else {
    registerStore.province = '';
    registerStore.city = '';
    registerStore.district = '';
  }
};

// 处理用户注册
const handleRegister = async () => {
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
    }); // 使用 Axios 进行 API 请求

    alert('注册成功，请登录');
    router.push('/login'); // 注册成功后跳转到登录页面
  } catch (err) {
    error.value = err.response ? err.response.data.error : '请求失败'; // 获取错误信息并显示
  }
};

// 在离开当前路由时清空注册数据
onBeforeRouteLeave((to, from, next) => {
  registerStore.$reset(); // 重置注册 Store 数据
  next(); // 继续路由跳转
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