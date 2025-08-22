<template>
  <div class="experience-list-container">
<!--    <h2 class="page-title">经验分享贴审核</h2>-->
    <h1>经验分享贴审核</h1>
    <!-- 筛选 -->
    <div class="filter-section">
      <el-select
        v-model="filterStatus"
        placeholder="全部状态"
        clearable
        class="status-select"
      >
        <el-option label="待审核" value="pending"></el-option>
        <el-option label="已通过" value="approved"></el-option>
        <el-option label="已拒绝" value="rejected"></el-option>
      </el-select>
      <el-button type="default" @click="resetFilter" class="reset-button">重置</el-button>
    </div>

    <!-- 表格展示 -->
    <el-table :data="pagedArticles" style="width: 100%">
      <el-table-column prop="title" label="标题" width="200" />
      <el-table-column prop="author" label="作者" width="120" />
      <el-table-column prop="createTime" label="发布时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'pending'"
            type="primary"
            size="small"
            @click="goToDetail(row.id)"
          >
            去审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    return { router, userStore }
  },
  data() {
    return {
      filterStatus: '',
      allArticles: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0
      }
    }
  },
  computed: {
    filteredArticles() {
      const filtered = this.filterStatus
        ? this.allArticles.filter(a => a.status === this.filterStatus)
        : this.allArticles
      this.pagination.total = filtered.length
      return filtered
    },
    pagedArticles() {
      const start = (this.pagination.current - 1) * this.pagination.size
      return this.filteredArticles.slice(start, start + this.pagination.size)
    }
  },
  methods: {
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString()
    },
    getStatusText(status) {
      switch (status) {
        case 'pending':
          return '待审核'
        case 'approved':
          return '已通过'
        case 'rejected':
          return '已拒绝'
        default:
          return '未知状态'
      }
    },
    getStatusTagType(status) {
      switch (status) {
        case 'pending':
          return 'warning'
        case 'approved':
          return 'success'
        case 'rejected':
          return 'danger'
        default:
          return 'info'
      }
    },
    async fetchData() {
      try {
        const res = await axios.get('http://localhost:3000/api/experiences', {
          headers: { Authorization: `Bearer ${this.userStore.token}` },
          params: { status: this.filterStatus }
        })
        this.allArticles = res.data.map(item => ({
          id: item.experience_id,
          title: item.title,
          author: item.author_name,
          createTime: item.created_at,
          status: item.audit_status
        }))
        this.pagination.current = 1
      } catch (error) {
        console.error('获取经验数据失败:', error)
      }
    },
    goToDetail(id) {
      this.router.push(`/admin/experience/${id}`)
    },
    resetFilter() {
      this.filterStatus = ''
      this.pagination.current = 1
      this.fetchData()
    },
    handleSizeChange(size) {
      this.pagination.size = size
    },
    handleCurrentChange(page) {
      this.pagination.current = page
    }
  },
  watch: {
    filterStatus() {
      this.fetchData()
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>
.experience-list-container {
  padding: 20px;
}

.page-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
}

.filter-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.status-select {
  width: 200px;
}

.reset-button {
  margin-left: 20px;
}

.el-pagination {
  margin-top: 20px;
}
</style>