<template>
  <div class="questions-container">
    <h2>问题列表</h2>

    <!-- 状态筛选按钮 -->
    <div class="filter-buttons">
      <el-button :type="filter === 'all' ? 'primary' : 'default'" @click="filterQuestions('all')">全部</el-button>
      <el-button :type="filter === 'open' ? 'primary' : 'default'" @click="filterQuestions('open')">未关闭</el-button>
      <el-button :type="filter === 'closed' ? 'primary' : 'default'" @click="filterQuestions('closed')">已关闭</el-button>
    </div>

    <!-- 提问按钮 -->
    <div class="ask-button-container">
      <el-button type="primary" @click="goToAskQuestion" icon="el-icon-plus">我要提问</el-button>
    </div>

    <!-- 问题列表展示区域 -->
    <div class="question-list">
      <!-- 问题卡片 -->
      <el-card
          class="question-card"
          v-for="(question, index) in filteredQuestions"
          :key="index"
          shadow="hover"
      >
        <div class="card-header">
          <span class="question-title">{{ question.title }}</span>
          <el-tag :type="question.status === 'open' ? 'warning' : 'info'">
            {{ question.status === 'open' ? '未关闭' : '已关闭' }}
          </el-tag>
        </div>
        <div class="card-body">
          <p class="question-content">{{ truncateText(question.content, 150) }}</p>
          <div class="question-meta">
            <span><i class="el-icon-user"></i> {{ question.farmerName }}</span>
            <span><i class="el-icon-time"></i> {{ question.createdAt }}</span>
            <span><i class="el-icon-chat-dot-round"></i> {{ question.answerCount }} 回答</span>
          </div>
        </div>
        <div class="card-footer">
          <el-button type="primary" size="small" @click="viewQuestionDetail(question.questionId)">查看详情</el-button>
          <el-button
              v-if="question.status === 'open' && $store.getters.userRole === 'farmer'"
              type="danger"
              size="small"
              @click="closeQuestion(question.questionId)"
          >
            关闭问题
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getQuestions, closeQuestion } from '../../views/expert/expertApi';

