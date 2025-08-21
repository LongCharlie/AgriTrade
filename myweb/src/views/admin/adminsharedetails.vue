<template>
  <div class="admin-container">
    <el-card class="experience-card">
      <!-- 卡片头部 -->
      <template #header>
        <div class="card-header">
          <h2 class="page-title">经验详情</h2>
          <el-tag :type="statusTagType" size="large">{{ statusText }}</el-tag>
        </div>
      </template>

      <!-- 内容区域 -->
      <div class="card-content">
        <!-- 文章信息 -->
        <div class="info-section">
          <h3 class="article-title">{{ article.title }}</h3>
          <div class="meta-info">
            <div class="meta-item">
              <el-icon><User /></el-icon>
              <span>作者：{{ article.author }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Clock /></el-icon>
              <span>发布时间：{{ formatDate(article.createTime) }}</span>
            </div>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="content-section">
          <div class="content-body">
            <div v-for="(line, index) in article.content" :key="index" class="content-block">
              {{ line }}
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-section">
          <el-button type="success" size="large" @click="updateStatus('approved')">
            <el-icon><Check /></el-icon>
            通过审核
          </el-button>
          <el-button type="danger" size="large" @click="updateStatus('rejected')">
            <el-icon><Close /></el-icon>
            拒绝发布
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Check, Close, User, Clock } from '@element-plus/icons-vue'

export default {
  components: { Check, Close, User, Clock },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    return { route, router, userStore }
  },
  data() {
    return {
      article: {
        title: '',
        author: '',
        createTime: '',
        content: [],
        status: ''
      }
    }
  },
  computed: {
    statusText() {
      const statusMap = {
        'pending': '待审核',
        'approved': '已通过',
        'rejected': '已拒绝'
      }
      return statusMap[this.article.status] || '未知状态'
    },
    statusTagType() {
      const typeMap = {
        'pending': 'warning',
        'approved': 'success',
        'rejected': 'danger'
      }
      return typeMap[this.article.status] || 'info'
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    async fetchDetail() {
      try {
        const res = await axios.get(`http://localhost:3000/api/admin/experience/${this.route.params.id}`, {
          headers: { Authorization: `Bearer ${this.userStore.token}` }
        })
        const data = res.data
        this.article = {
          id: data.experience_id,
          title: data.title,
          author: data.author_name,
          createTime: data.created_at,
          content: data.content?.split('\n') || [],
          status: data.audit_status
        }
      } catch (error) {
        console.error('获取详情失败:', error)
        ElMessage.error('获取经验详情失败')
      }
    },
    async updateStatus(newStatus) {
      try {
        await axios.patch(`http://localhost:3000/api/experiences/${this.article.id}/status`, {
          status: newStatus
        }, {
          headers: { Authorization: `Bearer ${this.userStore.token}` }
        })

        const resultText = newStatus === 'approved' ? '已通过' : '已拒绝'
        ElMessageBox.alert(`经验《${this.article.title}》审核结果：${resultText}`, '审核完成', {
          confirmButtonText: '返回列表',
          callback: () => {
            this.router.push('/admin/share')
          }
        })
      } catch (error) {
        console.error('审核失败:', error)
        ElMessageBox.alert('审核操作失败，请稍后重试', '错误', {
          confirmButtonText: '确定'
        })
      }
    }
  },
  mounted() {
    this.fetchDetail()
  }
}
</script>

<style scoped>
.admin-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.experience-card {
  max-width: 900px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.page-title {
  margin: 0;
  color: #303133;
  font-weight: 600;
}

.card-content {
  padding: 0 10px;
}

.info-section {
  padding: 20px;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 24px;
}

.article-title {
  font-size: 22px;
  color: #303133;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.meta-info {
  display: flex;
  gap: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
  font-size: 14px;
}

.content-section {
  padding: 0 20px;
  margin-bottom: 32px;
}

.content-title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid #409EFF;
}

.content-body {
  background-color: #f0efefc0;
  border-radius: 8px;
  padding: 20px;
  line-height: 1.8;
}

.content-block {
  margin-bottom: 12px;
  text-align: justify;
}

.content-block:last-child {
  margin-bottom: 0;
}

.action-section {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 20px;
  border-top: 1px solid #e6e6e6;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .meta-info {
    flex-direction: column;
    gap: 12px;
  }
  
  .action-section {
    flex-direction: column;
    align-items: center;
  }
  
  .action-section .el-button {
    width: 100%;
    max-width: 280px;
  }
}
</style>