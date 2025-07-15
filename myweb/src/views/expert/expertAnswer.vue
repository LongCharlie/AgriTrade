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
          <div class="card-header" slot="header">
            <strong>{{ question.title }}</strong>
            <div class="tag">
              <el-tag :type="question.status === 'open' ? 'warning' : 'info'">
                {{ question.status === 'open' ? '未关闭' : '已关闭' }}
              </el-tag>
              <el-tag :type="question.status === 'unanswered' ? 'warning' : 'info'">
                {{ question.status === 'unanswered' ? '未回答' : '已回答' }}
              </el-tag>
            </div>
          </div>

          <div>
            <p><strong>提问者：</strong>{{ question.farmerName || '匿名' }}</p>
            <p><strong>时间：</strong>{{ question.createdAt }}</p>
            <p><strong>内容：</strong>{{ question.content }}</p>

          <!-- 回答表单 -->
            <el-form @submit.prevent="submitAnswer" label-width="80px">
              <el-form-item label="回答">
                <el-input v-model="question.answerContent" type="textarea" :rows="4" placeholder="请输入回答"/>
              </el-form-item>
              <el-button type="primary" native-type="submit">提交</el-button>
              <el-button @click="$router.back()">取消</el-button>
            </el-form>
          </div>
        </el-card>
        <!-- 回答列表 -->
        <div class="answers-container">
          <el-card
              v-for="answer in answers"
              :key="answer.answerId"
              class="answer-card"
              shadow="hover"
              @click.native="viewAnswerDetail(answer.answerId)"
          >
            <div class="answer-header">
      <span class="expert-info">
        <el-avatar
            @click="$router.push(`/expert/detail/${answer.expertId}`)"
            :size="40"
            :src="answer.avatar_url || defaultAvatar"
        ></el-avatar>
        <div>
          <strong>{{ answer.expertName }}</strong>
          <span v-if="answer.expertTitle" class="expert-title">{{ answer.expertTitle }}</span>
        </div>
      </span>
              <span class="answer-time">{{ formatDate(answer.answeredAt) }}</span>
            </div>
            <div class="answer-content">{{ answer.content }}</div>
            <div class="answer-footer">
              <el-button type="text" icon="el-icon-thumb">{{ answer.upvotes || 0 }} 有用</el-button>
            </div>
          </el-card>
        </div>
      </div>
    </el-main>
  </el-container>
  </el-container>
  </div>
</template>

<script>
import {getQuestionById, submitAnswer, getAnswersByQuestionId} from '@/views/expert/expertApi';
import { useUserStore } from '@/stores/user'
import expertCommonAside from "@/components/expertCommonAside.vue";
import expertCommonHeader from "@/components/expertCommonHeader.vue";

export default {
  components: {expertCommonHeader, expertCommonAside},
  data() {
    return {
      question: {},
      answers: [],
      defaultAvatar: require('@/assets/profile.jpg')
    };
  },
  computed: {
    filteredQuestions() {
      if (this.filter === 'open') {
        return this.questions.filter(q => q.status === 'open');
      } else if (this.filter === 'closed') {
        return this.questions.filter(q => q.status === 'closed');
      } else if (this.filter === 'answered') {
        return this.questions.filter(q => q.answerCount > 0);
      } else if (this.filter === 'unanswered') {
        return this.questions.filter(q => q.answerCount === 0);
      }
      return this.questions;
    }
  },
  /*
  created() 生命周期：
  在组件实例初始化完成（data 和 methods 等）之后，但在 DOM 挂载（模板编译/渲染）之前。
  */
  created() {
    this.fetchQuestion();
    this.fetchAnswers();
  },
  methods: {
    viewAnswerDetail(answerId) {
      this.$router.push(`/expert/answer/${answerId}`);
    },
    filterQuestions(status) {
      this.filter = status;
      this.fetchQuestions();
    },
    async fetchQuestion() {
      const id = Number(this.$route.params.id);
      try {
        //mock
        const mockData = [
          {
            questionId: 1,
            farmerId: 2,
            title: '水稻病虫害防治问题',
            content: '最近发现稻田里出现大量害虫，叶片上有明显的啃食痕迹，请问该如何有效防治？使用什么农药比较合适？需要注意哪些安全事项？',
            status: 'open',
            createdAt: '2023-05-10',
            answerCount: 3,
            farmerName: '张农户'
          },
          {
            questionId: 2,
            farmerId: 3,
            title: '小麦种植最佳时间',
            content: '请问在我们这个地区，小麦的最佳种植时间是什么时候？不同品种的小麦在种植时间上有什么区别？',
            status: 'closed',
            createdAt: '2023-04-15',
            answerCount: 5,
            farmerName: '李农户'
          },
          {
            questionId: 3,
            farmerId: 1,
            title: '有机肥料使用建议',
            content: '想请教专家关于有机肥料的使用方法和注意事项。如何判断有机肥料的质量？施用量应该如何控制？',
            status: 'open',
            createdAt: '2023-05-20',
            answerCount: 2,
            farmerName: '王农户'
          }
        ]
        //const res = await getQuestionById(id);
        //this.question = res.data;
        this.question = mockData.find(item => item.questionId === id); //mock
      } catch (error) {
        console.error('获取问题失败:', error);
      }
    },
    async fetchAnswers() {
      try {
        const id = Number(this.$route.params.id);
        // mock
        const mockData = [
            {
              answerId: 1,
              questionId: 1,
              expertId: 2,
              expertName: '张专家',
              expertTitle: ' crop expert',
              content: '根据你的问题，我建议使用有机 fertilizer，并控制施用量。',
              upvotes: 10,
              answeredAt: '2023-05-12'
            },
            {
              answerId: 2,
              questionId: 1,
              expertId: 3,
              expertName: '王专家',
              expertTitle: ' crop expert',
              content: '根据你的问题，我建议使用无机 fertilizer，并控制施用量。',
              upvotes: 8,
              answeredAt: '2023-04-12'
            }
        ]
        //const res = await getAnswersByQuestionId(id);
        //this.answers = res.data;
        this.answers = mockData.filter(item => item.questionId === id);
      } catch (error) {
        console.error('获取回答失败:', error);
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
    async submitAnswer() {
      if (!this.question.answerContent.trim()) {
        this.$message.warning('请输入回答内容');
        return;
      }

      try {
        const userStore = useUserStore();
        const userId = userStore.userId;

        const payload = {
          question_id: this.question.questionId,
          expert_id: userStore.userId,
          content: this.question.content
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

.answer-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.expert-info {
  display: flex;
  align-items: center;
}
.expert-info > div {
  margin-left: 10px;
}
.expert-title {
  display: block;
  color: #888;
  font-size: 12px;
}
.answer-time {
  color: #999;
  font-size: 13px;
}
.answer-content {
  line-height: 1.6;
  margin-bottom: 10px;
}
.answer-footer {
  text-align: right;
}
.tag {
  display: flex;
  gap: 8px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
/* 新增/修改以下样式 */
.answers-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.answer-card {
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.answer-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

/* 原有样式调整 */
.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.expert-info {
  display: flex;
  align-items: center;
}

.expert-info > div {
  margin-left: 10px;
}

.expert-title {
  display: block;
  color: #888;
  font-size: 12px;
}

.answer-content {
  line-height: 1.6;
  margin-bottom: 15px;
  padding: 0 10px;
}

.answer-footer {
  text-align: right;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

</style>
