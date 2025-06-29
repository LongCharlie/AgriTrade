<template>
  <div class="certifications-container">
    <h2>我的证书</h2>

    <!-- 证书列表 -->
    <!--
删除按钮 + /api/certificates/:id DELETE 接口
修改证书，添加编辑弹窗 + PATCH 接口
查看图片，图片字段用 image_path 显示图片
分页加载
审核状态显示 -->
    <el-table :data="certifications" style="width: 100%">
      <el-table-column prop="certificateId" label="证书ID" align="center" />
      <el-table-column prop="obtainTime" label="获得时间" align="center" />
      <el-table-column prop="level" label="等级" align="center" />
      <el-table-column prop="validPeriod" label="有效期(年)" align="center" />
      <el-table-column prop="authorizingUnit" label="授权单位" align="center" />
      <el-table-column prop="description" label="描述" align="center" />
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'valid' ? 'success' : 'danger'">
            {{ scope.row.status === 'valid' ? '有效' : '过期' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 上传证书表单 -->
    <h3 style="margin-top: 40px">上传新证书</h3>
    <el-form @submit.prevent="uploadCertificate" label-width="120px">
      <el-form-item label="获得时间">
        <el-date-picker v-model="newCert.obtainTime" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="等级">
        <el-input-number v-model="newCert.level" :min="1" :max="5" />
      </el-form-item>
      <el-form-item label="有效期(年)">
        <el-input-number v-model="newCert.validPeriod" :min="1" :max="10" />
      </el-form-item>
      <el-form-item label="授权单位">
        <el-input v-model="newCert.authorizingUnit" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="newCert.description" type="textarea" />
      </el-form-item>
      <el-button type="primary" native-type="submit">提交</el-button>
    </el-form>

    <!-- 空数据提示 -->
    <div v-if="!certifications.length" class="no-data">
      暂无证书记录
    </div>
  </div>
</template>

<script>
import { getMyCertificates, uploadCertificate } from '../../views/expert/expertApi';

export default {
  data() {
    return {
      certifications: [], // 存储证书列表
      newCert: {
        obtainTime: '',
        level: 1,
        validPeriod: 5,
        authorizingUnit: '中国农业协会',
        description: ''
      }
    };
  },
  created() {
    this.fetchCertificates();
  },
  methods: {
    async fetchCertificates() {
      try {
        const res = await getMyCertificates(); // 不再需要传 expertId
        this.certifications = res.map(cert => ({
          certificateId: cert.certificate_id,
          obtainTime: cert.obtain_time,
          level: cert.level,
          validPeriod: cert.valid_period,
          authorizingUnit: cert.authorizing_unit,
          description: cert.description || '暂无描述',
          status: cert.status
        }));
      } catch (error) {
        console.error('获取证书失败:', error);
        this.certifications = [];
      }
    },
    async uploadCertificate() {
      try {
        const expertId = this.$store.getters.userId; // 或者从 Vuex/token 中获取
        const payload = {
          expert_id: expertId, // 当前专家的 ID
          obtain_time: this.newCert.obtainTime,
          level: this.newCert.level,
          valid_period: this.newCert.validPeriod,
          authorizing_unit: this.newCert.authorizingUnit || '中国农业协会',
          description: this.newCert.description
        };

        const res = await uploadCertificate(payload);

        this.certifications.unshift({
          certificateId: res.certificate_id,
          obtainTime: payload.obtain_time,
          level: payload.level,
          validPeriod: payload.valid_period,
          authorizingUnit: payload.authorizing_unit,
          description: payload.description,
          status: 'valid'
        });

        this.newCert = {
          obtainTime: '',
          level: 1,
          validPeriod: 5,
          authorizingUnit: '中国农业协会',
          description: ''
        };

        this.$message.success('证书上传成功');
      } catch (error) {
        this.$message.error('证书上传失败');
        console.error('上传证书失败:', error);
      }
    }
  }
};
</script>

<style scoped>
.certifications-container {
  padding: 20px;
}

.no-data {
  text-align: center;
  margin-top: 20px;
  color: #999;
}
</style>
