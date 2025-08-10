<template>
  <div class="farmer-profile-container">
    <el-card class="profile-card">
      <div slot="header">
        <h3>编辑用户信息</h3>
      </div>

      <!-- 用户信息 -->
      <el-form :model="user" label-width="80px" style="margin-top: 20px;">
        <!-- ID（不可编辑） -->
        <el-form-item label="ID">
          <el-input v-model="user.user_id" disabled></el-input>
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item label="昵称">
          <el-input v-model="user.username" disabled></el-input>
        </el-form-item>

        <!-- 角色 -->
        <el-form-item label="角色">
          <el-input v-model="user.role" disabled></el-input>
        </el-form-item>

        <!-- 注册时间 -->
        <el-form-item label="注册时间">
          <el-input v-model="user.join_date" disabled></el-input>
        </el-form-item>

        <!-- 位置 -->
        <el-form-item label="位置">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-cascader
                  size="large"
                  :options="pcaTextArr"
                  v-model="selectedLocation"
                  @change="handleLocationChange"
                  :placeholder="'请选择省、市、区'"
                  clearable
              />
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 详细地址 -->
        <el-form-item label="详细地址">
          <el-input v-model="user.address_detail"></el-input>
        </el-form-item>

        <!-- 联系方式 -->
        <el-form-item label="联系方式">
          <el-input v-model="user.phone"></el-input>
        </el-form-item>

        <!-- 保存按钮 -->
        <el-form-item>
          <el-button type="primary" @click="saveProfile">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAdminEditUserStore } from '@/stores/adminEditUser'; // 引入 Pinia adminEditUser 存储
import { useUserStore } from '../../stores/user';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { pcaTextArr } from 'element-china-area-data'; // 引入省市区数据
import profile from '../../assets/logo.png';
import {useRouter} from "vue-router";

const adminEditUserStore = useAdminEditUserStore();
const userStore = useUserStore();
const router = useRouter();
const user = ref({
  user_id: null,
  username: '',
  province: '',
  city: '',
  district: '',
  phone: '',
  address_detail: '',
  avatar_url: ''  // 使用默认头像
});

const selectedLocation = ref([]);
const token = userStore.token;

onMounted(async () => {
  // 从 adminEditUserStore 中获取用户数据
  const storedUserData = adminEditUserStore.userData;
  user.value.user_id = storedUserData.user_id;
  user.value.username = storedUserData.username;
  user.value.role = storedUserData.role;
  user.value.join_date = storedUserData.join_date;
  user.value.province = storedUserData.province;
  user.value.city = storedUserData.city;
  user.value.district = storedUserData.district;
  user.value.phone = storedUserData.phone;
  user.value.address_detail = storedUserData.address_detail;
  user.value.avatar_url = storedUserData.avatar_url;
  selectedLocation.value = user.value.user_id ? [user.value.province, user.value.city, user.value.district] : [];
});

// 处理位置变化
const handleLocationChange = (value) => {
  if (Array.isArray(value) && value.length === 3) {
    user.value.province = value[0];
    user.value.city = value[1];
    user.value.district = value[2];
  } else {
    user.value.province = '';
    user.value.city = '';
    user.value.district = '';
  }
};

// 保存数据
const saveProfile = async () => {
  try {
    await axios.patch(`http://localhost:3000/api/users/${user.value.user_id}`, {
      phone: user.value.phone,
      province: user.value.province,
      city: user.value.city,
      district: user.value.district,
      address_detail: user.value.address_detail,
      avatar_url: user.value.avatar_url
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    ElMessage.success('保存成功');
    router.push('/admin/user');
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败，请重试');
  }
};
</script>

<style scoped>
.farmer-profile-container {
  padding: 20px;
}
.profile-card {
  max-width: 800px;
  margin: auto;
}
.avatar-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid #D0D0D0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>