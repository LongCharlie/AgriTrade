<template>
  <div class="admin-dashboard">
    <!-- 主要内容区域 -->
    <div class="dashboard-content"> 
      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="filter-section">
          <el-select v-model="filterStatus" placeholder="全部状态" clearable>
            <el-option label="待审核" value="pending"></el-option>
            <el-option label="已通过" value="approved"></el-option>
            <el-option label="已拒绝" value="rejected"></el-option>
          </el-select>
        </div>
      </div>
      
      <!-- 文章列表 -->
      <div class="article-list">
        <!-- 文章卡片 -->
        <div class="article-card" v-for="article in pagedArticles" :key="article.id">
          <div class="article-header">
            <div class="article-info">
              <div class="article-title">{{ article.title }}</div>
              <div class="article-meta">
                <div class="meta-item">
                  <span class="meta-label">作者：</span>
                  <span>{{ article.author }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">发布时间：</span>
                  <span>{{ formatDate(article.createTime) }}</span>
                </div>
              </div>
            </div>
            <div class="article-status" :class="'status-' + article.status">
              <i class="el-icon-time" v-if="article.status === 'pending'"></i>
              <i class="el-icon-check" v-if="article.status === 'approved'"></i>
              <i class="el-icon-close" v-if="article.status === 'rejected'"></i>
              {{ article.status === 'pending' ? '待审核' : article.status === 'approved' ? '已通过' : '已拒绝' }}
            </div>
          </div>
          
          <div class="article-content">
            <div class="article-full-content">
              {{ article.content }}
            </div>
          </div>
          
          <div class="article-footer">
            
            <div class="article-actions">
              <el-button 
                type="success" 
                size="medium"
                icon="el-icon-check" 
                @click="approveArticle(article)"
                :disabled="article.status !== 'pending'"
              >通过</el-button>
              <el-button 
                type="danger" 
                size="medium"
                icon="el-icon-close" 
                @click="rejectArticle(article)"
                :disabled="article.status !== 'pending'"
              >拒绝</el-button>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div class="empty-state" v-if="filteredArticles.length === 0">
          <i class="el-icon-document-delete"></i>
          <h3>没有找到匹配的文章</h3>
          <p>请尝试修改筛选条件，或者刷新页面获取最新数据</p>
          <el-button type="primary" icon="el-icon-refresh" @click="refreshData" style="margin-top: 20px;">刷新数据</el-button>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filteredArticles.length"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  data() {
    return {
      filterStatus: '',
      currentPage: 1,
      pageSize: 5,
      allArticles: []
    }
  },
  computed: {
    filteredArticles() {
      if (!this.filterStatus) return this.allArticles
      return this.allArticles.filter(a => a.status === this.filterStatus)
    },
    pagedArticles() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredArticles.slice(start, start + this.pageSize)
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleString()
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    async refreshData() {
      try {
        const token = this.userStore.token
        const res = await axios.get('http://localhost:3000/api/experiences', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            status: this.filterStatus || undefined
          }
        })
        this.allArticles = res.data.map(item => ({
          id: item.experience_id,
          title: item.title,
          content: item.content,
          author: item.author,
          createTime: item.create_time,
          status: item.audit_status
        }))
        this.currentPage = 1
      } catch (error) {
        console.error('获取经验失败:', error)
        alert('获取数据失败')
      }
    },
    async approveArticle(article) {
      await this.updateStatus(article, 'approved')
    },
    async rejectArticle(article) {
      await this.updateStatus(article, 'rejected')
    },
    async updateStatus(article, newStatus) {
      try {
        const token = this.userStore.token
        await axios.patch(
          `http://localhost:3000/api/experiences/${article.id}/status`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        article.status = newStatus
        alert(`经验《${article.title}》已${newStatus === 'approved' ? '通过' : '拒绝'}`)
      } catch (error) {
        console.error(`${newStatus === 'approved' ? '通过' : '拒绝'}失败:`, error)
        alert('操作失败')
      }
    }
  },
  mounted() {
    this.refreshData()
  },
  watch: {
    filterStatus() {
      this.refreshData()
    }
  }
}
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, #8bc79379, #62c16990);
  padding: 20px;
  min-height: 100vh;
}

.admin-dashboard {
  max-width: 1400px;
  margin: 20px auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.dashboard-header {
  background: linear-gradient(135deg, #71b89a6e 0%, #41a8687e 100%);
  color: white;
  padding: 24px 32px;
}

.header-title {
  font-size: 26px;
  font-weight: 700;
}

.stat-cards {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: #f8fafc;
  border-bottom: 1px solid #eaeef5;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  flex: 1;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
}

.pending::before { background: #757575; }
.total::before { background: #1f2225; }

.stat-title {
  font-size: 16px;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
}

.pending .stat-value { color: #757575; }
.total .stat-value { color: #1f2225; }

.dashboard-content {
  padding: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #eaeef5;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}

.filter-section {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaeef5;
  display: flex;
  flex-direction: column;
}

.article-header {
  display: flex;
  padding: 20px;
  background: #f9fafc;
  border-bottom: 1px solid #eee;
}

.article-info {
  flex: 1;
}

.article-title {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
}

.article-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #6c757d;
}

.meta-label {
  font-weight: 600;
  color: #495057;
}

.article-status {
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  height: fit-content;
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-pending {
  background: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #f5dab1;
}

.status-approved {
  background: #f0f9eb;
  color: #67c23a;
  border: 1px solid #c2e7b0;
}

.status-rejected {
  background: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
}

.article-content {
  padding: 25px;
  line-height: 1.8;
  color: #495057;
  border-bottom: 1px solid #eee;
}

.article-excerpt {
  font-size: 16px;
  margin-bottom: 25px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 3px solid #4e73df;
}

.article-full-content {
  margin-top: 20px;
  white-space: pre-wrap;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.article-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.article-tag {
  font-size: 13px;
  padding: 5px 12px;
  border-radius: 20px;
  background: #f0f5ff;
  color: #4e73df;
}

.article-actions {
  display: flex;
  gap: 12px;
}

.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 72px;
  color: #e9ecef;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 22px;
  margin-bottom: 12px;
  color: #495057;
}

.empty-state p {
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

@media (max-width: 992px) {
  .toolbar {
    flex-direction: column;
  }
  
  .filter-section {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .stat-cards {
    flex-direction: column;
  }
  
  .article-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .article-actions {
    width: 100%;
  }
  
  .article-actions .el-button {
    flex: 1;
  }
}
</style>