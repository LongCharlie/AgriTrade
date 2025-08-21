<template>
  <div class="expert-profile-container">
    <el-card class="profile-card">
      <div slot="header">
        <h3>我的主页</h3>
      </div>

      <!-- 头像显示 -->
      <div class="avatar-container">
<!--        <img v-if="user.avatar_url" :src="user.avatar_url" class="avatar" alt="用户头像" id="userAvatar" />-->
        <el-button class="btn-change-avatar" @click="handleAvatarClick">更换头像</el-button>
        <input type="file" ref="avatarUpload" accept="image/*" style="display: none;" @change="handleAvatarChange" />
      </div>

      <!-- 用户信息 -->
      <el-form :model="user" label-width="80px" style="margin-top: 20px;">
        <!-- ID（不可编辑） -->
        <el-form-item label="ID">
          <el-input v-model="user.id" disabled></el-input>
        </el-form-item>

        <!-- 用户名 -->
        <el-form-item label="用户名">
          <el-input v-model="user.username" disabled></el-input>
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

        <!-- 专家信息 -->
        <el-form-item label="真实姓名">
          <el-input v-model="user.real_name" placeholder="请输入真实姓名" disabled></el-input>
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

        <el-form-item label="回答数量">
          <el-input v-model="user.answer_count" disabled></el-input>
        </el-form-item>

<!--        <el-form-item label="专家排名">-->
<!--          <el-input v-model="user.expert_rank" disabled></el-input>-->
<!--        </el-form-item>-->

        <el-form-item label="个人简介">
          <el-input type="textarea" v-model="user.bio" placeholder="请填写个人简介"></el-input>
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
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { pcaTextArr } from 'element-china-area-data';

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
  bio: '',
  answer_count: 0,
  expert_rank: 0
});

const selectedLocation = ref([]);
const token = userStore.token;
const uploadUrl = 'http://localhost:3000/api/user/avatar';

onMounted(() => {
  user.value.id = userStore.userId;
  user.value.username = userStore.username;
  user.value.phone = userStore.phone;
  user.value.province = userStore.province;
  user.value.city = userStore.city;
  user.value.district = userStore.district;
  user.value.address_detail = userStore.address_detail;
  user.value.avatar_url = userStore.avatar_url;
  user.value.real_name = userStore.real_name || '';
  user.value.title = userStore.title || '';
  user.value.institution = userStore.institution || '';
  user.value.expertise = userStore.expertise || '';
  user.value.bio = userStore.bio || '';
  user.value.answer_count = userStore.answer_count || 0;
  user.value.expert_rank = userStore.expert_rank || 0;

  selectedLocation.value = user.value.id ? [user.value.province, user.value.city, user.value.district] : [];
});

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
// 保存数据 - 拆分为两个独立请求
const saveProfile = async () => {
  try {
    // 1. 先更新基础信息
    await axios.patch('http://localhost:3000/api/user/profile', {
      phone: user.value.phone,
      province: user.value.province,
      city: user.value.city,
      district: user.value.district,
      address_detail: user.value.address_detail,
      avatar_url: user.value.avatar_url
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // 2. 如果是专家，再更新专家信息
    if (userStore.role === 'expert') {
      await axios.patch('http://localhost:3000/api/expert/profile', {
        real_name: user.value.real_name,
        title: user.value.title,
        institution: user.value.institution,
        expertise: user.value.expertise,
        bio: user.value.bio
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }

    // 更新 Pinia 存储
    userStore.$patch({
      phone: user.value.phone,
      province: user.value.province,
      city: user.value.city,
      district: user.value.district,
      address_detail: user.value.address_detail,
      ...(userStore.role === 'expert' ? {
        real_name: user.value.real_name,
        title: user.value.title,
        institution: user.value.institution,
        expertise: user.value.expertise,
        bio: user.value.bio
      } : {})
    });

    ElMessage.success('保存成功');
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error(error.response?.data?.error || '保存失败，请重试');
  }
};
</script>

<style scoped>
.expert-profile-container {
  padding: 20px;
}
.profile-card {
  max-width: 800px;
  margin: auto;
}
.avatar-container {
  display: flex;
  align-items: center;
  gap: 15px;
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