<template>
  <div class="expert-profile-container">
    <!--    <el-card class="profile-card">-->
    <div slot="header">
      <h3>个人信息</h3>
    </div>

    <!-- 用户信息 -->
    <div class="user-info">
      <!-- 头像显示 -->
      <div class="avatar-container">
        <!--        <img v-if="user.avatar_url" :src="user.avatar_url" class="avatar" alt="用户头像" id="userAvatar" />-->
        <el-button class="btn-change-avatar" @click="handleAvatarClick">更换头像</el-button>
        <input type="file" ref="avatarUpload" accept="image/*" style="display: none;" @change="handleAvatarChange" />
      </div>
      <p><strong>用户名：</strong>{{ user.username }}</p>
      <p><strong>手机号：</strong>{{ user.phone }}</p>
      <p><strong>地址：</strong>{{ user.province }} {{ user.city }} {{ user.district }}</p>
      <p v-if="user.address_detail"><strong>详细地址：</strong>{{ user.address_detail }}</p>
    </div>

    <!-- 专家信息表单 -->
    <el-form ref="form" :model="user" label-width="100px" @submit.prevent="submitExpertInfo">
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

      <el-button type="primary" native-type="submit">保存修改</el-button>
    </el-form>
  </div>
</template>

<script>
// import {
//   getExpertById,
//   getMyCertificates,
//   uploadCertificate as uploadCertApi,
//   updateExpertProfile
// } from '@/views/expert/expertApi';
import axios from "axios";
import { ElMessage } from 'element-plus';
import { useUserStore } from '../../stores/user';

export default {
  setup() {
    const userStore = useUserStore();
    const token = userStore.token;
    const uploadUrl = 'http://localhost:3000/api/user/avatar';

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
          const newAvatarUrl = "http://localhost:3000/uploads/avatars/" + result.avatarUrl; // 计算新头像 URL

          // 更新用户信息中的头像 URL，确保是响应式的
          user.value.avatar_url = newAvatarUrl; // 更新 local state user
          userStore.avatar_url = newAvatarUrl; // 更新 Pinia 中的用户信息，确保状态一致

          ElMessage.success('头像上传成功');
          location.reload(); // 刷新页面
        } else {
          throw new Error('上传失败');
        }
      } catch (error) {
        console.error('头像上传失败:', error);
        ElMessage.error(`头像上传失败: ${error.message}`);
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

    return { userStore, token, uploadUrl, handleAvatarChange, handleAvatarClick, beforeAvatarUpload };
  },
  data() {
    return {
      user: {},
      expert: {},
      certificates: []
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        // 获取用户信息
        const token = this.userStore.token;
        console.log('Token:', 111);
        const response = await axios.get('http://localhost:3000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.user = response.data;
        console.log('加载个人信息成功');

        // 获取专家信息
        // const expertDetails = await getExpertById(userId);
        // this.expert = {
        //   realName: expertDetails.real_name,
        //   title: expertDetails.title || '',
        //   institution: expertDetails.institution || '',
        //   expertise: expertDetails.expertise || '',
        //   bio: expertDetails.bio || ''
        // };

        // 获取证书
        // this.certificates = await getMyCertificates();
      } catch (error) {
        console.error('加载个人信息失败:', error);
        this.$message.error('加载数据失败，请刷新重试');
      }
    },

    async submitExpertInfo() {
      try {
        const token = this.userStore.token;
        console.log('Token:', token);

        const payload = {
          real_name: this.expert.real_name,
          title: this.expert.title,
          institution: this.expert.institution,
          expertise: this.expert.expertise,
          bio: this.expert.bio
        };
        const response = await axios.patch('http://localhost:3000/api/expert/profile', payload,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.$message.success('信息更新成功');
        this.initData();
      } catch (error) {
        console.error('更新专家信息失败:', error);
        this.$message.error('更新失败，请稍后再试');
      }
    },

  }
};
</script>

<style scoped>
.expert-profile-container {
  padding: 20px;
}
.profile-card {
  //max-width: 800px;
  //margin: auto;
}
.user-info {
  margin-bottom: 20px;
}
.certificates-section {
  margin-top: 30px;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid #D0D0D0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
.avatar-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.avatar-container {
  display: flex;
  align-items: center;
  gap: 15px; /* Add some gap between avatar and button */
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
