<template>
  <div>
    <el-container>
      <el-aside width="0px">
        <expert-common-aside></expert-common-aside>
      </el-aside>
      <el-container>
        <el-header>
          <expert-common-header></expert-common-header>
        </el-header>
        <el-main>
          <div class="certificate-upload-container">
            <h2>{{ isEditing ? '编辑证书' : '上传证书' }}</h2>

            <el-card shadow="hover">
              <el-form
                  :model="certificateForm"
                  :rules="certificateRules"
                  ref="certificateForm"
                  label-width="120px"
                  class="certificate-form">

                <el-form-item label="证书名称" prop="certificate_name">
                  <el-input
                      v-model="certificateForm.certificate_name"
                      placeholder="请输入证书名称">
                  </el-input>
                </el-form-item>

                <el-form-item label="获得时间" prop="obtain_time">
                  <el-date-picker
                      v-model="certificateForm.obtain_time"
                      type="date"
                      placeholder="选择获得时间"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD">
                  </el-date-picker>
                </el-form-item>

                <el-form-item label="证书等级" prop="level">
                  <el-select
                      v-model="certificateForm.level"
                      placeholder="请选择证书等级"
                      style="width: 100%">
                    <el-option label="初级 (1)" :value="1"></el-option>
                    <el-option label="中级 (2)" :value="2"></el-option>
                    <el-option label="高级 (3)" :value="3"></el-option>
                    <el-option label="专家级 (4)" :value="4"></el-option>
                  </el-select>
                  <div class="form-tip">数字越大等级越高</div>
                </el-form-item>

                <el-form-item label="有效期(年)" prop="valid_period">
                  <el-input-number
                      v-model="certificateForm.valid_period"
                      :min="1"
                      :max="100"
                      placeholder="请输入有效期（年）">
                  </el-input-number>
                  <div class="form-tip">请输入证书有效期，单位为年</div>
                </el-form-item>

                <el-form-item label="颁发单位" prop="authorizing_unit">
                  <el-input
                      v-model="certificateForm.authorizing_unit"
                      placeholder="请输入颁发单位">
                  </el-input>
                </el-form-item>

                <el-form-item label="证书描述" prop="description">
                  <el-input
                      type="textarea"
                      :rows="4"
                      v-model="certificateForm.description"
                      placeholder="请输入证书描述">
                  </el-input>
                </el-form-item>

                <!-- 证书图片上传区域 -->
                <el-form-item label="证书图片" prop="certificate_image">
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
                    <el-icon v-if="fileList.length === 0"><Plus /></el-icon>
                    <div v-if="fileList.length === 0" class="el-upload__text">
                      点击上传图片 <br/>
                      <span style="font-size: 12px; color: #999;">支持jpg/png格式，不超过5MB</span>
                    </div>
                  </el-upload>
                  <div v-if="certificateImageUrl" class="certificate-preview">
                    <el-image
                        :src="certificateImageUrl"
                        class="certificate-image"
                        fit="cover"
                        :preview-src-list="[certificateImageUrl]">
                    </el-image>
                  </div>
                </el-form-item>

                <el-form-item>
                  <div class="form-actions">
                    <el-button @click="resetForm">重置</el-button>
                    <el-button
                        type="primary"
                        @click="submitCertificate"
                        :loading="submitting">
                      {{ submitting ? '提交中...' : '提交证书' }}
                    </el-button>
                  </div>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import expertCommonAside from "@/components/expertCommonAside.vue";
import expertCommonHeader from "@/components/expertCommonHeader.vue";
import axios from "axios";
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

export default {
  name: 'ExpertUploadCertificate',
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
      isEditing: false,
      certificateId: null,
      submitting: false,
      certificateForm: {
        certificate_name: '',
        obtain_time: '',
        level: null,
        valid_period: null,
        authorizing_unit: '',
        description: ''
      },
      fileList: [], // 存储上传的文件列表
      certificateImageUrl: '', // 用于编辑时显示已有的证书图片
      certificateRules: {
        certificate_name: [
          { required: true, message: '请输入证书名称', trigger: 'blur' }
        ],
        obtain_time: [
          { required: true, message: '请选择获得时间', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择证书等级', trigger: 'change' }
        ],
        valid_period: [
          { required: true, message: '请输入有效期', trigger: 'change' }
        ],
        authorizing_unit: [
          { required: true, message: '请输入颁发单位', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    // 检查是否是编辑模式
    if (this.$route.params.id) {
      this.isEditing = true;
      this.certificateId = this.$route.params.id;
      this.fetchCertificateDetail();
    }
  },
  methods: {
    // 获取证书详情（编辑时使用）
    async fetchCertificateDetail() {
      try {
        const token = this.userStore.token;
        const response = await axios.get(`http://localhost:3000/api/certificates/${this.certificateId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const certificate = response.data.certificate;
        this.certificateForm = {
          certificate_name: certificate.certificate_name,
          obtain_time: certificate.obtain_time,
          level: certificate.level,
          valid_period: certificate.valid_period,
          authorizing_unit: certificate.authorizing_unit,
          description: certificate.description
        };

        // 如果已有图片，显示预览
        if (certificate.image_url) {
          this.certificateImageUrl = `http://localhost:3000${certificate.image_url}`;
        }
      } catch (error) {
        console.error('获取证书详情失败:', error);
        ElMessage.error('获取证书详情失败: ' + (error.response?.data?.message || '未知错误'));
      }
    },

    // 处理文件选择
    handleFileChange(file, fileList) {
      this.fileList = fileList;
    },

    // 处理文件移除
    handleRemove() {
      this.fileList = [];
      this.certificateImageUrl = '';
    },

    // 处理超出限制的文件
    handleExceed() {
      ElMessage.warning('只能上传一张证书图片');
    },

    // 重置表单
    resetForm() {
      this.$refs.certificateForm.resetFields();
      this.fileList = [];
      this.certificateImageUrl = '';
    },

    // 提交证书
    async submitCertificate() {
      this.$refs.certificateForm.validate(async (valid) => {
        if (!valid) return;

        this.submitting = true;
        try {
          const token = this.userStore.token;

          // 创建 FormData 对象
          const formData = new FormData();

          // 添加表单数据
          Object.keys(this.certificateForm).forEach(key => {
            if (this.certificateForm[key] !== '' && this.certificateForm[key] !== null) {
              formData.append(key, this.certificateForm[key]);
            }
          });

          // 添加图片文件（如果有的话）
          if (this.fileList.length > 0) {
            formData.append('certificate_image', this.fileList[0].raw);
          }

          let response;
          if (this.isEditing) {
            // 编辑证书
            response = await axios.patch(
                `http://localhost:3000/api/certificates/${this.certificateId}`,
                formData,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                  }
                }
            );
          } else {
            // 新增证书
            response = await axios.post(
                'http://localhost:3000/api/certificates',
                formData,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                  }
                }
            );
          }

          ElMessage.success(this.isEditing ? '证书更新成功！' : '证书上传成功！');
          // 提交成功后跳转到证书列表页
          //跳回上一级路由
          this.$router.go(-1);
          //this.$router.push('/expert/certificates');
        } catch (error) {
          console.error('提交证书失败:', error);
          ElMessage.error('提交证书失败: ' + (error.response?.data?.message || '未知错误'));
        } finally {
          this.submitting = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.certificate-upload-container {
  padding: 20px;
}

.certificate-form {
  padding: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

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

:deep(.el-upload-list--picture-card) {
  display: inline-block;
}

.certificate-preview {
  margin-top: 15px;
}

.certificate-image {
  width: 200px;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #eee;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}
</style>
