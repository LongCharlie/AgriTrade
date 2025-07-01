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
        <span style="font-weight: bold; font-size: 18px;">{{ question.title }}</span>
      </div>
      <div>
        <p><strong>提问者：</strong>{{ question.farmerName || '匿名' }}</p>
        <p><strong>时间：</strong>{{ question.createdAt }}</p>
        <p><strong>内容：</strong>{{ question.content }}</p>

        <!-- 跳转按钮 -->
        <el-button
            type="success"
            @click="$router.push(`/expert/ques/${question.questionId}/answer`)">
          回答此问题
        </el-button>
      </div>
    </el-card>

    <!-- 空数据提示 -->
    <div v-if="!filteredQuestions.length" class="no-data">
      暂无待回答的问题
    </div>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
          layout="prev, pager, next"
          :total="questions.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
          @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { getAllQuestions, submitAnswer } from '../../views/expert/expertApi';

export default {
  data() {
    return {
      questions: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 2
    };
  },
  mounted() {
    this.fetchQuestions(this.currentPage);
  },
  /*
  计算属性的触发原理：
  1. 响应式依赖收集
  当组件首次渲染时，Vue 会执行 filteredQuestions() 方法，并在这个过程中自动追踪
  方法内部所依赖的数据属性searchQuery,questions,currentPage
  2. 缓存机制
  如果依赖没有变化，多次访问 filteredQuestions 会直接返回缓存结果，不会重复执行函数
  */
  computed: {
    filteredQuestions() {
      // 搜索过滤
      const query = this.searchQuery.toLowerCase();
      const filtered = this.questions.filter(q =>
          q.title.toLowerCase().includes(query) ||
          (q.farmerName && q.farmerName.toLowerCase().includes(query))
      );
      // 分页截取
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return filtered.slice(start, end); //截取从 start 到 end 的子数组，即当前页要显示的问题列表
    },
    totalPages() {
      return Math.ceil(this.questions.length / this.pageSize);
    }
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
    },
    async fetchQuestions(page = 1) {
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
        //const res = await getAllQuestions({ page, limit: this.pageSize });
        //this.questions = res.data;
        this.questions = mockData;//mock
      } catch (error) {
        console.error('获取问题失败:', error);
        this.questions = [];
      }
    },
    async submitAnswer(questionId, question) {
      //校验用户是否输入了回答内容，如果为空，弹出提示并阻止后续操作
      if (!question.answerContent.trim()) { //trim()用于移除字符串前后所有的空白字符（包括空格、换行、制表符等）
        this.$message.warning('请输入回答内容');
        return;
      }
      //构造请求体（payload）
      try {
        const payload = {
          question_id: questionId,
          expert_id: this.$store.getters.userId, //当前专家 ID（从 Vuex store 获取）
          content: question.answerContent
        };

        const res = await submitAnswer(payload);

        // 更新状态为已回答
        question.answered = true;

        // 显示成功提示
        this.$message.success('回答成功');

        // 刷新问题列表（重新获取数据）
        this.fetchQuestions();
      } catch (error) {
        this.$message.error('回答失败，请重试');
        console.error('提交回答失败:', error);
      }
    }
  }
};

/*
mounted()
  └─> fetchQuestions(1)
        └─> 调用接口 / 获取 mock 数据
              └─> questions 更新
                    └─> 触发 computed.filteredQuestions
                          ├─ 搜索过滤
                          └─ 分页截取
                                └─ 渲染到页面上
用户点击提交回答
  └─> submitAnswer()
        ├─ 参数校验
        ├─ 提交回答
        ├─ 更新状态
        └─ 刷新问题列表
*/

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

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

</style>
