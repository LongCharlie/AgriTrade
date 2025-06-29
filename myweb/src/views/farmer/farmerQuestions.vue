<template>
  <div class="questions-container">
    <!-- 过滤按钮 -->
    <div class="filter-buttons">
      <el-button :type="filter === 'all' ? 'primary' : 'default'" @click="setFilter('all')">全部</el-button>
      <el-button :type="filter === 'mine' ? 'primary' : 'default'" @click="setFilter('mine')">我的提问</el-button>
    </div>

    <!-- 提问卡片列表 -->
    <el-row :gutter="20" class="question-cards">
      <el-col :span="8" v-for="(question, index) in displayedQuestions" :key="index">
        <el-card class="question-card" @click="goToDetail(question.question_id)">
          <div class="card-header">
            <span class="title">{{ question.title }}</span>
          </div>
          <div class="card-body">
            <p class="content">{{ question.content }}</p>
            <p class="meta">提问者：{{ question.farmerName || '匿名' }}</p>
            <p class="meta">时间：{{ formatTime(question.created_at) }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 空状态 -->
    <div v-if="displayedQuestions.length === 0" class="no-data">
      暂无提问
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// 当前筛选状态
const filter = ref('mine'); // 默认显示“我的提问”

//mock
const testQuestions = ref([
  {
    question_id: 1,
    title: '如何防治小麦锈病？',
    content: '我种植的小麦最近出现了锈病，请问有什么有效的防治方法？',
    farmerName: '张三',
    farmer_id: 101,
    created_at: '2025-04-05T10:00:00Z',
    status: 'open',
    answer_count: 2
  },
  {
    question_id: 2,
    title: '玉米种植的最佳时间是什么时候？',
    content: '我在北方种植玉米，想知道最佳的播种时间以及需要注意的事项。',
    farmerName: '李四',
    farmer_id: 102,
    created_at: '2025-04-06T11:30:00Z',
    status: 'closed',
    answer_count: 1
  },
  {
    question_id: 3,
    title: '有机肥料对土壤的作用有哪些？',
    content: '我想了解有机肥料对改善土壤的具体作用，以及如何正确使用。',
    farmerName: '王五',
    farmer_id: 103,
    created_at: '2025-04-07T14:20:00Z',
    status: 'open',
    answer_count: 0
  }
]);

// 存储所有问题
const allQuestions = ref([]);

// 加载状态
const loading = ref(false);

// 获取问题列表
const fetchQuestions = async () => {
  try {
    loading.value = true;
    let res;

    if (filter.value === 'mine') {
      // 获取当前用户的提问
      res = await axios.get('/api/questions');
    } else {
      // 获取所有问题（仅专家可见）
      res = await axios.get('/api/questions/all');
    }

    // 处理返回数据
    const questionsWithNames = res.data.questions.map(q => ({
      ...q,
      farmerName: q.farmer ? q.farmer.username : null
    }));

    allQuestions.value = questionsWithNames;
  } catch (error) {
    console.error('获取问题失败:', error);
  } finally {
    loading.value = false;
  }
};

// 切换筛选条件时重新加载数据
const setFilter = (type) => {
  filter.value = type;
  fetchQuestions();
};

// 格式化时间
const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleDateString();
};

// 显示的问题列表计算属性
const displayedQuestions = computed(() => {
  return testQuestions.value;//mock
});

// 跳转到问题详情页
const goToDetail = (id) => {
  router.push(`/farmer/questions/${id}`);
};

// 初始化加载数据
fetchQuestions();

</script>

<style>
.questions-container {
  padding: 20px;
}

.filter-buttons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.question-cards {
  margin-top: 10px;
}

.question-card {
  cursor: pointer;
  transition: transform 0.2s ease;
  height: 200px;
  overflow-y: auto;
}

.question-card:hover {
  transform: scale(1.02);
}

.card-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-body .content {
  font-size: 14px;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 10px;
}

.card-body .meta {
  font-size: 12px;
  color: #999;
}
</style>