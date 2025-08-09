<template>
  <div class="expert-profile-container">
    <el-card class="profile-card">
      <div slot="header">
        <h3>个人信息</h3>
      </div>

      <!-- 用户信息 -->
      <div class="user-info">
        <!-- 头像显示 -->
        <div class="avatar-container">
          <el-button class="btn-change-avatar" @click="handleAvatarClick">更换头像</el-button>
          <input type="file" ref="avatarUpload" accept="image/*" style="display: none;" @change="handleAvatarChange" />
        </div>
        <p><strong>用户名：</strong>{{ user.username }}</p>
        <p><strong>手机号：</strong>{{ user.phone }}</p>
        <p><strong>地址：</strong>{{ user.province }} {{ user.city }} {{ user.district }}</p>
        <p v-if="user.address_detail"><strong>详细地址：</strong>{{ user.address_detail }}</p>
      </div>

      <!-- 专家信息表单 -->
      <el-form :model="user" label-width="100px" @submit.prevent="submitExpertInfo">
        <el-form-item label="真实姓名">
          <el-input v-model="user.real_name" placeholder="请输入真实姓名"></el-input>
        </el-form-item>

        <el-form-item label="职称">
          <el-input v-model="user.title" placeholder="请输入职称"></el-input>
        </el-form-item>

        <el-form-item label="所属机构">
          <el-input v-model="user.institution" placeholder="请输入机构名称"></el-input>
        </el-form-item>

        <el-form-item label="专业领域">
          <el-input v-model="user.expertise" placeholder="请输入专业领域"></el-input>
        </el-form-item>

        <el-form-item label="回答数">
          <el-input v-model="user.answer_count" disabled></el-input>
        </el-form-item>

        <el-form-item label="专家排名">
          <el-input v-model="user.expert_rank" disabled></el-input>
        </el-form-item>

        <el-form-item label="个人简介">
          <el-input type="textarea" v-model="user.bio" placeholder="请填写个人简介"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitExpertInfo">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const userStore = useUserStore();
const user = ref({
  id: null,
  username: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  address_detail: '',
  avatar_url: '',
  real_name: '',
  title: '',
  institution: '',
  expertise: '',
  answer_count: 0,
  expert_rank: 0,
  bio: ''
});

const token = userStore.token;
const uploadUrl = 'http://localhost:3000/api/user/avatar';

// 打开文件选择对话框
const handleAvatarClick = () => {
  const avatarUpload = document.querySelector('input[type=file]');
  avatarUpload.click();
};

// 处理头像上传
const handleAvatarChange = async (event) => {
  const file = event.target.files[0];

  if (!file) return;

  // 文件大小限制
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('头像大小不能超过5MB');
    return;
  }

  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片格式的文件!');
    return;
  }

  // 使用 fetch API 上传头像
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '上传失败');
    }

    const result = await response.json();
    if (result && result.avatarUrl) {
      const newAvatarUrl = "http://localhost:3000/uploads/avatars/" + result.avatarUrl;

      // 更新用户信息中的头像 URL
      user.value.avatar_url = newAvatarUrl;
      userStore.avatar_url = newAvatarUrl;

      ElMessage.success('头像上传成功');
      location.reload();
    } else {
      throw new Error('上传失败');
    }
  } catch (error) {
    console.error('头像上传失败:', error);
    ElMessage.error(`头像上传失败: ${error.message}`);
  }
};

// 初始化数据 - 全部从 userStore 获取
const initData = () => {
  // 从 userStore 获取所有用户和专家信息
  user.value.id = userStore.userId;
  user.value.username = userStore.username;
  user.value.phone = userStore.phone;
  user.value.province = userStore.province;
  user.value.city = userStore.city;
  user.value.district = userStore.district;
  user.value.address_detail = userStore.address_detail;
  user.value.avatar_url = userStore.avatar_url;

  // 专家信息
  user.value.real_name = userStore.real_name || '';
  user.value.title = userStore.title || '';
  user.value.institution = userStore.institution || '';
  user.value.expertise = userStore.expertise || '';
  user.value.answer_count = userStore.answer_count || 0;
  user.value.expert_rank = userStore.expert_rank || 0;
  user.value.bio = userStore.bio || '';
};

// 提交专家信息
const submitExpertInfo = async () => {
  try {
    const payload = {
      real_name: user.value.real_name,
      title: user.value.title,
      institution: user.value.institution,
      expertise: user.value.expertise,
      bio: user.value.bio
    };

    const response = await axios.patch('http://localhost:3000/api/expert/profile', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // 更新 userStore 中的专家信息
    userStore.real_name = user.value.real_name;
    userStore.title = user.value.title;
    userStore.institution = user.value.institution;
    userStore.expertise = user.value.expertise;
    userStore.bio = user.value.bio;

    ElMessage.success('信息更新成功');
  } catch (error) {
    console.error('更新专家信息失败:', error);
    ElMessage.error('更新失败，请稍后再试');
  }
};

onMounted(() => {
  initData();
});
</script>

<style scoped>
.expert-profile-container {
  padding: 20px;
}

.profile-card {
  width: 100%;
  margin: auto;
}

.user-info {
  margin-bottom: 20px;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.btn-change-avatar {
  background: #2196F3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-change-avatar:hover {
  background: #0b7dda;
}
</style>
