<template>
  <div class="comment-review-container">
    <h1>评论审核管理</h1>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true">
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
      <el-table-column prop="commenter" label="发布评论者" width="100"></el-table-column>
      <el-table-column prop="article_title" label="经验分享标题" width="100"></el-table-column>
      <el-table-column prop="content" label="内容" width="200"></el-table-column>
      <el-table-column prop="creation_date" label="发布时间" width="150">
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
import axios from 'axios';
import { useUserStore } from '@/stores/user';

export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      filter: {
        commenter: ''
      },
      comments: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0
      }
    };
  },
  computed: {
    filteredComments() {
      let result = this.comments;
      const { commenter } = this.filter;

      if (commenter.trim()) {
        result = result.filter(c =>
          c.commenter.toLowerCase().includes(commenter.trim().toLowerCase())
        );
      }

      this.pagination.total = result.length;
      const start = (this.pagination.current - 1) * this.pagination.size;
      return result.slice(start, start + this.pagination.size);
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString();
    },
    getStatusTagType(status) {
      switch (status) {
        case 'approved': return 'success';
        case 'rejected': return 'danger';
        case 'pending': return 'warning';
        default: return '';
      }
    },
    getStatusText(status) {
      return status === 'pending' ? '待审核'
           : status === 'approved' ? '已通过'
           : status === 'rejected' ? '已拒绝'
           : '未知';
    },
    async fetchComments() {
      try {
        const token = this.userStore.token;
        const res = await axios.get('http://localhost:3000/api/comments/pending', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.comments = res.data.map(c => ({
          ...c,
          creation_date: c.creation_date,
          status: c.status,
          commenter: c.commenter,
          article_title: c.article_title,
          content: c.content
        }));
        this.pagination.current = 1;
      } catch (error) {
        console.error('获取评论失败:', error);
        this.$message.error('评论加载失败');
      }
    },
    async approveComment(comment) {
      await this.updateCommentStatus(comment, 'approved');
    },
    async rejectComment(comment) {
      await this.updateCommentStatus(comment, 'rejected');
    },
    async updateCommentStatus(comment, newStatus) {
      try {
        const token = this.userStore.token;
        await axios.patch(
          `http://localhost:3000/api/comments/${comment.comment_id}/status`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        comment.status = newStatus;
        this.$message.success(`评论已${newStatus === 'approved' ? '通过' : '拒绝'}`);
      } catch (error) {
        console.error('更新状态失败:', error);
        this.$message.error('操作失败');
      }
    },
    handleSizeChange(size) {
      this.pagination.size = size;
    },
    handleCurrentChange(page) {
      this.pagination.current = page;
    },
    showDetail(row) {
      this.$message.info(`评论内容：${row.content}`);
    },
    resetFilter() {
      this.filter.commenter = '';
      this.pagination.current = 1;
      this.fetchComments();
    }
  },
  mounted() {
    this.fetchComments();
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