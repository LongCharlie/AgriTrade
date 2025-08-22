<!--<template>-->
<!--  <div>-->
<!--    <el-container>-->
<!--      <el-container>-->
<!--        <el-main>-->
<!--          <div class="answer-detail-container">-->
<!--            &lt;!&ndash; 回答主体内容 &ndash;&gt;-->
<!--            <el-card class="main-answer">-->
<!--              <div class="answer-header">-->
<!--                <el-avatar @click="$router.push(`/expert/detail/${answer.expert_id}`)" :size="60" :src="`http://localhost:3000/uploads/avatars/${answer.expert_avatar}`"></el-avatar>-->
<!--                <div class="user-info">-->
<!--                  <h3>{{ answer.expert_name }}</h3>-->
<!--                  <span class="expert-title">{{ answer.expert_title }}</span>-->
<!--                </div>-->
<!--                <div class="answer-meta">-->
<!--                  <span class="time">{{ formatDate(answer.answered_at) }}</span>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="answer-content">-->
<!--                {{ answer.content }}-->
<!--              </div>-->

<!--              &lt;!&ndash; 回答图片展示 &ndash;&gt;-->
<!--              <div v-if="answer.images && answer.images.length > 0" class="answer-images">-->
<!--                <h4>回答图片:</h4>-->
<!--                <div class="image-gallery">-->
<!--                  <el-image-->
<!--                      v-for="(image, index) in answer.images"-->
<!--                      :key="image.id"-->
<!--                      :src="`http://localhost:3000${image.url}`"-->
<!--                      :preview-src-list="getPreviewList(answer.images)"-->
<!--                      :initial-index="index"-->
<!--                      class="answer-image"-->
<!--                      fit="cover"-->
<!--                      lazy-->
<!--                  ></el-image>-->
<!--                </div>-->
<!--              </div>-->

<!--&lt;!&ndash;              <div class="answer-actions">&ndash;&gt;-->
<!--&lt;!&ndash;                                <el-button type="text" icon="el-icon-thumb">&ndash;&gt;-->
<!--&lt;!&ndash;                                  {{ answer.upvotes || 0 }} 有用&ndash;&gt;-->
<!--&lt;!&ndash;                                </el-button>&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--            </el-card>-->
<!--          </div>-->
<!--        </el-main>-->
<!--      </el-container>-->
<!--    </el-container>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import axios from "axios";-->
<!--import { useUserStore } from '@/stores/user';-->