export default {
  data() {
    return {
      questions: [],
      filter: 'all'
    };
  },
  computed: {
    // 根据状态过滤问题
    filteredQuestions() {
      if (this.filter === 'open') {
        return this.questions.filter(q => q.status === 'open');
      } else if (this.filter === 'closed') {
        return this.questions.filter(q => q.status === 'closed');
      }
      return this.questions;
    }
  },
  created() {
    this.fetchQuestions();
  },
  methods: {
    async fetchQuestions() {
      try {
        // 这里使用mock数据替代实际API调用
        const mockData = [
          {
            question_id: 1,
            title: '水稻病虫害防治问题',
            content: '最近发现稻田里出现大量害虫，叶片上有明显的啃食痕迹，请问该如何有效防治？使用什么农药比较合适？需要注意哪些安全事项？',
            status: 'open',
            created_at: '2023-05-10',
            answer_count: 3,
            farmer_name: '张农户'
          },
          {
            question_id: 2,
            title: '小麦种植最佳时间',
            content: '请问在我们这个地区，小麦的最佳种植时间是什么时候？不同品种的小麦在种植时间上有什么区别？',
            status: 'closed',
            created_at: '2023-04-15',
            answer_count: 5,
            farmer_name: '李农户'
          },
          {
            question_id: 3,
            title: '有机肥料使用建议',
            content: '想请教专家关于有机肥料的使用方法和注意事项。如何判断有机肥料的质量？施用量应该如何控制？',
            status: 'open',
            created_at: '2023-05-20',
            answer_count: 2,
            farmer_name: '王农户'
          }
        ];

        // 实际API调用应该像这样：
        // const res = await getQuestions({
        //   status: this.filter === 'all' ? undefined : this.filter
        // });
        // this.questions = res.data;

        this.questions = mockData.map(q => ({
          questionId: q.question_id,
          title: q.title,
          content: q.content,
          status: q.status,
          createdAt: q.created_at,
          answerCount: q.answer_count,
          farmerName: q.farmer_name
        }));
      } catch (error) {
        console.error('获取问题列表失败:', error);
        this.$message.error('获取问题列表失败');
      }
    },
    truncateText(text, length) {
      if (!text) return '';
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    },
    goToAskQuestion() {
      this.$router.push('/question/ask');
    },
    viewQuestionDetail(questionId) {
      this.$router.push(`/question/detail/${questionId}`);
    },
    async closeQuestion(questionId) {
      try {
        await this.$confirm('确定要关闭这个问题吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        // 实际API调用
        // await closeQuestion(questionId);

        // 模拟关闭操作
        const question = this.questions.find(q => q.questionId === questionId);
        if (question) {
          question.status = 'closed';
        }

        this.$message.success('问题已关闭');
      } catch (error) {
        if (error !== 'cancel') {
          console.error('关闭问题失败:', error);
          this.$message.error('关闭问题失败');
        }
      }
    },
    filterQuestions(status) {
      this.filter = status;
      this.fetchQuestions();
    }
  }
};
</script>

<style scoped>
.questions-container {
  padding: 20px;
}

.filter-buttons {
  margin-bottom: 20px;
}

.ask-button-container {
  margin-bottom: 20px;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-card {
  width: 100%;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.question-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.question-title {
  font-weight: bold;
  font-size: 18px;
  flex: 1;
  margin-right: 15px;
}

.card-body {
  padding: 10px 0;
}

.question-content {
  margin: 10px 0;
  color: #666;
  line-height: 1.6;
  font-size: 15px;
}

.question-meta {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  color: #888;
  font-size: 14px;
}

.question-meta i {
  margin-right: 5px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}
</style>




<!--<template>-->
<!--  <div class="vanta-container">-->
<!--    &lt;!&ndash; 主内容区域 &ndash;&gt;-->
<!--    <main class="content-wrapper">-->
<!--      &lt;!&ndash; 左侧问题列表 &ndash;&gt;-->
<!--      <aside class="question-sidebar">-->
<!--        <div class="search-box">-->
<!--          <input type="text" placeholder="搜索问题..." class="search-input" />-->
<!--          <button class="search-btn">-->
<!--&lt;!&ndash;            <i class="icon-search">🔍</i>&ndash;&gt;-->
<!--          </button>-->
<!--        </div>-->

<!--        <div class="question-list">-->
<!--          <div-->
<!--              v-for="(question, index) in questions"-->
<!--              :key="index"-->
<!--              class="question-item"-->
<!--              :class="{ active: activeQuestion === index }"-->
<!--              @click="selectQuestion(index)"-->
<!--          >-->
<!--            <h3 class="question-title">{{ question.title }}</h3>-->
<!--            <p class="question-excerpt">{{ question.content.substring(0, 30) }}...</p>-->
<!--            <div class="question-meta">-->
<!--              <span class="question-category">{{ question.category }}</span>-->
<!--              <span class="question-time">{{ question.time }}</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </aside>-->

<!--      &lt;!&ndash; 右侧问答详情 &ndash;&gt;-->
<!--      <section class="answer-section">-->
<!--        <div class="answer-card" @mouseenter="hoverCard" @mouseleave="leaveCard">-->
<!--          <div class="question-header">-->
<!--            <h2 class="current-question">{{ currentQuestion.title }}</h2>-->
<!--            <div class="question-tags">-->
<!--              <span class="tag" v-for="(tag, index) in currentQuestion.tags" :key="index">{{ tag }}</span>-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="question-content">-->
<!--            <p>{{ currentQuestion.content }}</p>-->
<!--            <div class="question-images" v-if="currentQuestion.images">-->
<!--              <img-->
<!--                  v-for="(img, index) in currentQuestion.images"-->
<!--                  :key="index"-->
<!--                  :src="img"-->
<!--                  alt="问题图片"-->
<!--                  @click="showImage(img)"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="answer-form">-->
<!--            <h3 class="answer-title">您的解答</h3>-->
<!--            <textarea-->
<!--                v-model="answerContent"-->
<!--                placeholder="请输入您的专业解答..."-->
<!--                class="answer-textarea"-->
<!--            ></textarea>-->

<!--            <div class="toolbar">-->
<!--              <button class="tool-btn" title="插入图片">-->
<!--                <i class="icon-image">🖼️</i>-->
<!--              </button>-->
<!--              <button class="tool-btn" title="格式化代码">-->
<!--                <i class="icon-code">💻</i>-->
<!--              </button>-->
<!--              <button class="tool-btn" title="添加引用">-->
<!--                <i class="icon-quote">📝</i>-->
<!--              </button>-->
<!--            </div>-->

<!--            <button class="submit-btn" @click="submitAnswer">-->
<!--              <span class="btn-text">提交解答</span>-->
<!--              <span class="btn-icon">📤</span>-->
<!--            </button>-->
<!--          </div>-->
<!--        </div>-->
<!--      </section>-->
<!--    </main>-->

<!--    &lt;!&ndash; 浮动元素 &ndash;&gt;-->
<!--    <div class="floating-elements">-->
<!--      <div class="floating-leaf">🍃</div>-->
<!--      <div class="floating-wheat">🌾</div>-->
<!--      <div class="floating-tractor">🚜</div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import * as THREE from 'three'-->
<!--import GLOBE from 'vanta/dist/vanta.globe.min'-->
<!--import { ref } from 'vue'-->

<!--export default {-->
<!--  setup() {-->
<!--    const questions = ref([-->
<!--      {-->
<!--        title: "水稻叶片出现黄斑如何处理？",-->
<!--        content: "最近发现水稻叶片上出现不规则的黄斑，逐渐扩大，叶片最终枯萎。请问这是什么病害？应该如何防治？",-->
<!--        category: "水稻种植",-->
<!--        time: "2小时前",-->
<!--        tags: ["水稻", "病害", "叶片"],-->
<!--        images: ["https://example.com/rice1.jpg", "https://example.com/rice2.jpg"]-->
<!--      },-->
<!--      {-->
<!--        title: "有机蔬菜的虫害防治方法",-->
<!--        content: "种植有机蔬菜不想使用化学农药，有哪些有效的生物防治方法可以推荐？",-->
<!--        category: "蔬菜种植",-->
<!--        time: "5小时前",-->
<!--        tags: ["有机", "蔬菜", "虫害"]-->
<!--      },-->
<!--      {-->
<!--        title: "果树冬季修剪的最佳时机",-->
<!--        content: "不同种类的果树冬季修剪的最佳时间是什么时候？修剪时需要注意哪些要点？",-->
<!--        category: "果树栽培",-->
<!--        time: "1天前",-->
<!--        tags: ["果树", "修剪", "冬季"]-->
<!--      }-->
<!--    ])-->

<!--    const activeQuestion = ref(0)-->
<!--    const currentQuestion = ref({})-->
<!--    const answerContent = ref('')-->
<!--    const isHovering = ref(false)-->

<!--    const selectQuestion = (index) => {-->
<!--      activeQuestion.value = index-->
<!--      currentQuestion.value = questions.value[index]-->
<!--    }-->

<!--    const submitAnswer = () => {-->
<!--      if (answerContent.value.trim()) {-->
<!--        alert('解答提交成功！')-->
<!--        answerContent.value = ''-->
<!--      }-->
<!--    }-->

<!--    const hoverCard = () => {-->
<!--      isHovering.value = true-->
<!--    }-->

<!--    const leaveCard = () => {-->
<!--      isHovering.value = false-->
<!--    }-->

<!--    const showImage = (imgUrl) => {-->
<!--      console.log('查看大图:', imgUrl)-->
<!--      // 实际项目中可以打开图片查看器-->
<!--    }-->

<!--    // 初始化显示第一个问题-->
<!--    currentQuestion.value = questions.value[0]-->

<!--    return {-->
<!--      questions,-->
<!--      activeQuestion,-->
<!--      currentQuestion,-->
<!--      answerContent,-->
<!--      isHovering,-->
<!--      selectQuestion,-->
<!--      submitAnswer,-->
<!--      hoverCard,-->
<!--      leaveCard,-->
<!--      showImage-->
<!--    }-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      vantaEffect: null-->
<!--    }-->
<!--  },-->
<!--  beforeUnmount() {-->
<!--    if (this.vantaEffect) {-->
<!--      this.vantaEffect.destroy()-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--/* 基础样式 */-->
<!--.vanta-container {-->
<!--  position: relative;-->
<!--  width: 100%;-->
<!--  min-height: 100vh;-->
<!--  overflow: hidden;-->
<!--  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;-->
<!--  color: #333;-->
<!--}-->

<!--/* 顶部导航 */-->
<!--.app-header {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  padding: 15px 40px;-->
<!--  background-color: rgba(255, 255, 255, 0.9);-->
<!--  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);-->
<!--  position: relative;-->
<!--  z-index: 10;-->
<!--}-->

<!--.logo-container {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 15px;-->
<!--}-->

<!--.logo {-->
<!--  width: 50px;-->
<!--  height: 50px;-->
<!--  object-fit: contain;-->
<!--  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));-->
<!--}-->

<!--.platform-title {-->
<!--  color: #2c3e50;-->
<!--  font-size: 22px;-->
<!--  font-weight: 600;-->
<!--  margin: 0;-->
<!--}-->

<!--.user-nav {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 25px;-->
<!--}-->

<!--.nav-link {-->
<!--  color: #555;-->
<!--  text-decoration: none;-->
<!--  font-size: 16px;-->
<!--  transition: all 0.2s;-->
<!--  position: relative;-->
<!--}-->

<!--.nav-link:hover {-->
<!--  color: #4CAF50;-->
<!--}-->

<!--.nav-link::after {-->
<!--  content: '';-->
<!--  position: absolute;-->
<!--  bottom: -5px;-->
<!--  left: 0;-->
<!--  width: 0;-->
<!--  height: 2px;-->
<!--  background: #4CAF50;-->
<!--  transition: width 0.3s;-->
<!--}-->

<!--.nav-link:hover::after {-->
<!--  width: 100%;-->
<!--}-->

<!--.notification-btn {-->
<!--  background: none;-->
<!--  border: none;-->
<!--  cursor: pointer;-->
<!--  position: relative;-->
<!--  padding: 5px;-->
<!--  border-radius: 50%;-->
<!--  transition: all 0.2s;-->
<!--}-->

<!--.notification-btn:hover {-->
<!--  background: rgba(76, 175, 80, 0.1);-->
<!--}-->

<!--.notification-badge {-->
<!--  position: absolute;-->
<!--  top: -5px;-->
<!--  right: -5px;-->
<!--  background: #e74c3c;-->
<!--  color: white;-->
<!--  border-radius: 50%;-->
<!--  width: 20px;-->
<!--  height: 20px;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  font-size: 12px;-->
<!--}-->

<!--/* 主内容布局 */-->
<!--.content-wrapper {-->
<!--  display: flex;-->
<!--  padding: 30px;-->
<!--  gap: 30px;-->
<!--  max-width: 1600px;-->
<!--  margin: 0 auto;-->
<!--}-->

<!--/* 左侧问题列表 */-->
<!--.question-sidebar {-->
<!--  flex: 0 0 350px;-->
<!--  background: rgba(255, 255, 255, 0.9);-->
<!--  border-radius: 15px;-->
<!--  padding: 20px;-->
<!--  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);-->
<!--  backdrop-filter: blur(5px);-->
<!--  border: 1px solid rgba(255, 255, 255, 0.2);-->
<!--  height: calc(100vh - 150px);-->
<!--  overflow-y: auto;-->
<!--}-->

<!--.search-box {-->
<!--  display: flex;-->
<!--  margin-bottom: 20px;-->
<!--  position: relative;-->
<!--}-->

<!--.search-input {-->
<!--  flex: 1;-->
<!--  padding: 12px 15px;-->
<!--  border: 1px solid #ddd;-->
<!--  border-radius: 8px;-->
<!--  font-size: 14px;-->
<!--  transition: all 0.2s;-->
<!--  background: rgba(255, 255, 255, 0.8);-->
<!--}-->

<!--.search-input:focus {-->
<!--  border-color: #4CAF50;-->
<!--  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);-->
<!--  outline: none;-->
<!--}-->

