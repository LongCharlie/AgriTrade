<template>
  <div class="cert-detail-container">
    <el-button @click="$router.back()" icon="el-icon-arrow-left">返回</el-button>

    <h2>证书详情</h2>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="certificate" class="cert-info">
      <el-card shadow="hover">
        <div class="cert-header">
          <span class="cert-title">{{ certificate.authorizingUnit }}</span>
          <el-tag :type="certificate.status === 'valid' ? 'success' : 'danger'">
            {{ certificate.status === 'valid' ? '有效' : '过期' }}
          </el-tag>
        </div>

        <div class="cert-body">
          <p><strong>获得时间：</strong>{{ certificate.obtainTime }}</p>
          <p><strong>等级：</strong>{{ certificate.level }}</p>
          <p><strong>有效期：</strong>{{ certificate.validPeriod }} 年</p>
          <p><strong>授权单位：</strong>{{ certificate.authorizingUnit }}</p>
          <p><strong>描述：</strong>{{ certificate.description || '暂无描述' }}</p>
        </div>
      </el-card>
    </div>

    <div v-else class="no-data">未找到该证书信息</div>
  </div>
</template>

<script>
import { getCertificateById } from '@/views/expert/expertApi';

export default {
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
      const id = this.$route.params.id;

      try {
        // mock 数据
        const mockData = [
          {
            certificate_id: 1,
            obtain_time: '2020-05-15',
            level: 3,
            valid_period: 5,
            authorizing_unit: '中国农业协会',
            description: '高级农业技术专家认证',
            status: 'valid'
          },
          {
            certificate_id: 2,
            obtain_time: '2018-10-20',
            level: 4,
            valid_period: 10,
            authorizing_unit: '农业农村部',
            description: '作物栽培与管理专家资格证',
            status: 'expired'
          },
          {
            certificate_id: 3,
            obtain_time: '2021-03-12',
            level: 2,
            valid_period: 5,
            authorizing_unit: '国家农科院',
            description: '植物病虫害防治专业认证',
            status: 'valid'
          },
          {
            certificate_id: 4,
            obtain_time: '2019-07-01',
            level: 5,
            valid_period: 3,
            authorizing_unit: '国际农业合作组织',
            description: '有机农业国际认证',
            status: 'valid'
          },
          {
            certificate_id: 5,
            obtain_time: '2022-01-10',
            level: 1,
            valid_period: 2,
            authorizing_unit: '中国农业大学',
            description: '农业可持续发展研究认证',
            status: 'valid'
          }
        ];

        // const res = await getCertificateById(id);
        const res = mockData.find(cert => cert.certificate_id === Number(id));

        if (res) {
          this.certificate = {
            certificateId: res.certificate_id,
            obtainTime: res.obtain_time,
            level: res.level,
            validPeriod: res.valid_period,
            authorizingUnit: res.authorizing_unit,
            description: res.description,
            status: res.status
          };
        } else {
          this.certificate = null;
        }
      } catch (error) {
        console.error('获取证书详情失败:', error);
        this.certificate = null;
      } finally {
        this.loading = false;
      }
    }
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
</style>
