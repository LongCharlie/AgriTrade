<template>
  <div class="container">
    <div class="content-wrapper">
      <!-- 分享内容区域 -->
      <section class="share-content">
        <h2 class="share-title">{{ post.title }}</h2>
        
        <div class="share-meta">
          <span><i class="far fa-user"></i> 作者： {{ author.name }}</span>
          <span><i class="far fa-calendar"></i> 发布于 {{ post.publishDate }}</span>
        </div>
        
        <div class="share-text">
          <p v-for="(paragraph, index) in post.content" :key="index">{{ paragraph }}</p>
          
          <ul v-if="post.tips && post.tips.length">
            <li v-for="(tip, index) in post.tips" :key="index">{{ tip }}</li>
          </ul>
        </div>
        
        <div class="share-stats">
          <div class="stat-icon">
            <i class="far fa-comment"></i> {{ commentPagination.total }} 评论
          </div>
        </div>
      </section>
    </div>
    
    <!-- 评论区域 -->
    <section class="comments-section">
      <div class="comment-form">
        <form @submit.prevent="submitComment">
          <div class="form-group">
            <textarea 
              id="comment" 
              class="form-control" 
              placeholder="写下你的想法..."
              v-model="newComment"
            ></textarea>
          </div>
          <button type="submit" class="btn-submit">提交评论</button>
        </form>
      </div>
      
      <div class="comment-list">
        <div class="comment" v-for="(comment, index) in comments" :key="index">
          <img :src="comment.avatar" alt="评论者头像" class="comment-avatar">
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author }}</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
          </div>
        </div>
      </div>

      <!-- 分页组件 -->
      <el-pagination
        @current-change="handleCommentPageChange"
        :current-page="commentPagination.currentPage"
        :page-size="commentPagination.pageSize"
        layout="prev, pager, next"
        :total="commentPagination.total"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const experienceId = route.params.id

const post = ref({
  title: '',
  content: [],
  tips: [],
  publishDate: ''
})

const author = ref({
  name: '',
  avatar: ''
})

const comments = ref([])
const newComment = ref('')

const commentPagination = ref({
  currentPage: 1,
  pageSize: 5,
  total: 0
})

// 获取经验详情
const fetchExperienceDetail = async () => {
  try {
    const res = await axios.get(`/api/experience/${experienceId}`)
    const data = res.data

    post.value.title = data.title
    post.value.content = data.content ? data.content.split('\n') : []
    post.value.tips = data.tips || []
    post.value.publishDate = data.created_at || data.published_at || ''

    author.value.name = data.author_name || '匿名'
    author.value.avatar = data.author_avatar_url ? data.author_avatar_url : ''

    commentPagination.value.total = data.comments.length // 初始总数（可选）
    fetchComments()
  } catch (err) {
    console.error('获取经验详情失败:', err)
  }
}

// 获取分页评论
const fetchComments = async () => {
  try {
    const { currentPage, pageSize } = commentPagination.value
    const res = await axios.get(`/api/experiences/${experienceId}/comments`, {
      params: { page: currentPage, pageSize }
    })
    comments.value = res.data.comments.map(c => ({
      author: c.username,
      avatar: c.avatar_url ? `/uploads/avatars/${c.avatar_url}` : '',
      content: c.content,
      time: c.created_at
    }))
    commentPagination.value.total = res.data.total
  } catch (err) {
    console.error('获取评论失败:', err)
  }
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) return
  try {
    await axios.post(`/api/experiences/${experienceId}/comments`, {
      content: newComment.value
    })
    newComment.value = ''
    fetchComments()
  } catch (err) {
    console.error('提交评论失败:', err)
  }
}

const handleCommentPageChange = (page) => {
  commentPagination.value.currentPage = page
  fetchComments()
}

onMounted(() => {
  fetchExperienceDetail()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}


.container {
  max-width: 1500px;
  margin: 0 auto;
}


.content-wrapper {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.author-section {
  flex: 0 0 280px;
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  align-self: flex-start;
  text-align: center;
}

.author-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #f1f9ff;
  margin: 0 auto 20px;
  display: block;
  transition: transform 0.3s ease;
}

.author-avatar:hover {
  transform: scale(1.05);
}

.author-name {
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: #2c3e50;
}

.author-title {
  color: #7f8c8d;
  margin-bottom: 20px;
  font-size: 1rem;
}

.author-stats {
  display: flex;
  justify-content: space-around;
  margin: 25px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.btn-profile {
  display: block;
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #3498dbb5, #3a5d80b0);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
  margin-top: 15px;
}

.btn-profile:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.btn-back {
  display: block;
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #9ae6bc8b, #2a84288c);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
  margin-top: 15px;
}

.btn-back:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.share-content {
  flex: 1;
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.share-title {
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f4f8;
}

.share-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  color: #7f8c8d;
  font-size: 0.95rem;
}

.share-text {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 30px;
  color: #34495e;
}

.share-text p {
  margin-bottom: 20px;
}

.share-text ul {
  margin: 20px 0 30px 25px;
}

.share-text li {
  margin-bottom: 10px;
}

.share-image {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.share-stats {
  display: flex;
  gap: 25px;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin: 25px 0;
}

.stat-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.stat-icon:hover {
  color: #3498db;
}

.comments-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-form {
  margin-bottom: 30px;
  padding: 20px;
  background: #f9fbfd;
  border-radius: 12px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.form-control {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

textarea.form-control {
  min-height: 120px;
  resize: vertical;
}

.btn-submit {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.comment-list {
  margin-top: 30px;
}

.comment {
  display: flex;
  gap: 20px;
  padding: 25px 0;
  border-bottom: 1px solid #f0f4f8;
}

.comment:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.comment-author {
  font-weight: bold;
  font-size: 1.1rem;
  color: #2c3e50;
}

.comment-time {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.comment-text {
  color: #34495e;
  line-height: 1.7;
}

.comment-actions {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.action-btn {
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.2s ease;
}

.action-btn:hover {
  color: #3498db;
}

footer {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .author-section {
    width: 100%;
  }
  
  .share-title {
    font-size: 1.8rem;
  }
  
  .share-meta {
    flex-direction: column;
    gap: 10px;
  }
  
  .share-stats {
    flex-wrap: wrap;
  }
}
</style>