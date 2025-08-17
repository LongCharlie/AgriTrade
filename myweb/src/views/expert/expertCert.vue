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
            <p><strong>获得时间：</strong>{{ formatDate(cert.obtain_time) }}</p>
            <p><strong>等级：</strong>{{ getLevelText(cert.level) }}</p>
<!--            <p><strong>有效期：</strong>{{ cert.valid_period }} 年</p>-->
<!--            <p><strong>描述：</strong>{{ cert.description || '暂无描述' }}</p>-->

            <!-- 证书图片展示 -->
<!--            <div v-if="cert.image_url" class="certificate-image-container">-->
<!--              <p><strong>证书图片：</strong></p>-->
<!--              <el-image-->
<!--                  :src="`http://localhost:3000${cert.image_url}`"-->
<!--                  class="certificate-image"-->
<!--                  fit="cover"-->
<!--                  :preview-src-list="[`http://localhost:3000${cert.image_url}`]"-->
<!--                  hide-on-click-modal>-->
<!--                <div slot="error" class="image-slot">-->
<!--                  <i class="el-icon-picture-outline"></i>-->
<!--                </div>-->
<!--              </el-image>-->
<!--            </div>-->
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
          <el-select v-model="editingCert.level" placeholder="请选择等级">
            <el-option label="初级" :value="1"></el-option>
            <el-option label="中级" :value="2"></el-option>
            <el-option label="高级" :value="3"></el-option>
            <el-option label="专家级" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期(年)">
          <el-input-number v-model="editingCert.valid_period" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="授权单位">
          <el-input v-model="editingCert.authorizing_unit" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editingCert.description" type="textarea" />
        </el-form-item>

        <!-- 编辑时的图片上传 -->
        <el-form-item label="证书图片">
          <el-upload
              ref="upload"
              class="certificate-uploader"
              :auto-upload="false"
              :multiple="false"
              :limit="1"
              :on-exceed="handleExceed"
              :on-change="handleFileChange"
              :on-remove="handleRemove"
              list-type="picture-card"
              v-model:file-list="fileList">
            <el-icon v-if="fileList.length === 0 && !editingCert.image_url"><Plus /></el-icon>
            <div v-if="fileList.length === 0 && !editingCert.image_url" class="el-upload__text">
              点击上传图片 <br/>
              <span style="font-size: 12px; color: #999;">支持jpg/png格式，不超过5MB</span>
            </div>
          </el-upload>

          <!-- 显示当前图片 -->
          <div v-if="editingCert.image_url && !fileList.length" class="current-image">
            <p>当前图片：</p>
            <el-image
                :src="editingCert.image_url.startsWith('http') ? editingCert.image_url : `http://localhost:3000${editingCert.image_url}`"
                class="certificate-image-preview"
                fit="cover"
                :preview-src-list="[editingCert.image_url.startsWith('http') ? editingCert.image_url : `http://localhost:3000${editingCert.image_url}`]"
                hide-on-click-modal>
            </el-image>
          </div>
        </el-form-item>

        <el-button type="primary" native-type="submit" :loading="updating">保存</el-button>
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
          <el-input :value="formatDate(rejectionReason.audited_at) || '无'" readonly />
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
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

export default {
  components: {
    Plus
  },
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
        level: null,
        valid_period: null,
        authorizing_unit: '',
        description: '',
        image_url: ''
      },
      dialogVisible: false,
      filter: 'all',
      // 审核未通过理由相关数据
      reasonDialogVisible: false,
      rejectionReason: {},
      // 上传相关属性
      fileList: [],
      updating: false
    };
  },
  computed: {
    // 根据状态过滤证书
    filteredCertificates() {
      if (this.filter === 'all') {
        return this.certifications;
      }
      return this.certifications.filter(cert => cert.is_audited === this.filter);
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
        });
        this.certifications = response.data.certificates || [];
      } catch (error) {
        console.error('获取证书失败:', error);
        ElMessage.error('获取证书失败: ' + (error.response?.data?.message || '未知错误'));
        this.certifications = [];
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toISOString().split('T')[0];
    },
    goToAddNewCert() {
      this.$router.push('/expert/cert/new');
    },
    viewCertificateDetail(certificate_id) {
      this.$router.push(`/expert/cert/detail/${certificate_id}`);
    },
    async updateCertificate(id) {
      this.updating = true;
      try {
        const token = this.userStore.token;

        // 创建 FormData 对象
        const formData = new FormData();

        // 添加表单数据
        Object.keys(this.editingCert).forEach(key => {
          // 排除 image_url 字段，因为它不是数据库字段
          if (key !== 'image_url' && this.editingCert[key] !== null && this.editingCert[key] !== '') {
            formData.append(key, this.editingCert[key]);
          }
        });

        // 添加新图片文件（如果有的话）
        if (this.fileList.length > 0) {
          formData.append('certificate_image', this.fileList[0].raw);
        }

        await axios.patch(
            `http://localhost:3000/api/certificates/${id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
        );

        this.dialogVisible = false;
        ElMessage.success('证书更新成功，需要重新审核');
        this.fetchCertificates();
      } catch (error) {
        ElMessage.error('证书更新失败: ' + (error.response?.data?.message || '未知错误'));
        console.error('更新证书失败:', error);
      } finally {
        this.updating = false;
      }
    },
    async deleteCertificate(id) {
      try {
        const token = this.userStore.token;
        await axios.delete(`http://localhost:3000/api/certificates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        ElMessage.success('证书删除成功');
        this.fetchCertificates();
      } catch (error) {
        ElMessage.error('证书删除失败: ' + (error.response?.data?.message || '未知错误'));
        console.error('删除证书失败:', error);
      }
    },
    editCertificate(cert) {
      this.editingCert = {...cert}; // 创建副本
      // 确保图片URL是完整的
      if (cert.image_url && !cert.image_url.startsWith('http')) {
        this.editingCert.image_url = `http://localhost:3000${cert.image_url}`;
      }
      this.fileList = []; // 清空文件列表
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
    getLevelText(level) {
      const levelMap = {
        1: '初级',
        2: '中级',
        3: '高级',
        4: '专家级'
      };
      return levelMap[level] || level;
    },
    showRejectionReason(cert) {
      this.rejectionReason = cert;
      this.reasonDialogVisible = true;
    },
    // 处理文件选择
    handleFileChange(file, fileList) {
      this.fileList = fileList;
    },

    // 处理文件移除
    handleRemove() {
      this.fileList = [];
    },

    // 处理超出限制的文件
    handleExceed() {
      ElMessage.warning('只能上传一张证书图片');
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
  min-height: 200px;
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
  min-height: 255px;
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
  flex: 1;
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

/* 证书图片展示样式 */
.certificate-image-container {
  margin-top: 10px;
}

.certificate-image {
  width: 100%;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #eee;
  margin-top: 5px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  color: #999;
  font-size: 24px;
}

/* 编辑对话框中的图片上传样式 */
.certificate-uploader {
  width: 100%;
}

:deep(.el-upload--picture-card) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
}

.certificate-image-preview {
  width: 150px;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #eee;
  margin-top: 10px;
}

.current-image p {
  margin: 10px 0 5px 0;
  font-weight: bold;
}
</style>