<!--.search-btn {-->
<!--  position: absolute;-->
<!--  right: 10px;-->
<!--  top: 50%;-->
<!--  transform: translateY(-50%);-->
<!--  background: none;-->
<!--  border: none;-->
<!--  cursor: pointer;-->
<!--  color: #777;-->
<!--  transition: all 0.2s;-->
<!--}-->

<!--.search-btn:hover {-->
<!--  color: #4CAF50;-->
<!--}-->

<!--.question-list {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 15px;-->
<!--}-->

<!--.question-item {-->
<!--  padding: 15px;-->
<!--  border-radius: 10px;-->
<!--  background: white;-->
<!--  cursor: pointer;-->
<!--  transition: all 0.3s;-->
<!--  border-left: 3px solid transparent;-->
<!--}-->

<!--.question-item:hover {-->
<!--  transform: translateX(5px);-->
<!--  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);-->
<!--  border-left-color: #4CAF50;-->
<!--}-->

<!--.question-item.active {-->
<!--  background: #f5fff5;-->
<!--  border-left-color: #4CAF50;-->
<!--}-->

<!--.question-title {-->
<!--  font-size: 16px;-->
<!--  font-weight: 600;-->
<!--  margin: 0 0 8px 0;-->
<!--  color: #2c3e50;-->
<!--}-->

