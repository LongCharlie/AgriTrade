<template>
  <div class="certifications-container">
    <h2>我的证书</h2>

    <!-- 状态筛选按钮 -->
    <div class="filter-buttons">
      <el-button :type="filter === 'all' ? 'primary' : 'default'" @click="filterCertificates('all')">全部</el-button>
      <el-button :type="filter === 'valid' ? 'primary' : 'default'" @click="filterCertificates('valid')">有效</el-button>
      <el-button :type="filter === 'expired' ? 'primary' : 'default'" @click="filterCertificates('expired')">过期</el-button>
    </div>

    <!-- 证书卡片展示区域 -->
    <el-row :gutter="40" class="crop-cards">
      <!-- 添加新证书卡片 -->
      <el-col :span="8" @click="goToAddNewCert">
        <el-card class="crop-card add-card" shadow="hover">
          <div class="card-content">
            <p>+</p>
            <p>上传新证书</p>
          </div>
        </el-card>
      </el-col>

      <!-- 已有证书卡片 -->
      <el-col :span="8" v-for="(cert, index) in filteredCertificates" :key="index">
        <el-card class="crop-card" shadow="hover" @click="viewCertificateDetail(cert.certificateId)">
          <div class="card-header">
            <span class="cert-name">{{ cert.authorizingUnit }}</span>
            <el-tag :type="cert.status === 'valid' ? 'success' : 'danger'">
              {{ cert.status === 'valid' ? '有效' : '过期' }}
            </el-tag>
          </div>
          <div class="card-body">
            <p><strong>获得时间：</strong>{{ cert.obtainTime }}</p>
            <p><strong>等级：</strong>{{ cert.level }}</p>
            <p><strong>有效期：</strong>{{ cert.validPeriod }} 年</p>
            <p><strong>描述：</strong>{{ cert.description || '暂无描述' }}</p>
          </div>
          <div class="card-footer">
            <span class="delete-btn" @click.stop="deleteCertificate(cert.certificateId)">删除</span>
            <span class="edit-btn" @click.stop="editCertificate(cert)">编辑</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹窗 - 编辑证书 -->
    <el-dialog :modal="false" :close-on-click-modal="false" title="编辑证书" v-model="dialogVisible" width="50%">
      <el-form @submit.prevent="updateCertificate" label-width="120px">
        <el-form-item label="获得时间">
          <el-date-picker v-model="editingCert.obtainTime" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="等级">
          <el-input-number v-model="editingCert.level" :min="1" :max="5" />
        </el-form-item>
        <el-form-item label="有效期(年)">
          <el-input-number v-model="editingCert.validPeriod" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="授权单位">
          <el-input v-model="editingCert.authorizingUnit" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editingCert.description" type="textarea" />
        </el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
//import { getMyCertificates, uploadCertificate, deleteCertificate, updateCertificate } from '../../views/expert/expertApi';
import axios from "axios";
import { useUserStore } from '@/stores/user';

export default {
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    };
  },
  data() {
    return {
      certifications: [],
      newCert: {
        obtainTime: '',
        level: 1,
        validPeriod: 5,
        authorizingUnit: '中国农业协会',
        description: ''
      },
      editingCert: null,
      dialogVisible: false,
      filter: 'all'
    };
  },
  computed: {
    // 根据状态过滤证书
    filteredCertificates() {
      if (this.filter === 'valid') {
        return this.certifications.filter(cert => cert.status === 'valid');
      } else if (this.filter === 'expired') {
        return this.certifications.filter(cert => cert.status === 'expired');
      }
      return this.certifications;
    }
  },
  created() {
    this.fetchCertificates();
  },
  methods: {
    async fetchCertificates() {
      try {
        //mock
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
        const token = this.userStore.token;
        const response = await axios.get('http://localhost:3000/api/certificates/my', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.certifications = response.data;
        // this.certifications = mockData.map(cert => ({ //mock
        //   certificateId: cert.certificate_id,
        //   obtainTime: cert.obtain_time,
        //   level: cert.level,
        //   validPeriod: cert.valid_period,
        //   authorizingUnit: cert.authorizing_unit,
        //   description: cert.description,
        //   status: cert.status
        // }));
      } catch (error) {
        console.error('获取证书失败:', error);
        this.certifications = [];
      }
    },
    goToAddNewCert() {
      this.$router.push('/expert/cert/new');
    },
    viewCertificateDetail(certificateId) {
      this.$router.push(`/expert/cert/detail/${certificateId}`);
    },
    async updateCertificate() {
      try {
        const payload = {
          obtain_time: this.editingCert.obtainTime,
          level: this.editingCert.level,
          valid_period: this.editingCert.validPeriod,
          authorizing_unit: this.editingCert.authorizingUnit,
          description: this.editingCert.description
        };

        await updateCertificate(this.editingCert.certificateId, payload);

        const cert = this.certifications.find(c => c.certificateId === this.editingCert.certificateId);
        if (cert) {
          Object.assign(cert, this.editingCert);
        }

        this.dialogVisible = false;
        this.$message.success('证书更新成功');
      } catch (error) {
        this.$message.error('证书更新失败');
        console.error('更新证书失败:', error);
      }
    },
    async deleteCertificate(id) {
      try {
        await deleteCertificate(id);
        this.certifications = this.certifications.filter(cert => cert.certificateId !== id);
        this.$message.success('证书删除成功');
      } catch (error) {
        this.$message.error('证书删除失败');
        console.error('删除证书失败:', error);
      }
    },
    editCertificate(cert) {
      this.editingCert = {
        certificateId: cert.certificateId,
        obtainTime: cert.obtainTime || '',
        level: cert.level || 1,
        validPeriod: cert.validPeriod || 1,
        authorizingUnit: cert.authorizingUnit || '',
        description: cert.description || '',
        status: cert.status || 'valid'
      };
      this.dialogVisible = true;
    },
    filterCertificates(status) {
      this.filter = status;
    }
  }
};
</script>

<style scoped>
.certifications-container {
  padding: 20px;
}

.crop-cards {
  margin-top: 20px;
}

.crop-card {
  width: 100%;
  height: 260px;
  margin: 20px 0;
  cursor: pointer;
}

.crop-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.add-card {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  min-height: 100px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  padding: 10px 0;
  font-size: 14px;
  color: #666;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #999;
  margin-top: 10px;
}

.delete-btn,
.edit-btn {
  cursor: pointer;
  color: #409EFF;
  margin-left: 10px;
}

.delete-btn {
  color: #f56c6c;
}

.filter-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
