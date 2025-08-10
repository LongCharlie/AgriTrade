<!--&lt;!&ndash;<template>&ndash;&gt;-->
<!--&lt;!&ndash;  <div class="cert-audit-container">&ndash;&gt;-->
<!--&lt;!&ndash;    <h1>证书审核管理</h1>&ndash;&gt;-->

<!--&lt;!&ndash;    &lt;!&ndash; 筛选区域 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;    <div class="filter-section">&ndash;&gt;-->
<!--&lt;!&ndash;      <el-form :inline="true">&ndash;&gt;-->
<!--&lt;!&ndash;        <el-form-item label="审核状态">&ndash;&gt;-->
<!--&lt;!&ndash;          <el-select v-model="filter.status" clearable placeholder="请选择">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-option label="待审核" value="pending"></el-option>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-option label="已通过" value="approved"></el-option>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-option label="已拒绝" value="rejected"></el-option>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-select>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-form-item label="专家ID">&ndash;&gt;-->
<!--&lt;!&ndash;          <el-input v-model="filter.expertId" placeholder="专家ID"></el-input>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-button type="primary" @click="fetchCertificates">查询</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-button @click="resetFilter">重置</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;      </el-form>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->

<!--&lt;!&ndash;    &lt;!&ndash; 证书列表 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;    <el-table :data="filteredCertificates" style="width: 100%">&ndash;&gt;-->
<!--&lt;!&ndash;    <el-table-column prop="certificate_id" label="证书ID" width="100"></el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;      <el-table-column prop="expert_id" label="专家ID" width="100"></el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;      <el-table-column prop="authorizing_unit" label="授权单位"></el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;      <el-table-column prop="obtain_time" label="获得时间" width="120"></el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;      <el-table-column prop="level" label="等级" width="80"></el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;      <el-table-column prop="valid_period" label="有效期(年)" width="100"></el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;      <el-table-column label="审核状态" width="120">&ndash;&gt;-->
<!--&lt;!&ndash;        <template #default="{row}">&ndash;&gt;-->
<!--&lt;!&ndash;          <el-tag :type="getStatusTagType(row.status)">&ndash;&gt;-->
<!--&lt;!&ndash;            {{ getStatusText(row.status) }}&ndash;&gt;-->
<!--&lt;!&ndash;          </el-tag>&ndash;&gt;-->
<!--&lt;!&ndash;        </template>&ndash;&gt;-->
<!--&lt;!&ndash;      </el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;      <el-table-column label="操作" width="200" fixed="right">&ndash;&gt;-->
<!--&lt;!&ndash;        <template #default="{row}">&ndash;&gt;-->
<!--&lt;!&ndash;          <el-button size="small" @click="showDetail(row)">查看详情</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-button&ndash;&gt;-->
<!--&lt;!&ndash;              v-if="row.status === 'pending'"&ndash;&gt;-->
<!--&lt;!&ndash;              size="small"&ndash;&gt;-->
<!--&lt;!&ndash;              type="primary"&ndash;&gt;-->
<!--&lt;!&ndash;              @click="showAuditDialog(row)"&ndash;&gt;-->
<!--&lt;!&ndash;          >&ndash;&gt;-->
<!--&lt;!&ndash;            审核&ndash;&gt;-->
<!--&lt;!&ndash;          </el-button>&ndash;&gt;-->
<!--&lt;!&ndash;        </template>&ndash;&gt;-->
<!--&lt;!&ndash;      </el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;    </el-table>&ndash;&gt;-->

<!--&lt;!&ndash;    &lt;!&ndash; 分页 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;    <div class="pagination">&ndash;&gt;-->
<!--&lt;!&ndash;    <el-pagination&ndash;&gt;-->
<!--&lt;!&ndash;        @size-change="handleSizeChange"&ndash;&gt;-->
<!--&lt;!&ndash;        @current-change="handleCurrentChange"&ndash;&gt;-->
<!--&lt;!&ndash;        :current-page="pagination.current"&ndash;&gt;-->
<!--&lt;!&ndash;        :page-sizes="[10, 20, 50, 100]"&ndash;&gt;-->
<!--&lt;!&ndash;        :page-size="pagination.size"&ndash;&gt;-->
<!--&lt;!&ndash;        layout="total, sizes, prev, pager, next, jumper"&ndash;&gt;-->
<!--&lt;!&ndash;        :total="pagination.total"&ndash;&gt;-->
<!--&lt;!&ndash;    ></el-pagination>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->

