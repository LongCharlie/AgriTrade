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
<!--      <el-button @click="resetSearch">重置</el-button>-->
<!--    </div>-->

<!--    &lt;!&ndash; 问题表格 &ndash;&gt;-->
<!--    <el-table-->
<!--        :data="paginatedQuestions"-->
<!--        style="width: 100%"-->
<!--        v-loading="loading"-->
<!--    >-->
<!--      <el-table-column prop="question_id" label="ID" width="80" />-->
<!--      <el-table-column prop="title" label="标题" min-width="200" />-->
<!--      <el-table-column prop="content" label="内容" min-width="300" />-->
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
<!--import axios from "axios";-->
<!--import { useUserStore } from "@/stores/user";-->

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

<!--    // 添加搜索条件状态-->
<!--    const searchQueryFilter = ref('')-->
<!--    const searchFarmerFilter = ref('')-->
<!--    const filterStatusFilter = ref('')-->

<!--    // 操作相关-->
<!--    const actionDialogVisible = ref(false)-->
<!--    const currentActionQuestion = ref(null)-->

<!--    // 格式化日期-->
<!--    const formatDate = (dateString) => {-->
<!--      if (!dateString) return '';-->
<!--      const date = new Date(dateString);-->
<!--      const year = date.getFullYear();-->
<!--      const month = String(date.getMonth() + 1).padStart(2, '0');-->
<!--      const day = String(date.getDate()).padStart(2, '0');-->
<!--      return `${year}-${month}-${day}`;-->
<!--    }-->

<!--    // 获取问题列表-->
<!--    const fetchQuestions = async () => {-->
<!--      try {-->
<!--        loading.value = true-->
<!--        const res = await axios.get('http://localhost:3000/api/questions', {-->
<!--          headers: {-->
<!--            Authorization: `Bearer ${userStore.token}`-->
<!--          }-->
<!--        })-->
<!--        allQuestions.value = res.data-->
<!--      } catch (error) {-->
<!--        ElMessage.error('获取问题列表失败: ' + (error.response?.data?.message || error.message))-->
<!--        console.error('获取问题列表失败:', error)-->
<!--      } finally {-->
<!--        loading.value = false-->
<!--      }-->
<!--    }-->

