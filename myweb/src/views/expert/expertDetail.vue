<template>
  <div class="expert-detail-container">
    <!-- 返回按钮 -->
    <el-button @click="$router.back()" icon="ArrowLeftBold" plain style="background-color: #4C9148; color: #eeeeee">返回</el-button>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 专家信息 -->
    <div v-else-if="expert" class="expert-info">
      <h2>{{ expert.real_name }} 的详情</h2>

      <el-card shadow="hover" class="expert-card">
        <div class="expert-avatar">
          <el-avatar :src="expert.avatar_url" :size="100" />
        </div>

        <div class="expert-details">
          <p><strong>姓名：</strong>{{ expert.real_name }}</p>
          <p><strong>手机号：</strong>{{ expert.phone || '暂无' }}</p>
          <p><strong>地址：</strong>{{ expert.province }}, {{ expert.city }}, {{ expert.district }}</p>
          <p><strong>职称：</strong>{{ expert.title || '暂无' }}</p>
          <p><strong>所属机构：</strong>{{ expert.institution || '暂无' }}</p>
          <p><strong>专业领域：</strong>{{ expert.expertise || '暂无' }}</p>
          <p><strong>回答数：</strong>{{ expert.answer_count || 0 }}</p>
          <p><strong>专家排名：</strong>{{ expert.expert_rank || '暂无' }}</p>
          <p><strong>个人简介：</strong></p>
          <p class="bio">{{ expert.bio || '暂无简介' }}</p>
          <p><strong>所获证书：</strong></p>
          <el-card shadow="hover" class="certificate-card">
            <div class="certificate-details">
              <p><strong>证书名称：</strong>{{ expert.certificate_name || '暂无' }}</p>
              <p><strong>发证机构：</strong>{{ expert.authorizing_unit || '暂无' }}</p>
              <img v-if="expert.certificate_image" :src="expert.certificate_image" alt="证书图片">
            </div>
          </el-card>
        </div>
      </el-card>
    </div>

    <!-- 错误提示 -->
    <div v-else class="no-data">未找到该专家的信息</div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import axios from "axios";
//import { getExpertById } from '../../views/expert/expertApi';

export default {
  data() {
    return {
      expert: null,
      loading: true
    };
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  created() {
    this.fetchExpert();
  },
  methods: {
    async fetchExpert() {
      const expertId = Number(this.$route.params.id);
      try {
        const res = await axios.get(`http://localhost:3000/api/experts/${expertId}`);
        this.expert = res.data;
        //mock
        // const res=[
        //   {
        //     expert_id: 1,
        //     real_name: '张三',
        //     title: '教授',
        //     institution: '中国农业科学院',
        //     expertise: '农业经济',
        //     answer_count: 45,
        //     expert_rank: 1,
        //     bio: '专注于农村经济发展与政策研究，具有丰富的实践经验。'
        //   },
        //   {
        //     expert_id: 2,
        //     real_name: '李四',
        //     title: '高级农艺师',
        //     institution: '北京农业大学',
        //     expertise: '植物保护',
        //     answer_count: 30,
        //     expert_rank: 2,
        //     bio: '长期从事农作物病虫害防治研究，发表多篇核心论文。'
        //   },
        //   {
        //     expert_id: 3,
        //     real_name: '王五',
        //     title: '研究员',
        //     institution: '南京土壤研究所',
        //     expertise: '土壤科学',
        //     answer_count: 28,
        //     expert_rank: 3,
        //     bio: '专长于土壤改良和土地可持续利用研究。'
        //   },
        //   {
        //     expert_id: 4,
        //     real_name: '赵六',
        //     title: '副教授',
        //     institution: '华中农业大学',
        //     expertise: '畜牧养殖',
        //     answer_count: 20,
        //     expert_rank: 4,
        //     bio: '研究方向为畜禽遗传育种与规模化养殖技术。'
        //   },
        //   {
        //     expert_id: 5,
        //     real_name: '陈七',
        //     title: '博士',
        //     institution: '华南农业技术中心',
        //     expertise: '农业机械',
        //     answer_count: 15,
        //     expert_rank: 5,
        //     bio: '致力于智能农机装备研发，拥有多项专利技术。'
        //   }
        // ]
        //this.expert = res.find(item => item.expert_id === id);
      } catch (error) {
        console.error('获取专家详情失败:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.expert-detail-container {
  padding: 20px;
}

.expert-card {
  margin-top: 20px;
  padding: 20px;
}

.expert-avatar {
  text-align: center;
  margin-bottom: 20px;
}

.expert-details p {
  font-size: 16px;
  margin: 8px 0;
}

.bio {
  white-space: pre-wrap;
  color: #555;
}

.no-data {
  text-align: center;
  margin-top: 40px;
  color: #999;
}

.loading {
  text-align: center;
  margin-top: 40px;
  color: #666;
}

.certificate-details
{

}
</style>
