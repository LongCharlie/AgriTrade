<!--<template>-->
<!--  <div class="cert-audit-container">-->
<!--    <h1>证书审核管理</h1>-->

<!--    &lt;!&ndash; 筛选区域 &ndash;&gt;-->
<!--    <div class="filter-section">-->
<!--      <el-form :inline="true">-->
<!--        <el-form-item label="审核状态">-->
<!--          <el-select v-model="filter.status" clearable placeholder="请选择">-->
<!--            <el-option label="待审核" value="pending"></el-option>-->
<!--            <el-option label="已通过" value="approved"></el-option>-->
<!--            <el-option label="已拒绝" value="rejected"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="专家ID">-->
<!--          <el-input v-model="filter.expertId" placeholder="专家ID"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button type="primary" @click="fetchCertificates">查询</el-button>-->
<!--          <el-button @click="resetFilter">重置</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--    </div>-->

<!--    &lt;!&ndash; 证书列表 &ndash;&gt;-->
<!--    <el-table :data="filteredCertificates" style="width: 100%">-->
<!--    <el-table-column prop="certificate_id" label="证书ID" width="100"></el-table-column>-->
<!--      <el-table-column prop="expert_id" label="专家ID" width="100"></el-table-column>-->
<!--      <el-table-column prop="authorizing_unit" label="授权单位"></el-table-column>-->
<!--      <el-table-column prop="obtain_time" label="获得时间" width="120"></el-table-column>-->
<!--      <el-table-column prop="level" label="等级" width="80"></el-table-column>-->
<!--      <el-table-column prop="valid_period" label="有效期(年)" width="100"></el-table-column>-->
<!--      <el-table-column label="审核状态" width="120">-->
<!--        <template #default="{row}">-->
<!--          <el-tag :type="getStatusTagType(row.status)">-->
<!--            {{ getStatusText(row.status) }}-->
<!--          </el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="操作" width="200" fixed="right">-->
<!--        <template #default="{row}">-->
<!--          <el-button size="small" @click="showDetail(row)">查看详情</el-button>-->
<!--          <el-button-->
<!--              v-if="row.status === 'pending'"-->
<!--              size="small"-->
<!--              type="primary"-->
<!--              @click="showAuditDialog(row)"-->
<!--          >-->
<!--            审核-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->

<!--    &lt;!&ndash; 分页 &ndash;&gt;-->
<!--    <div class="pagination">-->
<!--    <el-pagination-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--        :current-page="pagination.current"-->
<!--        :page-sizes="[10, 20, 50, 100]"-->
<!--        :page-size="pagination.size"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="pagination.total"-->
<!--    ></el-pagination>-->
<!--    </div>-->

<!--    &lt;!&ndash; 审核对话框 &ndash;&gt;-->
<!--    <el-dialog title="证书审核" v-model="auditDialogVisible" width="50%">-->
<!--      <el-form label-width="120px">-->
<!--        <el-form-item label="证书ID">-->
<!--          <span>{{ currentCert.certificate_id }}</span>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="专家ID">-->
<!--          <span>{{ currentCert.expert_id }}</span>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="授权单位">-->
<!--          <span>{{ currentCert.authorizing_unit }}</span>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="获得时间">-->
<!--          <span>{{ currentCert.obtain_time }}</span>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="审核结果">-->
<!--          <el-radio-group v-model="auditForm.decision">-->
<!--            <el-radio label="approve">通过</el-radio>-->
<!--            <el-radio label="reject">拒绝</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="审核意见">-->
<!--          <el-input-->
<!--              v-model="auditForm.reason"-->
<!--              type="textarea"-->
<!--              :rows="3"-->
<!--              placeholder="请输入审核意见"-->
<!--          ></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button type="primary" @click="submitAudit">提交</el-button>-->
<!--          <el-button @click="auditDialogVisible = false">取消</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--    </el-dialog>-->

