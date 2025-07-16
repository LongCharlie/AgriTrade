<template>
  <div class="cert-audit-container">
    <h1>证书审核管理</h1>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true">
        <el-form-item label="审核状态">
          <el-select v-model="filter.status" clearable placeholder="请选择">
            <el-option label="待审核" value="pending"></el-option>
            <el-option label="已通过" value="approved"></el-option>
            <el-option label="已拒绝" value="rejected"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专家ID">
          <el-input v-model="filter.expertId" placeholder="专家ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchCertificates">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 证书列表 -->
    <el-table :data="certificates" style="width: 100%">
      <el-table-column prop="certificateId" label="证书ID" width="100"></el-table-column>
      <el-table-column prop="expertId" label="专家ID" width="100"></el-table-column>
      <el-table-column prop="authorizingUnit" label="授权单位"></el-table-column>
      <el-table-column prop="obtainTime" label="获得时间" width="120"></el-table-column>
      <el-table-column prop="level" label="等级" width="80"></el-table-column>
      <el-table-column prop="validPeriod" label="有效期(年)" width="100"></el-table-column>
      <el-table-column label="审核状态" width="120">
        <template #default="{row}">
          <el-tag :type="getStatusTagType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{row}">
          <el-button size="small" @click="showDetail(row)">查看详情</el-button>
          <el-button
              v-if="row.status === 'pending'"
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
          <span>{{ currentCert.certificateId }}</span>
        </el-form-item>
        <el-form-item label="专家ID">
          <span>{{ currentCert.expertId }}</span>
        </el-form-item>
        <el-form-item label="授权单位">
          <span>{{ currentCert.authorizingUnit }}</span>
        </el-form-item>
        <el-form-item label="获得时间">
          <span>{{ currentCert.obtainTime }}</span>
        </el-form-item>
        <el-form-item label="审核结果">
          <el-radio-group v-model="auditForm.decision">
            <el-radio label="approve">通过</el-radio>
            <el-radio label="reject">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input
              v-model="auditForm.reason"
              type="textarea"
              :rows="3"
              placeholder="请输入审核意见"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAudit">提交</el-button>
          <el-button @click="auditDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog title="证书详情" v-model="detailDialogVisible" width="60%">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="证书ID">{{ detailData.certificateId }}</el-descriptions-item>
        <el-descriptions-item label="专家ID">{{ detailData.expertId }}</el-descriptions-item>
        <el-descriptions-item label="授权单位">{{ detailData.authorizingUnit }}</el-descriptions-item>
        <el-descriptions-item label="获得时间">{{ detailData.obtainTime }}</el-descriptions-item>
        <el-descriptions-item label="等级">{{ detailData.level }}</el-descriptions-item>
        <el-descriptions-item label="有效期">{{ detailData.validPeriod }}年</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ detailData.description }}</el-descriptions-item>
        <el-descriptions-item label="审核状态">
          <el-tag :type="getStatusTagType(detailData.status)">
            {{ getStatusText(detailData.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审核人" v-if="detailData.auditedBy">{{ detailData.auditedBy }}</el-descriptions-item>
        <el-descriptions-item label="审核时间" v-if="detailData.auditedAt">{{ detailData.auditedAt }}</el-descriptions-item>
        <el-descriptions-item label="审核意见" :span="2" v-if="detailData.auditedReason">{{ detailData.auditedReason }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { getCertificatesForAudit, auditCertificate } from '@/views/admin/adminApi.js';

export default {
  data() {
    return {
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
        decision: 'approve',
        reason: ''
      }
    };
  },
  created() {
    this.fetchCertificates();
  },
  methods: {
    async fetchCertificates() {
      try {
        const params = {
          ...this.filter,
          page: this.pagination.current,
          size: this.pagination.size
        };
        const res = await getCertificatesForAudit(params);
        this.certificates = res.data.records;
        this.pagination.total = res.data.total;
      } catch (error) {
        console.error('获取证书列表失败:', error);
        this.$message.error('获取证书列表失败');
      }
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
        decision: 'approve',
        reason: ''
      };
      this.auditDialogVisible = true;
    },
    showDetail(cert) {
      this.detailData = cert;
      this.detailDialogVisible = true;
    },
    async submitAudit() {
      try {
        const payload = {
          certificateId: this.currentCert.certificateId,
          decision: this.auditForm.decision,
          reason: this.auditForm.reason
        };
        await auditCertificate(payload);

        this.$message.success('审核提交成功');
        this.auditDialogVisible = false;
        this.fetchCertificates();
      } catch (error) {
        console.error('审核提交失败:', error);
        this.$message.error('审核提交失败');
      }
    },
    resetFilter() {
      this.filter = {
        status: '',
        expertId: ''
      };
      this.pagination.current = 1;
      this.fetchCertificates();
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.fetchCertificates();
    },
    handleCurrentChange(current) {
      this.pagination.current = current;
      this.fetchCertificates();
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

}
.filter-section {
  //margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
