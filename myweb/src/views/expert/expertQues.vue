<template>
  <div class="questions-container">
    <h2>问题列表</h2>

    <!-- 状态筛选按钮 -->
    <div class="filter-buttons">
      <el-button :type="filter === 'all' ? 'primary' : 'default'" @click="filterQuestions('all')">全部</el-button>
      <el-button :type="filter === 'open' ? 'primary' : 'default'" @click="filterQuestions('open')">未关闭</el-button>
      <el-button :type="filter === 'closed' ? 'primary' : 'default'" @click="filterQuestions('closed')">已关闭</el-button>
      <el-button :type="filter === 'unanswered' ? 'primary' : 'default'" @click="filterQuestions('unanswered')">未回答</el-button>
      <el-button :type="filter === 'answered' ? 'primary' : 'default'" @click="filterQuestions('answered')">已回答</el-button>
    </div>

    <!-- 问题列表展示区域 -->
    <div class="question-list">
      <!-- 问题卡片 -->
      <el-card
          class="question-card"
          v-for="(question, index) in filteredQuestions"
          :key="index"
          shadow="hover"
      >
        <div class="card-header">
          <span class="question-title">{{ question.title }}</span>
          <div class="tag">
          <el-tag :type="question.status === 'open' ? 'warning' : 'info'">
            {{ question.status === 'open' ? '未关闭' : '已关闭' }}
          </el-tag>
          <el-tag :type="question.status === 'unanswered' ? 'warning' : 'info'">
            {{ question.status === 'unanswered' ? '未回答' : '已回答' }}
          </el-tag>
          </div>
        </div>
        <div class="card-body">
          <p class="question-content">{{ truncateText(question.content, 150) }}</p>
          <div class="question-meta">
            <span><i class="el-icon-user"></i> {{ question.farmerName }}</span>
            <span><i class="el-icon-time"></i> {{ question.createdAt }}</span>
            <span><i class="el-icon-chat-dot-round"></i> {{ question.answerCount }} 回答</span>
          </div>
        </div>
        <div class="card-footer">
          <el-button type="primary" size="small" @click="viewQuestionDetail(question.questionId)">去回答</el-button>
<!--          <el-button-->
<!--              v-if="question.status === 'open' && $store.getters.userRole === 'farmer'"-->
<!--              type="danger"-->
<!--              size="small"-->
<!--              @click="closeQuestion(question.questionId)"-->
<!--          >-->
<!--            关闭问题-->
<!--          </el-button>-->
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getAllQuestions } from '../../views/expert/expertApi';
//import { getQuestions, closeQuestion } from '../../views/expert/expertApi';

export default {
  data() {
    return {
      questions: [],
      filter: 'all'
    };
  },
  computed: {
    // 根据状态过滤问题
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
  created() {
    this.fetchQuestions();
  },
  methods: {
    async fetchQuestions() {
      try {
        // mock
        const mockData = [
          {
            question_id: 1,
            farmer_id: 2,
            title: '水稻病虫害防治问题',
            content: '最近发现稻田里出现大量害虫，叶片上有明显的啃食痕迹，请问该如何有效防治？使用什么农药比较合适？需要注意哪些安全事项？',
            status: 'open',
            created_at: '2023-05-10',
            answer_count: 3,
            farmer_name: '张农户'
          },
          {
            question_id: 2,
            farmer_id: 3,
            title: '小麦种植最佳时间',
            content: '请问在我们这个地区，小麦的最佳种植时间是什么时候？不同品种的小麦在种植时间上有什么区别？',
            status: 'closed',
            created_at: '2023-04-15',
            answer_count: 5,
            farmer_name: '李农户'
          },
          {
            question_id: 3,
            farmer_id: 1,
            title: '有机肥料使用建议',
            content: '想请教专家关于有机肥料的使用方法和注意事项。如何判断有机肥料的质量？施用量应该如何控制？',
            status: 'open',
            created_at: '2023-05-20',
            answer_count: 2,
            farmer_name: '王农户'
          }
        ];

        // //mock
        // const res = await getQuestions({
        //   status: this.filter === 'all' ? undefined : this.filter
        // });
        // this.questions = res.data;

        //mock
        this.questions = mockData.map(q => ({
          questionId: q.question_id,
          farmerId: q.farmer_id,
          title: q.title,
          content: q.content,
          status: q.status,
          createdAt: q.created_at,
          answerCount: q.answer_count,
          farmerName: q.farmer_name
        }));
      } catch (error) {
        console.error('获取问题列表失败:', error);
        this.$message.error('获取问题列表失败');
      }
    },
    truncateText(text, length) {
      if (!text) return '';
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    },
    viewQuestionDetail(questionId) {
      this.$router.push(`/expert/ques/${questionId}/answer`);
    },
    // async closeQuestion(questionId) {
    //   try {
    //     await this.$confirm('确定要关闭这个问题吗?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     });
    //
    //     // 实际API调用
    //     // await closeQuestion(questionId);
    //
    //     // 模拟关闭操作
    //     const question = this.questions.find(q => q.questionId === questionId);
    //     if (question) {
    //       question.status = 'closed';
    //     }
    //
    //     this.$message.success('问题已关闭');
    //   } catch (error) {
    //     if (error !== 'cancel') {
    //       console.error('关闭问题失败:', error);
    //       this.$message.error('关闭问题失败');
    //     }
    //   }
    // },
    filterQuestions(status) {
      this.filter = status;
      this.fetchQuestions();
    }
  }
};
</script>

<style scoped>
.questions-container {
  padding: 20px;
}

.filter-buttons {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-card {
  width: 100%;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.question-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.question-title {
  font-weight: bold;
  font-size: 18px;
  flex: 1;
  margin-right: 15px;
}

.card-body {
  padding: 10px 0;
}

.question-content {
  margin: 10px 0;
  color: #666;
  line-height: 1.6;
  font-size: 15px;
}

.question-meta {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  color: #888;
  font-size: 14px;
}

.question-meta i {
  margin-right: 5px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.tag {
  display: flex;
  gap: 8px;
}

</style>