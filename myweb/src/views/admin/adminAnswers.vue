<template>
  <div class="question-detail-container">
    <el-page-header @back="goBack" content="问题详情" />

    <!-- 问题基本信息 -->
    <div class="question-header">
      <h2>{{ question.title }}</h2>
      <div class="meta">
        <span>提问农户: {{ question.farmerName }} (ID: {{ question.farmerId }})</span>
        <span>提问时间: {{ formatDate(question.createdAt) }}</span>
        <el-tag :type="question.status === 'open' ? 'success' : 'info'">
          {{ question.status === 'open' ? '开放' : '已关闭' }}
        </el-tag>
      </div>
      <div class="content">{{ question.content }}</div>
    </div>

    <!-- 回答筛选区域 -->
    <div class="search-filter">
      <el-input
          v-model="searchExpert"
          placeholder="搜索专家ID或姓名"
          clearable      style="width: 200px"
      />
      <el-input
          v-model="searchContent"
          placeholder="搜索回答内容"
          clearable      style="width: 300px"
      />
      <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"      style="width: 350px"
          @change="handleDateChange"
      />
      <el-button type="primary" @click="fetchAnswers">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>

    <!-- 回答列表 -->
    <el-table :data="filteredAnswers" v-loading="loading">
      <el-table-column prop="expert_name" label="专家" width="150">
        <template #default="{ row }">
          {{ row.expert_name }} (ID: {{ row.expert_id }})
        </template>
      </el-table-column>
      <el-table-column prop="content" label="回答内容" />
      <el-table-column prop="answered_at" label="回答时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.answered_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
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
          :total="totalAnswers"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getQuestionDetail, getQuestionAnswers, deleteAnswer } from '@/views/admin/adminApi'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()

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
    const totalAnswers = ref(0)

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
      fetchAnswers()
    }

    // 格式化日期
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString()
    }

    // 返回问题列表
    const goBack = () => {
      router.push(`/admin/ques`)
    }

    // 获取问题详情
    const fetchQuestion = async () => {
      try {
        loading.value = true
        // mock数据
        question.value = {
          questionId: route.params.id,
          title: '水稻病虫害防治问题',
          content: '最近发现稻田里出现大量害虫...',
          farmerId: 2,
          farmerName: '张农户',
          status: 'open',
          createdAt: '2023-05-10T08:00:00Z',
          answerCount: 3
        }
        // const res = await getQuestionDetail(route.params.id)
        // question.value = res.data
      } catch (error) {
        ElMessage.error('获取问题详情失败')
      } finally {
        loading.value = false
      }
    }

    // 获取回答列表
    const fetchAnswers = async () => {
      try {
        loading.value = true
        // mock数据
        const mockAnswers = [
          {
            answer_id: 1,
            question_id: route.params.id,
            expert_id: 101,
            expert_name: '张专家',
            content: '建议使用XX农药...',
            answered_at: '2023-05-11T10:30:00Z',
            upvotes: 5
          },
          {
            answer_id: 2,
            question_id: route.params.id,
            expert_id: 102,
            expert_name: '李教授',
            content: '可以使用生物防治方法...',
            answered_at: '2023-05-12T14:15:00Z',
            upvotes: 8
          }
        ]
        answers.value = mockAnswers
        totalAnswers.value = mockAnswers.length

        //// 应用筛选条件
        // answers.value = mockAnswers.filter(answer => {
        //   const expertMatch = String(answer.expert_id).includes(searchExpert.value) ||
        //       answer.expert_name.toLowerCase().includes(searchExpert.value.toLowerCase())
        //   const contentMatch = answer.content.toLowerCase().includes(searchContent.value.toLowerCase())
        //
        //   let dateMatch = true
        //   if (startDate.value && endDate.value) {
        //     const answerDate = new Date(answer.answered_at).toISOString().split('T')[0]
        //     dateMatch = answerDate >= startDate.value && answerDate <= endDate.value
        //   }
        //
        //   return expertMatch && contentMatch && dateMatch
        // })
        //
        // totalAnswers.value = answers.value.length

        // const params = {
        //   page: currentPage.value,
        //   page_size: pageSize.value,
        //   search: searchExpert.value
        // }
        // const res = await getQuestionAnswers(route.params.id, params)
        // answers.value = res.data
        // totalAnswers.value = res.total
      } catch (error) {
        ElMessage.error('获取回答列表失败')
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
          // await deleteAnswer(answerId)
          ElMessage.success('回答已删除')
          fetchAnswers() // 刷新列表
        } catch (error) {
          ElMessage.error('删除回答失败')
        }
      }).catch(() => {
        // 用户取消
      })
    }

    // 计算属性 - 过滤回答
    const filteredAnswers = computed(() => {
      return answers.value.filter(answer => {
        const search = searchExpert.value.toLowerCase()
        return (
            String(answer.expert_id).includes(search) ||
            answer.expert_name.toLowerCase().includes(search)
        )
      })
    })

    // 分页处理
    const handlePageChange = (page) => {
      currentPage.value = page
      fetchAnswers()
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchAnswers()
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
      currentPage,
      pageSize,
      totalAnswers,
      searchContent,
      dateRange,

      // 方法
      formatDate,
      goBack,
      fetchAnswers,
      handleDeleteAnswer,
      handlePageChange,
      handleSizeChange,
      resetSearch,
      handleDateChange,

      // 计算属性
      filteredAnswers
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

.answer-filter {
  margin: 15px 0;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
