<template>
  <div>
    <el-container>
<!--      <el-aside width="0px">-->
<!--        <expert-common-aside></expert-common-aside>-->
<!--      </el-aside>-->
      <el-container>
<!--        <el-header>-->
<!--          <expert-common-header></expert-common-header>-->
<!--        </el-header>-->
        <el-main>
          <div class="certificate-detail-container">
<!--            <el-page-header @back="goBack" content="证书详情"></el-page-header>-->

            <el-card class="certificate-card" shadow="hover">
              <div class="card-header">
                <h2>{{ certificate.certificate_name }}</h2>
                <el-tag :type="getTagType(certificate.is_audited)" class="status-tag">
                  {{ getAuditStatusText(certificate.is_audited) }}
                </el-tag>
              </div>

              <el-divider></el-divider>

              <el-row :gutter="20">
                <el-col :span="16">
                  <div class="certificate-info">
                    <el-descriptions :column="1" border>
                      <el-descriptions-item label="证书ID">
                        {{ certificate.certificate_id }}
                      </el-descriptions-item>
                      <el-descriptions-item label="证书名称">
                        {{ certificate.certificate_name }}
                      </el-descriptions-item>
                      <el-descriptions-item label="获得时间">
                        {{ formatDate(certificate.obtain_time) }}
                      </el-descriptions-item>
                      <el-descriptions-item label="证书等级">
                        {{ getLevelText(certificate.level) }} ({{ certificate.level }})
                      </el-descriptions-item>
                      <el-descriptions-item label="有效期">
                        {{ certificate.valid_period }} 年
                      </el-descriptions-item>
                      <el-descriptions-item label="颁发单位">
                        {{ certificate.authorizing_unit }}
                      </el-descriptions-item>
                      <el-descriptions-item label="证书描述">
                        {{ certificate.description || '暂无描述' }}
                      </el-descriptions-item>
                      <el-descriptions-item label="审核状态">
                        {{ getAuditStatusText(certificate.is_audited) }}
                      </el-descriptions-item>
                      <el-descriptions-item v-if="certificate.is_audited === 'rejected'" label="拒绝理由">
                        {{ certificate.audited_reason || '无' }}
                      </el-descriptions-item>
                      <el-descriptions-item v-if="certificate.audited_at" label="审核时间">
                        {{ formatDateTime(certificate.audited_at) }}
                      </el-descriptions-item>
                      <el-descriptions-item v-if="certificate.audited_by" label="审核人ID">
                        {{ certificate.audited_by }}
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                </el-col>

                <el-col :span="8">
                  <div class="certificate-image-section">
                    <div v-if="certificate.image_url" class="image-container">
                      <el-image
                          :src="`http://localhost:3000${certificate.image_url}`"
                          class="certificate-image"
                          fit="scale-down"
                          :preview-src-list="[`http://localhost:3000${certificate.image_url}`]"
                          hide-on-click-modal>
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                          <p>图片加载失败</p>
                        </div>
                      </el-image>
                    </div>
                    <div v-else class="no-image">
                      <i class="el-icon-picture-outline"></i>
                      <p>暂无证书图片</p>
                    </div>
                  </div>
                </el-col>
              </el-row>

              <div class="card-footer">
                <el-button @click="goBack">返回</el-button>
                <el-button type="primary" @click="openEditDialog">编辑证书</el-button>
                <el-button type="danger" @click="deleteCertificate">删除证书</el-button>
              </div>
            </el-card>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- 编辑证书弹窗 -->
    <el-dialog :modal="true" :close-on-click-modal="false" title="编辑证书" v-model="dialogVisible" width="50%">
      <el-form @submit.prevent="updateCertificate" label-width="120px">
        <el-form-item label="证书名称" prop="certificate_name" :rules="[{ required: true, message: '请输入证书名称', trigger: 'blur' }]">
          <el-input v-model="editingCert.certificate_name" placeholder="请输入证书名称" />
        </el-form-item>
        <el-form-item label="获得时间" prop="obtain_time" :rules="[{ required: true, message: '请选择获得时间', trigger: 'change' }]">
          <el-date-picker v-model="editingCert.obtain_time" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="等级" prop="level" :rules="[{ required: true, message: '请选择等级', trigger: 'change' }]">
          <el-select v-model="editingCert.level" placeholder="请选择等级" style="width: 100%">
            <el-option label="初级" :value="1"></el-option>
            <el-option label="中级" :value="2"></el-option>
            <el-option label="高级" :value="3"></el-option>
            <el-option label="专家级" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期(年)" prop="valid_period" :rules="[{ required: true, message: '请输入有效期', trigger: 'change' }]">
          <el-input-number v-model="editingCert.valid_period" :min="1" :max="100" style="width: 100%" />
        </el-form-item>
        <el-form-item label="授权单位" prop="authorizing_unit" :rules="[{ required: true, message: '请输入授权单位', trigger: 'blur' }]">
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

        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="updating" style="float: right;">保存</el-button>
          <el-button @click="dialogVisible = false" style="float: right; margin-right: 10px;">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import expertCommonAside from "@/components/expertCommonAside.vue";