<!--.question-excerpt {-->
<!--  font-size: 14px;-->
<!--  color: #666;-->
<!--  margin: 0 0 10px 0;-->
<!--  line-height: 1.4;-->
<!--}-->

<!--.question-meta {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  font-size: 12px;-->
<!--}-->

<!--.question-category {-->
<!--  background: #e8f5e9;-->
<!--  color: #4CAF50;-->
<!--  padding: 3px 8px;-->
<!--  border-radius: 10px;-->
<!--}-->

<!--.question-time {-->
<!--  color: #999;-->
<!--}-->

<!--/* 右侧问答详情 */-->
<!--.answer-section {-->
<!--  flex: 1;-->
<!--}-->

<!--.answer-card {-->
<!--  background: rgba(255, 255, 255, 0.95);-->
<!--  border-radius: 15px;-->
<!--  padding: 30px;-->
<!--  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);-->
<!--  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);-->
<!--  height: calc(100vh - 150px);-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  backdrop-filter: blur(5px);-->
<!--  border: 1px solid rgba(255, 255, 255, 0.2);-->
<!--}-->

<!--.answer-card:hover {-->
<!--  transform: translateY(-5px) scale(1.01);-->
<!--  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);-->
<!--}-->

<!--.current-question {-->
<!--  font-size: 24px;-->
<!--  color: #2c3e50;-->
<!--  margin: 0 0 20px 0;-->
<!--  position: relative;-->
<!--  padding-bottom: 15px;-->
<!--}-->

