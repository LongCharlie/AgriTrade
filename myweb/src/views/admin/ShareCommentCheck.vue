<template>
  <div class="admin-dashboard">
    <!-- 顶部标题栏 -->
    <div class="dashboard-header">
      <div class="header-content">
        <div>
          <div class="header-title">评论审核</div>
        </div>
      </div>
    </div>
    <!-- 主要内容区域 -->
    <div class="dashboard-content">
      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="filter-section">
          <el-select v-model="filterStatus" placeholder="全部状态" clearable @change="handleFilterChange">
            <el-option label="待审核" value="pending"></el-option>
            <el-option label="已通过" value="approved"></el-option>
            <el-option label="已拒绝" value="rejected"></el-option>
          </el-select>
        </div>
      </div>
      
      <!-- 评论表格 -->
      <el-table 
        :data="pagedComments" 
        class="comment-table"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="loading"
        :row-class-name="tableRowClassName"
      >
    
        <el-table-column label="评论内容" min-width="500">
          <template #default="{ row }">
            <div class="comment-content">
              <div class="comment-meta">
                <div class="comment-tag user-tag">
                   {{ row.userName }} (ID: {{ row.userId }})
                </div>
                <div class="comment-tag article-tag">
                   {{ row.articleTitle }}
                </div>
                <div class="comment-tag time-tag">
                   {{ formatDate(row.createTime) }}
                </div>
              </div>
              <p style="margin-top: 8px; line-height: 1.7;">{{ row.content }}</p>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <div v-if="row.status === 'pending'" class="status-badge status-pending">
              待审核
            </div>
            <div v-if="row.status === 'approved'" class="status-badge status-approved">
              已通过
            </div>
            <div v-if="row.status === 'rejected'" class="status-badge status-rejected">
              已拒绝
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="review-actions" v-if="row.status === 'pending'">
              <button 
                  class="custom-button approve" 
                  @click="approveComment(row)"
              >通过</button>
              <button 
                  class="custom-button reject" 
                  @click="rejectComment(row)"
              >拒绝</button>
            </div>
            <!-- 非待审核状态显示提示信息 -->
            <div v-else class="no-actions">
              无需操作
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 空状态 -->
      <div v-if="filteredComments.length === 0 && !loading" class="empty-state">
        <i class="el-icon-chat-line-square"></i>
        <h3>没有找到匹配的评论</h3>
        <p>请尝试修改筛选条件或搜索关键词</p>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <div class="selected-count">
          显示 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredComments.length) }} 条，共 {{ filteredComments.length }} 条
        </div>
        
        <div class="pagination-controls">
          <div class="page-size-selector">
            <span>每页显示：</span>
            <el-select v-model="pageSize" size="small" @change="handlePageSizeChange" style="width: 100px;">
              <el-option v-for="size in pageSizes" :key="size" :label="size" :value="size"></el-option>
            </el-select>
          </div>
          
          <el-pagination
            background
            :current-page="currentPage"
            :page-size="pageSize"
            :total="filteredComments.length"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';

// 初始化dayjs
dayjs.locale('zh-cn');

// 搜索和筛选条件
const filterStatus = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizes = ref([5, 10, 20, 50, 100]);
const selectedComments = ref([]);
const loading = ref(false);

// 状态计数
const pendingCount = ref(0);
const todayReviewedCount = ref(0);
const rejectedCount = ref(0);
const totalComments = ref(0);

// 模拟评论数据
const generateComments = () => {
  const comments = [];
  const statuses = ['pending', 'approved', 'rejected'];
  const users = [
    { id: 'U1001', name: '前端开发者' },
    { id: 'U2056', name: '技术经理' },
    { id: 'U3012', name: '忠实读者' },
    { id: 'U4012', name: '匿名用户' },
    { id: 'U1567', name: '代码审查员' },
    { id: 'U2890', name: '求知者' },
    { id: 'U3245', name: '架构师' },
    { id: 'U4123', name: '资深工程师' }
  ];
  
  const articles = [
    { id: 'A2001', title: 'Vue3高级技巧与实践' },
    { id: 'A1987', title: '微服务架构设计模式' },
    { id: 'A2105', title: 'React性能优化指南' },
    { id: 'A1954', title: '人工智能入门教程' },
    { id: 'A2033', title: 'JavaScript最佳实践' },
    { id: 'A2078', title: 'TypeScript实战技巧' },
    { id: 'A2019', title: '云原生技术解析' },
    { id: 'A1890', title: 'Python入门指南' }
  ];
  
  const sampleComments = [
    '这篇文章写得非常棒，特别是关于Vue3的部分，对我帮助很大！期待作者更多的分享。',
    '完全不同意作者的观点，这个方案在实际项目中根本行不通，建议修改或删除此部分内容。',
    '期待作者更新下一期内容，已经订阅了专栏！希望有更多实战案例的分析。',
    '垃圾文章，浪费我的时间，建议平台下架！内容错误百出，误导初学者。',
    '第三部分的代码示例有个小错误，应该是const而不是let，希望作者修正。其他部分写得很好！',
    '有没有人试过在大型项目中使用这个方案？求经验分享，特别是性能方面的表现如何？',
    '作者的观点很有前瞻性，特别是在云原生方面，为我们团队的技术选型提供了重要参考。',
    '这内容也太基础了吧，完全不适合有经验的开发者，标题有误导性，建议修改为"入门教程"。'
  ];
  
  // 生成120条评论
  for (let i = 0; i < 120; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const article = articles[Math.floor(Math.random() * articles.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const content = sampleComments[Math.floor(Math.random() * sampleComments.length)];
    
    // 生成随机日期（最近30天内）
    const date = dayjs().subtract(Math.floor(Math.random() * 30), 'day')
      .add(Math.floor(Math.random() * 24), 'hour')
      .add(Math.floor(Math.random() * 60), 'minute');
    
    comments.push({
      id: 1000 + i,
      content: content,
      userName: user.name,
      userId: user.id,
      articleTitle: article.title,
      articleId: article.id,
      createTime: date.format('YYYY-MM-DD HH:mm'),
      status: status
    });
  }
  
  return comments;
};

const comments = ref(generateComments());

// 计算属性：过滤后的评论
const filteredComments = computed(() => {
  let result = [...comments.value];
  
  // 状态过滤
  if (filterStatus.value) {
    result = result.filter(comment => comment.status === filterStatus.value);
  }
  
  return result;
});

// 分页后的评论
const pagedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredComments.value.slice(start, end);
});

