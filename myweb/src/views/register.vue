<template>
  <div ref="vantaBg" class="vanta-container">
    <div class="logo-container">
      <img src="@/assets/platform_logo2.png" alt="Logo" class="logo" />
    </div>
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
        <button type="submit" class="login-button">注册</button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
      <p>已有账号? <router-link to="/login">登录</router-link></p>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import GLOBE from 'vanta/dist/vanta.globe.min'
import { ref } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useRegisterStore } from '../stores/register';
import axios from 'axios';
import { pcaTextArr } from 'element-china-area-data';

export default {
  setup() {
    const registerStore = useRegisterStore();
    const error = ref('');
    const router = useRouter();
    const selectedOptions = ref([]);
    const addressSelected = ref(false);

    const handleAddressChange = (value) => {
      if (Array.isArray(value) && value.length === 3) {
        registerStore.province = value[0];
        registerStore.city = value[1];
        registerStore.district = value[2];
        addressSelected.value = true;
      } else {
        registerStore.province = '';
        registerStore.city = '';
        registerStore.district = '';
        addressSelected.value = false;
      }
    };

    const handleRegister = async () => {
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
        alert('注册成功，请登录');
        router.push('/login');
      } catch (err) {
        error.value = err.response?.data || '注册失败';
      }
    };

    onBeforeRouteLeave((to, from, next) => {
      registerStore.$reset();
      next();
    });

    return {
      registerStore,
      error,
      selectedOptions,
      addressSelected,
      handleAddressChange,
      handleRegister,
      pcaTextArr
    };
  },
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
      color: 0x41743b,
      backgroundColor: 0xd1e8dc
    })
  },
  beforeUnmount() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy()
    }
  }
}
</script>

<style>
.vanta-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.form-content {
  max-width: 400px;
  width: 100%;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
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

input, select {
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
  margin-top: 10px;
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
