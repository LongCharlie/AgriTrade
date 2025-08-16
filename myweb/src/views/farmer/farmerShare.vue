<template>
  <div class="experience-container">
    <h1>经验分享列表</h1>

    <!-- 发布按钮 -->
    <div class="header-actions">
      <el-button type="primary" @click="showPostExperienceForm">发布经验分享</el-button>
    </div>

    <!-- 发布经验分享表单 -->
    <div v-if="postExperienceFormVisible" class="post-experience-form">
      <el-form-item label="标题">
        <el-input v-model="postExperienceForm.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input
          type="textarea"
          v-model="postExperienceForm.content"
          placeholder="请输入内容"
          :rows="4"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitPostExperience" :loading="posting">发布</el-button>
        <el-button @click="cancelPostExperience">取消</el-button>
      </el-form-item>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-filter-container">
      <el-input
        v-model="searchQuery"
        placeholder="输入标题或内容搜索"
        class="search-input"
        clearable
        @clear="handleSearchClear"
        @keyup.enter="handleSearch"
      />
      <div class="filter-buttons">
        <el-button
          :type="filter === 'all' ? 'primary' : 'default'"
          @click="filterExperiences('all')"
        >全部分享</el-button>
        <el-button
          :type="filter === 'mine' ? 'primary' : 'default'"
          @click="filterExperiences('mine')"
        >我的分享</el-button>
      </div>
    </div>

    <!-- 搜索提示 -->
    <div v-if="searchQuery" class="search-result-tip">
      共找到 {{ filteredExperiences.length }} 条关于 "{{ searchQuery }}" 的结果
      <el-button type="text" @click="clearSearch">清除搜索</el-button>
    </div>

    <!-- 分享列表 -->
    <div class="experience-list">
      <el-card
        class="experience-card"
        v-for="(experience, index) in paginatedExperiences"
        :key="index"
        shadow="hover"
      >
        <div class="card-header">
          <span
            class="experience-title"
            v-html="highlightSearchText(experience.title)"
          ></span>
          <div class="tag">
            <el-tag :type="experience.comment_count === 0 ? 'warning' : 'success'">
              {{ experience.comment_count === 0 ? '无评论' : experience.comment_count + ' 评论' }}
            </el-tag>
          </div>
        </div>
        <div class="card-body">
          <p
            class="experience-content"
            v-html="highlightSearchText(truncateText(experience.content, 150))"
          ></p>
          <div class="experience-meta">
            <span><i class="el-icon-user"></i> {{ experience.publisher }}</span>
            <span><i class="el-icon-time"></i> {{ formatDate(experience.published_at) }}</span>
          </div>
        </div>
        <div class="card-footer">
          <el-button
            type="primary"
            size="small"
            @click="viewExperienceDetail(experience.id)"
          >查看详情</el-button>
        </div>
      </el-card>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredExperiences.length"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 发布表单
const postExperienceFormVisible = ref(false)
const postExperienceForm = ref({ title: '', content: '' })
const posting = ref(false)

// 列表 & 分页 & 筛选
const experiences = ref([])
const searchQuery = ref('')
const filter = ref('all')
const pagination = ref({ currentPage: 1, pageSize: 10 })

// ====== 数据获取 ======
const fetchExperiences = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/api/experiences')
    experiences.value = data
  } catch (err) {
    ElMessage.error('获取经验列表失败')
    console.error(err)
  }
}

// ====== 发布经验 ======
const submitPostExperience = async () => {
  const { title, content } = postExperienceForm.value
  if (!title || !content) {
    return ElMessage.warning('标题和内容不能为空')
  }

  const token = userStore.token
  if (!token) {
    return ElMessage.error('请先登录后再发布')
  }

  if (posting.value) return
  posting.value = true

  try {
    const { data } = await axios.post(
      'http://localhost:3000/api/experiences',
      { title, content },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    ElMessage.success(data.message || '发布成功')
    postExperienceFormVisible.value = false
    postExperienceForm.value = { title: '', content: '' }
    fetchExperiences()
  } catch (err) {
    const msg = err.response?.data?.message || '发布失败，请稍后再试'
    ElMessage.error(msg)
    console.error(err)
  } finally {
    posting.value = false
  }
}

const showPostExperienceForm = () => {
  postExperienceFormVisible.value = true
}

const cancelPostExperience = () => {
  postExperienceFormVisible.value = false
  postExperienceForm.value = { title: '', content: '' }
}

// ====== 过滤 & 搜索 ======
const filteredExperiences = computed(() => {
  let list = [...experiences.value]
  if (filter.value === 'mine') {
    list = list.filter(e => e.publisher === userStore.username)
  }
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()
    list = list.filter(e =>
      e.title.toLowerCase().includes(keyword) ||
      e.content.toLowerCase().includes(keyword)
    )
  }
  return list
})

const handleSearch = () => {
  pagination.value.currentPage = 1
}

const handleSearchClear = () => {
  searchQuery.value = ''
  pagination.value.currentPage = 1
}

const filterExperiences = (type) => {
  filter.value = type
  pagination.value.currentPage = 1
}

const clearSearch = () => {
  searchQuery.value = ''
  pagination.value.currentPage = 1
}

// ====== 分页 ======
const paginatedExperiences = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  return filteredExperiences.value.slice(start, start + pagination.value.pageSize)
})

const handleSizeChange = size => {
  pagination.value.pageSize = size
  pagination.value.currentPage = 1
}

const handleCurrentChange = page => {
  pagination.value.currentPage = page
}

// ====== 工具函数 ======
const highlightSearchText = (text) => {
  if (!searchQuery.value) return text
  const keyword = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // 转义正则字符
  const reg = new RegExp(`(${keyword})`, 'gi')
  return text.replace(reg, '<span class="highlight">$1</span>')
}

const truncateText = (text, length) => {
  return text.length > length ? text.slice(0, length) + '...' : text
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString()
}

// ====== 详情查看 ======
const viewExperienceDetail = (id) => {
  router.push(`/farmer/share/${id}`)
}

onMounted(fetchExperiences)
</script>


<style scoped>

.experience-container {
  padding: 20px;
}

.header-actions {
  margin-bottom: 30px;
  margin-top: 20px;
}

.search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.search-result-tip {
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}

.experience-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.experience-card {
  width: 100%;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.experience-card:hover {
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

.experience-title {
  font-weight: bold;
  font-size: 18px;
  flex: 1;
  margin-right: 15px;
}

.card-body {
  padding: 10px 0;
}

.experience-content {
  margin: 10px 0;
  color: #666;
  line-height: 1.6;
  font-size: 15px;
}

.experience-meta {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  color: #888;
  font-size: 14px;
}

.experience-meta i {
  margin-right: 5px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.tag {
  display: flex;
  gap: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>