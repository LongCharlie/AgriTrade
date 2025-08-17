<template>
  <div class="expert-detail-container">
    <!-- 返回按钮 -->
    <el-button @click="$router.back()" icon="ArrowLeftBold" plain style="background-color: #4C9148; color: #eeeeee">返回</el-button>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 专家信息 -->
    <div v-else-if="expert" class="expert-info">
      <h2>{{ expert.real_name }} 的详情</h2>

      <el-card shadow="hover" class="expert-card">
        <div class="expert-avatar">
          <el-avatar :src="getAvatarUrl(expert.avatar_url)" :size="100" />
        </div>

        <div class="expert-details">
          <p><strong>姓名：</strong>{{ expert.real_name }}</p>
          <p><strong>手机号：</strong>{{ expert.phone || '暂无' }}</p>
          <p><strong>地址：</strong>{{ expert.province }}, {{ expert.city }}, {{ expert.district }}</p>
          <p><strong>职称：</strong>{{ expert.title || '暂无' }}</p>
          <p><strong>所属机构：</strong>{{ expert.institution || '暂无' }}</p>
          <p><strong>专业领域：</strong>{{ expert.expertise || '暂无' }}</p>
          <p><strong>回答数：</strong>{{ expert.answer_count || 0 }}</p>
          <p><strong>专家排名：</strong>{{ expert.expert_rank || '暂无' }}</p>
          <p><strong>个人简介：</strong></p>
          <p class="bio">{{ expert.bio || '暂无简介' }}</p>
          <p><strong>所获证书：</strong></p>
          <el-card shadow="hover" class="certificate-card">
            <div class="certificate-details">
              <p><strong>证书名称：</strong>{{ expert.certificate_name || '暂无' }}</p>
              <p><strong>发证机构：</strong>{{ expert.authorizing_unit || '暂无' }}</p>
              <img v-if="expert.certificate_image" :src="getCertificateImageUrl(expert.certificate_image)" alt="证书图片" class="certificate-image">
            </div>
          </el-card>
        </div>
      </el-card>
    </div>

    <!-- 错误提示 -->
    <div v-else class="no-data">未找到该专家的信息</div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import axios from "axios";

export default {
  data() {
    return {
      expert: null,
      loading: true
    };
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  created() {
    this.fetchExpert();
  },
  methods: {
    async fetchExpert() {
      const expertId = Number(this.$route.params.id);
      try {
        const res = await axios.get(`http://localhost:3000/api/experts/${expertId}`);
        this.expert = res.data;
        console.log('专家详情:', this.expert);
        console.log('头像URL:', this.expert.avatar_url);
      } catch (error) {
        console.error('获取专家详情失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 获取头像完整URL
    getAvatarUrl(avatarUrl) {
      // 如果没有头像，返回默认头像
      if (!avatarUrl) {
        return require('@/assets/profile.jpg'); // 使用默认头像
      }

      // 如果已经是完整URL，直接返回
      if (avatarUrl.startsWith('http')) {
        return avatarUrl;
      }

      // 构建完整URL - 头像存储在 /uploads/avatars/ 目录下
      if (avatarUrl.startsWith('/')) {
        return `http://localhost:3000${avatarUrl}`;
      } else {
        return `http://localhost:3000/uploads/avatars/${avatarUrl}`;
      }
    },

    // 获取证书图片完整URL
    getCertificateImageUrl(certificateImage) {
      if (!certificateImage) return '';

      // 如果已经是完整URL，直接返回
      if (certificateImage.startsWith('http')) {
        return certificateImage;
      }

      // 构建完整URL - 证书图片存储在 /uploads/certificates/ 目录下
      if (certificateImage.startsWith('/')) {
        return `http://localhost:3000${certificateImage}`;
      } else {
        return `http://localhost:3000/uploads/certificates/${certificateImage}`;
      }
    }
  }
};
</script>

<style scoped>
.expert-detail-container {
  padding: 20px;
}

.expert-card {
  margin-top: 20px;
  padding: 20px;
}

.expert-avatar {
  text-align: center;
  margin-bottom: 20px;
}

.expert-details p {
  font-size: 16px;
  margin: 8px 0;
}

.bio {
  white-space: pre-wrap;
  color: #555;
}

.no-data {
  text-align: center;
  margin-top: 40px;
  color: #999;
}

.loading {
  text-align: center;
  margin-top: 40px;
  color: #666;
}

.certificate-card {
  margin-top: 10px;
}

.certificate-image {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.certificate-details p {
  margin: 5px 0;
}
</style>
