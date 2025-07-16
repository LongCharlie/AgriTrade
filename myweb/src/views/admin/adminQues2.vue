<template>
  <div class="container">
    <h1>问题审核</h1>

    <!-- 搜索和筛选区域 -->
    <div class="search-bar">
      <el-input v-model="searchQuery" placeholder="搜索问题标题" style="width: 200px;"></el-input>
      <el-input v-model="searchFarmer" placeholder="搜索农户名" style="width: 200px;"></el-input>
      <el-select v-model="filterStatus" placeholder="选择状态" style="width: 200px;">
        <el-option label="全部" value="all"></el-option>
        <el-option label="未关闭" value="open"></el-option>
        <el-option label="已关闭" value="closed"></el-option>
        <el-option label="未回答" value="unanswered"></el-option>
        <el-option label="已回答" value="answered"></el-option>
      </el-select>

      <el-button type="primary" @click="performSearch">搜索</el-button>
    </div>

    <!-- 问题表格 -->
    <el-table :data="paginatedData" style="width: 100%">
      <el-table-column prop="questionId" label="问题ID" width="120"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="farmerName" label="提问农户" width="150"></el-table-column>
      <el-table-column prop="createdAt" label="提问时间" width="180"></el-table-column>
      <el-table-column prop="answerCount" label="回答数" width="100"></el-table-column>
      <el-table-column label="状态" width="120">
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row)">
            {{ getStatusText(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button
              type="text"
              @click="viewQuestionDetail(scope.row.questionId)"
          >
            查看详情
          </el-button>
          <el-button
              v-if="scope.row.status === 'open' && !scope.row.isDeleted"
              type="text"
              @click="showCloseDialog(scope.row)"
          >
            关闭问题
          </el-button>
          <el-button
              v-if="scope.row.status === 'closed' && !scope.row.isDeleted"
              type="text"
              @click="reopenQuestion(scope.row.questionId)"
          >
            重新打开
          </el-button>
          <el-button
              v-if="!scope.row.isDeleted"
              type="text"
              @click="showDeleteDialog(scope.row)"
          >
            删除
          </el-button>
          <el-button
              v-if="scope.row.isDeleted"
              type="text"
              @click="restoreQuestion(scope.row.questionId)"
          >
            恢复
          </el-button>
        </template>
      </el-table-column>
      <!-- 关闭/删除对话框 -->
      <el-dialog v-model="actionDialogVisible" :title="actionDialogTitle" width="500px">
        <el-form v-if="currentActionQuestion">
          <el-form-item label="操作原因" v-if="actionType !== 'restore'">
            <el-input
                v-model="actionReason"
                type="textarea"
                :rows="3"
                placeholder="请输入操作原因"
            ></el-input>
          </el-form-item>
          <el-form-item v-else>
            <p>确定要恢复此问题吗？</p>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="actionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAction">确认</el-button>
        </template>
      </el-dialog>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="filteredData.length"
        layout="total, prev, pager, next, jumper"
        style="margin-top: 20px; display: flex; justify-content: center;"
    ></el-pagination>

    <!-- 问题详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="问题详情" width="70%">
      <div v-if="currentQuestion">
        <h3>{{ currentQuestion.title }}</h3>
        <p class="content">{{ currentQuestion.content }}</p>

        <div class="meta">
          <span><i class="el-icon-user"></i> {{ currentQuestion.farmerName }}</span>
          <span><i class="el-icon-time"></i> {{ currentQuestion.createdAt }}</span>
          <span><i class="el-icon-chat-dot-round"></i> {{ currentQuestion.answerCount }} 回答</span>
        </div>

        <el-divider></el-divider>

        <div class="answers" v-if="currentQuestion.answers && currentQuestion.answers.length > 0">
          <h4>回答列表</h4>
          <div v-for="(answer, index) in currentQuestion.answers" :key="index" class="answer-item">
            <p>{{ answer.content }}</p>
            <p class="answer-meta">- {{ answer.expertName }} ({{ answer.createdAt }})</p>
          </div>
        </div>
        <div v-else>
          <p>暂无回答</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getAllQuestions,
  closeQuestion,
  reopenQuestion,
  deleteQuestion,
  restoreQuestion
} from '../../views/expert/expertApi'

export default {
  setup() {
    const router = useRouter()

    // 数据状态
    const questions = ref([])
    const searchQuery = ref('')
    const searchFarmer = ref('')
    const filterStatus = ref('all')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const detailDialogVisible = ref(false)
    const currentQuestion = ref(null)
    const actionDialogVisible = ref(false)
    const actionType = ref('') // 'close'|'delete'|'restore'
    const actionReason = ref('')
    const currentActionQuestion = ref(null)

    // 获取问题列表
    const fetchQuestions = async () => {
      try {
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
        //补充api调用
      } catch (error) {
        console.error('获取问题列表失败:', error)
      }
    }

    // 计算属性
    const actionDialogTitle = computed(() => {
      switch(actionType.value) {
        case 'close': return '关闭问题'
        case 'delete': return '删除问题'
        case 'restore': return '恢复问题'
        default: return ''
      }
    })

    const showCloseDialog = (question) => {
      actionType.value = 'close'
      currentActionQuestion.value = question
      actionDialogVisible.value = true
    }

    const showDeleteDialog = (question) => {
      actionType.value = 'delete'
      currentActionQuestion.value = question
      actionDialogVisible.value = true
    }

    const confirmAction = async () => {
      try {
        const questionId = currentActionQuestion.value.questionId
        switch(actionType.value) {
          case 'close':
            await closeQuestion(questionId, actionReason.value)
            updateQuestionStatus(questionId, {
              status: 'closed',
              closedReason: actionReason.value,
              closedAt: new Date().toISOString()
            })
            break
          case 'delete':
            await deleteQuestion(questionId, actionReason.value)
            updateQuestionStatus(questionId, {
              isDeleted: true,
              deletedReason: actionReason.value,
              deletedAt: new Date().toISOString()
            })
            break
          case 'restore':
            await restoreQuestion(questionId)
            updateQuestionStatus(questionId, {
              isDeleted: false,
              deletedReason: null,
              deletedAt: null
            })
            break
        }
        actionDialogVisible.value = false
        actionReason.value = ''
      } catch (error) {
        console.error('操作失败:', error)
      }
    }

    const reopenQuestion = async (questionId) => {
      try {
        await reopenQuestion(questionId)
        updateQuestionStatus(questionId, {
          status: 'open',
          closedReason: null,
          closedAt: null
        })
      } catch (error) {
        console.error('重新打开问题失败:', error)
      }
    }

    const restoreQuestion = async (questionId) => {
      actionType.value = 'restore'
      currentActionQuestion.value = questions.value.find(q => q.questionId === questionId)
      actionDialogVisible.value = true
    }

    const updateQuestionStatus = (questionId, updates) => {
      const question = questions.value.find(q => q.questionId === questionId)
      if (question) {
        Object.assign(question, updates)
      }
    }

    const filteredData = computed(() => {
      return questions.value.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesFarmer = q.farmerName.toLowerCase().includes(searchFarmer.value.toLowerCase())
        const matchesStatus =
            filterStatus.value === 'all' ||
            (filterStatus.value === 'open' && q.status === 'open') ||
            (filterStatus.value === 'closed' && q.status === 'closed') ||
            (filterStatus.value === 'unanswered' && q.answerCount === 0) ||
            (filterStatus.value === 'answered' && q.answerCount > 0)

        return matchesSearch && matchesFarmer && matchesStatus
      })
    })

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredData.value.slice(start, end)
    })

    // 方法
    const performSearch = () => {
      currentPage.value = 1
    }

    const handlePageChange = (page) => {
      currentPage.value = page
    }

    const getStatusText = (question) => {
      if (question.status === 'closed') return '已关闭'
      return question.answerCount > 0 ? '已回答' : '未回答'
    }

    const getStatusTagType = (question) => {
      if (question.status === 'closed') return 'info'
      return question.answerCount > 0 ? 'success' : 'warning'
    }

    const viewQuestionDetail = (questionId) => {
      currentQuestion.value = questions.value.find(q => q.questionId === questionId)
      detailDialogVisible.value = true
    }

    const closeQuestion = async (questionId) => {
      try {
        await closeQuestion(questionId)
        const question = questions.value.find(q => q.questionId === questionId)
        if (question) {
          question.status = 'closed'
        }
      } catch (error) {
        console.error('关闭问题失败:', error)
      }
    }

    // 生命周期钩子
    onMounted(() => {
      fetchQuestions()
    })

    return {
      // 数据状态
      questions,
      searchQuery,
      searchFarmer,
      filterStatus,
      currentPage,
      pageSize,

      // 计算属性
      filteredData,
      paginatedData,

      // 对话框状态
      detailDialogVisible,
      currentQuestion,
      actionDialogVisible,
      actionDialogTitle,
      actionType,
      actionReason,
      currentActionQuestion,

      // 方法
      performSearch,
      handlePageChange,
      getStatusText,
      getStatusTagType,
      viewQuestionDetail,
      closeQuestion,
      showCloseDialog,
      showDeleteDialog,
      confirmAction,
      reopenQuestion,
      restoreQuestion,
      updateQuestionStatus
    }
  }
}
</script>

<style scoped>
.container {
  //padding: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.content {
  white-space: pre-wrap;
  margin: 15px 0;
  line-height: 1.6;
}

.meta {
  color: #888;
  font-size: 14px;
  display: flex;
  gap: 15px;
  margin: 10px 0;
}

.answers {
  margin-top: 20px;
}

.answer-item {
  padding: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.answer-meta {
  color: #888;
  font-size: 12px;
  text-align: right;
  margin-top: 5px;
}
</style>
