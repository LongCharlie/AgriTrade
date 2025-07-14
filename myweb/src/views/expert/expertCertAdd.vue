<template>
  <div class="cert-add-container">
    <h2>上传新证书</h2>
    <el-card shadow="hover" class="expert-card">
    <el-form label-width="120px" @submit.prevent="submitCertificate">
      <el-form-item label="获得时间">
        <el-date-picker v-model="cert.obtainTime" type="date" placeholder="选择日期" />
      </el-form-item>

      <el-form-item label="等级">
        <el-input-number v-model="cert.level" :min="1" :max="5" />
      </el-form-item>

      <el-form-item label="有效期(年)">
        <el-input-number v-model="cert.validPeriod" :min="1" :max="10" />
      </el-form-item>

      <el-form-item label="授权单位">
        <el-input v-model="cert.authorizingUnit" placeholder="请输入证书的授权单位（如：中国农业协会）" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="cert.description" type="textarea" :rows="3"
                  placeholder="请输入证书的详细描述信息（如认证范围、专业领域、证书效力等）"/>
      </el-form-item>

      <el-button type="primary" native-type="submit">提交</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </el-form>
    </el-card>
    <div class="tip">请确保填写完整信息后再提交</div>
  </div>
</template>

<script>
import { uploadCertificate } from '@/views/expert/expertApi';

export default {
  data() {
    return {
      cert: {
        obtainTime: '',
        level: 1,
        validPeriod: 5,
        authorizingUnit: '',
        description: ''
      }
    };
  },
  methods: {
    async submitCertificate() {
      try {
        const expertId = this.$store.getters.userId;

        const payload = {
          expert_id: expertId,
          obtain_time: this.cert.obtainTime,
          level: this.cert.level,
          valid_period: this.cert.validPeriod,
          authorizing_unit: this.cert.authorizingUnit || '中国农业协会',
          description: this.cert.description
        };

        // mock 数据测试用
        const mockRes = {
          certificate_id: Math.floor(Math.random() * 1000)
        };

        // 实际接口调用
        // const res = await uploadCertificate(payload);

        this.$message.success('证书上传成功');

        // 提交完成后返回证书列表页
        this.$router.push('/expert/cert');
      } catch (error) {
        this.$message.error('上传失败，请检查网络或重试');
        console.error('上传证书失败:', error);
      }
    }
  }
};
</script>

<style scoped>
.cert-add-container {
  padding: 20px;
}

.tip {
  color: #999;
  font-size: 13px;
  margin-top: 10px;
}

.expert-card {
  margin-top: 20px;
  padding: 20px;
}
</style>