<!--    // 计算筛选后的问题列表-->
<!--    const filteredQuestions = computed(() => {-->
<!--      let filtered = [...allQuestions.value]-->

<!--      // 标题搜索筛选-->
<!--      if (searchQueryFilter.value) {-->
<!--        const query = searchQueryFilter.value.toLowerCase()-->
<!--        filtered = filtered.filter(q =>-->
<!--            q.title.toLowerCase().includes(query)-->
<!--        )-->
<!--      }-->

<!--      // 农户ID筛选-->
<!--      if (searchFarmerFilter.value) {-->
<!--        const farmerId = parseInt(searchFarmerFilter.value)-->
<!--        if (!isNaN(farmerId)) {-->
<!--          filtered = filtered.filter(q => q.user_id === farmerId)-->
<!--        }-->
<!--      }-->

<!--      // 状态筛选-->
<!--      if (filterStatusFilter.value) {-->
<!--        filtered = filtered.filter(q => q.status === filterStatusFilter.value)-->
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

<!--    // 搜索处理-->
<!--    const handleSearch = () => {-->
<!--      // 将当前搜索条件应用到过滤器-->
<!--      searchQueryFilter.value = searchQuery.value-->
<!--      searchFarmerFilter.value = searchFarmer.value-->
<!--      filterStatusFilter.value = filterStatus.value-->
<!--      currentPage.value = 1; // 搜索时重置到第一页-->
<!--    }-->

<!--    // 重置搜索-->
<!--    const resetSearch = () => {-->
<!--      searchQuery.value = ''-->
<!--      searchFarmer.value = ''-->
<!--      filterStatus.value = ''-->

<!--      // 同时重置过滤器-->
<!--      searchQueryFilter.value = ''-->
<!--      searchFarmerFilter.value = ''-->
<!--      filterStatusFilter.value = ''-->

<!--      currentPage.value = 1; // 重置到第一页-->
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
<!--        ElMessage.error('删除失败: ' + (error.response?.data?.message || error.message))-->
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
<!--      resetSearch,-->
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
<!--  align-items: center;-->
<!--  flex-wrap: wrap;-->
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
          placeholder="搜索问题标题或内容"
          clearable
          style="width: 200px"
      />
      <el-input
          v-model="searchQuestionId"
          placeholder="问题ID"
          clearable
          style="width: 120px"
      />
      <el-input
          v-model="searchFarmer"
          placeholder="农户ID"
          clearable
          style="width: 120px"
      />
      <el-input
          v-model="searchAnswerCount"
          placeholder="回答数"
          clearable
          style="width: 120px"
      />
      <el-date-picker
          v-model="searchCreateDate"
          type="date"
          placeholder="提问日期"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          style="width: 150px"
      />
      <el-select
          v-model="filterStatus"
          placeholder="问题状态"
          clearable
          style="width: 120px"
      >
        <el-option label="全部" value="" />
        <el-option label="开放" value="open" />
        <el-option label="已关闭" value="closed" />
      </el-select>
      <el-button type="primary" @click="handleSearch">确认搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
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
    const searchQuery = ref('') // 标题或内容搜索
    const searchQuestionId = ref('') // 问题ID搜索
    const searchFarmer = ref('') // 农户ID搜索
    const searchAnswerCount = ref('') // 回答数搜索
    const searchCreateDate = ref('') // 提问日期搜索
    const filterStatus = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)

    // 添加搜索条件状态
    const searchQueryFilter = ref('')
    const searchQuestionIdFilter = ref('')
    const searchFarmerFilter = ref('')
    const searchAnswerCountFilter = ref('')
    const searchCreateDateFilter = ref('')
    const filterStatusFilter = ref('')

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
    }

    // 获取问题列表
    const fetchQuestions = async () => {
      try {
        loading.value = true
        const res = await axios.get('http://localhost:3000/api/questions', {
          headers: {
            Authorization: `Bearer ${userStore.token}`
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

      // 标题或内容搜索筛选
      if (searchQueryFilter.value) {
        const query = searchQueryFilter.value.toLowerCase()
        filtered = filtered.filter(q =>
            q.title.toLowerCase().includes(query) ||
            q.content.toLowerCase().includes(query)
        )
      }

      // 问题ID筛选
      if (searchQuestionIdFilter.value) {
        const questionId = parseInt(searchQuestionIdFilter.value)
        if (!isNaN(questionId)) {
          filtered = filtered.filter(q => q.question_id === questionId)
        }
      }

      // 农户ID筛选
      if (searchFarmerFilter.value) {
        const farmerId = parseInt(searchFarmerFilter.value)
        if (!isNaN(farmerId)) {
          filtered = filtered.filter(q => q.user_id === farmerId)
        }
      }

      // 回答数筛选
      if (searchAnswerCountFilter.value) {
        const answerCount = parseInt(searchAnswerCountFilter.value)
        if (!isNaN(answerCount)) {
          filtered = filtered.filter(q => q.answer_count === answerCount)
        }
      }

      // 提问日期筛选
      if (searchCreateDateFilter.value) {
        const searchDate = new Date(searchCreateDateFilter.value);
        searchDate.setHours(0, 0, 0, 0);

        filtered = filtered.filter(q => {
          if (!q.created_at) return false;
          const questionDate = new Date(q.created_at);
          questionDate.setHours(0, 0, 0, 0);
          return questionDate.getTime() === searchDate.getTime();
        });
      }

      // 状态筛选
      if (filterStatusFilter.value) {
        filtered = filtered.filter(q => q.status === filterStatusFilter.value)
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

    // 搜索处理
    const handleSearch = () => {
      // 将当前搜索条件应用到过滤器
      searchQueryFilter.value = searchQuery.value
      searchQuestionIdFilter.value = searchQuestionId.value
      searchFarmerFilter.value = searchFarmer.value
      searchAnswerCountFilter.value = searchAnswerCount.value
      searchCreateDateFilter.value = searchCreateDate.value
      filterStatusFilter.value = filterStatus.value
      currentPage.value = 1; // 搜索时重置到第一页
    }

    // 重置搜索
    const resetSearch = () => {
      searchQuery.value = ''
      searchQuestionId.value = ''
      searchFarmer.value = ''
      searchAnswerCount.value = ''
      searchCreateDate.value = ''
      filterStatus.value = ''

      // 同时重置过滤器
      searchQueryFilter.value = ''
      searchQuestionIdFilter.value = ''
      searchFarmerFilter.value = ''
      searchAnswerCountFilter.value = ''
      searchCreateDateFilter.value = ''
      filterStatusFilter.value = ''

      currentPage.value = 1; // 重置到第一页
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
      searchQuestionId,
      searchFarmer,
      searchAnswerCount,
      searchCreateDate,
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
      resetSearch,
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
  align-items: center;
  flex-wrap: wrap;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
