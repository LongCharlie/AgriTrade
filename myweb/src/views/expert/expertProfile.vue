<template>
  <div class="expert-profile-container">
<!--    <el-card class="profile-card">-->
      <div slot="header">
        <h3>个人信息</h3>
      </div>

      <!-- 用户信息 -->
      <div class="user-info">
        <div class="avatar-container">
          <img v-if="user.avatar_url" :src="user.avatar_url" class="avatar" alt="用户头像" />
          <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-change="handleAvatarChange"
              :before-upload="beforeAvatarUpload"
              :headers="{ Authorization: `Bearer ${token}` }"
              name="avatar"
          >
            <el-button type="primary">上传头像</el-button>
          </el-upload>
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
    const uploadUrl = 'http://localhost:3000/api/upload';

    // 处理头像上传
    const handleAvatarChange = async (file) => {
      // 上传成功直接更新头像 URL
      if (file.status === 'success' && file.response && file.response.avatarUrl) {
        const avatarUrl = file.response.avatarUrl; // 从响应中获取头像 URL
        user.value.avatar_url = avatarUrl; // 更新用户信息中的头像 URL
        // 更新 Pinia 中的用户信息
        userStore.avatar_url = avatarUrl;
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

    return { userStore, token, uploadUrl, handleAvatarChange, beforeAvatarUpload };
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
</style>
