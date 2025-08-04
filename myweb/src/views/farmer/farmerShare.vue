<template>
  <div id="app">
    <div class="nav-tabs">
      <div 
        class="nav-tab" 
        :class="{ active: currentPage === 'mine' }"
        @click="currentPage = 'mine'"
      >
        <i class="fas fa-user"></i> 我的分享
      </div>
      <div 
        class="nav-tab" 
        :class="{ active: currentPage === 'hall' }"
        @click="currentPage = 'hall'"
      >
        <i class="fas fa-book-open"></i> 分享大厅
      </div>
    </div>
    
    <transition name="fade" mode="out-in">
      <!-- 我的分享页面 -->
      <div v-if="currentPage === 'mine'" class="container">
        <div class="page-header">
          <h2 class="page-title">
            <i class="fas fa-user"></i> 我的分享
          </h2>
          <button class="btn" @click="showForm = !showForm">
            <i class="fas fa-plus"></i> {{ showForm ? '取消发布' : '发布新分享' }}
          </button>
        </div>
        
        <!-- 发布表单 -->
        <div v-if="showForm" class="publish-form">
          <div class="form-group">
            <label for="postTitle"><i class="fas fa-heading"></i> 标题</label>
            <input 
              type="text" 
              id="postTitle" 
              class="form-control" 
              placeholder="输入经验分享标题"
              v-model="newPost.title"
            >
          </div>
          
          <div class="form-group">
            <label for="postContent"><i class="fas fa-file-alt"></i> 内容</label>
            <textarea 
              id="postContent" 
              class="form-control" 
              placeholder="详细描述您的种植经验、技巧或心得..."
              v-model="newPost.content"
            ></textarea>
          </div>
          
          <button class="btn" @click="publishPost">
            <i class="fas fa-paper-plane"></i> 发布分享
          </button>
        </div>
        
        <!-- 我的分享列表 -->
        <div v-if="myPosts.length > 0" class="posts-container">
          <div v-for="(post, index) in myPosts" :key="index" class="post-card">
            <div class="post-header">
              <h3 class="post-title">{{ post.title }}</h3>
              <div class="post-author">
                <i class="fas fa-user"></i>
                {{ post.author }} · {{ post.date }}
              </div>
            </div>
            <div class="post-content">
              <p>{{ post.content }}</p>
            </div>
            <div class="post-footer">
              <div class="post-date">
                <i class="far fa-clock"></i> {{ post.time }}
              </div>
              <router-link 
                to="/farmer/sharedetails" 
                class="view-more"
              >
                查看更多
              </router-link>
              <div class="post-actions">
                <div class="post-action" @click="likePost(post.id)">
                  <i class="far fa-thumbs-up"></i> {{ post.likes }}
                </div>
                <div class="post-action">
                  <i class="far fa-comment"></i> {{ post.comments }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <i class="fas fa-book"></i>
          <h3>暂无分享内容</h3>
          <p>立即发布您的第一条分享吧！</p>
          <button class="btn" style="margin-top: 20px;" @click="showForm = true">
            <i class="fas fa-plus"></i> 发布分享
          </button>
        </div>
      </div>
      
      <!-- 分享大厅页面 -->
      <div v-else-if="currentPage === 'hall'" class="container">
        <h2 class="page-title">
          <i class="fas fa-book-open"></i> 分享大厅
        </h2>
        
        <div v-if="posts.length === 0" class="empty-state">
          <i class="fas fa-book"></i>
          <h3>暂无分享内容</h3>
          <p>成为第一个分享种植经验的人吧！</p>
        </div>
        
        <div v-else class="posts-container">
          <div v-for="(post, index) in posts" :key="index" class="post-card">
            <div class="post-header">
              <h3 class="post-title">{{ post.title }}</h3>
              <div class="post-author">
                <i class="fas fa-user"></i>
                {{ post.author }} · {{ post.date }}
              </div>
            </div>
            <div class="post-content">
              <p>{{ post.content }}</p>
            </div>
            <div class="post-footer">
              <div class="post-date">
                <i class="far fa-clock"></i> {{ post.time }}
              </div>
              <router-link 
                to="/farmer/sharedetails" 
                class="view-more"
              >
                查看更多
              </router-link>
              <div class="post-actions">
                <div class="post-action" @click="likePost(post.id)">
                  <i class="far fa-thumbs-up"></i> {{ post.likes }}
                </div>
                <div class="post-action">
                  <i class="far fa-comment"></i> {{ post.comments }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 'mine', // 默认显示我的分享
      showForm: false, // 控制发布表单显示
      newPost: {
        title: '',
        content: '',
        author: '李技术员'
      },
      posts: [
        {
          id: 1,
          title: '水稻高产种植技术要点',
          content: '在水稻种植过程中，合理的水肥管理是关键。分蘖期要保证充足水分，幼穗分化期适当控水，抽穗扬花期保持浅水层。施肥方面，基肥要足，分蘖肥要早，穗肥要巧。同时注意病虫害防治，特别是稻飞虱和纹枯病。',
          author: '张专家',
          date: '2023-08-15',
          time: '10:30',
          likes: 24,
          comments: 8
        },
        {
          id: 2,
          title: '大棚蔬菜病虫害防治经验',
          content: '大棚蔬菜种植中，温湿度控制不当容易引发病虫害。建议：1. 加强通风，降低湿度；2. 定期轮作，减少土传病害；3. 使用黄板诱杀蚜虫、白粉虱；4. 发现病害及时使用生物农药防治。推荐使用枯草芽孢杆菌防治灰霉病。',
          author: '王技术员',
          date: '2023-08-12',
          time: '14:20',
          likes: 18,
          comments: 5
        },
        {
          id: 3,
          title: '果树修剪的最佳时期与方法',
          content: '果树修剪是提高产量的重要措施。落叶果树宜在冬季休眠期修剪，常绿果树宜在春季萌芽前。修剪原则：去弱留强，疏密留稀，控制高度。具体操作：剪除病虫枝、交叉枝、下垂枝，保留健壮结果枝。修剪后及时涂抹伤口保护剂。',
          author: '赵专家',
          date: '2023-08-10',
          time: '09:45',
          likes: 31,
          comments: 12
        },
        {
          id: 4,
          title: '玉米密植高产栽培技术',
          content: '玉米密植是提高产量的有效途径。选择紧凑型品种，适当增加种植密度，增施肥料特别是中后期追肥，加强病虫害防治，适时晚收增加粒重。',
          author: '李技术员',
          date: '2023-08-05',
          time: '16:10',
          likes: 15,
          comments: 3
        }
      ]
    };
  },
  computed: {
    // 获取当前用户的分享
    myPosts() {
      return this.posts.filter(post => post.author === '李技术员');
    }
  },
  methods: {
    // 获取当前日期
    getCurrentDate() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    },
    // 获取当前时间
    getCurrentTime() {
      const now = new Date();
      return now.toTimeString().slice(0, 5);
    },
    // 发布新分享
    publishPost() {
      if (!this.newPost.title.trim() || !this.newPost.content.trim()) {
        alert('标题和内容不能为空！');
        return;
      }
      
      const post = {
        id: Date.now(),
        title: this.newPost.title,
        content: this.newPost.content,
        author: this.newPost.author,
        date: this.getCurrentDate(),
        time: this.getCurrentTime(),
        likes: 0,
        comments: 0
      };
      
      // 添加到 posts 数组开头
      this.posts.unshift(post);
      
      // 清空表单
      this.newPost.title = '';
      this.newPost.content = '';
      this.showForm = false;
      
      alert('分享发布成功！');
    },
    // 点赞功能
    likePost(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.likes++;
      }
    }
  }
};
</script>

