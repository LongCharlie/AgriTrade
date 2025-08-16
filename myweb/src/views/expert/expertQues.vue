<template>
  <div class="questions-container">
    <h2>问题列表</h2>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter-container">
      <el-input
          v-model="searchQuery"
          placeholder="输入问题标题或内容搜索"
          class="search-input"
          clearable
          @clear="handleSearchClear"
          @keyup.enter="handleSearch"
      >
<!--        <template #append>-->
<!--          <el-button type="primary" @click="handleSearch" icon="el-icon-search">搜索</el-button>-->
<!--        </template>-->
      </el-input>

      <!-- 状态筛选按钮 -->
      <div class="filter-buttons">
        <el-button :type="filter === 'all' ? 'primary' : 'default'" @click="filterQuestions('all')">全部</el-button>
        <el-button :type="filter === 'unanswered' ? 'primary' : 'default'" @click="filterQuestions('unanswered')">未回答</el-button>
        <el-button :type="filter === 'answered' ? 'primary' : 'default'" @click="filterQuestions('answered')">已回答</el-button>
      </div>
    </div>

    <!-- 问题列表展示区域 -->
    <div class="question-list">
      <!-- 搜索结果提示 -->
      <div v-if="searchQuery" class="search-result-tip">
        共找到 {{ filteredQuestions.length }} 条关于"{{ searchQuery }}"的结果
        <el-button type="text" @click="clearSearch" v-if="searchQuery">清除搜索</el-button>
      </div>

      <!-- 问题卡片 -->
      <el-card
          class="question-card"
          v-for="(question, index) in paginatedQuestions"
          :key="index"
          shadow="hover"
      >
        <div class="card-header">
          <span class="question-title" v-html="highlightSearchText(question.title, true)"></span>
          <div class="tag">
            <el-tag :type="question.answer_count === 0 ? 'warning' : 'success'">
              {{ question.answer_count === 0 ? '未回答' : '已回答' }}
            </el-tag>
          </div>
        </div>
        <div class="card-body">
          <p class="question-content" v-html="highlightSearchText(truncateText(question.content, 150), true)"></p>
          <div class="question-meta">
            <span><i class="el-icon-user"></i> {{ question.username }}</span>
            <span><i class="el-icon-time"></i> {{ formatDate(question.created_at) }}</span>
            <span><i class="el-icon-chat-dot-round"></i> {{ question.answer_count }} 回答</span>
          </div>
        </div>
        <div class="card-footer">
          <el-button type="primary" size="small" @click="viewQuestionDetail(question.question_id)">去回答</el-button>
        </div>
      </el-card>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredQuestions.length">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import DOMPurify from 'dompurify';
import axios from "axios";
import { useUserStore } from '@/stores/user';
//import { getAllQuestions } from '../../views/expert/expertApi';
//import { getQuestions, closeQuestion } from '../../views/expert/expertApi';

export default {
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    };
  },
  data() {
    return {
      questions: [],
      filter: 'all',
      searchQuery: '', // 搜索关键词
      pagination: {
        currentPage: 1,
        pageSize: 10
      }
    };
  },
  computed: {
    // 根据状态和搜索词过滤问题
    filteredQuestions() {
      let filtered = this.questions.filter(q => q.status === 'open');

      // 状态筛选
      if (this.filter === 'answered') {
        filtered = filtered.filter(q => q.answer_count > 0);
      } else if (this.filter === 'unanswered') {
        filtered = filtered.filter(q => q.answer_count === 0);
      }

      // 搜索筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(q =>
            q.title.toLowerCase().includes(query) ||
            q.content.toLowerCase().includes(query)
        );
      }

      return filtered;
    },
    // 分页后的数据
    paginatedQuestions() {
      const start = (this.pagination.currentPage - 1) * this.pagination.pageSize;
      const end = start + this.pagination.pageSize;
      return this.filteredQuestions.slice(start, end);
    }
  },
  created() {
    this.fetchQuestions();
  },
  methods: {
    async fetchQuestions() {
      try {
        const token = this.userStore.token;
        const response = await axios.get('http://localhost:3000/api/questions/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.questions = response.data.questions;
        // console.success('获取问题列表成功');
        // mock
        /*const mockData = [
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
        ];*/

        // //mock
        // const res = await getQuestions({
        //   status: this.filter === 'all' ? undefined : this.filter
        // });
        // this.questions = res.data;

        //mock
        /*this.questions = mockData.map(q => ({
          questionId: q.question_id,
          farmerId: q.farmer_id,
          title: q.title,
          content: q.content,
          status: q.status,
          createdAt: q.created_at,
          answerCount: q.answer_count,
          farmerName: q.farmer_name
        }));*/
      } catch (error) {
        console.error('获取问题列表失败:', error);
        this.$message.error('获取问题列表失败');
      }
    },
    // 搜索处理
    handleSearch() {
      this.pagination.currentPage = 1; // 搜索时重置到第一页
    },
    // 清除搜索
    clearSearch() {
      this.searchQuery = '';
      this.pagination.currentPage = 1;
    },
    // 搜索框清空时处理
    handleSearchClear() {
      this.pagination.currentPage = 1;
    },
    // 高亮搜索文本
    highlightSearchText(text, isHtml = false) {
      if (!this.searchQuery || !text) return text;

      const query = this.searchQuery.toLowerCase();
      const regex = new RegExp(query, 'gi');

      if (isHtml) {
        // 用于v-html的情况
        const highlighted = text.toString().replace(regex, match =>
            `<span class="highlight-text">${match}</span>`
        );
        return DOMPurify.sanitize(highlighted);
      } else {
        // 用于普通文本插值的情况
        return text.toString().replace(regex, match =>
            `{{${match}}}`
        );
      }
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1; // 重置到第一页
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    },
    truncateText(text, length) {
      if (!text) return '';
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    },
    viewQuestionDetail(questionId) {
      this.$router.push(`/expert/ques/${questionId}/answer`);
    },
    filterQuestions(status) {
      this.filter = status;
      this.pagination.currentPage = 1;
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  }
};
</script>

<style scoped>
.search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  gap: 20px;
}

.search-input {
  width: 300px;
}

.search-result-tip {
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}

/* 高亮文本样式 */
.question-title ::v-deep .highlight-text,
.question-content ::v-deep .highlight-text {
  background-color: #FFEB3B;
  color: #000;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: bold;
  display: inline; /* 确保是行内显示 */
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 问题卡片样式微调 */
.question-card {
  margin-bottom: 20px;
  background-color: #F7FFF9;
}

/* 确保内容区域有足够空间 */
.questions-container {
  padding: 20px;
  min-height: calc(100vh - 120px); /* 根据实际布局调整 */
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