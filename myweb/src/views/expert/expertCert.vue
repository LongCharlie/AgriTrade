<template>
  <div class="certifications-container">
    <h2>我的证书</h2>

    <!-- 状态筛选按钮 -->
    <div class="filter-buttons">
      <el-button :type="filter === 'all' ? 'primary' : 'default'" @click="filterCertificates('all')">全部</el-button>
      <el-button :type="filter === 'pending' ? 'primary' : 'default'" @click="filterCertificates('pending')">审核中</el-button>
      <el-button :type="filter === 'approved' ? 'primary' : 'default'" @click="filterCertificates('approved')">审核通过</el-button>
      <el-button :type="filter === 'rejected' ? 'primary' : 'default'" @click="filterCertificates('rejected')">审核未通过</el-button>
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
        <el-card class="crop-card" shadow="hover" @click="viewCertificateDetail(cert.certificate_id)">
          <div class="card-header">
            <span class="cert-name">{{ cert.certificate_name }}</span>
            <el-tag :type="getTagType(cert.is_audited)">
              {{ getAuditStatusText(cert.is_audited) }}
            </el-tag>
          </div>
          <div class="card-body">
            <p><strong>授权单位：</strong>{{ cert.authorizing_unit }}</p>
            <p><strong>获得时间：</strong>{{ cert.obtain_time }}</p>
            <p><strong>等级：</strong>{{ cert.level }}</p>
            <p><strong>有效期：</strong>{{ cert.valid_period }} 年</p>
            <p><strong>描述：</strong>{{ cert.description || '暂无描述' }}</p>
          </div>
          <div class="card-footer">
            <span v-if="cert.is_audited === 'rejected'" class="reason-btn" @click.stop="showRejectionReason(cert)">未通过理由</span>
            <span class="delete-btn" @click.stop="deleteCertificate(cert.certificate_id)">删除</span>
            <span class="edit-btn" @click.stop="editCertificate(cert)">编辑</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹窗 - 编辑证书 -->
    <el-dialog :modal="false" :close-on-click-modal="false" title="编辑证书" v-model="dialogVisible" width="50%">
      <el-form @submit.prevent="updateCertificate(editingCert.certificate_id)" label-width="120px">
        <el-form-item label="证书名称">
          <el-input v-model="editingCert.certificate_name" placeholder="请输入证书名称" />
        </el-form-item>
        <el-form-item label="获得时间">
          <el-date-picker v-model="editingCert.obtain_time" type="date" placeholder="选择日期" value-format="YYYY-MM-DD"/>
        </el-form-item>
        <el-form-item label="等级">
          <el-input-number v-model="editingCert.level" :min="1" :max="5" />
        </el-form-item>
        <el-form-item label="有效期(年)">
          <el-input-number v-model="editingCert.valid_period" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="授权单位">
          <el-input v-model="editingCert.authorizing_unit" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editingCert.description" type="textarea" />
        </el-form-item>
        <el-form-item label="证书图片">
          <el-upload
              class="certificate-uploader"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleImageSuccess"
              :before-upload="beforeImageUpload">
            <img v-if="editingCert.certificate_image" :src="editingCert.certificate_image" class="certificate-image">
            <i v-else class="el-icon-plus certificate-uploader-icon"></i>
          </el-upload>
          <div v-if="editingCert.certificate_image" class="image-preview">
            <img :src="editingCert.certificate_image" class="preview-image" />
          </div>
        </el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form>
    </el-dialog>

    <!-- 弹窗 - 审核未通过理由 -->
    <el-dialog title="审核未通过详情" v-model="reasonDialogVisible" width="50%">
      <el-form label-width="120px">
        <el-form-item label="未通过理由">
          <el-input type="textarea" :value="rejectionReason.audited_reason || '无'" :rows="3" readonly />
        </el-form-item>
        <el-form-item label="审核时间">
          <el-input :value="rejectionReason.audited_at || '无'" readonly />
        </el-form-item>
        <el-form-item label="审核人ID">
          <el-input :value="rejectionReason.audited_by || '无'" readonly />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reasonDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
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
      editingCert: {
        certificate_id: null,
        certificate_name: '',
        obtain_time: '',
        level: 1,
        valid_period: 1,
        authorizing_unit: '',
        description: '',
        certificate_image: ''
      },
      dialogVisible: false,
      filter: 'all',
      // 审核未通过理由相关数据
      reasonDialogVisible: false,
      rejectionReason: {},
      // 上传相关属性
      uploadUrl: 'http://localhost:3000/api/upload'
    };
  },
  computed: {
    // 根据状态过滤证书
    filteredCertificates() {
      if (this.filter === 'all') {
        return this.certifications;
      }
      return this.certifications.filter(cert => cert.is_audited === this.filter);
    },
    // 上传headers计算属性
    uploadHeaders() {
      return {
        Authorization: `Bearer ${this.userStore.token}`
      };
    }
  },
  mounted() {
    this.fetchCertificates();
  },
  methods: {
    async fetchCertificates() {
      try {
        const token = this.userStore.token;
        const response = await axios.get('http://localhost:3000/api/certificates/my', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.certifications = response.data;
      } catch (error) {
        console.error('获取证书失败:', error);
        this.certifications = [];
      }
    },
    goToAddNewCert() {
      this.$router.push('/expert/cert/new');
    },
    viewCertificateDetail(certificate_id) {
      this.$router.push(`/expert/cert/detail/${certificate_id}`);
    },
    async updateCertificate(id) {
      try {
        const token = this.userStore.token;

        // 更新证书时重置审核状态为pending
        const payload = {
          certificate_name: this.editingCert.certificate_name,
          obtain_time: this.editingCert.obtain_time,
          level: this.editingCert.level,
          valid_period: this.editingCert.valid_period,
          authorizing_unit: this.editingCert.authorizing_unit,
          description: this.editingCert.description,
          certificate_image: this.editingCert.certificate_image,
          is_audited: 'pending' // 证书更新后需要重新审核
        };
        await axios.patch(`http://localhost:3000/api/certificates/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.dialogVisible = false;
        this.$message.success('证书更新成功，需要重新审核');
        this.fetchCertificates();
      } catch (error) {
        this.$message.error('证书更新失败');
        console.error('更新证书失败:', error);
      }
    },
    async deleteCertificate(id) {
      try {
        const token = this.userStore.token;
        await axios.delete(`http://localhost:3000/api/certificates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.$message.success('证书删除成功');
        this.fetchCertificates();
      } catch (error) {
        this.$message.error('证书删除失败');
        console.error('删除证书失败:', error);
      }
    },
    editCertificate(cert) {
      this.editingCert = { ...cert }; // 创建副本
      this.dialogVisible = true;
    },
    filterCertificates(is_audited) {
      this.filter = is_audited;
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
    showRejectionReason(cert) {
      this.rejectionReason = cert;
      this.reasonDialogVisible = true;
    },
    handleImageSuccess(res, file) {
      // 假设上传成功后返回图片URL
      this.editingCert.certificate_image = res.data.url || URL.createObjectURL(file.raw);
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
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
  min-height: 300px; /* 增加最小高度 */
  margin: 20px 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
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
  margin-bottom: 10px;
}

.card-body {
  padding: 10px 0;
  font-size: 14px;
  color: #666;
  flex: 1; /* 占据剩余空间 */
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #999;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.reason-btn,
.delete-btn,
.edit-btn {
  cursor: pointer;
  color: #409EFF;
  padding: 2px 5px;
}

.reason-btn:hover,
.delete-btn:hover,
.edit-btn:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.reason-btn {
  color: #e6a23c;
}

.delete-btn {
  color: #f56c6c;
}

.filter-buttons {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 证书图片上传样式 */
.certificate-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.certificate-uploader .el-upload:hover {
  border-color: #409EFF;
}

.certificate-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.certificate-image {
  width: 178px;
  height: 178px;
  display: block;
}

.image-preview {
  margin-top: 10px;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>