<!--&lt;!&ndash;    &lt;!&ndash; 审核对话框 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;    <el-dialog title="证书审核" v-model="auditDialogVisible" width="50%">&ndash;&gt;-->
<!--&lt;!&ndash;      <el-form label-width="120px">&ndash;&gt;-->
<!--&lt;!&ndash;        <el-form-item label="证书ID">&ndash;&gt;-->
<!--&lt;!&ndash;          <span>{{ currentCert.certificate_id }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-form-item label="专家ID">&ndash;&gt;-->
<!--&lt;!&ndash;          <span>{{ currentCert.expert_id }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-form-item label="授权单位">&ndash;&gt;-->
<!--&lt;!&ndash;          <span>{{ currentCert.authorizing_unit }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-form-item label="获得时间">&ndash;&gt;-->
<!--&lt;!&ndash;          <span>{{ currentCert.obtain_time }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-form-item label="审核结果">&ndash;&gt;-->
<!--&lt;!&ndash;          <el-radio-group v-model="auditForm.decision">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-radio label="approve">通过</el-radio>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-radio label="reject">拒绝</el-radio>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-radio-group>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-form-item label="审核意见">&ndash;&gt;-->
<!--&lt;!&ndash;          <el-input&ndash;&gt;-->
<!--&lt;!&ndash;              v-model="auditForm.reason"&ndash;&gt;-->
<!--&lt;!&ndash;              type="textarea"&ndash;&gt;-->
<!--&lt;!&ndash;              :rows="3"&ndash;&gt;-->
<!--&lt;!&ndash;              placeholder="请输入审核意见"&ndash;&gt;-->
<!--&lt;!&ndash;          ></el-input>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-button type="primary" @click="submitAudit">提交</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-button @click="auditDialogVisible = false">取消</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;      </el-form>&ndash;&gt;-->
<!--&lt;!&ndash;    </el-dialog>&ndash;&gt;-->

<!--&lt;!&ndash;    &lt;!&ndash; 详情对话框 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;    <el-dialog title="证书详情" v-model="detailDialogVisible" width="60%">&ndash;&gt;-->
<!--&lt;!&ndash;      <el-descriptions :column="2" border>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-descriptions-item label="证书ID">{{ detailData.certificate_id }}</el-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-descriptions-item label="专家ID">{{ detailData.expert_id }}</el-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-descriptions-item label="授权单位">{{ detailData.authorizing_unit }}</el-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-descriptions-item label="获得时间">{{ detailData.obtain_time }}</el-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-descriptions-item label="等级">{{ detailData.level }}</el-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-descriptions-item label="有效期">{{ detailData.valid_period }}年</el-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-descriptions-item label="描述" :span="2">{{ detailData.description }}</el-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-descriptions-item label="审核状态">&ndash;&gt;-->
<!--&lt;!&ndash;          <el-tag :type="getStatusTagType(detailData.status)">&ndash;&gt;-->
<!--&lt;!&ndash;            {{ getStatusText(detailData.status) }}&ndash;&gt;-->
<!--&lt;!&ndash;          </el-tag>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-descriptions-item label="审核人" v-if="detailData.audited_by">{{ detailData.audited_by }}</el-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-descriptions-item label="审核时间" v-if="detailData.audited_at">{{ detailData.audited_at }}</el-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-descriptions-item label="审核意见" :span="2" v-if="detailData.audited_reason">{{ detailData.audited_reason }}</el-descriptions-item>&ndash;&gt;-->
<!--&lt;!&ndash;      </el-descriptions>&ndash;&gt;-->
<!--&lt;!&ndash;    </el-dialog>&ndash;&gt;-->
<!--&lt;!&ndash;  </div>&ndash;&gt;-->
<!--&lt;!&ndash;</template>&ndash;&gt;-->

<!--&lt;!&ndash;<script>&ndash;&gt;-->
<!--&lt;!&ndash;// import { getCertificatesForAudit, auditCertificate } from '@/views/admin/adminApi.js';&ndash;&gt;-->
<!--&lt;!&ndash;import axios from "axios";&ndash;&gt;-->
<!--&lt;!&ndash;import {useUserStore} from "@/stores/user";&ndash;&gt;-->

<!--&lt;!&ndash;export default {&ndash;&gt;-->
<!--&lt;!&ndash;  name: 'AdminCert',&ndash;&gt;-->
<!--&lt;!&ndash;  setup() {&ndash;&gt;-->
<!--&lt;!&ndash;    const userStore = useUserStore();&ndash;&gt;-->
<!--&lt;!&ndash;    return {&ndash;&gt;-->
<!--&lt;!&ndash;      userStore&ndash;&gt;-->
<!--&lt;!&ndash;    };&ndash;&gt;-->
<!--&lt;!&ndash;  },&ndash;&gt;-->
<!--&lt;!&ndash;  data() {&ndash;&gt;-->
<!--&lt;!&ndash;    return {&ndash;&gt;-->
<!--&lt;!&ndash;      allCertificates: [], // 存储所有从后端获取的数据&ndash;&gt;-->
<!--&lt;!&ndash;      certificates: [],    // 存储当前页显示的数据&ndash;&gt;-->
<!--&lt;!&ndash;      filter: {&ndash;&gt;-->
<!--&lt;!&ndash;        status: '',&ndash;&gt;-->
<!--&lt;!&ndash;        expertId: ''&ndash;&gt;-->
<!--&lt;!&ndash;      },&ndash;&gt;-->
<!--&lt;!&ndash;      pagination: {&ndash;&gt;-->
<!--&lt;!&ndash;        current: 1,&ndash;&gt;-->
<!--&lt;!&ndash;        size: 10,&ndash;&gt;-->
<!--&lt;!&ndash;        total: 0&ndash;&gt;-->
<!--&lt;!&ndash;      },&ndash;&gt;-->
<!--&lt;!&ndash;      auditDialogVisible: false,&ndash;&gt;-->
<!--&lt;!&ndash;      detailDialogVisible: false,&ndash;&gt;-->
<!--&lt;!&ndash;      currentCert: {},&ndash;&gt;-->
<!--&lt;!&ndash;      detailData: {},&ndash;&gt;-->
<!--&lt;!&ndash;      auditForm: {&ndash;&gt;-->
<!--&lt;!&ndash;        decision: 'approve',&ndash;&gt;-->
<!--&lt;!&ndash;        reason: ''&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    };&ndash;&gt;-->
<!--&lt;!&ndash;  },&ndash;&gt;-->
<!--&lt;!&ndash;  created() {&ndash;&gt;-->
<!--&lt;!&ndash;    this.fetchCertificates();&ndash;&gt;-->
<!--&lt;!&ndash;  },&ndash;&gt;-->
<!--&lt;!&ndash;  computed: {&ndash;&gt;-->
<!--&lt;!&ndash;    filteredCertificates() {&ndash;&gt;-->
<!--&lt;!&ndash;      let filtered = [...this.allCertificates];&ndash;&gt;-->

<!--&lt;!&ndash;      // 根据审核状态筛选&ndash;&gt;-->
<!--&lt;!&ndash;      if (this.filter.status) {&ndash;&gt;-->
<!--&lt;!&ndash;        filtered = filtered.filter(cert => cert.status === this.filter.status);&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->

<!--&lt;!&ndash;      // 根据专家ID筛选&ndash;&gt;-->
<!--&lt;!&ndash;      if (this.filter.expertId) {&ndash;&gt;-->
<!--&lt;!&ndash;        filtered = filtered.filter(cert =>&ndash;&gt;-->
<!--&lt;!&ndash;            cert.expert_id && cert.expert_id.toString().includes(this.filter.expertId)&ndash;&gt;-->
<!--&lt;!&ndash;        );&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->

<!--&lt;!&ndash;      // 更新分页总数&ndash;&gt;-->
<!--&lt;!&ndash;      this.pagination.total = filtered.length;&ndash;&gt;-->

<!--&lt;!&ndash;      // 实现分页&ndash;&gt;-->
<!--&lt;!&ndash;      const start = (this.pagination.current - 1) * this.pagination.size;&ndash;&gt;-->
<!--&lt;!&ndash;      const end = start + this.pagination.size;&ndash;&gt;-->
<!--&lt;!&ndash;      this.certificates = filtered.slice(start, end);&ndash;&gt;-->

<!--&lt;!&ndash;      return this.certificates;&ndash;&gt;-->
<!--&lt;!&ndash;    }&ndash;&gt;-->
<!--&lt;!&ndash;  },&ndash;&gt;-->
<!--&lt;!&ndash;  methods: {&ndash;&gt;-->
<!--&lt;!&ndash;    async fetchCertificates() {&ndash;&gt;-->
<!--&lt;!&ndash;      try {&ndash;&gt;-->
<!--&lt;!&ndash;        const token = this.userStore.token;&ndash;&gt;-->
<!--&lt;!&ndash;        //改&ndash;&gt;-->
<!--&lt;!&ndash;        const res = await axios.get('http://localhost:3000/api/admin/certificates', {&ndash;&gt;-->
<!--&lt;!&ndash;          headers: {&ndash;&gt;-->
<!--&lt;!&ndash;            Authorization: `Bearer ${token}`&ndash;&gt;-->
<!--&lt;!&ndash;          }&ndash;&gt;-->
<!--&lt;!&ndash;        })&ndash;&gt;-->
<!--&lt;!&ndash;        this.allCertificates = res.data;&ndash;&gt;-->
<!--&lt;!&ndash;        this.pagination.total = res.data.length;&ndash;&gt;-->
<!--&lt;!&ndash;        // this.pagination.total = res.data.total;&ndash;&gt;-->
<!--&lt;!&ndash;      } catch (error) {&ndash;&gt;-->
<!--&lt;!&ndash;        console.error('获取证书列表失败:', error);&ndash;&gt;-->
<!--&lt;!&ndash;        this.$message.error('获取证书列表失败');&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    getStatusText(status) {&ndash;&gt;-->
<!--&lt;!&ndash;      const map = {&ndash;&gt;-->
<!--&lt;!&ndash;        pending: '待审核',&ndash;&gt;-->
<!--&lt;!&ndash;        approved: '已通过',&ndash;&gt;-->
<!--&lt;!&ndash;        rejected: '已拒绝'&ndash;&gt;-->
<!--&lt;!&ndash;      };&ndash;&gt;-->
<!--&lt;!&ndash;      return map[status] || status;&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    getStatusTagType(status) {&ndash;&gt;-->
<!--&lt;!&ndash;      const map = {&ndash;&gt;-->
<!--&lt;!&ndash;        pending: 'warning',&ndash;&gt;-->
<!--&lt;!&ndash;        approved: 'success',&ndash;&gt;-->
<!--&lt;!&ndash;        rejected: 'danger'&ndash;&gt;-->
<!--&lt;!&ndash;      };&ndash;&gt;-->
<!--&lt;!&ndash;      return map[status] || '';&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    showAuditDialog(cert) {&ndash;&gt;-->
<!--&lt;!&ndash;      this.currentCert = cert;&ndash;&gt;-->
<!--&lt;!&ndash;      this.auditForm = {&ndash;&gt;-->
<!--&lt;!&ndash;        decision: 'approve',&ndash;&gt;-->
<!--&lt;!&ndash;        reason: ''&ndash;&gt;-->
<!--&lt;!&ndash;      };&ndash;&gt;-->
<!--&lt;!&ndash;      this.auditDialogVisible = true;&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    showDetail(cert) {&ndash;&gt;-->
<!--&lt;!&ndash;      this.detailData = cert;&ndash;&gt;-->
<!--&lt;!&ndash;      this.detailDialogVisible = true;&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    async submitAudit() {&ndash;&gt;-->
<!--&lt;!&ndash;      try {&ndash;&gt;-->
<!--&lt;!&ndash;        const payload = { //audited_at后端补&ndash;&gt;-->
<!--&lt;!&ndash;          decision: this.auditForm.decision,//对应is_audited&ndash;&gt;-->
<!--&lt;!&ndash;          reason: this.auditForm.reason,//对应audited_reason&ndash;&gt;-->
<!--&lt;!&ndash;          auditedBy: this.userStore.userId//从token获取也行，这里直接传了&ndash;&gt;-->
<!--&lt;!&ndash;        };&ndash;&gt;-->
<!--&lt;!&ndash;        const token = this.userStore.token;&ndash;&gt;-->
<!--&lt;!&ndash;        //改&ndash;&gt;-->
<!--&lt;!&ndash;        await axios.post(`http://localhost:3000/api/certificates/${this.currentCert.certificate_id}/approve`, payload, {&ndash;&gt;-->
<!--&lt;!&ndash;          headers: {&ndash;&gt;-->
<!--&lt;!&ndash;            Authorization: `Bearer ${token}`&ndash;&gt;-->
<!--&lt;!&ndash;          }&ndash;&gt;-->
<!--&lt;!&ndash;        });&ndash;&gt;-->

<!--&lt;!&ndash;        this.$message.success('审核提交成功');&ndash;&gt;-->
<!--&lt;!&ndash;        this.auditDialogVisible = false;&ndash;&gt;-->
<!--&lt;!&ndash;        this.fetchCertificates();&ndash;&gt;-->
<!--&lt;!&ndash;      } catch (error) {&ndash;&gt;-->
<!--&lt;!&ndash;        console.error('审核提交失败:', error);&ndash;&gt;-->
<!--&lt;!&ndash;        this.$message.error('审核提交失败');&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    // 修改分页处理方法&ndash;&gt;-->
<!--&lt;!&ndash;    handleSizeChange(size) {&ndash;&gt;-->
<!--&lt;!&ndash;      this.pagination.size = size;&ndash;&gt;-->
<!--&lt;!&ndash;      this.pagination.current = 1; // 重置到第一页&ndash;&gt;-->
<!--&lt;!&ndash;      // 触发重新计算&ndash;&gt;-->
<!--&lt;!&ndash;      this.filteredCertificates;&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    handleCurrentChange(current) {&ndash;&gt;-->
<!--&lt;!&ndash;      this.pagination.current = current;&ndash;&gt;-->
<!--&lt;!&ndash;      // 触发重新计算&ndash;&gt;-->
<!--&lt;!&ndash;      this.filteredCertificates;&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    resetFilter() {&ndash;&gt;-->
<!--&lt;!&ndash;      this.filter = {&ndash;&gt;-->
<!--&lt;!&ndash;        status: '',&ndash;&gt;-->
<!--&lt;!&ndash;        expertId: ''&ndash;&gt;-->
<!--&lt;!&ndash;      };&ndash;&gt;-->
<!--&lt;!&ndash;      this.pagination.current = 1;&ndash;&gt;-->
<!--&lt;!&ndash;      // 触发重新计算&ndash;&gt;-->
<!--&lt;!&ndash;      this.filteredCertificates;&ndash;&gt;-->
<!--&lt;!&ndash;    }&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;};&ndash;&gt;-->
<!--&lt;!&ndash;</script>&ndash;&gt;-->

<!--&lt;!&ndash;<style scoped>&ndash;&gt;-->
<!--&lt;!&ndash;.pagination {&ndash;&gt;-->
<!--&lt;!&ndash;  margin-top: 20px;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: center;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.cert-audit-container {&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.filter-section {&ndash;&gt;-->
<!--&lt;!&ndash;  //margin-bottom: 20px;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.el-pagination {&ndash;&gt;-->
<!--&lt;!&ndash;  margin-top: 20px;&ndash;&gt;-->
<!--&lt;!&ndash;  text-align: right;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;</style>&ndash;&gt;-->
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
<!--      <el-table-column prop="certificate_id" label="证书ID" width="100"></el-table-column>-->
<!--      <el-table-column prop="expert_id" label="专家ID" width="100"></el-table-column>-->
<!--      <el-table-column prop="authorizing_unit" label="授权单位"></el-table-column>-->
<!--      <el-table-column prop="obtain_time" label="获得时间" width="120">-->
<!--        <template #default="{row}">-->
<!--          {{ formatDate(row.obtain_time) }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="level" label="等级" width="80"></el-table-column>-->
<!--      <el-table-column prop="valid_period" label="有效期(年)" width="100"></el-table-column>-->
<!--      <el-table-column label="审核状态" width="120">-->
<!--        <template #default="{row}">-->
<!--          <el-tag :type="getStatusTagType(row.is_audited)">-->
<!--            {{ getStatusText(row.is_audited) }}-->
<!--          </el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="操作" width="200" fixed="right">-->
<!--        <template #default="{row}">-->
<!--          <el-button size="small" @click="showDetail(row)">查看详情</el-button>-->
<!--          <el-button-->
<!--              v-if="row.is_audited === 'pending'"-->
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
<!--      <el-pagination-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--          :current-page="pagination.current"-->
<!--          :page-sizes="[10, 20, 50, 100]"-->
<!--          :page-size="pagination.size"-->
<!--          layout="total, sizes, prev, pager, next, jumper"-->
<!--          :total="pagination.total"-->
<!--      ></el-pagination>-->
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
<!--          <span>{{ formatDate(currentCert.obtain_time) }}</span>-->
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
<!--        <el-descriptions-item label="获得时间">{{ formatDate(detailData.obtain_time) }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="等级">{{ detailData.level }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="有效期">{{ detailData.valid_period }}年</el-descriptions-item>-->
<!--        <el-descriptions-item label="描述" :span="2">{{ detailData.description }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="审核状态">-->
<!--          <el-tag :type="getStatusTagType(detailData.is_audited)">-->
<!--            {{ getStatusText(detailData.is_audited) }}-->
<!--          </el-tag>-->
<!--        </el-descriptions-item>-->
<!--        <el-descriptions-item label="审核人" v-if="detailData.audited_by">{{ detailData.audited_by }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="审核时间" v-if="detailData.audited_at">{{ formatDate(detailData.audited_at) }}</el-descriptions-item>-->
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
<!--        const res = await axios.get('http://localhost:3000/api/certificates', {-->
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
<!--          //auditedBy: this.userStore.userId//从token获取也行，这里直接传了-->
<!--        };-->
<!--        const token = this.userStore.token;-->
<!--        //改-->
<!--        await axios.patch(`http://localhost:3000/api/certificates/${this.currentCert.certificate_id}/status`, payload, {-->
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
<!--    },-->
<!--    // 添加日期格式化方法-->
<!--    formatDate(dateString) {-->
<!--      if (!dateString) return '';-->
<!--      const date = new Date(dateString);-->
<!--      const year = date.getFullYear();-->
<!--      const month = String(date.getMonth() + 1).padStart(2, '0');-->
<!--      const day = String(date.getDate()).padStart(2, '0');-->
<!--      return `${year}-${month}-${day}`;-->
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
              <el-descriptions-item label="专家姓名" :span="2">{{ detailData.expert_name }}</el-descriptions-item>
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
              <el-descriptions-item label="审核人" v-if="detailData.reviewed_by">{{ detailData.reviewed_by }}</el-descriptions-item>
              <el-descriptions-item label="审核时间" v-if="detailData.reviewed_at">{{ formatDate(detailData.reviewed_at) }}</el-descriptions-item>
              <el-descriptions-item label="拒绝原因" :span="2" v-if="detailData.reject_reason">{{ detailData.reject_reason }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="8">
            <div class="certificate-image-section">
              <h3>证书图片</h3>
              <div v-if="detailData.image_url" class="image-container">
                <el-image
                    :src="getImageUrl(detailData.image_url)"
                    class="certificate-image"
                    fit="contain"
                    :preview-src-list="[getImageUrl(detailData.image_url)]"
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
        const res = await axios.get(`http://localhost:3000/api/admin/certificates/${cert.certificate_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.detailData = res.data;
        this.detailDialogVisible = true;
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