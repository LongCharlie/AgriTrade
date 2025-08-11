<template>
  <div class="question-detail-container">
    <el-page-header @back="goBack" content="问题详情" />

    <!-- 问题基本信息 -->
    <div class="question-header">
      <div class="header-actions">
        <h2>{{ question.title }}</h2>
        <el-button
            size="small"
            type="danger"
            @click="showDeleteDialog(question)"
        >
          删除提问
        </el-button>
      </div>
      <div class="meta">
        <span>提问农户: {{ question.username }} (ID: {{ question.user_id }})</span>
        <span>提问时间: {{ formatDate(question.created_at) }}</span>
        <el-tag :type="question.status === 'open' ? 'success' : 'info'">
          {{ question.status === 'open' ? '开放' : '已关闭' }}
        </el-tag>
      </div>
      <div class="content">{{ question.content }}</div>
      <!-- 问题图片展示 -->
      <div v-if="question.images && question.images.length > 0" class="question-images">
        <p><strong>问题图片：</strong></p>
        <div class="image-gallery">
          <el-image
              v-for="(image, index) in question.images"
              :key="image.id"
              :src="`http://localhost:3000${image.url}`"
              :preview-src-list="getPreviewList(question.images)"
              :initial-index="index"
              class="question-image"
              fit="cover"
              lazy
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
      </div>
    </div>

    <!-- 回答筛选区域 -->
    <div class="search-filter">
      <el-input
          v-model="searchExpert"
          placeholder="搜索专家ID或姓名"
          clearable
          style="width: 200px"
      />
      <el-input
          v-model="searchContent"
          placeholder="搜索回答内容"
          clearable
          style="width: 300px"
      />
      <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 350px"
          @change="handleDateChange"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>

    <!-- 回答列表 -->
    <el-table :data="paginatedAnswers" v-loading="loading">
      <el-table-column prop="real_name" label="专家" width="150">
        <template #default="{ row }">
          {{ row.real_name }} (ID: {{ row.expert_id }})
        </template>
      </el-table-column>
      <el-table-column prop="content" label="回答内容" />
      <el-table-column prop="answered_at" label="回答时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.answered_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="showAnswerDetail(row)">
            详情
          </el-button>
          <el-button
              type="danger"
              size="small"
              @click="handleDeleteAnswer(row.answer_id)"
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
          :total="filteredAnswers.length"
          :page-sizes="[10, 20, 50]"
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from "axios";
import { useUserStore } from "@/stores/user";

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore();
    const token = userStore.token;

    // 状态管理
    const searchExpert = ref('')
    const searchContent = ref('')
    const dateRange = ref([])
    const startDate = ref('')
    const endDate = ref('')
    const question = ref({})
    const answers = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)

    // 操作相关
    const actionDialogVisible = ref(false)
    const currentActionQuestion = ref(null)

    // 日期范围变更处理
    const handleDateChange = (dates) => {
      if (dates && dates.length === 2) {
        startDate.value = dates[0].toISOString().split('T')[0]
        endDate.value = dates[1].toISOString().split('T')[0]
      } else {
        startDate.value = ''
        endDate.value = ''
      }
    }

    // 重置搜索条件
    const resetSearch = () => {
      searchExpert.value = ''
      searchContent.value = ''
      dateRange.value = []
      startDate.value = ''
      endDate.value = ''
      currentPage.value = 1; // 重置到第一页
    }

    const handleSearch = () => {
      currentPage.value = 1; // 搜索时重置到第一页
    }

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

    // 返回问题列表
    const goBack = () => {
      router.push(`/admin/ques`)
    }

    // 获取问题详情
    const fetchQuestion = async () => {
      try {
        loading.value = true
        const id = route.params.id;
        const token = userStore.token;
        const response = await axios.get(`http://localhost:3000/api/questions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        question.value = response.data;
      } catch (error) {
        ElMessage.error('获取问题详情失败')
        console.error('获取问题详情失败:', error)
      } finally {
        loading.value = false
      }
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
        //fetchQuestions() // 重新获取问题列表
        router.push(`/admin/ques`)
      } catch (error) {
        ElMessage.error('删除失败: ' + (error.response?.data?.message || error.message))
        console.error('删除失败:', error)
      }
    }

    // 获取回答列表
    const fetchAnswers = async () => {
      try {
        loading.value = true
        const id = route.params.id;
        const token = userStore.token;
        const response = await axios.get(`http://localhost:3000/api/questions/${id}/answers`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        answers.value = response.data
        //ElMessage.success('获取回答列表成功')
      } catch (error) {
        ElMessage.error('获取回答列表失败')
        console.error('获取回答列表失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 删除回答
    const handleDeleteAnswer = (answerId) => {
      ElMessageBox.confirm('确定要删除这条回答吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const token = userStore.token;

          await axios.delete(`http://localhost:3000/api/answers/${answerId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          // 从本地列表中移除
          const index = answers.value.findIndex(a => a.answer_id === answerId);
          if (index !== -1) {
            answers.value.splice(index, 1);
          }

          ElMessage.success('回答已删除')
        } catch (error) {
          ElMessage.error('删除回答失败')
          console.error('删除回答失败:', error)
        }
      }).catch(() => {
        // 用户取消
      })
    }

    // 显示问题详情
    const showAnswerDetail = (answer) => {
      router.push(`/admin/answer/${answer.answer_id}`);
    }
    
    // 获取图片预览列表
    const getPreviewList = (images) => {
      return images.map(image => `http://localhost:3000${image.url}`);
    }

    // 计算属性 - 过滤回答
    const filteredAnswers = computed(() => {
      return answers.value.filter(answer => {
        // 专家ID或姓名筛选
        const expertMatch = searchExpert.value ?
            (String(answer.expert_id).includes(searchExpert.value) ||
                answer.real_name.toLowerCase().includes(searchExpert.value.toLowerCase())) :
            true;

        // 内容筛选
        const contentMatch = searchContent.value ?
            answer.content.toLowerCase().includes(searchContent.value.toLowerCase()) :
            true;

        // 日期筛选
        let dateMatch = true;
        if (startDate.value && endDate.value) {
          const answerDate = new Date(answer.answered_at).toISOString().split('T')[0];
          dateMatch = answerDate >= startDate.value && answerDate <= endDate.value;
        }

        return expertMatch && contentMatch && dateMatch;
      })
    })

    // 计算属性 - 分页后的回答
    const paginatedAnswers = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredAnswers.value.slice(start, end);
    })

    // 分页处理
    const handlePageChange = (page) => {
      currentPage.value = page
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1 // 重置到第一页
    }

    // 初始化加载
    onMounted(() => {
      fetchQuestion()
      fetchAnswers()
    })

    return {
      // 状态
      question,
      answers,
      loading,
      searchExpert,
      searchContent,
      dateRange,
      currentPage,
      pageSize,

      // 方法
      formatDate,
      goBack,
      handleDeleteAnswer,
      showAnswerDetail,
      handlePageChange,
      handleSizeChange,
      resetSearch,
      handleDateChange,
      handleSearch,
      getPreviewList,
      showDeleteDialog,
      confirmDelete,

      // 计算属性
      filteredAnswers,
      paginatedAnswers,
      actionDialogVisible
    }
  }
}
</script>

<style scoped>
.search-filter {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.question-detail-container {
  padding: 20px;
}

.question-header {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.question-header h2 {
  margin-bottom: 10px;
}

.meta {
  margin-bottom: 15px;
  color: #666;
  display: flex;
  gap: 15px;
}

.content {
  white-space: pre-wrap;
  line-height: 1.6;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 问题图片样式 */
.question-images {
  margin-top: 20px;
  margin-bottom: 20px;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.question-image {
  width: 150px;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #eee;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  color: #999;
  font-size: 24px;
}

/* 添加头部操作区域样式 */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  margin-right: 60px;
}

/* 调整标题样式 */
.header-actions h2 {
  margin: 0;
  flex-grow: 1;
}

/* 确保删除按钮有足够间距 */
.header-actions .el-button {
  margin-left: 20px;
}
</style>
