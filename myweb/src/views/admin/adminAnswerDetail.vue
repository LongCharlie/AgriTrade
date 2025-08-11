<template>
  <div class="question-detail-container">
    <el-page-header @back="goBack" content="回答详情" />

    <!-- 专家信息行 -->
    <div class="admin-expert-info">
      <div class="admin-user-details">
        <span class="admin-user-id">专家ID: {{ answer.expert_id }}</span>
        <span class="admin-username">专家姓名：{{ answer.expert_name }}</span>
        <span class="admin-user-title">专家职称：{{ answer.expert_title }}</span>
        <span class="admin-answer-time">回答时间：{{ formatDate(answer.answered_at) }}</span>
      </div>
      <div class="admin-answer-meta">
<!--        <span class="admin-answer-time">回答时间：{{ formatDate(answer.answered_at) }}</span>-->
        <el-button
            type="danger"
            size="small"
            @click="deleteAnswer"
            style="margin-left: 20px;"
        >
          删除回答
        </el-button>
      </div>
    </div>

    <!-- 分隔线 -->
    <el-divider></el-divider>

    <!-- 回答内容 -->
    <div class="answer-text">
      {{ answer.content }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from '@/stores/user';

export default {
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    };
  },

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
        const answerId = this.$route.params.id;
        const token = this.userStore.token;

        // 实际API调用
        const response = await axios.get(`http://localhost:3000/api/answers/${answerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.answer = response.data;
      } catch (error) {
        console.error('获取回答详情失败:', error);
        this.$message.error('获取回答详情失败');
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },

    goBack() {
      this.$router.back(); // 返回上一路由
    },

    // 删除回答方法
    deleteAnswer() {
      this.$confirm('确定要删除这个回答吗？此操作不可恢复。', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const answerId = this.$route.params.id;
          const token = this.userStore.token;

          await axios.delete(`http://localhost:3000/api/answers/${answerId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          this.$message.success('回答删除成功');
          this.$router.back(); // 删除成功后返回上一页
        } catch (error) {
          console.error('删除回答失败:', error);
          this.$message.error('删除回答失败: ' + (error.response?.data?.error || error.message));
        }
      }).catch(() => {
        // 用户取消删除
        this.$message.info('已取消删除');
      });
    }
  }
};
</script>

<style scoped>
.question-detail-container {
  padding: 20px;
}

.admin-expert-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.admin-user-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.admin-user-id {
  font-size: 20px;
  color: #333;
}

.admin-username {
  font-size: 20px;
  color: #333;
}

.admin-user-title {
  font-size: 20px;
  color: #333;
}

.admin-answer-meta {
  display: flex;
  align-items: center;
  margin-right: 60px;
}

.admin-answer-time {
  font-size: 20px;
  color: #333;
}

.answer-text {
  line-height: 1.8;
  font-size: 22px;
  padding: 20px 0;
  white-space: pre-wrap;
}
</style>