<!--    &lt;!&ndash; 详情对话框 &ndash;&gt;-->
<!--    <el-dialog title="证书详情" v-model="detailDialogVisible" width="60%">-->
<!--      <el-descriptions :column="2" border>-->
<!--        <el-descriptions-item label="证书ID">{{ detailData.certificate_id }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="专家ID">{{ detailData.expert_id }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="授权单位">{{ detailData.authorizing_unit }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="获得时间">{{ detailData.obtain_time }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="等级">{{ detailData.level }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="有效期">{{ detailData.valid_period }}年</el-descriptions-item>-->
<!--        <el-descriptions-item label="描述" :span="2">{{ detailData.description }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="审核状态">-->
<!--          <el-tag :type="getStatusTagType(detailData.status)">-->
<!--            {{ getStatusText(detailData.status) }}-->
<!--          </el-tag>-->
<!--        </el-descriptions-item>-->
<!--        <el-descriptions-item label="审核人" v-if="detailData.audited_by">{{ detailData.audited_by }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="审核时间" v-if="detailData.audited_at">{{ detailData.audited_at }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="审核意见" :span="2" v-if="detailData.audited_reason">{{ detailData.audited_reason }}</el-descriptions-item>-->
<!--      </el-descriptions>-->
<!--    </el-dialog>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--// import { getCertificatesForAudit, auditCertificate } from '@/views/admin/adminApi.js';-->
<!--import axios from "axios";-->
<!--import {useUserStore} from "@/stores/user";-->

<!--export default {-->
<!--  name: 'AdminCert',-->
<!--  setup() {-->
<!--    const userStore = useUserStore();-->
<!--    return {-->
<!--      userStore-->
<!--    };-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      allCertificates: [], // 存储所有从后端获取的数据-->
<!--      certificates: [],    // 存储当前页显示的数据-->
<!--      filter: {-->
<!--        status: '',-->
<!--        expertId: ''-->
<!--      },-->
<!--      pagination: {-->
<!--        current: 1,-->
<!--        size: 10,-->
<!--        total: 0-->
<!--      },-->
<!--      auditDialogVisible: false,-->
<!--      detailDialogVisible: false,-->
<!--      currentCert: {},-->
<!--      detailData: {},-->
<!--      auditForm: {-->
<!--        decision: 'approve',-->
<!--        reason: ''-->
<!--      }-->
<!--    };-->
<!--  },-->
<!--  created() {-->
<!--    this.fetchCertificates();-->
<!--  },-->
<!--  computed: {-->
<!--    filteredCertificates() {-->
<!--      let filtered = [...this.allCertificates];-->

<!--      // 根据审核状态筛选-->
<!--      if (this.filter.status) {-->
<!--        filtered = filtered.filter(cert => cert.status === this.filter.status);-->
<!--      }-->

<!--      // 根据专家ID筛选-->
<!--      if (this.filter.expertId) {-->
<!--        filtered = filtered.filter(cert =>-->
<!--            cert.expert_id && cert.expert_id.toString().includes(this.filter.expertId)-->
<!--        );-->
<!--      }-->

<!--      // 更新分页总数-->
<!--      this.pagination.total = filtered.length;-->

<!--      // 实现分页-->
<!--      const start = (this.pagination.current - 1) * this.pagination.size;-->
<!--      const end = start + this.pagination.size;-->
<!--      this.certificates = filtered.slice(start, end);-->

<!--      return this.certificates;-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    async fetchCertificates() {-->
<!--      try {-->
<!--        const token = this.userStore.token;-->
<!--        //改-->
<!--        const res = await axios.get('http://localhost:3000/api/admin/certificates', {-->
<!--          headers: {-->
<!--            Authorization: `Bearer ${token}`-->
<!--          }-->
<!--        })-->
<!--        this.allCertificates = res.data;-->
<!--        this.pagination.total = res.data.length;-->
<!--        // this.pagination.total = res.data.total;-->
<!--      } catch (error) {-->
<!--        console.error('获取证书列表失败:', error);-->
<!--        this.$message.error('获取证书列表失败');-->
<!--      }-->
<!--    },-->
<!--    getStatusText(status) {-->
<!--      const map = {-->
<!--        pending: '待审核',-->
<!--        approved: '已通过',-->
<!--        rejected: '已拒绝'-->
<!--      };-->
<!--      return map[status] || status;-->
<!--    },-->
<!--    getStatusTagType(status) {-->
<!--      const map = {-->
<!--        pending: 'warning',-->
<!--        approved: 'success',-->
<!--        rejected: 'danger'-->
<!--      };-->
<!--      return map[status] || '';-->
<!--    },-->
<!--    showAuditDialog(cert) {-->
<!--      this.currentCert = cert;-->
<!--      this.auditForm = {-->
<!--        decision: 'approve',-->
<!--        reason: ''-->
<!--      };-->
<!--      this.auditDialogVisible = true;-->
<!--    },-->
<!--    showDetail(cert) {-->
<!--      this.detailData = cert;-->
<!--      this.detailDialogVisible = true;-->
<!--    },-->
<!--    async submitAudit() {-->
<!--      try {-->
<!--        const payload = { //audited_at后端补-->
<!--          decision: this.auditForm.decision,//对应is_audited-->
<!--          reason: this.auditForm.reason,//对应audited_reason-->
<!--          auditedBy: this.userStore.userId//从token获取也行，这里直接传了-->
<!--        };-->
<!--        const token = this.userStore.token;-->
<!--        //改-->
<!--        await axios.post(`http://localhost:3000/api/certificates/${this.currentCert.certificate_id}/approve`, payload, {-->
<!--          headers: {-->
<!--            Authorization: `Bearer ${token}`-->
<!--          }-->
<!--        });-->

<!--        this.$message.success('审核提交成功');-->
<!--        this.auditDialogVisible = false;-->
<!--        this.fetchCertificates();-->
<!--      } catch (error) {-->
<!--        console.error('审核提交失败:', error);-->
<!--        this.$message.error('审核提交失败');-->
<!--      }-->
<!--    },-->
<!--    // 修改分页处理方法-->
<!--    handleSizeChange(size) {-->
<!--      this.pagination.size = size;-->
<!--      this.pagination.current = 1; // 重置到第一页-->
<!--      // 触发重新计算-->
<!--      this.filteredCertificates;-->
<!--    },-->
<!--    handleCurrentChange(current) {-->
<!--      this.pagination.current = current;-->
<!--      // 触发重新计算-->
<!--      this.filteredCertificates;-->
<!--    },-->
<!--    resetFilter() {-->
<!--      this.filter = {-->
<!--        status: '',-->
<!--        expertId: ''-->
<!--      };-->
<!--      this.pagination.current = 1;-->
<!--      // 触发重新计算-->
<!--      this.filteredCertificates;-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.pagination {-->
<!--  margin-top: 20px;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--}-->

<!--.cert-audit-container {-->

<!--}-->
<!--.filter-section {-->
<!--  //margin-bottom: 20px;-->
<!--}-->
<!--.el-pagination {-->
<!--  margin-top: 20px;-->
<!--  text-align: right;-->
<!--}-->
<!--</style>-->
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
        <el-descriptions-item label="证书ID">{{ detailData.certificate_id }}</el-descriptions-item>
        <el-descriptions-item label="专家ID">{{ detailData.expert_id }}</el-descriptions-item>
        <el-descriptions-item label="授权单位">{{ detailData.authorizing_unit }}</el-descriptions-item>
        <el-descriptions-item label="获得时间">{{ formatDate(detailData.obtain_time) }}</el-descriptions-item>
        <el-descriptions-item label="等级">{{ detailData.level }}</el-descriptions-item>
        <el-descriptions-item label="有效期">{{ detailData.valid_period }}年</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ detailData.description }}</el-descriptions-item>
        <el-descriptions-item label="审核状态">
          <el-tag :type="getStatusTagType(detailData.status)">
            {{ getStatusText(detailData.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审核人" v-if="detailData.audited_by">{{ detailData.audited_by }}</el-descriptions-item>
        <el-descriptions-item label="审核时间" v-if="detailData.audited_at">{{ formatDate(detailData.audited_at) }}</el-descriptions-item>
        <el-descriptions-item label="审核意见" :span="2" v-if="detailData.audited_reason">{{ detailData.audited_reason }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
// import { getCertificatesForAudit, auditCertificate } from '@/views/admin/adminApi.js';
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
      allCertificates: [], // 存储所有从后端获取的数据
      certificates: [],    // 存储当前页显示的数据
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
  computed: {
    filteredCertificates() {
      let filtered = [...this.allCertificates];

      // 根据审核状态筛选
      if (this.filter.status) {
        filtered = filtered.filter(cert => cert.status === this.filter.status);
      }

      // 根据专家ID筛选
      if (this.filter.expertId) {
        filtered = filtered.filter(cert =>
            cert.expert_id && cert.expert_id.toString().includes(this.filter.expertId)
        );
      }

      // 更新分页总数
      this.pagination.total = filtered.length;

      // 实现分页
      const start = (this.pagination.current - 1) * this.pagination.size;
      const end = start + this.pagination.size;
      this.certificates = filtered.slice(start, end);

      return this.certificates;
    }
  },
  methods: {
    async fetchCertificates() {
      try {
        const token = this.userStore.token;
        //改
        const res = await axios.get('http://localhost:3000/api/admin/certificates', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.allCertificates = res.data;
        this.pagination.total = res.data.length;
        // this.pagination.total = res.data.total;
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
        const payload = { //audited_at后端补
          decision: this.auditForm.decision,//对应is_audited
          reason: this.auditForm.reason,//对应audited_reason
          auditedBy: this.userStore.userId//从token获取也行，这里直接传了
        };
        const token = this.userStore.token;
        //改
        await axios.post(`http://localhost:3000/api/admin/certificates/${this.currentCert.certificate_id}/approve`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.$message.success('审核提交成功');
        this.auditDialogVisible = false;
        this.fetchCertificates();
      } catch (error) {
        console.error('审核提交失败:', error);
        this.$message.error('审核提交失败');
      }
    },
    // 修改分页处理方法
    handleSizeChange(size) {
      this.pagination.size = size;
      this.pagination.current = 1; // 重置到第一页
      // 触发重新计算
      this.filteredCertificates;
    },
    handleCurrentChange(current) {
      this.pagination.current = current;
      // 触发重新计算
      this.filteredCertificates;
    },
    resetFilter() {
      this.filter = {
        status: '',
        expertId: ''
      };
      this.pagination.current = 1;
      // 触发重新计算
      this.filteredCertificates;
    },
    // 添加日期格式化方法
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
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
