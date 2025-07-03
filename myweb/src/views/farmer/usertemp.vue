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
          <el-input v-model="user.nickname"></el-input>
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
  id: null,
  nickname: '',
  province: '',
  city: '',
  district: '',
  phone: '',
  address_detail: '',
  avatar_url: ''
});

const mockuser = ref({
  id: '0000',  // 备用 ID
  nickname: '默认用户',  // 备用昵称
  province: '河北省',  // 备用省份
  city: '保定市',      // 备用城市
  district: '徐水区',   // 备用区县
  phone: '12345678900', // 备用电话
  address_detail: '默认详细地址', // 备用详细地址
  avatar_url: profile        // 备用头像
}); // 设置备用值

// 定义选择的省市区
const selectedLocation = ref([user.value.province, user.value.city, user.value.district]);
const tempAvatarUrl = ref(user.value.avatar_url); // 使用头像 URL

// 获取用户信息
onMounted(async () => {
  try {
    const data = userStore.$state; // 从 Pinia 中获取用户信息
    if (data.userId) {
      user.value.id = data.userId;
      user.value.nickname = data.username;
      user.value.province = data.value.province;
      user.value.city = data.value.city;
      user.value.district = data.value.district;
      user.value.phone = data.value.phone;
      user.value.address_detail = data.value.address_detail;
      user.value.avatar_url = data.avatar_url;
      tempAvatarUrl.value = ref(user.value.avatar_url);
      selectedLocation.value = ref([user.value.province, user.value.city, user.value.district]);
    } else {
      ElMessage.warning('没有用户信息，使用默认值');
      user.value = mockuser.value;
      selectedLocation.value = ref([mockuser.value.province, mockuser.value.city, mockuser.value.district]);
      tempAvatarUrl.value = profile;
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
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
    await axios.patch('/api/user/profile', {
      ...user.value,
      avatar_url: tempAvatarUrl.value

    });
    userStore.setUser(user.value); // 更新 Pinia 中的用户信息
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