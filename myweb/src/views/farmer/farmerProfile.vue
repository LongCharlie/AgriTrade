<template>
  <div class="farmer-profile-container">
    <el-card class="profile-card">
      <div slot="header">
        <h3>我的主页</h3>
      </div>

      <!-- 头像显示 -->
      <div class="avatar-container">
        <img v-if="tempAvatarUrl" :src="tempAvatarUrl" class="avatar" alt="用户头像" />
        <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-change="handleAvatarChange"
            :before-upload="beforeAvatarUpload"
        >
          <el-button type="primary">上传头像</el-button>
        </el-upload>
      </div>

      <!-- 用户信息 -->
      <el-form :model="user" label-width="80px" style="margin-top: 20px;">
        <!-- ID（不可编辑） -->
        <el-form-item label="ID">
          <el-input v-model="user.id" disabled></el-input>
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item label="昵称">
          <el-input v-model="user.nickname" disabled></el-input>
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
import { useUserStore } from '@/stores/user'; // 引入 Pinia 用户存储
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { pcaTextArr } from 'element-china-area-data'; // 引入省市区数据
import profile from '../../assets/logo.png'; // 引入默认头像

const userStore = useUserStore();
const user = ref({
  id: null,  // 备用 ID
  nickname: '',  // 备用昵称
  province: '',  // 备用省份
  city: '',      // 备用城市
  district: '',  // 备用区县
  phone: '',
  address_detail: '', // 备用详细地址
  avatar_url: ''        // 备用头像
});

const mockuser = ref({
  id: '0000',  // 备用 ID
  nickname: '默认用户',  // 备用昵称
  province: '北京市',  // 备用省份
  city: '市辖区',      // 备用城市
  district: '朝阳区',   // 备用区县
  phone: '12345678900', // 备用电话
  address_detail: '默认详细地址', // 备用详细地址
  avatar_url: profile        // 备用头像
}); // 设置备用值

// 定义选择的省市区
const selectedLocation = ref([]); // 初始化为空数组以便后续设置

const tempAvatarUrl = ref(user.value.avatar_url); // 使用头像 URL
const token = userStore.token; // 从用户存储中获取 token

// 获取用户信息
onMounted(async () => {
  user.value.id = userStore.userId;
  user.value.nickname = userStore.username;
  user.value.province = userStore.province;
  user.value.city = userStore.city;
  user.value.district = userStore.district;
  user.value.phone = userStore.phone;
  user.value.address_detail = userStore.address_detail;
  user.value.avatar_url = userStore.avatar_url;

  console.log('用户主页//user.value');
  console.log(user.value);
  if (user.value.id) {
    // 依据用户信息设置省市区选择的默认值
    selectedLocation.value = [user.value.province, user.value.city, user.value.district];
    console.log('用户主页//拿到数据');
  } else {
    console.error('没有用户信息，使用默认值');
    user.value = mockuser.value;
    selectedLocation.value = [mockuser.value.province, mockuser.value.city, mockuser.value.district];
  }
});

// 处理头像上传
const handleAvatarChange = (file) => {
  if (file.status === 'success') {
    tempAvatarUrl.value = file.response.url;
    ElMessage.success('头像上传成功');
  } else if (file.status === 'fail') {
    ElMessage.error('头像上传失败');
  }
};

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片格式的文件!');
    return false;
  }
  return true;
};

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
    await axios.patch('http://localhost:3000/api/user/profile', {
      phone: user.value.phone,
      province: user.value.province,
      city: user.value.city,
      district: user.value.district,
      address_detail: user.value.address_detail,
      // avatar_url: tempAvatarUrl.value
    }, {
      headers: {
        'Authorization': `Bearer ${token}` // 发送 token
      }
    });
    user.value.avatar_url = tempAvatarUrl.value;
    // 更新 Pinia 中的用户信息
    userStore.phone = user.value.phone,
    userStore.province = user.value.province,
    userStore.city = user.value.city,
    userStore.district = user.value.district,
    userStore.address_detail = user.value.address_detail,
    userStore.avatar_url = user.value.avatar_url;
    ElMessage.success('保存成功');
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