<style>
/* 全局样式变量 */
.view-more {
  color: #000000;
  cursor: pointer;
  text-decoration: underline;
  display: inline; /* 改为内联元素 */
  line-height: normal; /* 重置行高 */
  padding: 0 ; /* 清除内边距 */
  margin: 0; /* 清除外边距 */
  border: none ; /* 清除边框 */
  background: none ; /* 清除背景 */
}

.view-more:hover {
  opacity: 0.8;
  text-decoration: underline;
}

:root {
  --primary-green: #2e7d32;
  --light-green: #4caf50;
  --lighter-green: #8bc34a;
  --background: #f5f9f5;
  --card-bg: #ffffff;
  --text-dark: #333333;
  --text-light: #666666;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: var(--background);
  color: var(--text-dark);
  line-height: 1.6;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}



.logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo i {
  font-size: 2.5rem;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 700;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: var(--light-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.nav-tabs {
  display: flex;
  background-color: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: var(--shadow);
  margin: 0 auto 30px;
  max-width: 500px;
}

.nav-tab {
  flex: 1;
  text-align: center;
  padding: 15px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: var(--text-light);
  text-decoration: none;
}

.nav-tab.active {
  background: linear-gradient(135deg, var(--lighter-green), var(--light-green));
  color: white;
}

.nav-tab:not(.active):hover {
  background-color: #f0f0f0;
}

.container {
  background-color: var(--card-bg);
  border-radius: 15px;
  box-shadow: var(--shadow);
  padding: 30px;
  margin-bottom: 30px;
  transition: transform 0.3s ease;
}

.container:hover {
  transform: translateY(-5px);
}

.page-title {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--lighter-green);
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

/* 发布分享表单样式 */
.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--dark-green);
}

.form-control {
  width: 100%;
  padding: 14px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border 0.3s ease;
}

.form-control:focus {
  border-color: var(--lighter-green);
  outline: none;
  box-shadow: 0 0 0 3px rgba(139, 195, 74, 0.2);
}

textarea.form-control {
  min-height: 200px;
  resize: vertical;
}

.btn {
  background: linear-gradient(135deg, var(--light-green), var(--primary-green));
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(46, 125, 50, 0.3);
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
}

.btn:active {
  transform: translateY(1px);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--primary-green);
  color: var(--primary-green);
  box-shadow: none;
}

.btn-outline:hover {
  background: rgba(76, 175, 80, 0.1);
}

/* 分享大厅样式 */
.posts-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.post-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.post-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.post-header {
  background: linear-gradient(135deg, var(--light-green), var(--primary-green));
  color: white;
  padding: 20px;
}

.post-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.post-author {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  opacity: 0.9;
}

.post-author i {
  margin-right: 8px;
}

.post-content {
  padding: 20px;
  flex-grow: 1;
  color: var(--text-light);
  line-height: 1.7;
}

.post-footer {
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  color: var(--text-light);
  font-size: 0.9rem;
}

.post-actions {
  display: flex;
  gap: 15px;
}

.post-action {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.post-action:hover {
  color: var(--primary-green);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-light);
}

.empty-state i {
  font-size: 4rem;
  color: #e0e0e0;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--dark-green);
}

.publish-form {
  background-color: #f8fdf8;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  border: 2px dashed var(--lighter-green);
}

/* 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

footer {
  text-align: center;
  padding: 30px 0;
  color: var(--text-light);
  font-size: 0.9rem;
  border-top: 1px solid #e0e0e0;
  margin-top: 30px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .posts-container {
    grid-template-columns: 1fr;
  }
  
  .nav-tabs {
    max-width: 100%;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>