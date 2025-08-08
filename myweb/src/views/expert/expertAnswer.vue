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
                  <el-tag :type="question.answer_count > 0 ? 'success' : 'warning'">
                    {{ question.answer_count > 0 ? '已回答' : '未回答' }}
                  </el-tag>
                </div>
              </div>

              <div>
                <p><strong>提问者：</strong>{{ question.username || '匿名' }}</p>
                <p><strong>时间：</strong>{{ formatDate(question.created_at) }}</p>
                <p><strong>内容：</strong>{{ question.content }}</p>

                <!-- 回答表单 -->
                <el-form @submit.prevent="submitAnswer" label-width="80px">
                  <el-form-item label="回答">
                    <el-input v-model="answerContent" type="textarea" :rows="4" placeholder="请输入回答"/>
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
                  :key="answer.answer_id"
                  class="answer-card"
                  shadow="hover"
                  @click.native="viewAnswerDetail(answer.answer_id)"
              >
                <div class="answer-header">
      <span class="expert-info">
        <el-avatar
            @click="$router.push(`/expert/detail/${answer.expert_id}`)"
            :size="40"
            :src="answer.avatar_url || defaultAvatar"
        ></el-avatar>
        <div>
          <strong>{{ answer.real_name }}</strong>
          <span v-if="answer.title" class="expert-title">{{ answer.title }}</span>
        </div>
      </span>
                  <span class="answer-time">{{ formatDate(answer.answered_at) }}</span>
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
//import {getQuestionById, submitAnswer, getAnswersByQuestionId} from '@/views/expert/expertApi';
import { useUserStore } from '@/stores/user'
import expertCommonAside from "@/components/expertCommonAside.vue";
import expertCommonHeader from "@/components/expertCommonHeader.vue";
import axios from "axios";

export default {
  components: {expertCommonHeader, expertCommonAside},
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    };
  },
  data() {
    return {
      question: {},
      answers: [],
      answerContent: '',
      defaultAvatar: require('@/assets/profile.jpg')
    };
  },
  created() {
    this.fetchQuestion();
    this.fetchAnswers();
  },
  methods: {
    viewAnswerDetail(answerId) {
      this.$router.push(`/expert/answer/${answerId}`);
    },
    async fetchQuestion() {
      try {
        const id = this.$route.params.id;
        const token = this.userStore.token;
        const response = await axios.get(`http://localhost:3000/api/questions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.question = response.data;
      } catch (error) {
        console.error('获取问题失败:', error);
      }
    },
    async fetchAnswers() {
      try {
        const id = this.$route.params.id;
        const token = this.userStore.token;
        //改
        const response = await axios.get(`http://localhost:3000/api/questions/${id}/answers`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.answers = response.data;
      } catch (error) {
        console.error('获取回答失败:', error);
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
    async submitAnswer() {
      if (!this.answerContent.trim()) {
        this.$message.warning('请输入回答内容');
        return;
      }

      try {
        //const id = this.$route.params.id; //问题id
        const token = this.userStore.token;
        const userId = this.userStore.userId; //用户id

        const payload = {
          //question_id: this.question.question_id,
          //expert_id: userId,
          content: this.answerContent
          //answered_at, upvotes后端补齐
        };

        //改
        await axios.post(`http://localhost:3000/api/questions/${this.question.question_id}/answers`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.$message.success('回答成功');
        this.answerContent = ''; // 清空回答内容
        this.fetchAnswers(); // 重新获取回答列表
        this.fetchQuestion();
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