<!--.current-question::after {-->
<!--  content: '';-->
<!--  position: absolute;-->
<!--  bottom: 0;-->
<!--  left: 0;-->
<!--  width: 60px;-->
<!--  height: 3px;-->
<!--  background: linear-gradient(to right, #4CAF50, #8BC34A);-->
<!--  border-radius: 3px;-->
<!--}-->

<!--.question-tags {-->
<!--  display: flex;-->
<!--  gap: 10px;-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.tag {-->
<!--  background: #e8f5e9;-->
<!--  color: #4CAF50;-->
<!--  padding: 5px 10px;-->
<!--  border-radius: 15px;-->
<!--  font-size: 12px;-->
<!--}-->

<!--.question-content {-->
<!--  flex: 1;-->
<!--  margin-bottom: 30px;-->
<!--  line-height: 1.6;-->
<!--  overflow-y: auto;-->
<!--}-->

<!--.question-images {-->
<!--  display: flex;-->
<!--  gap: 15px;-->
<!--  margin-top: 20px;-->
<!--}-->

<!--.question-images img {-->
<!--  width: 120px;-->
<!--  height: 120px;-->
<!--  object-fit: cover;-->
<!--  border-radius: 8px;-->
<!--  cursor: pointer;-->
<!--  transition: all 0.3s;-->
<!--}-->

<!--.question-images img:hover {-->
<!--  transform: scale(1.05);-->
<!--  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);-->
<!--}-->

<!--.answer-form {-->
<!--  border-top: 1px solid #eee;-->
<!--  padding-top: 20px;-->
<!--}-->

<!--.answer-title {-->
<!--  font-size: 18px;-->
<!--  margin: 0 0 15px 0;-->
<!--  color: #2c3e50;-->
<!--}-->

<!--.answer-textarea {-->
<!--  width: 100%;-->
<!--  min-height: 150px;-->
<!--  padding: 15px;-->
<!--  border: 1px solid #ddd;-->
<!--  border-radius: 8px;-->
<!--  font-size: 14px;-->
<!--  line-height: 1.6;-->
<!--  resize: none;-->
<!--  transition: all 0.2s;-->
<!--  margin-bottom: 15px;-->
<!--  background: rgba(255, 255, 255, 0.8);-->
<!--}-->

<!--.answer-textarea:focus {-->
<!--  border-color: #4CAF50;-->
<!--  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);-->
<!--  outline: none;-->
<!--}-->

