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
      <el-select
          v-model="filterDeleted"
          placeholder="删除状态"
          clearable
          style="width: 200px"
      >
        <el-option label="全部" value="" />
        <el-option label="正常" value="false" />
        <el-option label="已删除" value="true" />
      </el-select>
      <el-button type="primary" @click="fetchQuestions">搜索</el-button>
    </div>

    <!-- 问题表格 -->
    <el-table
        :data="paginatedQuestions"
        style="width: 100%"
        v-loading="loading"
    >
      <el-table-column prop="questionId" label="ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="farmerId" label="农户ID" width="100" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 'open' ? 'success' : 'info'">
            {{ row.status === 'open' ? '开放' : '已关闭' }}
          </el-tag>
          <el-tag v-if="row.is_deleted" type="danger" style="margin-left: 5px">
            已删除
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="answerCount" label="回答数" width="100" />
      <el-table-column prop="createdAt" label="提问时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="showQuestionDetail(row)">
            详情
          </el-button>
          <el-button
              v-if="row.status === 'open' && !row.is_deleted"
              size="small"
              type="warning"
              @click="showCloseDialog(row)"
          >
            关闭
          </el-button>
          <el-button
              v-if="row.status === 'closed' && !row.is_deleted"
              size="small"
              type="success"
              @click="reopenQuestion(row.question_id)"
          >
            重开
          </el-button>
          <el-button
              v-if="!row.is_deleted"
              size="small"
              type="danger"
              @click="showDeleteDialog(row)"
          >
            删除
          </el-button>
          <el-button
              v-if="row.is_deleted"
              size="small"
              type="primary"
              @click="restoreQuestion(row.question_id)"
          >
            恢复
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

    <!-- 问题详情对话框 -->
    <el-dialog v-model="detailVisible" title="问题详情" width="70%">
      <div v-if="currentQuestion">
        <h3>{{ currentQuestion.title }}</h3>
        <div class="content">{{ currentQuestion.content }}</div>

        <el-divider />

        <div class="meta-info">
          <div><strong>提问农户ID:</strong> {{ currentQuestion.farmer_id }}</div>
          <div><strong>提问时间:</strong> {{ formatDate(currentQuestion.created_at) }}</div>
          <div><strong>回答数量:</strong> {{ currentQuestion.answer_count }}</div>
          <div v-if="currentQuestion.status === 'closed'">
            <strong>关闭时间:</strong> {{ formatDate(currentQuestion.closed_at) }}
          </div>
          <div v-if="currentQuestion.is_deleted">
            <strong>删除时间:</strong> {{ formatDate(currentQuestion.deleted_at) }}
            <div><strong>删除原因:</strong> {{ currentQuestion.delete_reason }}</div>
          </div>
        </div>

        <el-divider />

        <h4>回答列表</h4>
        <el-table :data="answers" v-loading="answersLoading">
          <el-table-column prop="expert_id" label="专家ID" width="100" />
          <el-table-column prop="content" label="回答内容" />
          <el-table-column prop="answered_at" label="回答时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.answered_at) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 关闭/删除对话框 -->
    <el-dialog v-model="actionDialogVisible" :title="actionDialogTitle" width="500px">
      <el-form>
        <el-form-item label="操作原因" required>
          <el-input
              v-model="actionReason"
              type="textarea"
              :rows="4"
              placeholder="请输入操作原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="actionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAction">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getQuestions,
  closeQuestion,
  reopenQuestion,
  deleteQuestion,
  restoreQuestion,
  getQuestionAnswers
} from '@/views/admin/adminApi'

