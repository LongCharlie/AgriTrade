<!-- src/views/expert/expertAnswer.vue -->
<template>
  <div>
  <el-container>
  <el-aside width="200px">
    <expert-common-aside></expert-common-aside>
  </el-aside>
  <el-container>
    <el-header>
      <expert-common-header></expert-common-header>
    </el-header>
    <el-main>
      <div class="expert-answer-detail">
        <h2>问题详情</h2>

        <el-card shadow="hover" style="margin-bottom: 20px;">
          <div slot="header">
            <strong>{{ question.title }}</strong>
          </div>
          <div>
            <p><strong>提问者：</strong>{{ question.farmerName || '匿名' }}</p>
            <p><strong>时间：</strong>{{ question.createdAt }}</p>
            <p><strong>内容：</strong>{{ question.content }}</p>

          <!-- 回答表单 -->
            <el-form @submit.prevent="submitAnswer" label-width="80px">
              <el-form-item label="回答">
                <el-input v-model="question.answerContent" type="textarea" :rows="4" />
              </el-form-item>
              <el-button type="primary" native-type="submit">提交回答</el-button>
              <el-button @click="$router.back()">取消</el-button>
            </el-form>
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
  </el-container>
  </div>
</template>

<script>
import { getQuestionById, submitAnswer } from '@/views/expert/expertApi';
import expertCommonAside from "@/components/expertCommonAside.vue";
import expertCommonHeader from "@/components/expertCommonHeader.vue";

export default {
  components: {expertCommonHeader, expertCommonAside},
  data() {
    return {
      question: {}
    };
  },
  /*
  created() 生命周期：
  在组件实例初始化完成（data 和 methods 等）之后，但在 DOM 挂载（模板编译/渲染）之前。
  */
  created() {
    this.fetchQuestion();
  },
  methods: {
    async fetchQuestion() {
      const id = Number(this.$route.params.id);
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
        //const res = await getQuestionById(id);
        //this.question = res.data;
        this.question = mockData.find(item => item.questionId === id); //mock
      } catch (error) {
        console.error('获取问题失败:', error);
      }
    },
    async submitAnswer() {
      if (!this.question.answerContent.trim()) {
        this.$message.warning('请输入回答内容');
        return;
      }

      try {
        const payload = {
          question_id: this.question.questionId,
          expert_id: this.$store.getters.userId,
          content: this.question.answerContent
        };

        await submitAnswer(payload);

        this.$message.success('回答成功');
        //this.$router.push('/expert/ques'); // 返回问题列表页
      } catch (error) {
        this.$message.error('回答失败，请重试');
        console.error('提交回答失败:', error);
      }
    }
  }
};
</script>

<style scoped>
.expert-answer-detail {
  padding: 20px;
}
.el-header{
  padding: 0;
}
</style>