<!--.toolbar {-->
<!--  display: flex;-->
<!--  gap: 10px;-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.tool-btn {-->
<!--  background: none;-->
<!--  border: 1px solid #ddd;-->
<!--  border-radius: 5px;-->
<!--  padding: 5px 10px;-->
<!--  cursor: pointer;-->
<!--  transition: all 0.2s;-->
<!--}-->

<!--.tool-btn:hover {-->
<!--  background: #f5f5f5;-->
<!--  border-color: #4CAF50;-->
<!--  color: #4CAF50;-->
<!--}-->

<!--.submit-btn {-->
<!--  align-self: flex-end;-->
<!--  padding: 12px 25px;-->
<!--  background: linear-gradient(to right, #4CAF50, #8BC34A);-->
<!--  color: white;-->
<!--  border: none;-->
<!--  border-radius: 8px;-->
<!--  cursor: pointer;-->
<!--  font-size: 16px;-->
<!--  font-weight: 500;-->
<!--  transition: all 0.3s;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 10px;-->
<!--}-->

<!--.submit-btn:hover {-->
<!--  transform: translateY(-2px);-->
<!--  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);-->
<!--}-->

<!--.btn-icon {-->
<!--  transition: all 0.3s;-->
<!--}-->

<!--.submit-btn:hover .btn-icon {-->
<!--  transform: rotate(360deg);-->
<!--}-->

<!--/* 浮动元素 */-->
<!--.floating-elements {-->
<!--  position: fixed;-->
<!--  bottom: 30px;-->
<!--  right: 30px;-->
<!--  z-index: 3;-->
<!--}-->

<!--.floating-leaf,-->
<!--.floating-wheat,-->
<!--.floating-tractor {-->
<!--  font-size: 28px;-->
<!--  position: absolute;-->
<!--  opacity: 0.8;-->
<!--  animation: float 6s ease-in-out infinite;-->
<!--}-->

<!--.floating-leaf {-->
<!--  bottom: 0;-->
<!--  right: 0;-->
<!--  animation-delay: 0s;-->
<!--  color: #8BC34A;-->
<!--}-->

<!--.floating-wheat {-->
<!--  bottom: 50px;-->
<!--  right: 50px;-->
<!--  animation-delay: 1s;-->
<!--  color: #f1c40f;-->
<!--}-->

<!--.floating-tractor {-->
<!--  bottom: 20px;-->
<!--  right: 100px;-->
<!--  animation-delay: 2s;-->
<!--  font-size: 32px;-->
<!--}-->

<!--@keyframes float {-->
<!--  0%, 100% {-->
<!--    transform: translateY(0) rotate(0deg);-->
<!--  }-->
<!--  50% {-->
<!--    transform: translateY(-20px) rotate(5deg);-->
<!--  }-->
<!--}-->

<!--/* 响应式设计 */-->
<!--@media (max-width: 1200px) {-->
<!--  .content-wrapper {-->
<!--    flex-direction: column;-->
<!--  }-->

<!--  .question-sidebar {-->
<!--    flex: none;-->
<!--    width: 100%;-->
<!--    height: auto;-->
<!--    max-height: 300px;-->
<!--  }-->

<!--  .answer-card {-->
<!--    height: auto;-->
<!--  }-->
<!--}-->

<!--@media (max-width: 768px) {-->
<!--  .app-header {-->
<!--    padding: 15px 20px;-->
<!--  }-->

<!--  .content-wrapper {-->
<!--    padding: 15px;-->
<!--  }-->

<!--  .answer-card {-->
<!--    padding: 20px;-->
<!--  }-->

<!--  .current-question {-->
<!--    font-size: 20px;-->
<!--  }-->
<!--}-->
<!--</style>-->
