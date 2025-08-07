<template>
  <div class="container">
    <div class="content-wrapper">
      <!-- 作者信息区域 -->
      <section class="author-section">
        <img :src="author.avatar" alt="作者头像" class="author-avatar">
        <h2 class="author-name">{{ author.name }}</h2>

        <a href="#" class="btn-profile">
          <i class="fas fa-user"></i> 查看作者主页
        </a>

        <a href="#" class="btn btn-back">
                    <i class="fas fa-arrow-left"></i> 返回
        </a>

      </section>
      
      <!-- 分享内容区域 -->
      <section class="share-content">
        <h2 class="share-title">{{ post.title }}</h2>
        
        <div class="share-meta">
          <span><i class="far fa-calendar"></i> 发布于 {{ post.publishDate }}</span>
        </div>
        
        <div class="share-text">
          <p v-for="(paragraph, index) in post.content" :key="index">{{ paragraph }}</p>
          
          <ul v-if="post.tips && post.tips.length">
            <li v-for="(tip, index) in post.tips" :key="index">{{ tip }}</li>
          </ul>
        </div>
        
        <div class="share-stats">
          <div class="stat-icon" @click="toggleLike">
            <i class="far fa-heart" :class="{ 'fas': isLiked, 'far': !isLiked }"></i> 
            {{ post.likes }} 点赞
          </div>
          <div class="stat-icon">
            <i class="far fa-comment"></i> {{ comments.length }} 评论
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
            <div class="comment-actions">
              <button 
                class="action-btn" 
                @click="toggleCommentLike(index)"
              >
                <i 
                  class="far fa-thumbs-up" 
                  :class="{ 'fas': comment.liked, 'far': !comment.liked }"
                ></i> 
                {{ comment.likeCount }}
              </button>
              <button class="action-btn">
                <i class="fas fa-reply"></i> 回复
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <footer>
      <p>© 2023 知识分享社区 | 让知识流动起来</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 点赞状态
      isLiked: false,
      
      // 评论相关
      newComment: '',
      
      // 虚拟作者数据
      author: {
        name: '陈明远',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        title: '资深农业技术员 | 生态农场主',
        bio: '从事有机农业研究与实践15年，专注于可持续农业发展和生态种植技术推广',
        stats: {
          followers: '2.3k',
          shares: 42,
          likes: '8.7k'
        }
      },
      
      // 虚拟分享数据
      post: {
        title: '有机蔬菜大棚种植的关键技术与管理要点',
        publishDate: '2023年9月28日',
        readTime: '10分钟',
        imageUrl: 'https://images.unsplash.com/photo-1544847558-167b99e057d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        likes: 456,
        shares: 78,
        content: [
          '有机蔬菜大棚种植是一种高效的农业生产方式，既能保证蔬菜的品质和安全性，又能有效抵御自然环境的影响，实现反季节生产。近年来，随着消费者对食品安全的重视，有机蔬菜的市场需求持续增长，为农户带来了可观的经济效益。',
          '要成功进行有机蔬菜大棚种植，首先要做好前期准备工作。大棚选址应选择地势平坦、排水良好、土壤肥沃的地块，同时要保证充足的光照条件。大棚的结构设计也很关键，应考虑通风、保温、灌溉等因素，确保蔬菜生长在适宜的环境中。',
          '土壤改良是有机种植的基础。在种植前，应进行土壤检测，了解土壤的pH值、有机质含量等指标，有针对性地进行改良。通常采用秸秆还田、施用有机肥等方式提高土壤肥力，避免使用化学肥料和农药。',
          '品种选择应根据当地气候条件、市场需求以及大棚的种植环境来确定。优先选择抗病性强、产量高、品质好的优良品种，同时要注意种子的来源，确保其符合有机种植的要求。',
          '在日常管理中，温湿度控制是重中之重。不同的蔬菜品种对温湿度有不同的要求，应根据蔬菜的生长阶段进行调节。通过通风、遮阳、喷雾等措施，创造适宜的生长环境，减少病虫害的发生。'
        ],
        tips: [
          '采用轮作制度，避免连作障碍，提高土地利用率',
          '推广生物防治技术，利用天敌、生物农药等控制病虫害',
          '安装智能监测设备，实时监控大棚内的温湿度、光照等环境因素',
          '采用滴灌、喷灌等节水灌溉方式，提高水资源利用效率',
          '建立完善的田间档案，记录种植过程中的各项农事活动'
        ]
      },
      
      // 虚拟评论数据
      comments: [
        {
          avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
          author: '林小美',
          time: '3小时前',
          content: '非常实用的技术分享！我正在筹备自己的蔬菜大棚，这些建议对我很有帮助。请问在南方地区，夏季大棚如何有效降温？',
          likeCount: 24,
          liked: false
        },
        {
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          author: '王建国',
          time: '昨天',
          content: '作为一名有多年经验的菜农，我非常认同作者的观点。有机种植虽然初期投入大，但长期来看经济效益和生态效益都很显著。补充一点，在土壤改良时加入蚯蚓粪效果非常好。',
          likeCount: 47,
          liked: false
        },
        {
          avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
          author: '刘志强',
          time: '2天前',
          content: '智能监测设备有具体的推荐吗？想了解一下相关的成本和安装方式。',
          likeCount: 12,
          liked: false
        }
      ]
    };
  },
  methods: {
    // 切换文章点赞状态
    toggleLike() {
      this.isLiked = !this.isLiked;
      this.post.likes += this.isLiked ? 1 : -1;
    },
    
    // 切换评论点赞状态
    toggleCommentLike(index) {
      const comment = this.comments[index];
      comment.liked = !comment.liked;
      comment.likeCount += comment.liked ? 1 : -1;
    },
    
    // 提交评论
    submitComment() {
      if (!this.newComment.trim()) {
        alert('请填写评论内容');
        return;
      }
      
      // 添加新评论到列表
      this.comments.unshift({
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        author: '当前用户',
        time: '刚刚',
        content: this.newComment,
        likeCount: 0,
        liked: false
      });
      
      // 清空输入框
      this.newComment = '';
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}


.container {
  max-width: 1000px;
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