import expertCommonHeader from "@/components/expertCommonHeader.vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

export default {
  name: 'ExpertCertificateDetail',
  components: {
    expertCommonAside,
    expertCommonHeader,
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
      certificate: {
        certificate_id: '',
        certificate_name: '',
        certificate_image: '',
        image_url: '',
        obtain_time: '',
        level: null,
        valid_period: null,
        authorizing_unit: '',
        description: '',
        status: '',
        is_audited: '',
        audited_reason: '',
        audited_at: '',
        audited_by: ''
      },
      // 编辑相关数据
      dialogVisible: false,
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
      fileList: [],
      updating: false
    };
  },
  created() {
    const certificateId = this.$route.params.id;
    if (certificateId) {
      this.fetchCertificateDetail(certificateId);
    }
  },
  methods: {
    async fetchCertificateDetail(id) {
      try {
        const token = this.userStore.token;
        const response = await axios.get(`http://localhost:3000/api/certificate/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.certificate = response.data.certificate;
      } catch (error) {
        console.error('获取证书详情失败:', error);
        ElMessage.error('获取证书详情失败: ' + (error.response?.data?.message || '未知错误'));
        // 返回证书列表页
        this.$router.push('/expert/certificates');
      }
    },

    goBack() {
      this.$router.go(-1);
    },

    openEditDialog() {
      // 初始化编辑表单数据
      this.editingCert = { ...this.certificate };
      // 确保图片URL是完整的
      if (this.certificate.image_url && !this.certificate.image_url.startsWith('http')) {
        this.editingCert.image_url = `http://localhost:3000${this.certificate.image_url}`;
      }
      this.fileList = []; // 清空文件列表
      this.dialogVisible = true;
    },

    async updateCertificate() {
      this.updating = true;
      try {
        const token = this.userStore.token;

        // 创建 FormData 对象
        const formData = new FormData();

        // 添加表单数据
        Object.keys(this.editingCert).forEach(key => {
          // 排除 image_url 字段，因为它不是数据库字段
          if (key !== 'image_url' && key !== 'certificate_id' && this.editingCert[key] !== null && this.editingCert[key] !== '') {
            formData.append(key, this.editingCert[key]);
          }
        });

        // 添加新图片文件（如果有的话）
        if (this.fileList.length > 0) {
          formData.append('certificate_image', this.fileList[0].raw);
        }

        await axios.patch(
            `http://localhost:3000/api/certificates/${this.certificate.certificate_id}`,
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
        // 重新获取证书详情以更新显示
        this.fetchCertificateDetail(this.certificate.certificate_id);
      } catch (error) {
        ElMessage.error('证书更新失败: ' + (error.response?.data?.message || '未知错误'));
        console.error('更新证书失败:', error);
      } finally {
        this.updating = false;
      }
    },

    deleteCertificate() {
      ElMessageBox.confirm(
          '确定要删除此证书吗？此操作不可恢复。',
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).then(async () => {
        try {
          const token = this.userStore.token;
          await axios.delete(`http://localhost:3000/api/certificates/${this.certificate.certificate_id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          ElMessage.success('证书删除成功');
          this.$router.go(-1);
          // this.$router.push('/expert/certificates');
        } catch (error) {
          ElMessage.error('删除证书失败: ' + (error.response?.data?.message || '未知错误'));
          console.error('删除证书失败:', error);
        }
      }).catch(() => {
        // 用户取消删除
      });
    },

    getAuditStatusText(is_audited) {
      const auditStatusMap = {
        'pending': '审核中',
        'approved': '审核通过',
        'rejected': '审核未通过'
      };
      return auditStatusMap[is_audited] || '未知状态';
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
      return levelMap[level] || '未知等级';
    },

    formatDate(dateString) {
      if (!dateString) return '无';
      return new Date(dateString).toLocaleDateString();
    },

    formatDateTime(dateTimeString) {
      if (!dateTimeString) return '无';
      return new Date(dateTimeString).toLocaleString();
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
.certificate-detail-container {
  //padding: 20px;
}

.certificate-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  color: #333;
}

.status-tag {
  font-size: 14px;
}

.certificate-info {
  margin-bottom: 20px;
}

.certificate-image-section {
  text-align: center;
}

.certificate-image-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.image-container {
  //display: flex;
  //justify-content: center;
  //align-items: center;
  height: 800px;
  //border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.certificate-image {
  max-width: 100%;
  max-height: 100%;
}

.image-slot {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  color: #999;
}

.image-slot i {
  font-size: 48px;
  margin-bottom: 10px;
}

.no-image {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  color: #999;
}

.no-image i {
  font-size: 48px;
  margin-bottom: 10px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

:deep(.el-descriptions__label) {
  font-weight: 500;
  width: 120px;
}

:deep(.el-page-header__content) {
  font-size: 18px;
  font-weight: 500;
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
