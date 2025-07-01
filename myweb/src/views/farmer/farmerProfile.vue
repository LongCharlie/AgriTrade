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
            :before-upload="beforeAvatarUpload">
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
            <el-col :span="8">
              <el-input v-model="user.province" placeholder="省"></el-input>
            </el-col>
            <el-col :span="8">
              <el-input v-model="user.city" placeholder="市"></el-input>
            </el-col>
            <el-col :span="8">
              <el-input v-model="user.district" placeholder="区"></el-input>
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
          <el-button type="primary" @click="saveProfile">保存</el-button>
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

const userStore = useUserStore();
const user = ref({
  id: '',
  nickname: '',
  province: '',
  city: '',
  district: '',
  phone: '',
  address_detail: '',
  avatar_url: '' // 用户头像URL字段
});

// 临时保存头像 URL
const tempAvatarUrl = ref('');

// 默认用户数据
const defaultUserData = {
  id: '0001',
  nickname: '默认用户',
  province: '广东',
  city: '广州',
  district: '越秀区',
  phone: '12345678901',
  address_detail: '默认地址',
  avatar_url: '../../assets/logo.png' // 默认头像
};

// 获取用户信息
onMounted(async () => {
  try {
    const { data } = await axios.get('/api/user/profile');
    userStore.setUser(data);
    user.value = { ...data };
    tempAvatarUrl.value = data.avatar_url || ''; // 初始化头像 URL
  } catch (error) {
    console.error('加载个人信息失败:', error);
    ElMessage.error('加载数据失败，将使用默认数据');
    user.value = { ...defaultUserData };
    tempAvatarUrl.value = defaultUserData.avatar_url; // 设置默认头像
  }
});

// 处理头像上传
const handleAvatarChange = (file) => {
  if (file.status === 'success') {
    tempAvatarUrl.value = file.response.url; // 假设响应中返回了文件的 URL
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
    return false; // 阻止上传
  }
  return true; // 允许上传
};

// 保存数据
const saveProfile = async () => {
  try {
    await axios.patch('/api/user/profile', {
      ...user.value,
      avatar_url: tempAvatarUrl.value // 提交最新的头像 URL
    });
    userStore.setUser(user.value);
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
  border: 1px solid #D0D0D0; /* 添加浅灰色边框 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* 添加阴影效果，仅作为视觉增强 */
}
</style>