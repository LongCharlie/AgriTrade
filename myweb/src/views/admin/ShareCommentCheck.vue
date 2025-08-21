<template>
  <div class="comment-review-container">
    <h1>评论审核管理</h1>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true">
        <el-form-item label="评论者">
          <el-input v-model="filter.commenter" placeholder="请输入评论者的名称"></el-input>
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
      rawComments: [], // 原始数据
      comments: [],    // 筛选后的数据
      pagination: {
        current: 1,
        size: 10,
        total: 0
      }
    };
  },
  computed: {
    filteredComments() {
      const start = (this.pagination.current - 1) * this.pagination.size;
      return this.comments.slice(start, start + this.pagination.size);
    }
  },
  methods: {
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    },
    getStatusTagType(status) {
      return status === 'approved' ? 'success'
           : status === 'rejected' ? 'danger'
           : status === 'pending' ? 'warning'
           : '';
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
          headers: { Authorization: `Bearer ${token}` }
        });
        this.rawComments = res.data.map(c => ({
          ...c,
          creation_date: c.created_at,
          status: c.status,
          commenter: c.commenter_name,
          article_title: c.experience_title,
          content: c.content
        }));
        this.applyFilter(); // 初次加载后应用筛选
      } catch (error) {
        console.error('获取评论失败:', error);
        this.$message.error('评论加载失败');
      }
    },
    applyFilter() {
      const keyword = this.filter.commenter.trim().toLowerCase();
      this.comments = keyword
        ? this.rawComments.filter(c =>
            c.commenter.toLowerCase().includes(keyword)
          )
        : [...this.rawComments];
      this.pagination.current = 1;
      this.pagination.total = this.comments.length;
    },
    approveComment(comment) {
      this.updateCommentStatus(comment, 'approved');
    },
    rejectComment(comment) {
      this.updateCommentStatus(comment, 'rejected');
    },
    async updateCommentStatus(comment, newStatus) {
      try {
        const token = this.userStore.token;
        await axios.patch(
          `http://localhost:3000/api/comments/${comment.comment_id}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
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
    resetFilter() {
      this.filter.commenter = '';
      this.applyFilter();
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