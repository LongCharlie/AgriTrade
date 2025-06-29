<template>
  <div class="expert-answer-container">
    <h2>专家问答</h2>

    <!-- 待回答的问题 -->
    <el-card v-for="question in questions" :key="question.questionId" shadow="hover" style="margin-bottom: 20px;">
      <div slot="header">
        <span>{{ question.title }}</span>
      </div>
      <div>
        <p><strong>提问者：</strong>{{ question.farmerName || '匿名' }}</p>
        <p><strong>时间：</strong>{{ question.createdAt }}</p>
        <p><strong>内容：</strong>{{ question.content }}</p>

        <!-- 回答表单 -->
        <el-form @submit.prevent="submitAnswer(question.questionId, question)" label-width="80px">
          <el-form-item label="回答">
            <el-input v-model="question.answerContent" type="textarea" :rows="4" />
          </el-form-item>
          <el-button type="primary" native-type="submit">提交回答</el-button>
        </el-form>
      </div>
    </el-card>

    <!-- 空数据提示 -->
    <div v-if="!questions.length" class="no-data">
      暂无待回答的问题
    </div>
  </div>
</template>

<script>
import { getAllQuestions, submitAnswer } from '../../views/expert/expertApi';

export default {
  data() {
    return {
      questions: []
    };
  },
  mounted() {
    this.fetchQuestions();
  },
  methods: {
    async fetchQuestions() {
      try {
        const res = await getAllQuestions();
        this.questions = res.map(q => ({
          questionId: q.question_id,
          farmerName: q.username,
          title: q.title,
          content: q.content,
          createdAt: new Date(q.created_at).toLocaleString(),
          answerContent: ''
        }));
      } catch (error) {
        console.error('获取问题失败:', error);
        this.questions = [];
      }
    },
    async submitAnswer(questionId, question) {
      if (!question.answerContent.trim()) {
        this.$message.warning('请输入回答内容');
        return;
      }

      try {
        const payload = {
          question_id: questionId,
          expert_id: this.$store.getters.userId,
          content: question.answerContent
        };

        const res = await submitAnswer(payload);

        // 更新状态为已回答
        question.answered = true;

        this.$message.success('回答成功');

        // 可以选择刷新或移除该问题
        this.fetchQuestions();
      } catch (error) {
        this.$message.error('回答失败，请重试');
        console.error('提交回答失败:', error);
      }
    }
  }
};
</script>

<style scoped>
.expert-answer-container {
  padding: 20px;
}

.no-data {
  text-align: center;
  margin-top: 20px;
  color: #999;
}
</style>
