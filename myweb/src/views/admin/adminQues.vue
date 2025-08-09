<!--<template>-->
<!--  <div class="container">-->
<!--    <h1>问题审核</h1>-->

<!--    &lt;!&ndash; 搜索和筛选区域 &ndash;&gt;-->
<!--    <div class="search-filter">-->
<!--      <el-input-->
<!--          v-model="searchQuery"-->
<!--          placeholder="搜索问题标题"-->
<!--          clearable-->
<!--          style="width: 300px"-->
<!--          @clear="handleSearchClear"-->
<!--      />-->
<!--      <el-input-->
<!--          v-model="searchFarmer"-->
<!--          placeholder="搜索农户ID"-->
<!--          clearable-->
<!--          style="width: 200px"-->
<!--      />-->
<!--      <el-select-->
<!--          v-model="filterStatus"-->
<!--          placeholder="问题状态"-->
<!--          clearable-->
<!--          style="width: 200px"-->
<!--      >-->
<!--        <el-option label="全部" value="" />-->
<!--        <el-option label="开放" value="open" />-->
<!--        <el-option label="已关闭" value="closed" />-->
<!--      </el-select>-->
<!--      <el-button type="primary" @click="handleSearch">搜索</el-button>-->
<!--    </div>-->

<!--    &lt;!&ndash; 问题表格 &ndash;&gt;-->
<!--    <el-table-->
<!--        :data="paginatedQuestions"-->
<!--        style="width: 100%"-->
<!--        v-loading="loading"-->
<!--    >-->
<!--      <el-table-column prop="question_id" label="ID" width="80" />-->
<!--      <el-table-column prop="title" label="标题" min-width="200" />-->
<!--      <el-table-column prop="user_id" label="农户ID" width="100" />-->
<!--      <el-table-column label="状态" width="120">-->
<!--        <template #default="{ row }">-->
<!--          <el-tag :type="row.status === 'open' ? 'success' : 'info'">-->
<!--            {{ row.status === 'open' ? '开放' : '已关闭' }}-->
<!--          </el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="answer_count" label="回答数" width="100" />-->
<!--      <el-table-column prop="created_at" label="提问时间" width="180">-->
<!--        <template #default="{ row }">-->
<!--          {{ formatDate(row.created_at) }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="操作" width="200" fixed="right">-->
<!--        <template #default="{ row }">-->
<!--          <el-button size="small" @click="showQuestionDetail(row)">-->
<!--            详情-->
<!--          </el-button>-->
<!--          <el-button-->
<!--              size="small"-->
<!--              type="danger"-->
<!--              @click="showDeleteDialog(row)"-->
<!--          >-->
<!--            删除-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->

<!--    &lt;!&ndash; 分页 &ndash;&gt;-->
<!--    <div class="pagination">-->
<!--      <el-pagination-->
<!--          v-model:current-page="currentPage"-->
<!--          v-model:page-size="pageSize"-->
<!--          :total="totalQuestions"-->
<!--          :page-sizes="[10, 20, 50, 100]"-->
<!--          layout="total, sizes, prev, pager, next, jumper"-->
<!--          @current-change="handlePageChange"-->
<!--          @size-change="handleSizeChange"-->
<!--      />-->
<!--    </div>-->

<!--    &lt;!&ndash; 删除确认对话框 &ndash;&gt;-->
<!--    <el-dialog v-model="actionDialogVisible" title="确认删除" width="500px">-->
<!--      <p>确定要删除这个问题吗？</p>-->
<!--      <template #footer>-->
<!--        <el-button @click="actionDialogVisible = false">取消</el-button>-->
<!--        <el-button type="primary" @click="confirmDelete">确认删除</el-button>-->
<!--      </template>-->
<!--    </el-dialog>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { useRouter } from 'vue-router'-->
<!--import { ref, computed, onMounted } from 'vue'-->
<!--import { ElMessage } from 'element-plus'-->
<!--// import { getQuestions, deleteQuestion } from '@/views/admin/adminApi'-->
<!--import axios from "axios";-->
<!--import {useUserStore} from "@/stores/user";-->

<!--export default {-->
<!--  setup() {-->
<!--    const userStore = useUserStore();-->
<!--    const token = userStore.token;-->

<!--    // 状态管理-->
<!--    const allQuestions = ref([]) // 存储所有问题-->
<!--    const loading = ref(false)-->
<!--    const searchQuery = ref('')-->
<!--    const searchFarmer = ref('')-->
<!--    const filterStatus = ref('')-->
<!--    const currentPage = ref(1)-->
<!--    const pageSize = ref(10)-->

<!--    // 操作相关-->
<!--    const actionDialogVisible = ref(false)-->
<!--    const currentActionQuestion = ref(null)-->

<!--    // 格式化日期-->
<!--    const formatDate = (dateString) => {-->
<!--      return new Date(dateString).toLocaleString()-->
<!--    }-->

<!--    // 获取问题列表-->
<!--    const fetchQuestions = async () => {-->
<!--      try {-->
<!--        loading.value = true-->
<!--        const token = this.userStore.token;-->
<!--        const res = await axios.get('http://localhost:3000/api/admin/questions', {-->
<!--          headers: {-->
<!--            Authorization: `Bearer ${token}`-->
<!--          }-->
<!--        })-->
<!--        allQuestions.value = res.data-->
<!--      } catch (error) {-->
<!--        ElMessage.error('获取问题列表失败')-->
<!--        console.error('获取问题列表失败:', error)-->
<!--      } finally {-->
<!--        loading.value = false-->
<!--      }-->
<!--    }-->

<!--    // 计算筛选后的问题列表-->
<!--    const filteredQuestions = computed(() => {-->
<!--      let filtered = [...allQuestions.value]-->

<!--      // 标题搜索筛选-->
<!--      if (searchQuery.value) {-->
<!--        const query = searchQuery.value.toLowerCase()-->
<!--        filtered = filtered.filter(q =>-->
<!--            q.title.toLowerCase().includes(query)-->
<!--        )-->
<!--      }-->

<!--      // 农户ID筛选-->
<!--      if (searchFarmer.value) {-->
<!--        const farmerId = parseInt(searchFarmer.value)-->
<!--        if (!isNaN(farmerId)) {-->
<!--          filtered = filtered.filter(q => q.user_id === farmerId)-->
<!--        }-->
<!--      }-->

<!--      // 状态筛选-->
<!--      if (filterStatus.value) {-->
<!--        filtered = filtered.filter(q => q.status === filterStatus.value)-->
<!--      }-->

<!--      return filtered-->
<!--    })-->

<!--    // 计算分页后的问题列表-->
<!--    const paginatedQuestions = computed(() => {-->
<!--      const start = (currentPage.value - 1) * pageSize.value-->
<!--      const end = start + pageSize.value-->
<!--      return filteredQuestions.value.slice(start, end)-->
<!--    })-->

<!--    // 计算总问题数-->
<!--    const totalQuestions = computed(() => {-->
<!--      return filteredQuestions.value.length-->
<!--    })-->

<!--    // 分页处理-->
<!--    const handlePageChange = (page) => {-->
<!--      currentPage.value = page-->
<!--    }-->

<!--    const handleSizeChange = (size) => {-->
<!--      pageSize.value = size-->
<!--      currentPage.value = 1 // 重置到第一页-->
<!--    }-->

<!--    const handleSearch = () => {-->
<!--      currentPage.value = 1; // 搜索时重置到第一页-->
<!--      // 不需要调用 fetchQuestions，因为筛选逻辑已经在 computed 中实现-->
<!--    }-->

<!--    // 搜索清空-->
<!--    const handleSearchClear = () => {-->
<!--      searchQuery.value = ''-->
<!--    }-->

<!--    const router = useRouter()-->
<!--    // 显示问题详情-->
<!--    const showQuestionDetail = (question) => {-->
<!--      router.push(`/admin/ques/${question.question_id}`);-->
<!--    }-->

<!--    // 显示删除对话框-->
<!--    const showDeleteDialog = (question) => {-->
<!--      currentActionQuestion.value = question-->
<!--      actionDialogVisible.value = true-->
<!--    }-->

<!--    // 确认删除-->
<!--    const confirmDelete = async () => {-->
<!--      try {-->
<!--        const questionId = currentActionQuestion.value.question_id;-->
<!--        await axios.delete(`http://localhost:3000/api/questions/${questionId}`, {-->
<!--          headers: {-->
<!--            Authorization: `Bearer ${token}`-->
<!--          }-->
<!--        });-->

<!--        ElMessage.success('问题已删除')-->
<!--        actionDialogVisible.value = false-->
<!--        fetchQuestions() // 重新获取问题列表-->
<!--      } catch (error) {-->
<!--        ElMessage.error('删除失败')-->
<!--        console.error('删除失败:', error)-->
<!--      }-->
<!--    }-->

<!--    // 初始化加载-->
<!--    onMounted(() => {-->
<!--      fetchQuestions()-->
<!--    })-->

<!--    return {-->
<!--      // 状态-->
<!--      allQuestions,-->
<!--      loading,-->
<!--      searchQuery,-->
<!--      searchFarmer,-->
<!--      filterStatus,-->
<!--      currentPage,-->
<!--      pageSize,-->

<!--      // 计算属性-->
<!--      paginatedQuestions,-->
<!--      totalQuestions,-->

<!--      actionDialogVisible,-->
<!--      currentActionQuestion,-->

<!--      // 方法-->
<!--      fetchQuestions,-->
<!--      handlePageChange,-->
<!--      handleSizeChange,-->
<!--      handleSearch,-->
<!--      handleSearchClear,-->
<!--      showQuestionDetail,-->
<!--      showDeleteDialog,-->
<!--      confirmDelete,-->
<!--      formatDate-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.container {-->
<!--  padding: 20px;-->
<!--}-->

<!--.search-filter {-->
<!--  margin-bottom: 20px;-->
<!--  display: flex;-->
<!--  gap: 10px;-->
<!--}-->

<!--.pagination {-->
<!--  margin-top: 20px;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--}-->
<!--</style>-->
<template>
  <div class="container">
    <h1>问题审核</h1>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter">
      <el-input
          v-model="searchQuery"
          placeholder="搜索问题标题"
          clearable
          style="width: 300px"
          @clear="handleSearchClear"
      />
      <el-input
          v-model="searchFarmer"
          placeholder="搜索农户ID"
          clearable
          style="width: 200px"
      />
      <el-select
          v-model="filterStatus"
          placeholder="问题状态"
          clearable
          style="width: 200px"
      >
        <el-option label="全部" value="" />
        <el-option label="开放" value="open" />
        <el-option label="已关闭" value="closed" />
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 问题表格 -->
    <el-table
        :data="paginatedQuestions"
        style="width: 100%"
        v-loading="loading"
    >
      <el-table-column prop="question_id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="content" label="内容" min-width="300" />
      <el-table-column prop="user_id" label="农户ID" width="100" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 'open' ? 'success' : 'info'">
            {{ row.status === 'open' ? '开放' : '已关闭' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="answer_count" label="回答数" width="100" />
      <el-table-column prop="created_at" label="提问时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="showQuestionDetail(row)">
            详情
          </el-button>
          <el-button
              size="small"
              type="danger"
              @click="showDeleteDialog(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="totalQuestions"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
      />
    </div>

    <!-- 删除确认对话框 -->
    <el-dialog v-model="actionDialogVisible" title="确认删除" width="500px">
      <p>确定要删除这个问题吗？</p>
      <template #footer>
        <el-button @click="actionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确认删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from "axios";
import { useUserStore } from "@/stores/user";

export default {
  setup() {
    const userStore = useUserStore();
    const token = userStore.token;

    // 状态管理
    const allQuestions = ref([]) // 存储所有问题
    const loading = ref(false)
    const searchQuery = ref('')
    const searchFarmer = ref('')
    const filterStatus = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)

    // 操作相关
    const actionDialogVisible = ref(false)
    const currentActionQuestion = ref(null)

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
      //return new Date(dateString).toLocaleString()
    }

    // 获取问题列表
    const fetchQuestions = async () => {
      try {
        loading.value = true
        // 修复：使用 userStore 而不是 this.userStore
        const res = await axios.get('http://localhost:3000/api/admin/questions', {
          headers: {
            Authorization: `Bearer ${userStore.token}` // 修复：使用 userStore.token
          }
        })
        allQuestions.value = res.data
      } catch (error) {
        ElMessage.error('获取问题列表失败: ' + (error.response?.data?.message || error.message))
        console.error('获取问题列表失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 计算筛选后的问题列表
    const filteredQuestions = computed(() => {
      let filtered = [...allQuestions.value]

      // 标题搜索筛选
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(q =>
            q.title.toLowerCase().includes(query)
        )
      }

      // 农户ID筛选
      if (searchFarmer.value) {
        const farmerId = parseInt(searchFarmer.value)
        if (!isNaN(farmerId)) {
          filtered = filtered.filter(q => q.user_id === farmerId)
        }
      }

      // 状态筛选
      if (filterStatus.value) {
        filtered = filtered.filter(q => q.status === filterStatus.value)
      }

      return filtered
    })

    // 计算分页后的问题列表
    const paginatedQuestions = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredQuestions.value.slice(start, end)
    })

    // 计算总问题数
    const totalQuestions = computed(() => {
      return filteredQuestions.value.length
    })

    // 分页处理
    const handlePageChange = (page) => {
      currentPage.value = page
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1 // 重置到第一页
    }

    const handleSearch = () => {
      currentPage.value = 1; // 搜索时重置到第一页
      // 不需要调用 fetchQuestions，因为筛选逻辑已经在 computed 中实现
    }

    // 搜索清空
    const handleSearchClear = () => {
      searchQuery.value = ''
    }

    const router = useRouter()
    // 显示问题详情
    const showQuestionDetail = (question) => {
      router.push(`/admin/ques/${question.question_id}`);
    }

    // 显示删除对话框
    const showDeleteDialog = (question) => {
      currentActionQuestion.value = question
      actionDialogVisible.value = true
    }

    // 确认删除
    const confirmDelete = async () => {
      try {
        const questionId = currentActionQuestion.value.question_id;
        await axios.delete(`http://localhost:3000/api/questions/${questionId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        ElMessage.success('问题已删除')
        actionDialogVisible.value = false
        fetchQuestions() // 重新获取问题列表
      } catch (error) {
        ElMessage.error('删除失败: ' + (error.response?.data?.message || error.message))
        console.error('删除失败:', error)
      }
    }

    // 初始化加载
    onMounted(() => {
      fetchQuestions()
    })

    return {
      // 状态
      allQuestions,
      loading,
      searchQuery,
      searchFarmer,
      filterStatus,
      currentPage,
      pageSize,

      // 计算属性
      paginatedQuestions,
      totalQuestions,

      actionDialogVisible,
      currentActionQuestion,

      // 方法
      fetchQuestions,
      handlePageChange,
      handleSizeChange,
      handleSearch,
      handleSearchClear,
      showQuestionDetail,
      showDeleteDialog,
      confirmDelete,
      formatDate
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.search-filter {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