export default {
  setup() {
    // 状态管理
    const questions = ref([])
    const loading = ref(false)
    const searchQuery = ref('')
    const searchFarmer = ref('')
    const filterStatus = ref('')
    const filterDeleted = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalQuestions = ref(0)

    // 详情相关
    const detailVisible = ref(false)
    const currentQuestion = ref(null)
    const answers = ref([])
    const answersLoading = ref(false)

    // 操作相关
    const actionDialogVisible = ref(false)
    const actionType = ref('') // 'close' | 'delete'
    const actionReason = ref('')
    const currentActionQuestion = ref(null)

    // 格式化日期
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString()
    }

    // 获取问题列表
    const fetchQuestions = async () => {
      try {
        loading.value = true
        // mock
        const mockData = [
          {
            question_id: 1,
            farmer_id: 2,
            title: '水稻病虫害防治问题',
            content: '最近发现稻田里出现大量害虫，叶片上有明显的啃食痕迹，请问该如何有效防治？使用什么农药比较合适？需要注意哪些安全事项？',
            status: 'open',
            created_at: '2023-05-10',
            answer_count: 3,
            farmer_name: '张农户',
            deleted_by: 1,
            is_deleted: false,
            deleted_at: '2023-05-14',
            deleted_reason: '表述不当'
          },
          {
            question_id: 2,
            farmer_id: 3,
            title: '小麦种植最佳时间',
            content: '请问在我们这个地区，小麦的最佳种植时间是什么时候？不同品种的小麦在种植时间上有什么区别？',
            status: 'closed',
            created_at: '2023-04-15',
            answer_count: 5,
            farmer_name: '李农户',
            deleted_by: 1,
            is_deleted: false,
            deleted_at: '2023-05-14',
            deleted_reason: '表述不当'
          },
          {
            question_id: 3,
            farmer_id: 1,
            title: '有机肥料使用建议',
            content: '想请教专家关于有机肥料的使用方法和注意事项。如何判断有机肥料的质量？施用量应该如何控制？',
            status: 'open',
            created_at: '2023-05-20',
            answer_count: 2,
            farmer_name: '王农户',
            deleted_by: 1,
            is_deleted: false,
            deleted_at: '2023-05-14',
            deleted_reason: '表述不当'
          }
        ]
        questions.value = mockData.map(q => ({
          questionId: q.question_id,
          farmerId: q.farmer_id,
          title: q.title,
          content: q.content,
          status: q.status,
          createdAt: q.created_at,
          answerCount: q.answer_count,
          farmerName: q.farmer_name,
          isDeleted: q.is_deleted,
          deletedBy: q.deleted_by,
          deletedAt: q.deleted_at,
          deletedReason: q.deleted_reason
        }))
        // const params = {
        //   page: currentPage.value,
        //   page_size: pageSize.value,
        //   search: searchQuery.value,
        //   farmer_id: searchFarmer.value,
        //   status: filterStatus.value,
        //   is_deleted: filterDeleted.value
        // }
        // const res = await getQuestions(params)
        // questions.value = res.data
        // totalQuestions.value = res.total
      } catch (error) {
        ElMessage.error('获取问题列表失败')
        console.error('获取问题列表失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 分页处理
    const handlePageChange = (page) => {
      currentPage.value = page
      fetchQuestions()
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchQuestions()
    }

    // 搜索清空
    const handleSearchClear = () => {
      searchQuery.value = ''
      fetchQuestions()
    }

    const router = useRouter()
    // 显示问题详情
    const showQuestionDetail = (question) => {
      router.push(`/admin/ques/${question.questionId}`);
    }
    // const showQuestionDetail = async (question) => {
    //   currentQuestion.value = question
    //   answersLoading.value = true
    //   try {
    //     //mock
    //     const mockAnswers = [
    //       {
    //         answer_id: 1,
    //         question_id: 1,
    //         expert_id: 101,
    //         expert_name: '张专家',
    //         content: '建议使用XX农药，按照1:1000的比例稀释后喷洒，注意避开高温时段使用。',
    //         answered_at: '2023-05-11T10:30:00',
    //         upvotes: 5
    //       },
    //       {
    //         answer_id: 2,
    //         question_id: 1,
    //         expert_id: 102,
    //         expert_name: '李教授',
    //         content: '可以使用生物防治方法，引入天敌昆虫如瓢虫来控制害虫数量。',
    //         answered_at: '2023-05-12T14:15:00',
    //         upvotes: 8
    //       }
    //     ]
    //     answers.value = mockAnswers.filter(answer =>
    //         answer.question_id === question.questionId
    //     )
    //     //const res = await getQuestionAnswers(question.question_id)
    //     //answers.value = res.data
    //     detailVisible.value = true
    //   } catch (error) {
    //     ElMessage.error('获取回答列表失败')
    //   } finally {
    //     answersLoading.value = false
    //   }
    // }

    // 操作对话框
    const showCloseDialog = (question) => {
      actionType.value = 'close'
      actionDialogTitle.value = '关闭问题'
      currentActionQuestion.value = question
      actionDialogVisible.value = true
    }

    const showDeleteDialog = (question) => {
      actionType.value = 'delete'
      actionDialogTitle.value = '删除问题'
      currentActionQuestion.value = question
      actionDialogVisible.value = true
    }

    // 确认操作
    const confirmAction = async () => {
      if (!actionReason.value) {
        ElMessage.warning('请填写操作原因')
        return
      }

      try {
        const questionId = currentActionQuestion.value.question_id
        if (actionType.value === 'close') {
          await closeQuestion(questionId, actionReason.value)
          ElMessage.success('问题已关闭')
        } else if (actionType.value === 'delete') {
          await deleteQuestion(questionId, actionReason.value)
          ElMessage.success('问题已删除')
        }
        actionDialogVisible.value = false
        actionReason.value = ''
        fetchQuestions()
      } catch (error) {
        ElMessage.error('操作失败')
        console.error('操作失败:', error)
      }
    }

    // 重新打开问题
    const reopenQuestion = async (questionId) => {
      try {
        await reopenQuestion(questionId)
        ElMessage.success('问题已重新开放')
        fetchQuestions()
      } catch (error) {
        ElMessage.error('重新打开问题失败')
        console.error('重新打开问题失败:', error)
      }
    }

    // 恢复问题
    const restoreQuestion = async (questionId) => {
      try {
        await restoreQuestion(questionId)
        ElMessage.success('问题已恢复')
        fetchQuestions()
      } catch (error) {
        ElMessage.error('恢复问题失败')
        console.error('恢复问题失败:', error)
      }
    }

    // 计算属性
    const paginatedQuestions = computed(() => {
      return questions.value
    })

    const actionDialogTitle = computed(() => {
      return actionType.value === 'close' ? '关闭问题' : '删除问题'
    })

    // 初始化加载
    onMounted(() => {
      fetchQuestions()
    })

    return {
      // 状态
      questions,
      loading,
      searchQuery,
      searchFarmer,
      filterStatus,
      filterDeleted,
      currentPage,
      pageSize,
      totalQuestions,
      detailVisible,
      currentQuestion,
      answers,
      answersLoading,
      actionDialogVisible,
      actionType,
      actionReason,
      currentActionQuestion,

      // 方法
      fetchQuestions,
      handlePageChange,
      handleSizeChange,
      handleSearchClear,
      showQuestionDetail,
      showCloseDialog,
      showDeleteDialog,
      confirmAction,
      reopenQuestion,
      restoreQuestion,
      formatDate,

      // 计算属性
      paginatedQuestions,
      actionDialogTitle
    }
  }
}
</script>

<style scoped>
.container {
  //padding: 20px;
}

.search-filter {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.content {
  white-space: pre-wrap;
  margin: 15px 0;
  line-height: 1.6;
}

.meta-info {
  margin: 15px 0;
}

.meta-info div {
  margin-bottom: 8px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
