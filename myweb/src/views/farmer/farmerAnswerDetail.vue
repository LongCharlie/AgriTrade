<!--<template>-->
<!--  <div>-->
<!--    <el-container>-->
<!--      &lt;!&ndash;      <el-aside width="200px">&ndash;&gt;-->
<!--      &lt;!&ndash;        <expert-common-aside />&ndash;&gt;-->
<!--      &lt;!&ndash;      </el-aside>&ndash;&gt;-->
<!--      <el-container>-->
<!--        &lt;!&ndash;        <el-header>&ndash;&gt;-->
<!--        &lt;!&ndash;          <expert-common-header />&ndash;&gt;-->
<!--        &lt;!&ndash;        </el-header>&ndash;&gt;-->
<!--        <el-main>-->
<!--          <div class="answer-detail-container">-->
<!--            &lt;!&ndash; 回答主体内容 &ndash;&gt;-->
<!--            <el-card class="main-answer">-->
<!--              <div class="answer-header">-->
<!--                <el-avatar @click="$router.push(`/expert/detail/${answer.expert_id}`)" :size="60" :src="answer.avatar_url || defaultAvatar"></el-avatar>-->
<!--                <div class="user-info">-->
<!--                  <h3>{{ answer.expert_name }}</h3>-->
<!--                  <span class="expert-title">{{ answer.expert_title }}</span>-->
<!--                </div>-->
<!--                <div class="answer-meta">-->
<!--                  <span class="time">{{ formatDate(answer.answered_at) }}</span>-->
<!--                  &lt;!&ndash;                  <el-tag :type="answer.isAccepted ? 'success' : ''">&ndash;&gt;-->
<!--                  &lt;!&ndash;                    {{ answer.isAccepted ? '已采纳' : '未采纳' }}&ndash;&gt;-->
<!--                  &lt;!&ndash;                  </el-tag>&ndash;&gt;-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="answer-content">-->
<!--                {{ answer.content }}-->
<!--              </div>-->

<!--              <div class="answer-actions">-->
<!--                <el-button type="text" icon="el-icon-thumb">-->
<!--                  {{ answer.upvotes || 0 }} 有用-->
<!--                </el-button>-->
<!--                &lt;!&ndash;                <el-button type="text" icon="el-icon-chat-round" @click="showReplyForm = !showReplyForm">&ndash;&gt;-->
<!--                &lt;!&ndash;                  回复&ndash;&gt;-->
<!--                &lt;!&ndash;                </el-button>&ndash;&gt;-->
<!--              </div>-->
<!--            </el-card>-->

<!--            &lt;!&ndash; 回复表单 &ndash;&gt;-->
<!--            &lt;!&ndash;            <el-card v-if="showReplyForm" class="reply-form">&ndash;&gt;-->
<!--            &lt;!&ndash;              <el-input&ndash;&gt;-->
<!--            &lt;!&ndash;                  v-model="replyContent"&ndash;&gt;-->
<!--            &lt;!&ndash;                  type="textarea"&ndash;&gt;-->
<!--            &lt;!&ndash;                  :rows="3"&ndash;&gt;-->
<!--            &lt;!&ndash;                  placeholder="请输入您的回复"&ndash;&gt;-->
<!--            &lt;!&ndash;              ></el-input>&ndash;&gt;-->
<!--            &lt;!&ndash;              <div class="form-actions">&ndash;&gt;-->
<!--            &lt;!&ndash;                <el-button type="primary" @click="submitReply">提交</el-button>&ndash;&gt;-->
<!--            &lt;!&ndash;                <el-button @click="showReplyForm = false">取消</el-button>&ndash;&gt;-->
<!--            &lt;!&ndash;              </div>&ndash;&gt;-->
<!--            &lt;!&ndash;            </el-card>&ndash;&gt;-->

<!--            &lt;!&ndash; 回复列表 &ndash;&gt;-->
<!--            &lt;!&ndash;            <div class="replies-container">&ndash;&gt;-->
<!--            &lt;!&ndash;              <h3>回复 ({{ replies.length }})</h3>&ndash;&gt;-->
<!--            &lt;!&ndash;              <div v-for="reply in replies" :key="reply.id" class="reply-item">&ndash;&gt;-->
<!--            &lt;!&ndash;                &lt;!&ndash; 回复项内容 &ndash;&gt;&ndash;&gt;-->
<!--            &lt;!&ndash;              </div>&ndash;&gt;-->
<!--            &lt;!&ndash;            </div>&ndash;&gt;-->
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
<!--        //console.log('Answer ID from route:', this.$route.params.answerId);-->

<!--        const answerId = this.$route.params.id;-->
<!--        const token = this.userStore.token;-->

<!--        // 实际API调用-->
<!--        const response = await axios.get(`http://localhost:3000/api/answers/${answerId}`, {-->
<!--          headers: {-->
<!--            Authorization: `Bearer ${token}`-->
<!--          }-->
<!--        });-->

<!--        this.answer = response.data;-->

