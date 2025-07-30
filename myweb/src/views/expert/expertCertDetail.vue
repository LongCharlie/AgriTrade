<template>
  <div class="cert-detail-container">
    <el-button @click="$router.back()" icon="ArrowLeftBold" style="background-color: #4C9148; color: #eeeeee">返回</el-button>

    <h2>证书详情</h2>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="certificate" class="cert-info">
      <el-card shadow="hover">
        <div class="cert-header">
          <span class="cert-title">{{ certificate.certificate_name }}</span>
          <el-tag :type="getTagType(certificate.is_audited)">
            {{ getAuditStatusText(certificate.is_audited) }}
          </el-tag>
        </div>

        <div class="cert-body">
          <p><strong>授权单位：</strong>{{ certificate.authorizing_unit }}</p>
          <p><strong>获得时间：</strong>{{ certificate.obtain_time }}</p>
          <p><strong>等级：</strong>{{ certificate.level }}</p>
          <p><strong>有效期：</strong>{{ certificate.valid_period }} 年</p>
          <p><strong>描述：</strong>{{ certificate.description || '暂无描述' }}</p>
          <!-- 证书图片展示 -->
          <div v-if="certificate.certificate_image" class="certificate-image-section">
            <p><strong>证书图片：</strong></p>
            <div class="image-container">
              <img
                  :src="getImageUrl(certificate.certificate_image)"
                  :alt="certificate.certificate_name"
                  class="certificate-image"
              />
            </div>
          </div>
          <div v-else class="no-image">
            <p><strong>证书图片：</strong>暂无图片</p>
          </div>
        </div>
      </el-card>
    </div>

    <div v-else class="no-data">未找到该证书信息</div>
  </div>
</template>

<script>
//import { getCertificateById } from '@/views/expert/expertApi';
import axios from "axios";
import {useUserStore} from "@/stores/user";

export default {
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    };
  },
  data() {
    return {
      certificate: null,
      loading: true
    };
  },
  created() {
    this.fetchCertificate();
  },
  methods: {
    async fetchCertificate() {
      try {
        // mock 数据
        // const mockData = [
        //   {
        //     certificate_id: 1,
        //     obtain_time: '2020-05-15',
        //     level: 3,
        //     valid_period: 5,
        //     authorizing_unit: '中国农业协会',
        //     description: '高级农业技术专家认证',
        //     status: 'valid'
        //   },
        //   {
        //     certificate_id: 2,
        //     obtain_time: '2018-10-20',
        //     level: 4,
        //     valid_period: 10,
        //     authorizing_unit: '农业农村部',
        //     description: '作物栽培与管理专家资格证',
        //     status: 'expired'
        //   },
        //   {
        //     certificate_id: 3,
        //     obtain_time: '2021-03-12',
        //     level: 2,
        //     valid_period: 5,
        //     authorizing_unit: '国家农科院',
        //     description: '植物病虫害防治专业认证',
        //     status: 'valid'
        //   },
        //   {
        //     certificate_id: 4,
        //     obtain_time: '2019-07-01',
        //     level: 5,
        //     valid_period: 3,
        //     authorizing_unit: '国际农业合作组织',
        //     description: '有机农业国际认证',
        //     status: 'valid'
        //   },
        //   {
        //     certificate_id: 5,
        //     obtain_time: '2022-01-10',
        //     level: 1,
        //     valid_period: 2,
        //     authorizing_unit: '中国农业大学',
        //     description: '农业可持续发展研究认证',
        //     status: 'valid'
        //   }
        // ];
        //const res = mockData.find(cert => cert.certificate_id === Number(id));

        //改
        const id = this.$route.params.id;
        const token = this.userStore.token;
        const response = await axios.get(`http://localhost:3000/api/certificates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.certificate = response.data;
      } catch (error) {
        console.error('获取证书详情失败:', error);
        this.certificate = null;
      } finally {
        this.loading = false;
      }
    },
    getAuditStatusText(is_audited) {
      const auditstatusMap = {
        'pending': '审核中',
        'approved': '审核通过',
        'rejected': '审核未通过'
      };
      return auditstatusMap[is_audited] || '未知状态';
    },
    getTagType(is_audited) {
      const typeMap = {
        'pending': 'warning',
        'approved': 'success',
        'rejected': 'danger'
      };
      return typeMap[is_audited] || 'info';
    },
    //改
    getImageUrl(imagePath) {
      // 如果已经是完整URL，直接返回
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      // 如果是相对路径，拼接完整URL
      if (imagePath.startsWith('/')) {
        return `http://localhost:3000${imagePath}`;
      }
      // 否则添加路径前缀
      return `http://localhost:3000/uploads/certificates/${imagePath}`;
    },
  }
};
</script>

<style scoped>
.cert-detail-container {
  padding: 20px;
}

.cert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.cert-title {
  font-size: 20px;
  font-weight: bold;
}

.cert-body p {
  font-size: 16px;
  margin: 10px 0;
}

.no-data {
  text-align: center;
  color: #999;
  margin-top: 40px;
}

.certificate-image-section {
  margin-top: 20px;
}

.certificate-image-section p {
  margin-bottom: 10px;
}

.image-container {
  text-align: center;
  margin-top: 10px;
}

.certificate-image {
  max-width: 100%;
  max-height: 400px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.no-image {
  margin-top: 20px;
  color: #999;
}
</style>
