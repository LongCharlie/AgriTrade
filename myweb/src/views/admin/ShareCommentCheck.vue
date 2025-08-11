<template>
  <div class="comment-review-container">
    <h1>评论审核管理</h1>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true">
        <el-form-item label="审核状态">
          <el-select v-model="filter.status" clearable placeholder="请选择">
            <el-option label="待审核" value="pending"></el-option>
            <el-option label="已通过" value="approved"></el-option>
            <el-option label="已拒绝" value="rejected"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论人">
          <el-input v-model="filter.commenter" placeholder="评论人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchComments">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 评论列表 -->
    <el-table :data="filteredComments" style="width: 100%">
      <el-table-column prop="comment_id" label="评论ID" width="100"></el-table-column>
      <el-table-column prop="commenter" label="评论人" width="150"></el-table-column>
      <el-table-column prop="article_title" label="文章标题" width="200"></el-table-column>
      <el-table-column prop="creation_date" label="评论时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.creation_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="审核状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="showDetail(row)">查看详情</el-button>
          <el-button
            v-if="row.status === 'pending'"
            size="small"
            type="primary"
            @click="approveComment(row)"
          >
            通过
          </el-button>
          <el-button
            v-if="row.status === 'pending'"
            size="small"
            type="danger"
            @click="rejectComment(row)"
          >
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";

export default {
  name: 'CommentReview',
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    };
  },
  data() {
    return {
      allComments: [],
      comments: [],
      filter: {
        status: '',
        commenter: ''
      },
      pagination: {
        current: 1,
        size: 10,
        total: 0
      }
    };
  },
  created() {
    this.fetchComments();
  },
  computed: {
    filteredComments() {
      let filtered = [...this.allComments];

      if (this.filter.status) {
        filtered = filtered.filter(comment => comment.status === this.filter.status);
      }

      if (this.filter.commenter) {
        filtered = filtered.filter(comment =>
            comment.commenter && comment.commenter.includes(this.filter.commenter)
        );
      }

      this.pagination.total = filtered.length;
      const start = (this.pagination.current - 1) * this.pagination.size;
      const end = start + this.pagination.size;
      return filtered.slice(start, end);
    }
  },
  methods: {
    async fetchComments() {
      try {
        const token = this.userStore.token;
        const res = await axios.get('http://localhost:3000/api/comments', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.allComments = res.data;
        this.pagination.total = res.data.length;
      } catch (error) {
        console.error('获取评论列表失败:', error);
        ElMessage.error('获取评论列表失败');
      }
    },
    getStatusText(status) {
      const map = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝'
      };
      return map[status] || status;
    },
    getStatusTagType(status) {
      const map = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger'
      };
      return map[status] || '';
    },
    async approveComment(comment) {
      try {
        const token = this.userStore.token;
        await axios.patch(
          `http://localhost:3000/api/comments/${comment.comment_id}/status`,
          { status: 'approved' },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        ElMessage.success('评论审核通过');
        await this.fetchComments();
      } catch (error) {
        console.error('审核通过失败:', error);
        ElMessage.error('审核通过失败');
      }
    },
    async rejectComment(comment) {
      try {
        const token = this.userStore.token;
        await axios.patch(
          `http://localhost:3000/api/comments/${comment.comment_id}/status`,
          { status: 'rejected' },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        ElMessage.success('评论审核拒绝');
        await this.fetchComments();
      } catch (error) {
        console.error('审核拒绝失败:', error);
        ElMessage.error('审核拒绝失败');
      }
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.pagination.current = 1;
    },
    handleCurrentChange(current) {
      this.pagination.current = current;
    },
    resetFilter() {
      this.filter = {
        status: '',
        commenter: ''
      };
      this.pagination.current = 1;
      this.fetchComments();
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.comment-review-container {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
}
</style>