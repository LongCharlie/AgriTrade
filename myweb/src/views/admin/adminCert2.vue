<template>
  <div class="cert-audit-container">
    <h1>证书审核管理</h1>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="filter.status" clearable placeholder="审核状态">
            <el-option label="待审核" value="pending"></el-option>
            <el-option label="已通过" value="approved"></el-option>
            <el-option label="已拒绝" value="rejected"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filter.expertId" placeholder="专家ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchCertificates">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 证书列表 -->
    <el-table :data="filteredCertificates" style="width: 100%">
      <el-table-column prop="certificate_id" label="证书ID" width="100"></el-table-column>
      <el-table-column prop="expert_id" label="专家ID" width="100"></el-table-column>
      <el-table-column prop="authorizing_unit" label="授权单位"></el-table-column>
      <el-table-column prop="obtain_time" label="获得时间" width="120">
        <template #default="{row}">
          {{ formatDate(row.obtain_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="level" label="等级" width="80"></el-table-column>
      <el-table-column prop="valid_period" label="有效期(年)" width="100"></el-table-column>
      <el-table-column label="审核状态" width="120">
        <template #default="{row}">
          <el-tag :type="getStatusTagType(row.is_audited)">
            {{ getStatusText(row.is_audited) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{row}">
          <el-button size="small" @click="showDetail(row)">查看详情</el-button>
          <el-button
              v-if="row.is_audited === 'pending'"
              size="small"
              type="primary"
              @click="showAuditDialog(row)"
          >
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
      ></el-pagination>
    </div>

    <!-- 审核对话框 -->
    <el-dialog title="证书审核" v-model="auditDialogVisible" width="50%">
      <el-form label-width="120px">
        <el-form-item label="证书ID">
          <span>{{ currentCert.certificate_id }}</span>
        </el-form-item>
        <el-form-item label="专家ID">
          <span>{{ currentCert.expert_id }}</span>
        </el-form-item>
        <el-form-item label="授权单位">
          <span>{{ currentCert.authorizing_unit }}</span>
        </el-form-item>
        <el-form-item label="获得时间">
          <span>{{ formatDate(currentCert.obtain_time) }}</span>
        </el-form-item>
        <el-form-item label="审核结果">
          <el-radio-group v-model="auditForm.status">
            <el-radio label="approved">通过</el-radio>
            <el-radio label="rejected">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" v-if="auditForm.status === 'rejected'">
          <el-input
              v-model="auditForm.rejectReason"
              type="textarea"
              :rows="3"
              placeholder="请输入拒绝原因"
              required
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAudit" :loading="submitting">提交</el-button>
          <el-button @click="auditDialogVisible = false" :disabled="submitting">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 详情对话框 -->
    <!--    <el-dialog title="证书详情" v-model="detailDialogVisible" width="60%">-->
    <!--      <el-descriptions :column="2" border>-->
    <!--        <el-descriptions-item label="证书ID">{{ detailData.certificate_id }}</el-descriptions-item>-->
    <!--        <el-descriptions-item label="专家ID">{{ detailData.expert_id }}</el-descriptions-item>-->
    <!--        <el-descriptions-item label="授权单位">{{ detailData.authorizing_unit }}</el-descriptions-item>-->
    <!--        <el-descriptions-item label="获得时间">{{ formatDate(detailData.obtain_time) }}</el-descriptions-item>-->
    <!--        <el-descriptions-item label="等级">{{ detailData.level }}</el-descriptions-item>-->
    <!--        <el-descriptions-item label="有效期">{{ detailData.valid_period }}年</el-descriptions-item>-->
    <!--        <el-descriptions-item label="描述" :span="2">{{ detailData.description }}</el-descriptions-item>-->
    <!--        <el-descriptions-item label="审核状态">-->
    <!--          <el-tag :type="getStatusTagType(detailData.is_audited)">-->
    <!--            {{ getStatusText(detailData.is_audited) }}-->
    <!--          </el-tag>-->
    <!--        </el-descriptions-item>-->
    <!--        <el-descriptions-item label="审核人" v-if="detailData.reviewed_by">{{ detailData.reviewed_by }}</el-descriptions-item>-->
    <!--        <el-descriptions-item label="审核时间" v-if="detailData.reviewed_at">{{ formatDate(detailData.reviewed_at) }}</el-descriptions-item>-->
    <!--        <el-descriptions-item label="拒绝原因" :span="2" v-if="detailData.reject_reason">{{ detailData.reject_reason }}</el-descriptions-item>-->
    <!--      </el-descriptions>-->
    <!--    </el-dialog>-->
    <!-- 修改后的详情对话框 -->
    <el-dialog title="证书详情" v-model="detailDialogVisible" width="70%" top="5vh">
      <el-scrollbar max-height="70vh">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-descriptions :column="2" border>
              <!-- 添加缺失的字段 -->
              <!--              <el-descriptions-item label="证书名称">{{ detailData.certificate_name }}</el-descriptions-item>-->
              <!--              <el-descriptions-item label="专家姓名" :span="2">{{ detailData.expert_name }}</el-descriptions-item>-->
              <!--              <el-descriptions-item label="证书状态">{{ detailData.status }}</el-descriptions-item>-->
              <!-- ... 其他原有字段 ... -->
              <el-descriptions-item label="证书ID">{{ detailData.certificate_id }}</el-descriptions-item>
              <el-descriptions-item label="证书名称">{{ detailData.certificate_name }}</el-descriptions-item>
              <el-descriptions-item label="专家姓名" :span="2">{{ detailData.real_name }}</el-descriptions-item>
              <el-descriptions-item label="专家ID">{{ detailData.expert_id }}</el-descriptions-item>
              <el-descriptions-item label="授权单位">{{ detailData.authorizing_unit }}</el-descriptions-item>
              <el-descriptions-item label="获得时间">{{ formatDate(detailData.obtain_time) }}</el-descriptions-item>
              <el-descriptions-item label="等级">{{ getLevelText(detailData.level) }} ({{ detailData.level }})</el-descriptions-item>              <el-descriptions-item label="有效期">{{ detailData.valid_period }}年</el-descriptions-item>
              <el-descriptions-item label="描述" :span="2">{{ detailData.description }}</el-descriptions-item>
              <el-descriptions-item label="审核状态">
                <el-tag :type="getStatusTagType(detailData.is_audited)">
                  {{ getStatusText(detailData.is_audited) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="审核人" v-if="detailData.audited_by">{{ detailData.audited_by }}</el-descriptions-item>
              <el-descriptions-item label="审核时间" v-if="detailData.audited_at">{{ formatDate(detailData.audited_at) }}</el-descriptions-item>
              <el-descriptions-item label="拒绝原因" :span="2" v-if="detailData.audited_reason">{{ detailData.audited_reason }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="8">
            <div class="certificate-image-section">
              <h3>证书图片</h3>
              <div v-if="detailData.certificate_image" class="image-container">
                <el-image
                    :src="`http://localhost:3000/uploads/certificates/${detailData.certificate_image}`"
                    class="certificate-image"
                    fit="contain"
                    :preview-src-list="getPreviewList(detailData.certificate_image)"
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
      </el-scrollbar>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="detailDialogVisible = false">关闭</el-button>
    </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import {useUserStore} from "@/stores/user";

export default {
  name: 'AdminCert',
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    };
  },
  data() {
    return {
      allCertificates: [],
      certificates: [],
      filter: {
        status: '',
        expertId: ''
      },
      pagination: {
        current: 1,
        size: 10,
        total: 0
      },
      auditDialogVisible: false,
      detailDialogVisible: false,
      currentCert: {},
      detailData: {},
      auditForm: {
        status: 'approved',
        rejectReason: ''
      },
      submitting: false
    };
  },
  created() {
    this.fetchCertificates();
  },
  computed: {
    filteredCertificates() {
      let filtered = [...this.allCertificates];

      if (this.filter.status) {
        filtered = filtered.filter(cert => cert.is_audited === this.filter.status);
      }

      if (this.filter.expertId) {
        filtered = filtered.filter(cert =>
            cert.expert_id && cert.expert_id.toString().includes(this.filter.expertId)
        );
      }

      this.pagination.total = filtered.length;
      const start = (this.pagination.current - 1) * this.pagination.size;
      const end = start + this.pagination.size;
      return filtered.slice(start, end);
    }
  },
  methods: {
    async fetchCertificates() {
      try {
        const token = this.userStore.token;
        const res = await axios.get('http://localhost:3000/api/certificates', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.allCertificates = res.data;
        this.pagination.total = res.data.length;
        console.log(res.data);
      } catch (error) {
        console.error('获取证书列表失败:', error);
        this.$message.error('获取证书列表失败');
      }
    },
    getPreviewList(imagePath) {
      // 处理单个图片路径
      if (typeof imagePath === 'string' && imagePath) {
        // 构建完整URL
        if (imagePath.startsWith('http')) {
          return [imagePath];
        } else if (imagePath.startsWith('/')) {
          return [`http://localhost:3000${imagePath}`];
        } else {
          // 假设证书图片存储在 /uploads/certificates/ 目录下
          return [`http://localhost:3000/uploads/certificates/${imagePath}`];
        }
      }
      return [];
    },
    getStatusText(status) {
      const map = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝'
      };
      return map[status] || status;
    },
    getStatusTagType(status) {
      const map = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger'
      };
      return map[status] || '';
    },
    showAuditDialog(cert) {
      this.currentCert = cert;
      this.auditForm = {
        status: 'approved',
        rejectReason: ''
      };
      this.auditDialogVisible = true;
    },
    // showDetail(cert) {
    //   this.detailData = cert;
    //   this.detailDialogVisible = true;
    // },
    async showDetail(cert) {
      try {
        // 获取完整的证书详情
        const token = this.userStore.token;
        const res = await axios.get(`http://localhost:3000/api/certificates/${cert.certificate_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.detailData = res.data;
        this.detailDialogVisible = true;
        // this.$message.info('获取证书详情成功' + res.data);
        console.log('获取证书详情成功:', JSON.stringify(this.detailData, null, 2));
        // console.log('获取证书详情成功' + this.detailData);
      } catch (error) {
        console.error('获取证书详情失败:', error);
        this.$message.error('获取证书详情失败: ' + (error.response?.data?.error || '未知错误'));
      }
    },
    async submitAudit() {
      if (this.auditForm.status === 'rejected' && !this.auditForm.rejectReason) {
        this.$message.warning('请填写拒绝原因');
        return;
      }

      this.submitting = true;
      try {
        const payload = {
          status: this.auditForm.status,
          ...(this.auditForm.status === 'rejected' && {
            rejectReason: this.auditForm.rejectReason
          })
        };

        const token = this.userStore.token;
        await axios.patch(
            `http://localhost:3000/api/certificates/${this.currentCert.certificate_id}/status`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
        );

        this.$message.success('审核提交成功');
        this.auditDialogVisible = false;
        await this.fetchCertificates();
      } catch (error) {
        console.error('审核提交失败:', error);
        this.$message.error(error.response?.data?.error || '审核提交失败');
      } finally {
        this.submitting = false;
      }
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.pagination.current = 1;
    },
    handleCurrentChange(current) {
      this.pagination.current = current;
    },
    resetFilter() {
      this.filter = {
        status: '',
        expertId: ''
      };
      this.pagination.current = 1;
      this.fetchCertificates();
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    getImageUrl(imageUrl) {
      // 如果已经是完整URL，直接返回
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      // 否则添加基础URL
      return `http://localhost:3000${imageUrl}`;
    },
    getLevelText(level) {
      const levelMap = {
        1: '初级',
        2: '中级',
        3: '高级',
        4: '专家级'
      };
      return levelMap[level] || level;
    }
  }
};
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.cert-audit-container {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
}
/* 在 <style scoped> 中添加 */
.certificate-image-section {
  text-align: center;
}

.certificate-image-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  border: 1px solid #eee;
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

.dialog-footer {
  text-align: right;
}
</style>