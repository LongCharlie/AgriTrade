<template>
  <div>
    <el-container>
<!--      <el-aside width="200px">-->
<!--        <expert-common-aside />-->
<!--      </el-aside>-->
      <el-container>
<!--        <el-header>-->
<!--          <expert-common-header />-->
<!--        </el-header>-->
        <el-main>
          <div class="answer-detail-container">
            <!-- 回答主体内容 -->
            <el-card class="main-answer">
              <div class="answer-header">
                <el-avatar :size="60" :src="answer.avatar_url || defaultAvatar"></el-avatar>
                <div class="user-info">
                  <h3>{{ answer.expertName }}</h3>
                  <span class="expert-title">{{ answer.expertTitle }}</span>
                </div>
                <div class="answer-meta">
                  <span class="time">{{ formatDate(answer.answeredAt) }}</span>
<!--                  <el-tag :type="answer.isAccepted ? 'success' : ''">-->
<!--                    {{ answer.isAccepted ? '已采纳' : '未采纳' }}-->
<!--                  </el-tag>-->
                </div>
              </div>

              <div class="answer-content">
                {{ answer.content }}
              </div>

              <div class="answer-actions">
                <el-button type="text" icon="el-icon-thumb">
                  {{ answer.upvotes || 0 }} 有用
                </el-button>
                <el-button type="text" icon="el-icon-chat-round" @click="showReplyForm = !showReplyForm">
                  回复
                </el-button>
              </div>
            </el-card>

            <!-- 回复表单 -->
            <el-card v-if="showReplyForm" class="reply-form">
              <el-input
                  v-model="replyContent"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入您的回复"
              ></el-input>
              <div class="form-actions">
                <el-button type="primary" @click="submitReply">提交</el-button>
                <el-button @click="showReplyForm = false">取消</el-button>
              </div>
            </el-card>

            <!-- 回复列表 -->
            <div class="replies-container">
              <h3>回复 ({{ replies.length }})</h3>
              <div v-for="reply in replies" :key="reply.id" class="reply-item">
                <!-- 回复项内容 -->
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import expertCommonAside from "@/components/expertCommonAside.vue";
import expertCommonHeader from "@/components/expertCommonHeader.vue";
import { getAnswerDetail } from '@/views/expert/expertApi';

export default {
  components: { expertCommonHeader, expertCommonAside },
  data() {
    return {
      answer: {},
      replies: [],
      replyContent: '',
      showReplyForm: false,
      defaultAvatar: require('@/assets/profile.jpg')
    };
  },
  created() {
    this.fetchAnswerDetail();
  },
  methods: {
    async fetchAnswerDetail() {
      try {
        const answerId = this.$route.params.answerId;
        // 实际API调用
        // const res = await getAnswerDetail(answerId);
        // this.answer = res.data;

        // Mock数据
        this.answer = {
          answerId: 1,
          expertId: 2,
          expertName: '张专家',
          expertTitle: '农业专家',
          content: '根据你的问题，我建议使用有机肥料...',
          upvotes: 10,
          answeredAt: '2023-05-12',
          isAccepted: true,
          avatar_url: ''
        };

        this.replies = [
          // 回复数据
        ];
      } catch (error) {
        console.error('获取回答详情失败:', error);
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
    submitReply() {
      // 提交回复逻辑
    }
  }
};
</script>

<style scoped>
.answer-detail-container {
  padding: 20px;
}

.main-answer {
  margin-bottom: 20px;
}

.answer-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-info {
  margin-left: 15px;
  flex: 1;
}

.user-info h3 {
  margin: 0;
}

.expert-title {
  color: #888;
  font-size: 14px;
}

.answer-meta {
  text-align: right;
}

.time {
  display: block;
  color: #999;
  margin-bottom: 5px;
}

.answer-content {
  line-height: 1.8;
  font-size: 16px;
  padding: 10px 0;
}

.answer-actions {
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 15px;
}

.reply-form {
  margin-bottom: 20px;
}

.form-actions {
  margin-top: 10px;
  text-align: right;
}

.replies-container {
  margin-top: 30px;
}
</style>
