<!--<template>-->
<!--  <div class="expert-detail-container">-->
<!--    &lt;!&ndash; 返回按钮 &ndash;&gt;-->
<!--    <el-button @click="$router.back()" icon="ArrowLeftBold" plain style="background-color: #4C9148; color: #eeeeee">返回</el-button>-->

<!--    &lt;!&ndash; 加载状态 &ndash;&gt;-->
<!--    <div v-if="loading" class="loading">加载中...</div>-->

<!--    &lt;!&ndash; 专家信息 &ndash;&gt;-->
<!--    <div v-else-if="expert" class="expert-info">-->
<!--      <h2>{{ expert.real_name }} 的详情</h2>-->

<!--      <el-card shadow="hover" class="expert-card">-->
<!--        <div class="expert-avatar">-->
<!--          <el-avatar :src="getAvatarUrl(expert.avatar_url)" :size="100" />-->
<!--        </div>-->

<!--        <div class="expert-details">-->
<!--          <p><strong>姓名：</strong>{{ expert.real_name }}</p>-->
<!--          <p><strong>手机号：</strong>{{ expert.phone || '暂无' }}</p>-->
<!--          <p><strong>地址：</strong>{{ expert.province }}, {{ expert.city }}, {{ expert.district }}</p>-->
<!--          <p><strong>职称：</strong>{{ expert.title || '暂无' }}</p>-->
<!--          <p><strong>所属机构：</strong>{{ expert.institution || '暂无' }}</p>-->
<!--          <p><strong>专业领域：</strong>{{ expert.expertise || '暂无' }}</p>-->
<!--          <p><strong>回答数：</strong>{{ expert.answer_count || 0 }}</p>-->
<!--          <p><strong>专家排名：</strong>{{ expert.expert_rank || '暂无' }}</p>-->
<!--          <p><strong>个人简介：</strong></p>-->
<!--          <p class="bio">{{ expert.bio || '暂无简介' }}</p>-->

<!--          &lt;!&ndash; 证书列表 &ndash;&gt;-->
<!--          <p><strong>所获证书：</strong></p>-->
<!--          <div v-if="certificates.length > 0">-->
<!--            <el-card-->
<!--                v-for="certificate in certificates"-->
<!--                :key="certificate.certificate_id"-->
<!--                shadow="hover"-->
<!--                class="certificate-card"-->
<!--            >-->
<!--              <div class="certificate-details" @click="viewCertificateDetail(certificate.certificate_id)">-->
<!--                <p><strong>证书名称：</strong>{{ certificate.certificate_name || '暂无' }}</p>-->
<!--                <p><strong>发证机构：</strong>{{ certificate.authorizing_unit || '暂无' }}</p>-->
<!--                <p><strong>获得时间：</strong>{{ formatDate(certificate.obtain_time) || '暂无' }}</p>-->
<!--&lt;!&ndash;                <img&ndash;&gt;-->
<!--&lt;!&ndash;                    v-if="certificate.image_url"&ndash;&gt;-->
<!--&lt;!&ndash;                    :src="certificate.image_url"&ndash;&gt;-->
<!--&lt;!&ndash;                    alt="证书图片"&ndash;&gt;-->
<!--&lt;!&ndash;                    class="certificate-image"&ndash;&gt;-->
<!--&lt;!&ndash;                    @error="handleImageError"&ndash;&gt;-->
<!--&lt;!&ndash;                >&ndash;&gt;-->
<!--&lt;!&ndash;                <p v-else>暂无证书图片</p>&ndash;&gt;-->
<!--              </div>-->
<!--            </el-card>-->
<!--          </div>-->
<!--          <p v-else>暂无证书</p>-->
<!--        </div>-->
<!--      </el-card>-->
<!--    </div>-->

<!--    &lt;!&ndash; 错误提示 &ndash;&gt;-->
<!--    <div v-else class="no-data">未找到该专家的信息</div>-->
<!--  </div>-->
<!--  -->
<!--</template>-->

<!--<script>-->
<!--import { useUserStore } from '@/stores/user';-->
<!--import axios from "axios";-->