<!--export default {-->
<!--  setup() {-->
<!--    const userStore = useUserStore();-->
<!--    return {-->
<!--      userStore-->
<!--    };-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      answer: {},-->
<!--      replies: [],-->
<!--      replyContent: '',-->
<!--      showReplyForm: false,-->
<!--      defaultAvatar: require('@/assets/profile.jpg')-->
<!--    };-->
<!--  },-->
<!--  created() {-->
<!--    this.fetchAnswerDetail();-->
<!--  },-->
<!--  methods: {-->
<!--    async fetchAnswerDetail() {-->
<!--      try {-->
<!--        const answerId = this.$route.params.id;-->
<!--        const token = this.userStore.token;-->

<!--        // 实际API调用-->
<!--        const response = await axios.get(`http://localhost:3000/api/answers/${answerId}`, {-->
<!--          headers: {-->
<!--            Authorization: `Bearer ${token}`-->
<!--          }-->
<!--        });-->

<!--        this.answer = response.data;-->
<!--        console.log('answer', this.answer)-->
<!--      } catch (error) {-->
<!--        console.error('获取回答详情失败:', error);-->
<!--        this.$message.error('获取回答详情失败');-->
<!--      }-->
<!--    },-->
<!--    formatDate(dateString) {-->
<!--      return new Date(dateString).toLocaleString();-->
<!--    },-->
<!--    submitReply() {-->
<!--      // 提交回复逻辑-->
<!--    },-->
<!--    // 获取问题图片预览列表-->
<!--    getPreviewList(images) {-->
<!--      return images.map(image => `http://localhost:3000${image.url}`);-->
<!--    },-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.answer-detail-container {-->
<!--  padding: 20px;-->
<!--}-->

<!--.main-answer {-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.answer-header {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.user-info {-->
<!--  margin-left: 15px;-->
<!--  flex: 1;-->
<!--}-->

<!--.user-info h3 {-->
<!--  margin: 0;-->
<!--}-->

<!--.expert-title {-->
<!--  color: #888;-->
<!--  font-size: 14px;-->
<!--}-->

<!--.answer-meta {-->
<!--  text-align: right;-->
<!--}-->

<!--.time {-->
<!--  display: block;-->
<!--  color: #999;-->
<!--  margin-bottom: 5px;-->
<!--}-->

<!--.answer-content {-->
<!--  line-height: 1.8;-->
<!--  font-size: 16px;-->
<!--  padding: 10px 0;-->
<!--}-->

<!--.answer-images {-->
<!--  margin: 20px 0;-->
<!--}-->

<!--.answer-images h4 {-->
<!--  margin-bottom: 10px;-->
<!--  color: #666;-->
<!--}-->

<!--.image-gallery {-->
<!--  display: flex;-->
<!--  flex-wrap: wrap;-->
<!--  gap: 10px;-->
<!--}-->

<!--.answer-image {-->
<!--  width: 150px;-->
<!--  height: 150px;-->
<!--  border-radius: 4px;-->
<!--  cursor: pointer;-->
<!--  transition: transform 0.3s;-->
<!--}-->

<!--.answer-image:hover {-->
<!--  transform: scale(1.05);-->
<!--}-->

<!--.answer-actions {-->
<!--  border-top: 1px solid #eee;-->
<!--  padding-top: 15px;-->
<!--  margin-top: 15px;-->
<!--}-->

<!--.reply-form {-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.form-actions {-->
<!--  margin-top: 10px;-->
<!--  text-align: right;-->
<!--}-->

<!--.replies-container {-->
<!--  margin-top: 30px;-->
<!--}-->
<!--</style>-->
<template>
  <div>
    <el-container>
      <el-container>
        <el-main>
          <div class="answer-detail-container">
            <!-- 回答主体内容 -->
            <el-card class="main-answer">
              <div class="answer-header">
                <el-avatar @click="$router.push(`/farmer/detail/${answer.expert_id}`)" :size="60" :src="`http://localhost:3000/uploads/avatars/${answer.expert_avatar}`"></el-avatar>
                <div class="user-info">
                  <h3>{{ answer.expert_name }}</h3>
                  <span class="expert-title">{{ answer.expert_title }}</span>
                </div>
                <div class="answer-meta">
                  <span class="time">{{ formatDate(answer.answered_at) }}</span>
                </div>
              </div>

              <div class="answer-content">
                {{ answer.content }}
              </div>

              <!-- 回答图片展示 -->
              <div v-if="answer.images && answer.images.length > 0" class="answer-images">
                <h4>回答图片:</h4>
                <div class="image-gallery">
                  <!-- 修改1: 使用统一的preview-src-list并添加preview-teleported -->
                  <el-image
                      v-for="(image, index) in answer.images"
                      :key="image.id"
                      :src="`http://localhost:3000${image.url}`"
                      :preview-src-list="previewSrcList"
                      :initial-index="index"
                      :preview-teleported="true"
                      class="answer-image"
                      fit="cover"
                      lazy
                  >
                    <!-- 添加错误插槽 -->
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
              </div>
            </el-card>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from '@/stores/user';

export default {
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    };
  },
  data() {
    return {
      answer: {},
      replies: [],
      replyContent: '',
      showReplyForm: false,
      defaultAvatar: require('@/assets/profile.jpg')
    };
  },
  computed: {
    // 添加计算属性来生成预览列表
    previewSrcList() {
      if (this.answer.images && this.answer.images.length > 0) {
        return this.answer.images.map(image => `http://localhost:3000${image.url}`);
      }
      return [];
    }
  },
  created() {
    this.fetchAnswerDetail();
  },
  methods: {
    async fetchAnswerDetail() {
      try {
        const answerId = this.$route.params.id;
        const token = this.userStore.token;

        // 实际API调用
        const response = await axios.get(`http://localhost:3000/api/answers/${answerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.answer = response.data;
        console.log('answer', this.answer)
      } catch (error) {
        console.error('获取回答详情失败:', error);
        this.$message.error('获取回答详情失败');
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
    submitReply() {
      // 提交回复逻辑
    }
  }
};
</script>

<style scoped>
.answer-detail-container {
  padding: 20px;
}

.main-answer {
  margin-bottom: 20px;
}

.answer-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-info {
  margin-left: 15px;
  flex: 1;
}

.user-info h3 {
  margin: 0;
}

.expert-title {
  color: #888;
  font-size: 14px;
}

.answer-meta {
  text-align: right;
}

.time {
  display: block;
  color: #999;
  margin-bottom: 5px;
}

.answer-content {
  line-height: 1.8;
  font-size: 16px;
  padding: 10px 0;
}

.answer-images {
  margin: 20px 0;
}

.answer-images h4 {
  margin-bottom: 10px;
  color: #666;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.answer-image {
  width: 150px;
  height: 150px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s;
}

.answer-image:hover {
  transform: scale(1.05);
}

/* 添加图片错误状态样式 */
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  color: #999;
  font-size: 24px;
}

.answer-actions {
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 15px;
}

.reply-form {
  margin-bottom: 20px;
}

.form-actions {
  margin-top: 10px;
  text-align: right;
}

.replies-container {
  margin-top: 30px;
}
</style>
