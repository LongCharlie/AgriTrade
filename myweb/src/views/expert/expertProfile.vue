<template>
  <div class="expert-profile-container">
    <el-card class="profile-card">
      <div slot="header">
        <h3>个人信息</h3>
      </div>

      <!-- 用户信息 -->
      <div class="user-info">
        <p><strong>用户名：</strong>{{ user.username }}</p>
        <p><strong>手机号：</strong>{{ user.phone }}</p>
        <p><strong>地址：</strong>{{ user.province }} {{ user.city }} {{ user.district }}</p>
        <p v-if="user.address_detail"><strong>详细地址：</strong>{{ user.address_detail }}</p>
      </div>

      <!-- 专家信息表单 -->
      <el-form ref="form" :model="expert" label-width="100px" @submit.prevent="submitExpertInfo">
        <el-form-item label="真实姓名">
          <el-input v-model="expert.realName" disabled></el-input>
        </el-form-item>

        <el-form-item label="职称">
          <el-input v-model="expert.title" placeholder="请输入职称"></el-input>
        </el-form-item>

        <el-form-item label="所属机构">
          <el-input v-model="expert.institution" placeholder="请输入机构名称"></el-input>
        </el-form-item>

        <el-form-item label="专业领域">
          <el-input v-model="expert.expertise" placeholder="请输入专业领域"></el-input>
        </el-form-item>

        <el-form-item label="个人简介">
          <el-input type="textarea" v-model="expert.bio" placeholder="请填写个人简介"></el-input>
        </el-form-item>

        <el-button type="primary" native-type="submit">保存修改</el-button>
      </el-form>

      <!-- 证书部分 -->
      <div class="certificates-section">
        <h4>我的证书</h4>
        <el-button type="success" @click="uploadCertificate">上传新证书</el-button>
        <el-table :data="certificates" border style="width: 100%" v-if="certificates.length > 0">
          <el-table-column prop="obtain_time" label="获得时间" width="150"></el-table-column>
          <el-table-column prop="level" label="等级" width="80"></el-table-column>
          <el-table-column prop="valid_period" label="有效期(年)" width="120"></el-table-column>
          <el-table-column prop="authorizing_unit" label="授权单位"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="{row}">
              <el-tag :type="row.status === 'valid' ? 'success' : 'danger'">
                {{ row.status === 'valid' ? '有效' : '过期' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <p v-else>暂无证书</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getExpertById,
  getMyCertificates,
  uploadCertificate as uploadCertApi,
  updateExpertProfile
} from '@/views/expert/expertApi';

export default {
  data() {
    return {
      user: {},
      expert: {
        realName: '',
        title: '',
        institution: '',
        expertise: '',
        bio: ''
      },
      certificates: []
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const userId = this.$store.getters.userId;

        // 获取用户信息
        const userProfile = await this.$get('/api/user/profile');
        this.user = {
          username: userProfile.username,
          phone: userProfile.phone,
          province: userProfile.province,
          city: userProfile.city,
          district: userProfile.district,
          address_detail: userProfile.address_detail
        };

        // 获取专家信息
        const expertDetails = await getExpertById(userId);
        this.expert = {
          realName: expertDetails.real_name,
          title: expertDetails.title || '',
          institution: expertDetails.institution || '',
          expertise: expertDetails.expertise || '',
          bio: expertDetails.bio || ''
        };

        // 获取证书
        this.certificates = await getMyCertificates();
      } catch (error) {
        console.error('加载个人信息失败:', error);
        this.$message.error('加载数据失败，请刷新重试');
      }
    },

    async submitExpertInfo() {
      try {
        const updatedExpert = await updateExpertProfile(this.expert);
        this.$message.success('信息更新成功');
      } catch (error) {
        console.error('更新专家信息失败:', error);
        this.$message.error('更新失败，请稍后再试');
      }
    },

    uploadCertificate() {
      this.$prompt('请输入证书获得时间（YYYY-MM-DD）、等级、有效期（年）', '上传证书', {
        formLabelWidth: '150px',
        inputType: 'date',
        inputValue: new Date().toISOString().slice(0, 10),
        inputValidator: (value) => {
          if (!value) return '日期不能为空';
          if (!this.levelInput && !this.periodInput) return '请输入等级和有效期';
        },
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async ({ value: obtainTime, levelInput, periodInput }) => {
        const data = {
          expert_id: this.$store.getters.userId,
          obtain_time: obtainTime,
          level: levelInput,
          valid_period: periodInput
        };
        await uploadCertApi(data);
        this.$message.success('证书上传成功');
        this.initData(); // 刷新证书列表
      }).catch(() => {
        this.$message.info('取消上传');
      });
    }
  }
};
</script>

<style scoped>
.expert-profile-container {
  padding: 20px;
}
.profile-card {
  max-width: 800px;
  margin: auto;
}
.user-info {
  margin-bottom: 20px;
}
.certificates-section {
  margin-top: 30px;
}
</style>