<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      expert: null,-->
<!--      certificates: [],-->
<!--      loading: true-->
<!--    };-->
<!--  },-->
<!--  setup() {-->
<!--    const userStore = useUserStore();-->
<!--    return { userStore };-->
<!--  },-->
<!--  created() {-->
<!--    this.fetchExpert();-->
<!--    this.fetchCertificates();-->
<!--  },-->
<!--  methods: {-->
<!--    async fetchExpert() {-->
<!--      const expertId = Number(this.$route.params.id);-->
<!--      try {-->
<!--        const res = await axios.get(`http://localhost:3000/api/experts/${expertId}`);-->
<!--        this.expert = res.data;-->
<!--        console.log('专家详情:', this.expert);-->
<!--        console.log('头像URL:', this.expert.avatar_url);-->
<!--      } catch (error) {-->
<!--        console.error('获取专家详情失败:', error);-->
<!--      } finally {-->
<!--        this.loading = false;-->
<!--      }-->
<!--    },-->

<!--    async fetchCertificates() {-->
<!--      const expertId = Number(this.$route.params.id);-->
<!--      try {-->
<!--        const res = await axios.get(`http://localhost:3000/api/certificates/expert/${expertId}`);-->
<!--        this.certificates = res.data.certificates || [];-->
<!--        console.log('专家证书:', this.certificates);-->
<!--      } catch (error) {-->
<!--        console.error('获取专家证书失败:', error);-->
<!--        this.certificates = [];-->
<!--      }-->
<!--    },-->

<!--    formatDate(dateString) {-->
<!--      if (!dateString) return '';-->
<!--      return new Date(dateString).toLocaleDateString();-->
<!--    },-->

<!--    // 获取头像完整URL-->
<!--    getAvatarUrl(avatarUrl) {-->
<!--      // 如果没有头像，返回默认头像-->
<!--      if (!avatarUrl) {-->
<!--        return require('@/assets/profile.jpg'); // 使用默认头像-->
<!--      }-->

<!--      // 如果已经是完整URL，直接返回-->
<!--      if (avatarUrl.startsWith('http')) {-->
<!--        return avatarUrl;-->
<!--      }-->

<!--      // 构建完整URL - 头像存储在 /uploads/avatars/ 目录下-->
<!--      if (avatarUrl.startsWith('/')) {-->
<!--        return `http://localhost:3000${avatarUrl}`;-->
<!--      } else {-->
<!--        return `http://localhost:3000/uploads/avatars/${avatarUrl}`;-->
<!--      }-->
<!--    },-->

<!--    // 处理图片加载错误-->
<!--    handleImageError(event) {-->
<!--      event.target.src = require('@/assets/profile.jpg');-->
<!--    },-->

<!--    viewCertificateDetail(certificate_id) {-->
<!--      this.$router.push(`/expert/cert/detail/${certificate_id}`);-->
<!--    },-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.expert-detail-container {-->
<!--  padding: 20px;-->
<!--}-->

<!--.expert-card {-->
<!--  margin-top: 20px;-->
<!--  padding: 20px;-->
<!--}-->

<!--.expert-avatar {-->
<!--  text-align: center;-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.expert-details p {-->
<!--  font-size: 16px;-->
<!--  margin: 8px 0;-->
<!--}-->

<!--.bio {-->
<!--  white-space: pre-wrap;-->
<!--  color: #555;-->
<!--}-->

<!--.no-data {-->
<!--  text-align: center;-->
<!--  margin-top: 40px;-->
<!--  color: #999;-->
<!--}-->

<!--.loading {-->
<!--  text-align: center;-->
<!--  margin-top: 40px;-->
<!--  color: #666;-->
<!--}-->

<!--.certificate-card {-->
<!--  margin-top: 10px;-->
<!--}-->

<!--.certificate-image {-->
<!--  max-width: 100%;-->
<!--  height: auto;-->
<!--  margin-top: 10px;-->
<!--  border: 1px solid #eee;-->
<!--  border-radius: 4px;-->
<!--}-->

<!--.certificate-details p {-->
<!--  margin: 5px 0;-->
<!--}-->
<!--</style>-->
<template>
  <div class="expert-detail-container">
<!--    &lt;!&ndash; 返回按钮 &ndash;&gt;-->
<!--    <el-button @click="$router.back()" icon="ArrowLeftBold" plain style="background-color: #4C9148; color: #eeeeee">返回</el-button>-->

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
<!--          <p><strong>专家排名：</strong>{{ expert.expert_rank || '暂无' }}</p>-->
          <p><strong>个人简介：</strong></p>
          <p class="bio">{{ expert.bio || '暂无简介' }}</p>

          <!-- 证书列表 -->
          <p><strong>所获证书：</strong></p>
          <div v-if="certificates.length > 0">
            <el-card
                v-for="certificate in certificates"
                :key="certificate.certificate_id"
                shadow="hover"
                class="certificate-card"
            >
              <div class="certificate-details" @click="viewCertificateDetail(certificate)">
                <p><strong>证书名称：</strong>{{ certificate.certificate_name || '暂无' }}</p>
                <p><strong>发证机构：</strong>{{ certificate.authorizing_unit || '暂无' }}</p>
                <p><strong>获得时间：</strong>{{ formatDate(certificate.obtain_time) || '暂无' }}</p>
              </div>
            </el-card>
          </div>
          <p v-else>暂无证书</p>
        </div>
      </el-card>
    </div>

    <!-- 错误提示 -->
    <div v-else class="no-data">未找到该专家的信息</div>

    <!-- 证书详情弹窗 -->
    <el-dialog
        v-model="certificateDialogVisible"
        :title="selectedCertificate?.certificate_name || '证书详情'"
        width="600px"
        center
    >
      <div v-if="selectedCertificate" class="certificate-detail-dialog">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="certificate-info-item">
              <label>证书名称：</label>
              <span>{{ selectedCertificate.certificate_name || '暂无' }}</span>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="certificate-info-item">
              <label>发证机构：</label>
              <span>{{ selectedCertificate.authorizing_unit || '暂无' }}</span>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="certificate-info-item">
              <label>获得时间：</label>
              <span>{{ formatDate(selectedCertificate.obtain_time) || '暂无' }}</span>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="certificate-info-item">
              <label>证书等级：</label>
              <span>{{ selectedCertificate.level || '暂无' }}</span>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="certificate-info-item">
              <label>有效期限：</label>
              <span>{{ selectedCertificate.valid_period || '暂无' }}</span>
            </div>
          </el-col>

          <el-col :span="24">
            <div class="certificate-info-item">
              <label>证书描述：</label>
              <span>{{ selectedCertificate.description || '暂无' }}</span>
            </div>
          </el-col>

          <el-col :span="24" v-if="selectedCertificate.image_url">
            <div class="certificate-image-container">
              <label>证书图片：</label>
              <el-image
                  :src="`http://localhost:3000${selectedCertificate.image_url}`"
                  :preview-src-list="[`http://localhost:3000${selectedCertificate.image_url}`]"
                  class="certificate-detail-image"
                  fit="scale-down"
                  lazy
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                  <p>图片加载失败</p>
                </div>
              </el-image>
            </div>
          </el-col>

          <el-col :span="24" v-else>
            <div class="certificate-image-container">
              <label>证书图片：</label>
              <div class="no-image-placeholder">
                <i class="el-icon-picture-outline"></i>
                <p>暂无证书图片</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="certificateDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import axios from "axios";

export default {
  data() {
    return {
      expert: null,
      certificates: [],
      loading: true,
      certificateDialogVisible: false,
      selectedCertificate: null
    };
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  created() {
    this.fetchExpert();
    this.fetchCertificates();
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

    async fetchCertificates() {
      const expertId = Number(this.$route.params.id);
      try {
        const res = await axios.get(`http://localhost:3000/api/certificates/expert/${expertId}`);
        this.certificates = res.data.certificates || [];
        console.log('专家证书:', this.certificates);
      } catch (error) {
        console.error('获取专家证书失败:', error);
        this.certificates = [];
      }
    },

    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
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

    // 处理图片加载错误
    handleImageError(event) {
      event.target.src = require('@/assets/profile.jpg');
    },

    viewCertificateDetail(certificate) {
      this.selectedCertificate = certificate;
      this.certificateDialogVisible = true;
    },
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
  cursor: pointer;
  transition: all 0.3s ease;
}

.certificate-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.certificate-details p {
  margin: 5px 0;
}

.certificate-detail-dialog {
  padding: 20px 0;
}

.certificate-info-item {
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
}

.certificate-info-item label {
  font-weight: bold;
  width: 100px;
  color: #333;
}

.certificate-info-item span {
  flex: 1;
  color: #666;
}

.certificate-image-container {
  margin-top: 15px;
}

.certificate-image-container label {
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
  color: #333;
}

.certificate-detail-image {
  width: 100%;
  max-height: 800px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.image-slot, .no-image-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: #f5f7fa;
  color: #909399;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
}

.image-slot i, .no-image-placeholder i {
  font-size: 32px;
  margin-bottom: 8px;
}

.dialog-footer {
  text-align: center;
}

@media (max-width: 768px) {
  .certificate-info-item label {
    width: 80px;
  }
}
</style>
