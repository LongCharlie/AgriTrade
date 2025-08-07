<template>
  <div class="admin-dashboard">
    <!-- 顶部标题栏 -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-title">经验分享审核</div>
      </div>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stat-cards">
      <div class="stat-card pending">
        <div class="stat-title">待审核文章</div>
        <div class="stat-value">{{ pendingCount }}</div>
      </div>
      <div class="stat-card total">
        <div class="stat-title">总文章数</div>
        <div class="stat-value">{{ totalArticles }}</div>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="dashboard-content">
      <div class="section-title">
        <span>文章列表</span>
      </div>
      
      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="filter-section">
          <el-select v-model="filterStatus" placeholder="全部状态" clearable>
            <el-option label="待审核" value="pending"></el-option>
            <el-option label="已通过" value="approved"></el-option>
            <el-option label="已拒绝" value="rejected"></el-option>
          </el-select>
        </div>
      </div>
      
      <!-- 文章列表 -->
      <div class="article-list">
        <!-- 文章卡片 -->
        <div class="article-card" v-for="article in pagedArticles" :key="article.id">
          <div class="article-header">
            <div class="article-info">
              <div class="article-title">{{ article.title }}</div>
              <div class="article-meta">
                <div class="meta-item">
                  <span class="meta-label">作者：</span>
                  <span>{{ article.author }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">发布时间：</span>
                  <span>{{ formatDate(article.createTime) }}</span>
                </div>
              </div>
            </div>
            <div class="article-status" :class="'status-' + article.status">
              <i class="el-icon-time" v-if="article.status === 'pending'"></i>
              <i class="el-icon-check" v-if="article.status === 'approved'"></i>
              <i class="el-icon-close" v-if="article.status === 'rejected'"></i>
              {{ article.status === 'pending' ? '待审核' : article.status === 'approved' ? '已通过' : '已拒绝' }}
            </div>
          </div>
          
          <div class="article-content">
            <div class="article-full-content">
              {{ article.content }}
            </div>
          </div>
          
          <div class="article-footer">
            
            <div class="article-actions">
              <el-button 
                type="success" 
                size="medium"
                icon="el-icon-check" 
                @click="approveArticle(article)"
                :disabled="article.status !== 'pending'"
              >通过</el-button>
              <el-button 
                type="danger" 
                size="medium"
                icon="el-icon-close" 
                @click="rejectArticle(article)"
                :disabled="article.status !== 'pending'"
              >拒绝</el-button>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div class="empty-state" v-if="filteredArticles.length === 0">
          <i class="el-icon-document-delete"></i>
          <h3>没有找到匹配的文章</h3>
          <p>请尝试修改筛选条件，或者刷新页面获取最新数据</p>
          <el-button type="primary" icon="el-icon-refresh" @click="refreshData" style="margin-top: 20px;">刷新数据</el-button>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filteredArticles.length"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage} from 'element-plus';
import dayjs from 'dayjs';

// 初始化dayjs
dayjs.locale('zh-cn');

// 搜索和筛选条件
const filterStatus = ref('');
const currentPage = ref(1);
const pageSize = ref(2); // 每页最多两篇文章

// 状态计数
const pendingCount = ref(8);
const totalArticles = ref(12);

// 模拟文章数据
const articles = ref([
  {
    id: 1001,
    title: 'Vue3 高级技巧与实践指南',
    author: '张前端',
    createTime: '2023-05-15 14:30',
    category: '技术',
    tags: ['前端', 'Vue3', 'JavaScript'],
    excerpt: '本文深入探讨了Vue3的高级特性和最佳实践，包括Composition API、性能优化和状态管理...',
    content: `Vue 3 引入了多项重大改进和新特性，其中最值得关注的是 Composition API。Composition API 提供了一种更灵活的组织组件逻辑的方式，尤其适合处理复杂组件的逻辑复用问题。

与 Options API 相比，Composition API 具有以下优势：
1. 更好的逻辑复用能力 - 通过自定义组合函数实现
2. 更灵活的组织方式 - 相关逻辑可以放在一起
3. 更好的类型推导支持 - 对 TypeScript 更友好

在实际项目中，我们可以这样使用 Composition API：
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const double = computed(() => count.value * 2)
    
    function increment() {
      count.value++
    }
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return {
      count,
      double,
      increment
    }
  }
}

除了 Composition API，Vue 3 还带来了：
- 性能提升：更快的渲染速度和更小的包体积
- 更好的 TypeScript 集成
- 新的内置组件：Fragment、Teleport、Suspense
- 自定义渲染器 API

这些改进使 Vue 3 成为构建现代 Web 应用程序的更强大工具。`,
    views: 1245,
    status: 'pending'
  },
  {
    id: 1002,
    title: '人工智能在医疗诊断中的应用与挑战',
    author: '李博士',
    createTime: '2023-05-16 09:15',
    category: '健康',
    tags: ['AI', '医疗', '科技'],
    excerpt: '本文分析了人工智能在医疗影像诊断中的最新进展，并讨论了面临的伦理和技术挑战...',
    content: `近年来，人工智能技术在医疗影像诊断领域取得了显著进展。深度学习算法在X光片、CT扫描和MRI图像的识别分析方面已经达到甚至超过人类专家的水平。

主要应用领域：
1. 早期癌症筛查 - AI可以识别微小的肿瘤迹象
2. 疾病预测 - 基于影像数据预测疾病发展趋势
3. 治疗规划 - 为复杂手术提供精准规划支持
4. 药物研发 - 加速新药发现和临床试验

技术挑战：
- 数据质量和数量不足
- 模型可解释性问题（黑箱问题）
- 跨机构数据共享障碍
- 算法偏见和公平性问题

伦理挑战：
1. 责任归属问题：当AI诊断出错时，责任在谁？
2. 患者隐私保护：如何安全处理敏感医疗数据
3. 医生角色转变：从诊断者到AI结果解释者
4. 医疗资源分配：AI可能加剧医疗不平等

未来展望：
随着技术的不断成熟，AI将成为医生的有力助手而非替代者。人机协作模式将成为未来医疗诊断的主流方向，结合AI的高效精准和人类医生的经验判断，共同为患者提供最佳诊疗方案。`,
    views: 3210,
    status: 'pending'
  },
  {
    id: 1003,
    title: '2023年最新教育政策解读',
    author: '王老师',
    createTime: '2023-05-14 18:42',
    category: '教育',
    tags: ['政策', '教育', '改革'],
    excerpt: '教育部最新发布的2023年教育改革政策将对学生、教师和家长产生深远影响...',
    content: `教育部于2023年初发布了《关于深化新时代教育改革的若干意见》，该政策文件包含多项重大改革措施：

一、基础教育改革
1. 全面推行素质教育评价体系
2. 减少机械性作业负担
3. 增加实践性和探究性学习内容
4. 优化课程设置，增加科技和艺术课程比重

二、高等教育改革
1. 推进学科交叉融合，建设跨学科专业
2. 加强产学研协同创新
3. 扩大高校招生自主权
4. 完善职业教育体系，培养应用型人才

三、教师队伍建设
1. 提高教师待遇和社会地位
2. 改革教师评价体系，突出教育教学实绩
3. 加强教师培训，提升数字素养
4. 建立教师流动机制，促进教育资源均衡

四、教育公平措施
1. 扩大农村和偏远地区教育投入
2. 完善随迁子女就学政策
3. 建立特殊教育支持体系
4. 推进优质教育资源共享平台建设

这些改革措施将分阶段实施，预计到2025年形成更加公平、更高质量的教育体系。`,
    views: 876,
    status: 'approved'
  },
  {
    id: 1004,
    title: '如何构建高效的前端开发团队',
    author: '陈总监',
    createTime: '2023-05-17 11:23',
    category: '技术',
    tags: ['管理', '前端', '团队'],
    excerpt: '本文分享了构建高效前端团队的关键要素，包括技术选型、流程优化和人才培养策略...',
    content: `构建高效的前端开发团队需要考虑多个维度的因素：

一、团队结构与角色分工
1. 明确角色职责：UI工程师、JS工程师、全栈工程师等
2. 建立专业梯队：初级、中级、高级、架构师
3. 设置技术导师制，促进知识传承

二、技术选型与标准化
1. 统一技术栈：框架、工具链、UI库
2. 建立编码规范和最佳实践
3. 组件库和工具链的集中管理
4. 基础设施统一：CI/CD、监控、日志

三、开发流程优化
1. 采用敏捷开发方法
2. 建立代码审查机制
3. 自动化测试覆盖
4. 持续集成和持续部署
5. 性能监控和优化流程

四、人才培养与文化
1. 定期技术分享和培训
2. 鼓励参加技术会议和开源项目
3. 建立学习资源库
4. 培养创新和解决问题的文化
5. 明确的职业发展路径

五、工具与环境
1. 高效开发环境配置
2. 可视化构建和部署工具
3. 组件开发沙盒环境
4. 文档知识管理系统

通过以上措施，可以打造出高效协作、技术领先的前端团队，持续交付高质量的产品。`,
    views: 1567,
    status: 'pending'
  }
]);

// 计算属性：过滤后的文章
const filteredArticles = computed(() => {
  let result = [...articles.value];
  
  // 状态过滤
  if (filterStatus.value) {
    result = result.filter(article => article.status === filterStatus.value);
  }
  return result;
});

// 分页后的文章
const pagedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredArticles.value.slice(start, end);
});

