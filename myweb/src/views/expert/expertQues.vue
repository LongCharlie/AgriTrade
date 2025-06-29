<template>
  <div class="expert-answer-container">
    <h2>专家问答</h2>

    <el-input
        v-model="searchQuery"
        placeholder="请输入问题标题或提问者姓名"
        style="margin-bottom: 20px; width: 100%;"
        clearable
    />

    <!-- 待回答的问题 -->
    <el-card v-for="question in filteredQuestions" :key="question.questionId" shadow="hover" style="margin-bottom: 20px;">
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
    <div v-if="!filteredQuestions.length" class="no-data">
      暂无待回答的问题
    </div>
  </div>
</template>

<script>
import { getAllQuestions, submitAnswer } from '../../views/expert/expertApi';

export default {
  data() {
    return {
      questions: [],
      searchQuery: ''
    };
  },
  mounted() {
    this.fetchQuestions();
  },
  computed: {
    filteredQuestions() {
      if (!this.searchQuery) {
        return this.questions;
      }

      const query = this.searchQuery.toLowerCase();
      return this.questions.filter(q =>
          q.title.toLowerCase().includes(query) ||
          (q.farmerName && q.farmerName.toLowerCase().includes(query))
      );
    }
  },
  methods: {
    async fetchQuestions() {
      try {
        //mock
        const mockData = [
          {
            questionId: 1,
            farmerName: '张三',
            title: '如何防治小麦锈病？',
            content: '我种植的小麦最近出现了锈病，请问有什么有效的防治方法？',
            createdAt: '2025-04-05 10:30:00',
            answerContent: ''
          },
          {
            questionId: 2,
            farmerName: '李四',
            title: '玉米种植的最佳时间是什么时候？',
            content: '我在北方种植玉米，想知道最佳的播种时间以及需要注意的事项。',
            createdAt: '2025-04-06 15:45:00',
            answerContent: ''
          },
          {
            questionId: 3,
            farmerName: '王五',
            title: '有机肥料对土壤的作用有哪些？',
            content: '我想了解有机肥料对改善土壤的具体作用，以及如何正确使用。',
            createdAt: '2025-04-07 09:20:00',
            answerContent: ''
          }
        ]
        const res = await getAllQuestions();
        this.questions = mockData.map(q => ({//mock
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