// 操作函数
const approveComment = (comment) => {
  loading.value = true;
  // 模拟API请求延迟
  setTimeout(() => {
    comment.status = 'approved';
    updateStatusCounts();
    ElMessage.success(`已通过评论 #${comment.id}`);
    loading.value = false;
  }, 500);
};

const rejectComment = (comment) => {
  loading.value = true;
  setTimeout(() => {
    comment.status = 'rejected';
    updateStatusCounts();
    ElMessage.warning(`已拒绝评论 #${comment.id}`);
    loading.value = false;
  }, 500);
};


const handleSelectionChange = (selection) => {
  selectedComments.value = selection;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const handlePageSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1; // 重置到第一页
};

const handleFilterChange = () => {
  currentPage.value = 1;
};

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm');
};

const tableRowClassName = ({ row }) => {
  return row.status === 'pending' ? 'highlight' : '';
};

// 更新状态计数
const updateStatusCounts = () => {
  pendingCount.value = comments.value.filter(c => c.status === 'pending').length;
  rejectedCount.value = comments.value.filter(c => c.status === 'rejected').length;
  totalComments.value = comments.value.length;
  
  // 模拟今日审核数（实际项目中应从API获取）
  todayReviewedCount.value = Math.floor(Math.random() * 50) + 30;
};

// 模拟数据加载
onMounted(() => {
  loading.value = true;
  setTimeout(() => {
    updateStatusCounts();
    loading.value = false;
  }, 1000);
});
</script>

<style scoped>
.review-actions {
    display: flex;
    gap: 8px;
}

.custom-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

.approve {
    background-color: #67c23aab;
    color: white;
}

.approve:hover {
    background-color: #5daf34ce;
}

.reject {
    background-color: #f56c6c5f;
    color: white;
}

.reject:hover {
    background-color: #f78989c3;
}

.no-actions {
  color: #999;
  font-size: 14px;
  text-align: center;
  padding: 8px 0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.admin-dashboard {
  width: 95%;
  max-width: 1400px;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.dashboard-header {
  background: linear-gradient(135deg, #8bc79379, #62c16990);
  color: white;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
}

.logo {
  width: 50px;
  height: 50px;
  background: #4e73df;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.logo i {
  font-size: 24px;
  color: white;
}

.header-title {
  font-size: 26px;
  font-weight: 700;
}

.header-subtitle {
  font-size: 16px;
  font-weight: 400;
  opacity: 0.8;
  margin-top: 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #4e73df;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  color: white;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
}

.stat-card.pending:before { background: #ffc1077a; }
.stat-card.reviewed:before { background: #28a74694; }
.stat-card.rejected:before { background: #dc35468f; }
.stat-card.total:before { background: #007bff97; }

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.pending .stat-icon { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
.reviewed .stat-icon { background: rgba(40, 167, 69, 0.2); color: #28a745; }
.rejected .stat-icon { background: rgba(220, 53, 69, 0.2); color: #dc3545; }
.total .stat-icon { background: rgba(0, 123, 255, 0.2); color: #007bff; }

.stat-title {
  font-size: 16px;
  font-weight: 600;
  color: #6c757d;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin: 4px 0;
}

.pending .stat-value { color: #ffc10778; }
.reviewed .stat-value { color: #28a74691; }
.rejected .stat-value { color: #dc354697; }
.total .stat-value { color: #007bff97; }

.stat-change {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.positive { color: #28a746b1; }
.negative { color: #dc3546a8; }

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
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #4e73df;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-section {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.search-bar {
  width: 320px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.comment-table {
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #eaeef5;
}

.comment-content {
  max-width: 500px;
  line-height: 1.6;
  color: #495057;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.pagination-info {
  font-size: 14px;
  color: #6c757d;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
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

.el-table__row {
  transition: background-color 0.2s;
}

.el-table__row:hover {
  background-color: #f8fafc !important;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.comment-tag {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
}

.user-tag {
  background: #e8f4ff;
  color: #1890ff;
}

.article-tag {
  background: #f0f5ff;
  color: #4e73df;
}

.time-tag {
  background: #f6f6f6;
  color: #6c757d;
}

.selected-count {
  font-size: 14px;
  color: #6c757d;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 64px;
  color: #e9ecef;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #495057;
}

.highlight {
  background-color: #fff8e1;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 992px) {
  .toolbar {
    flex-direction: column;
  }
  
  .filter-section {
    width: 100%;
  }
  
  .search-bar {
    width: 100%;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .user-info {
    align-self: flex-end;
  }
  
  .stat-cards {
    grid-template-columns: 1fr 1fr;
  }
  
  .pagination {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .pagination-controls {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 576px) {
  .stat-cards {
    grid-template-columns: 1fr;
  }
  
  .review-actions {
    flex-direction: column;
    gap: 6px;
  }
  
  .review-actions .el-button {
    width: 100%;
  }
  
  .filter-section {
    flex-direction: column;
  }
}
</style>