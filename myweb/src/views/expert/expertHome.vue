<template>
  <div class="expert-home-container">
    <!-- 头部欢迎 -->
    <el-row :gutter="20" class="welcome-section">
      <el-col :span="18">
        <h2>您好，{{ expert.realName }}！</h2>
        <p>欢迎回到耘联农业平台，快来解惑吧！</p>
      </el-col>
    </el-row>

    <!-- 卡片信息 -->
    <el-row :gutter="20" class="info-cards">
      <!-- 当前排名 -->
      <el-col :span="6">
        <el-card class="info-card rank-card">
          <div slot="header">
            <strong>当前排名</strong>
          </div>
          <div class="card-content">
            <p>{{ expert.rank || '暂无排名' }}</p>
          </div>
        </el-card>
      </el-col>

      <!-- 回答数 -->
      <el-col :span="6">
        <el-card class="info-card answer-count">
          <div slot="header">
            <strong>累计回答</strong>
          </div>
          <div class="card-content">
            <p>{{ expert.answerCount || 0 }} 条</p>
          </div>
        </el-card>
      </el-col>

      <!-- 待回答问题 -->
      <el-col :span="6">
        <el-card class="info-card unanswered-questions">
          <div slot="header">
            <strong>待回答问题</strong>
          </div>
          <div class="card-content">
            <p>{{ stats.unansweredCount || 0 }} 条</p>
          </div>
        </el-card>
      </el-col>

      <!-- 最新动态 -->
      <el-col :span="6">
        <el-card class="info-card latest-activity">
          <div slot="header">
            <strong>最新活动</strong>
          </div>
          <div class="card-content">
            <p v-if="latestAnswer">{{ latestAnswer.content.substring(0, 30) }}...</p>
            <p v-else>暂无最近回答</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-row :gutter="20" class="quick-actions">
      <el-col :span="6">
        <el-button @click="$router.push('/expert/ques')" style="width: 100%; background-color: #e6f7ff;">去回答问题</el-button>
      </el-col>
      <el-col :span="6">
        <el-button @click="$router.push('/expert/cert')" style="width: 100%; background-color: #fff7e6;">查看我的证书</el-button>
      </el-col>
      <el-col :span="6">
        <el-button @click="$router.push('/expert/rank')" style="width: 100%; background-color: #f9f9f9;">查看排行榜</el-button>
      </el-col>
      <el-col :span="6">
        <el-button @click="$router.push('/expert/profile')" style="width: 100%; background-color: #f0f9eb;">完善个人信息</el-button>
      </el-col>
    </el-row>

    <!-- 最近回答列表 -->
    <el-card class="recent-answers">
      <div slot="header">
        <strong>最近回答</strong>
      </div>
      <ul v-if="recentAnswers.length">
        <li v-for="(answer, index) in recentAnswers" :key="index" class="answer-item">
          <strong>关于：</strong>{{ answer.title }}<br/>
          <small>{{ answer.content.substring(0, 50) }}...</small>
        </li>
      </ul>
      <p v-else>暂无回答记录</p>
    </el-card>
  </div>
</template>

<script>
import {
  getExpertById,
  getMyCertificates,
  getAllQuestions,
  getRecentAnswers
} from '@/views/expert/expertApi';

export default {
  data() {
    return {
      expert: {},
      stats: {
        unansweredCount: 0
      },
      recentAnswers: [],
      latestAnswer: null
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const userId = this.$store.getters.userId;

        // 获取专家信息
        const expert = await getExpertById(userId);
        this.expert = {
          expertId: expert.user_id,
          realName: expert.real_name || '未登录专家',
          title: expert.title || '暂无职称',
          institution: expert.institution || '暂无机构',
          expertise: expert.expertise || '暂无领域',
          answerCount: expert.answer_count || 0
        };

        // 获取证书数量
        const certificates = await getMyCertificates();
        this.stats.certCount = certificates.length;

        // 获取未回答问题数量
        const questions = await getAllQuestions();
        this.stats.unansweredCount = questions.filter(q => !q.answered).length;

        // 获取最近回答
        const answers = await getRecentAnswers(userId);
        this.recentAnswers = answers.slice(0, 5); // 取前5条
        this.latestAnswer = answers[0] || null;
      } catch (error) {
        console.error('加载专家首页数据失败:', error);
        this.$message.error('加载数据失败，请刷新重试');
      }
    },
    getDefaultAvatar(expertId) {
      return `https://via.placeholder.com/60?text=Exp${expertId}`;
    }
  }
};
</script>

<style scoped>
.expert-home-container {
  padding: 20px;
}
.welcome-section {
  margin-bottom: 20px;
}
.info-cards .info-card {
  margin-bottom: 20px;
}
.card-content p {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
.quick-actions {
  margin: 20px 0;
}
.quick-actions .el-button {
  padding: 30px 70px;
  font-size: 16px;
  margin-bottom: 20px;
}
.recent-answers ul {
  list-style-type: none;
  padding-left: 0;
  margin-bottom: 20px;
}
.answer-item {
  margin-bottom: 10px;
}
</style>