// 操作函数
const approveArticle = (article) => {
  ElMessage.success(`已通过文章: ${article.title}`);
  article.status = 'approved';
  updateCounts();
};

const rejectArticle = (article) => {
  ElMessage.warning(`已拒绝文章: ${article.title}`);
  article.status = 'rejected';
  updateCounts();
};

const refreshData = () => {
  ElMessage.info('数据已刷新');
};

const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm');
};

const updateCounts = () => {
  pendingCount.value = articles.value.filter(a => a.status === 'pending').length;
  totalArticles.value = articles.value.length;
};

// 初始化
onMounted(() => {
  updateCounts();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

body {
  background: linear-gradient(135deg, #8bc79379, #62c16990);
  padding: 20px;
  min-height: 100vh;
}

.admin-dashboard {
  max-width: 1400px;
  margin: 20px auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.dashboard-header {
  background: linear-gradient(135deg, #71b89a6e 0%, #41a8687e 100%);
  color: white;
  padding: 24px 32px;
}

.header-title {
  font-size: 26px;
  font-weight: 700;
}

.stat-cards {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: #f8fafc;
  border-bottom: 1px solid #eaeef5;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  flex: 1;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
}

.pending::before { background: #757575; }
.total::before { background: #1f2225; }

.stat-title {
  font-size: 16px;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
}

.pending .stat-value { color: #757575; }
.total .stat-value { color: #1f2225; }

.dashboard-content {
  padding: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #eaeef5;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}

.filter-section {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaeef5;
  display: flex;
  flex-direction: column;
}

.article-header {
  display: flex;
  padding: 20px;
  background: #f9fafc;
  border-bottom: 1px solid #eee;
}

.article-info {
  flex: 1;
}

.article-title {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
}

.article-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #6c757d;
}

.meta-label {
  font-weight: 600;
  color: #495057;
}

.article-status {
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  height: fit-content;
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-pending {
  background: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #f5dab1;
}

.status-approved {
  background: #f0f9eb;
  color: #67c23a;
  border: 1px solid #c2e7b0;
}

.status-rejected {
  background: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
}

.article-content {
  padding: 25px;
  line-height: 1.8;
  color: #495057;
  border-bottom: 1px solid #eee;
}

.article-excerpt {
  font-size: 16px;
  margin-bottom: 25px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 3px solid #4e73df;
}

.article-full-content {
  margin-top: 20px;
  white-space: pre-wrap;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.article-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.article-tag {
  font-size: 13px;
  padding: 5px 12px;
  border-radius: 20px;
  background: #f0f5ff;
  color: #4e73df;
}

.article-actions {
  display: flex;
  gap: 12px;
}

.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 72px;
  color: #e9ecef;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 22px;
  margin-bottom: 12px;
  color: #495057;
}

.empty-state p {
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

@media (max-width: 992px) {
  .toolbar {
    flex-direction: column;
  }
  
  .filter-section {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .stat-cards {
    flex-direction: column;
  }
  
  .article-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .article-actions {
    width: 100%;
  }
  
  .article-actions .el-button {
    flex: 1;
  }
}
</style>