<!--        // 如果需要获取回复数据，可以添加额外的API调用-->
<!--        // const repliesResponse = await axios.get(`http://localhost:3000/api/answers/${answerId}/replies`, {-->
<!--        //   headers: {-->
<!--        //     Authorization: `Bearer ${token}`-->
<!--        //   }-->
<!--        // });-->
<!--        // this.replies = repliesResponse.data;-->

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
<!--    }-->
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
<!--<template>-->
<!--  <div>-->
<!--    <el-container>-->
<!--&lt;!&ndash;      <el-aside width="200px">&ndash;&gt;-->
<!--&lt;!&ndash;        <expert-common-aside />&ndash;&gt;-->
<!--&lt;!&ndash;      </el-aside>&ndash;&gt;-->
<!--      <el-container>-->
<!--&lt;!&ndash;        <el-header>&ndash;&gt;-->
<!--&lt;!&ndash;          <expert-common-header />&ndash;&gt;-->
<!--&lt;!&ndash;        </el-header>&ndash;&gt;-->
<!--        <el-main>-->
<!--          <div class="answer-detail-container">-->
<!--            &lt;!&ndash; 回答主体内容 &ndash;&gt;-->
<!--            <el-card class="main-answer">-->
<!--              <div class="answer-header">-->
<!--                <el-avatar @click="$router.push(`/expert/detail/${answer.expert_id}`)" :size="60" :src="answer.avatar_url || defaultAvatar"></el-avatar>-->
<!--                <div class="user-info">-->
<!--                  <h3>{{ answer.expert_name }}</h3>-->
<!--                  <span class="expert-title">{{ answer.expert_title }}</span>-->
<!--                </div>-->
<!--                <div class="answer-meta">-->
<!--                  <span class="time">{{ formatDate(answer.answered_at) }}</span>-->
<!--&lt;!&ndash;                  <el-tag :type="answer.isAccepted ? 'success' : ''">&ndash;&gt;-->
<!--&lt;!&ndash;                    {{ answer.isAccepted ? '已采纳' : '未采纳' }}&ndash;&gt;-->
<!--&lt;!&ndash;                  </el-tag>&ndash;&gt;-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="answer-content">-->
<!--                {{ answer.content }}-->
<!--              </div>-->

<!--              <div class="answer-actions">-->
<!--                <el-button type="text" icon="el-icon-thumb">-->
<!--                  {{ answer.upvotes || 0 }} 有用-->
<!--                </el-button>-->
<!--&lt;!&ndash;                <el-button type="text" icon="el-icon-chat-round" @click="showReplyForm = !showReplyForm">&ndash;&gt;-->
<!--&lt;!&ndash;                  回复&ndash;&gt;-->
<!--&lt;!&ndash;                </el-button>&ndash;&gt;-->
<!--              </div>-->
<!--            </el-card>-->

<!--            &lt;!&ndash; 回复表单 &ndash;&gt;-->
<!--&lt;!&ndash;            <el-card v-if="showReplyForm" class="reply-form">&ndash;&gt;-->
<!--&lt;!&ndash;              <el-input&ndash;&gt;-->
<!--&lt;!&ndash;                  v-model="replyContent"&ndash;&gt;-->
<!--&lt;!&ndash;                  type="textarea"&ndash;&gt;-->
<!--&lt;!&ndash;                  :rows="3"&ndash;&gt;-->
<!--&lt;!&ndash;                  placeholder="请输入您的回复"&ndash;&gt;-->
<!--&lt;!&ndash;              ></el-input>&ndash;&gt;-->
<!--&lt;!&ndash;              <div class="form-actions">&ndash;&gt;-->
<!--&lt;!&ndash;                <el-button type="primary" @click="submitReply">提交</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;                <el-button @click="showReplyForm = false">取消</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--&lt;!&ndash;            </el-card>&ndash;&gt;-->

<!--            &lt;!&ndash; 回复列表 &ndash;&gt;-->
<!--&lt;!&ndash;            <div class="replies-container">&ndash;&gt;-->
<!--&lt;!&ndash;              <h3>回复 ({{ replies.length }})</h3>&ndash;&gt;-->
<!--&lt;!&ndash;              <div v-for="reply in replies" :key="reply.id" class="reply-item">&ndash;&gt;-->
<!--&lt;!&ndash;                &lt;!&ndash; 回复项内容 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
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

<!--        // 如果需要获取回复数据，可以添加额外的API调用-->
<!--        // const repliesResponse = await axios.get(`http://localhost:3000/api/answers/${answerId}/replies`, {-->
<!--        //   headers: {-->
<!--        //     Authorization: `Bearer ${token}`-->
<!--        //   }-->
<!--        // });-->
<!--        // this.replies = repliesResponse.data;-->

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
<!--    }-->
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
                <el-avatar @click="$router.push(`/expert/detail/${answer.expert_id}`)" :size="60" :src="answer.avatar_url || defaultAvatar"></el-avatar>
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
                  <el-image
                      v-for="(image, index) in answer.images"
                      :key="image.id"
                      :src="`http://localhost:3000${image.url}`"
                      :preview-src-list="getPreviewList(answer.images)"
                      :initial-index="index"
                      class="answer-image"
                      fit="cover"
                      lazy
                  ></el-image>
                </div>
              </div>

              <div class="answer-actions">
                <!--                <el-button type="text" icon="el-icon-thumb">-->
                <!--                  {{ answer.upvotes || 0 }} 有用-->
                <!--                </el-button>-->
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
    },
    // 获取问题图片预览列表
    getPreviewList(images) {
      return images.map(image => `http://localhost:3000${image.url}`);
    },
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
