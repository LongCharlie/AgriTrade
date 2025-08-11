<template>
  <div class="experience-container">
    <h1>经验分享列表</h1>
    <!-- 添加发布经验分享按钮 -->
    <div class="header-actions">
      <el-button type="primary" @click="showPostExperienceForm">发布经验分享</el-button>
    </div>

    <!-- 发布经验分享表单 -->
    <el-dialog title="发布经验分享" v-model="postExperienceDialogVisible" width="50%">
      <el-form :model="postExperienceForm" ref="postExperienceForm" label-width="120px">
        <el-form-item label="标题" required>
          <el-input v-model="postExperienceForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input type="textarea" v-model="postExperienceForm.content" :rows="4"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPostExperience">发布</el-button>
          <el-button @click="postExperienceDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter-container">
      <el-input
        v-model="searchQuery"
        placeholder="输入标题或内容搜索"
        class="search-input"
        clearable
        @clear="handleSearchClear"
        @keyup.enter="handleSearch"
      ></el-input>
      <!-- 状态筛选按钮 -->
      <div class="filter-buttons">
        <el-button :type="filter === 'all' ? 'primary' : 'default'" @click="filterExperiences('all')">全部分享</el-button>
        <el-button :type="filter === 'mine' ? 'primary' : 'default'" @click="filterExperiences('mine')">我的分享</el-button>
      </div>
    </div>

    <!-- 经验分享列表展示区域 -->
    <div class="experience-list">
      <!-- 搜索结果提示 -->
      <div v-if="searchQuery" class="search-result-tip">
        共找到 {{ filteredExperiences.length }} 条关于"{{ searchQuery }}"的结果
        <el-button type="text" @click="clearSearch" v-if="searchQuery">清除搜索</el-button>
      </div>

      <!-- 经验分享卡片 -->
      <el-card
        class="experience-card"
        v-for="(experience, index) in paginatedExperiences"
        :key="index"
        shadow="hover"
      >
        <div class="card-header">
          <span class="experience-title" v-html="highlightSearchText(experience.title, true)"></span>
          <div class="tag">
            <el-tag :type="experience.comment_count === 0 ? 'warning' : 'success'">
              {{ experience.comment_count === 0 ? '无评论' : experience.comment_count + ' 评论' }}
            </el-tag>
          </div>
        </div>
        <div class="card-body">
          <p class="experience-content" v-html="highlightSearchText(truncateText(experience.content, 150), true)"></p>
          <div class="experience-meta">
            <span><i class="el-icon-user"></i> {{ experience.publisher }}</span>
            <span><i class="el-icon-time"></i> {{ formatDate(experience.published_at) }}</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="footer-buttons">
            <el-button type="primary" size="small" @click="viewExperienceDetail(experience.id)">
              查看详情
            </el-button>
          </div>
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
          :total="filteredExperiences.length">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from '@/stores/user';
import DOMPurify from 'dompurify';

export default {
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    };
  },
  data() {
    return {
      experiences: [], // 存储经验分享数据
      filter: 'all',
      searchQuery: '', // 搜索关键词
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      postExperienceDialogVisible: false, // 发布经验分享对话框可见性
      postExperienceForm: { // 发布经验分享表单数据
        title: '',
        content: ''
      }
    };
  },
  created() {
    this.fetchExperiences();
  },
  computed: {
    // 根据状态和搜索词过滤经验分享
    filteredExperiences() {
      let filtered = [...this.experiences];

      // 状态筛选
      if (this.filter === 'all') {
        filtered = filtered.filter(q => q.status === 'open');
      } else if (this.filter === 'mine') {
        filtered = filtered.filter(q => q.user_id === this.userStore.userId);
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
    paginatedExperiences() {
      const start = (this.pagination.currentPage - 1) * this.pagination.pageSize;
      const end = start + this.pagination.pageSize;
      return this.filteredExperiences.slice(start, end);
    }
  },
  methods: {
    async fetchExperiences() {
      try {
        // 使用虚拟数据
        const mockData = [
          {
            id: 1,
            title: '水稻病虫害防治',
            content: '最近发现稻田里出现大量害虫，叶片上有明显的啃食痕迹，请问该如何有效防治？',
            publisher: '张农户',
            published_at: '2023-05-10',
            comment_count: 3,
            status: 'open',
            user_id: 1
          },
          {
            id: 2,
            title: '小麦种植最佳时间',
            content: '请问在我们这个地区，小麦的最佳种植时间是什么时候？不同品种的小麦在种植时间上有什么区别？',
            publisher: '李农户',
            published_at: '2023-04-15',
            comment_count: 5,
            status: 'closed',
            user_id: 2
          },
          {
            id: 3,
            title: '有机肥料使用建议',
            content: '想请教专家关于有机肥料的使用方法和注意事项。如何判断有机肥料的质量？施用量应该如何控制？',
            publisher: '王农户',
            published_at: '2023-05-20',
            comment_count: 2,
            status: 'open',
            user_id: 1
          }
        ];
        this.experiences = mockData;
      } catch (error) {
        console.error('获取经验分享列表失败:', error);
        this.$message.error('获取经验分享列表失败');
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
        const highlighted = text.toString().replace(regex, match =>
            `<span class="highlight-text">${match}</span>`);
        return DOMPurify.sanitize(highlighted);
      } else {
        return text.toString().replace(regex, match =>
            `{{${match}}}`);
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
    viewExperienceDetail(experienceId) {
      this.$router.push(`/experience/${experienceId}`);
    },
    filterExperiences(status) {
      this.filter = status;
      this.pagination.currentPage = 1;
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    },
    showPostExperienceForm() {
      this.postExperienceDialogVisible = true;
      this.postExperienceForm = { title: '', content: '' };
    },
    submitPostExperience() {
      this.$refs.postExperienceForm.validate((valid) => {
        if (valid) {
          const token = this.userStore.token;
          axios.post('http://localhost:3000/api/experiences', {
            title: this.postExperienceForm.title,
            content: this.postExperienceForm.content,
            userId: this.userStore.userId
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            this.experiences.push(response.data);
            this.postExperienceDialogVisible = false;
            this.pagination.currentPage = 1;
            this.$message.success('经验分享发布成功');
          })
          .catch(error => {
            console.error('发布经验分享失败:', error);
            this.$message.error('发布经验分享失败');
          });
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.experience-container {
  padding: 20px;
}

.header-actions {
  margin-bottom: 30px;
  margin-top: 20px;
}

.search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.search-result-tip {
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}

.experience-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.experience-card {
  width: 100%;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.experience-card:hover {
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

.experience-title {
  font-weight: bold;
  font-size: 18px;
  flex: 1;
  margin-right: 15px;
}

.card-body {
  padding: 10px 0;
}

.experience-content {
  margin: 10px 0;
  color: #666;
  line-height: 1.6;
  font-size: 15px;
}

.experience-meta {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  color: #888;
  font-size: 14px;
}

.experience-meta i {
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>