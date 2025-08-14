<!--<template>-->
<!--  <div>-->
<!--    <el-container>-->
<!--      <el-aside width="200px">-->
<!--        <expert-common-aside></expert-common-aside>-->
<!--      </el-aside>-->
<!--      <el-container>-->
<!--        <el-header>-->
<!--          <expert-common-header></expert-common-header>-->
<!--        </el-header>-->
<!--        <el-main>-->
<!--          <div class="expert-answer-detail">-->
<!--            <h2>问题详情</h2>-->

<!--            <el-card shadow="hover" style="margin-bottom: 20px;">-->
<!--              <div class="card-header" slot="header">-->
<!--                <strong>{{ question.title }}</strong>-->
<!--                <div class="tag">-->
<!--                  <el-tag :type="question.answer_count > 0 ? 'success' : 'warning'">-->
<!--                    {{ question.answer_count > 0 ? '已回答' : '未回答' }}-->
<!--                  </el-tag>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div>-->
<!--                <p><strong>提问者：</strong>{{ question.username || '匿名' }}</p>-->
<!--                <p><strong>时间：</strong>{{ formatDate(question.created_at) }}</p>-->
<!--                <p><strong>内容：</strong>{{ question.content }}</p>-->

<!--                &lt;!&ndash; 问题图片展示 &ndash;&gt;-->
<!--                <div v-if="question.images && question.images.length > 0" class="question-images">-->
<!--                  <p><strong>问题图片：</strong></p>-->
<!--                  <div class="image-gallery">-->
<!--                    <el-image-->
<!--                        v-for="(image, index) in question.images"-->
<!--                        :key="image.id"-->
<!--                        :src="`http://localhost:3000${image.url}`"-->
<!--                        :preview-src-list="getPreviewList(question.images)"-->
<!--                        :initial-index="index"-->
<!--                        class="question-image"-->
<!--                        fit="cover"-->
<!--                        lazy-->
<!--                    >-->
<!--                      <div slot="error" class="image-slot">-->
<!--                        <i class="el-icon-picture-outline"></i>-->
<!--                      </div>-->
<!--                    </el-image>-->
<!--                  </div>-->
<!--                </div>-->

<!--                &lt;!&ndash; 回答表单 &ndash;&gt;-->
<!--                <el-form @submit.prevent="submitAnswer" label-width="80px">-->
<!--                  <el-form-item label="回答">-->
<!--                    <el-input v-model="answerContent" type="textarea" :rows="4" placeholder="请输入回答"/>-->
<!--                  </el-form-item>-->

<!--                  &lt;!&ndash; 回答图片上传区域 &ndash;&gt;-->
<!--                  <el-form-item label="回答图片">-->
<!--                    <el-upload-->
<!--                        ref="answerUpload"-->
<!--                        v-model:file-list="answerFileList"-->
<!--                        :auto-upload="false"-->
<!--                        :multiple="true"-->
<!--                        :limit="5"-->
<!--                        :on-exceed="handleAnswerExceed"-->
<!--                        :on-remove="handleAnswerRemove"-->
<!--                        list-type="picture-card">-->
<!--                      <el-icon><Plus /></el-icon>-->
<!--                      <div class="el-upload__text">-->
<!--                        点击上传图片 <br/>-->
<!--                        <span style="font-size: 12px; color: #999;">最多可上传5张图片，每张不超过5MB</span>-->
<!--                      </div>-->
<!--                    </el-upload>-->
<!--                  </el-form-item>-->

<!--                  <el-button type="primary" native-type="submit" :loading="submitting">提交</el-button>-->
<!--                  <el-button @click="$router.back()">取消</el-button>-->
<!--                </el-form>-->
<!--              </div>-->
<!--            </el-card>-->
<!--            &lt;!&ndash; 回答列表 &ndash;&gt;-->
<!--            <div class="answers-container">-->
<!--              <el-card-->
<!--                  v-for="answer in answers"-->
<!--                  :key="answer.answer_id"-->
<!--                  class="answer-card"-->
<!--                  shadow="hover"-->
<!--                  @click.native="viewAnswerDetail(answer.answer_id)"-->
<!--              >-->
<!--                <div class="answer-header">-->
<!--      <span class="expert-info">-->
<!--        <el-avatar-->
<!--            @click="$router.push(`/expert/detail/${answer.expert_id}`)"-->
<!--            :size="40"-->
<!--            :src="answer.avatar_url || defaultAvatar"-->
<!--        ></el-avatar>-->
<!--        <div>-->
<!--          <strong>{{ answer.real_name }}</strong>-->
<!--          <span v-if="answer.title" class="expert-title">{{ answer.title }}</span>-->
<!--        </div>-->
<!--      </span>-->
<!--                  <span class="answer-time">{{ formatDate(answer.answered_at) }}</span>-->
<!--                </div>-->
<!--                <div class="answer-content">{{ answer.content }}</div>-->

<!--                &lt;!&ndash; 回答图片展示 &ndash;&gt;-->
<!--                <div v-if="answer.images && answer.images.length > 0" class="answer-images">-->
<!--                  <div class="image-gallery">-->
<!--                    <el-image-->
<!--                        v-for="(image, index) in answer.images"-->
<!--                        :key="image.id"-->
<!--                        :src="`http://localhost:3000${image.url}`"-->
<!--                        :preview-src-list="getAnswerPreviewList(answer.images)"-->
<!--                        :initial-index="index"-->
<!--                        class="answer-image"-->
<!--                        fit="cover"-->
<!--                        lazy-->
<!--                    >-->
<!--                      <div slot="error" class="image-slot">-->
<!--                        <i class="el-icon-picture-outline"></i>-->
<!--                      </div>-->
<!--                    </el-image>-->
<!--                  </div>-->
<!--                </div>-->

<!--                <div class="answer-footer">-->
<!--                  <el-button type="text" icon="el-icon-thumb">{{ answer.upvotes || 0 }} 有用</el-button>-->
<!--                </div>-->
<!--              </el-card>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-main>-->
<!--      </el-container>-->
<!--    </el-container>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { useUserStore } from '@/stores/user'-->
<!--import expertCommonAside from "@/components/expertCommonAside.vue";-->
<!--import expertCommonHeader from "@/components/expertCommonHeader.vue";-->
<!--import axios from "axios";-->
<!--import { ElMessage } from 'element-plus';-->
<!--import { Plus } from '@element-plus/icons-vue';-->

<!--export default {-->
<!--  components: {-->
<!--    expertCommonHeader,-->
<!--    expertCommonAside,-->
<!--    Plus-->
<!--  },-->
<!--  setup() {-->
<!--    const userStore = useUserStore();-->
<!--    return {-->
<!--      userStore-->
<!--    };-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      question: {-->
<!--        images: []-->
<!--      },-->
<!--      answers: [],-->
<!--      answerContent: '',-->
<!--      answerFileList: [], // 存储回答的图片文件列表-->
<!--      defaultAvatar: require('@/assets/profile.jpg'),-->
<!--      submitting: false-->
<!--    };-->
<!--  },-->
<!--  created() {-->
<!--    this.fetchQuestion();-->
<!--    this.fetchAnswers();-->
<!--  },-->
<!--  methods: {-->
<!--    viewAnswerDetail(answerId) {-->
<!--      this.$router.push(`/expert/answer/${answerId}`);-->
<!--    },-->
<!--    async fetchQuestion() {-->
<!--      try {-->
<!--        const id = this.$route.params.id;-->
<!--        const token = this.userStore.token;-->
<!--        const response = await axios.get(`http://localhost:3000/api/question/${id}`, {-->
<!--          headers: {-->
<!--            Authorization: `Bearer ${token}`-->
<!--          }-->
<!--        })-->
<!--        this.question = response.data;-->
<!--      } catch (error) {-->
<!--        console.error('获取问题失败:', error);-->
<!--      }-->
<!--    },-->
<!--    async fetchAnswers() {-->
<!--      try {-->
<!--        const id = this.$route.params.id;-->
<!--        const token = this.userStore.token;-->
<!--        const response = await axios.get(`http://localhost:3000/api/question/${id}/answers`, {-->
<!--          headers: {-->
<!--            Authorization: `Bearer ${token}`-->
<!--          }-->
<!--        })-->
<!--        this.answers = response.data.answers;-->
<!--      } catch (error) {-->
<!--        console.error('获取回答失败:', error);-->
<!--      }-->
<!--    },-->
<!--    formatDate(dateString) {-->
<!--      return new Date(dateString).toLocaleString();-->
<!--    },-->
<!--    async submitAnswer() {-->
<!--      if (!this.answerContent.trim()) {-->
<!--        ElMessage.warning('请输入回答内容');-->
<!--        return;-->
<!--      }-->

<!--      this.submitting = true;-->
<!--      try {-->
<!--        const token = this.userStore.token;-->

<!--        // 创建 FormData 对象来支持图片上传-->
<!--        const formData = new FormData();-->
<!--        formData.append('content', this.answerContent);-->

<!--        // 添加图片文件-->
<!--        if (this.answerFileList.length > 0) {-->
<!--          this.answerFileList.forEach(file => {-->
<!--            formData.append('images', file.raw);-->
<!--          });-->
<!--        }-->

<!--        await axios.post(-->
<!--            `http://localhost:3000/api/questions/${this.question.question_id}/answers`,-->
<!--            formData,-->
<!--            {-->
<!--              headers: {-->
<!--                Authorization: `Bearer ${token}`,-->
<!--                'Content-Type': 'multipart/form-data'-->
<!--              }-->
<!--            }-->
<!--        );-->

<!--        ElMessage.success('回答成功');-->
<!--        this.answerContent = ''; // 清空回答内容-->
<!--        this.answerFileList = []; // 清空图片列表-->
<!--        this.fetchAnswers(); // 重新获取回答列表-->
<!--        this.fetchQuestion();-->
<!--      } catch (error) {-->
<!--        ElMessage.error('回答失败，请重试');-->
<!--        console.error('提交回答失败:', error);-->
<!--      } finally {-->
<!--        this.submitting = false;-->
<!--      }-->
<!--    },-->
<!--    // 获取问题图片预览列表-->
<!--    getPreviewList(images) {-->
<!--      return images.map(image => `http://localhost:3000${image.url}`);-->
<!--    },-->
<!--    // 获取回答图片预览列表-->
<!--    getAnswerPreviewList(images) {-->
<!--      return images.map(image => `http://localhost:3000${image.url}`);-->
<!--    },-->
<!--    // 处理回答图片超出限制-->
<!--    handleAnswerExceed() {-->
<!--      ElMessage.warning('最多只能上传5张图片');-->
<!--    },-->
<!--    // 处理回答图片移除-->
<!--    handleAnswerRemove(file, fileList) {-->
<!--      this.answerFileList = fileList;-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.expert-answer-detail {-->
<!--  padding: 20px;-->
<!--}-->

<!--.el-header {-->
<!--  padding: 0;-->
<!--}-->

<!--.answer-item {-->
<!--  padding: 15px 0;-->
<!--  border-bottom: 1px solid #eee;-->
<!--}-->

<!--.answer-header {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  margin-bottom: 10px;-->
<!--}-->

<!--.expert-info {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--}-->

<!--.expert-info > div {-->
<!--  margin-left: 10px;-->
<!--}-->

<!--.expert-title {-->
<!--  display: block;-->
<!--  color: #888;-->
<!--  font-size: 12px;-->
<!--}-->

<!--.answer-time {-->
<!--  color: #999;-->
<!--  font-size: 13px;-->
<!--}-->

<!--.answer-content {-->
<!--  line-height: 1.6;-->
<!--  margin-bottom: 10px;-->
<!--}-->

<!--.answer-footer {-->
<!--  text-align: right;-->
<!--}-->

<!--.tag {-->
<!--  display: flex;-->
<!--  gap: 8px;-->
<!--}-->

<!--.card-header {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  margin-bottom: 15px;-->
<!--  padding-bottom: 10px;-->
<!--  border-bottom: 1px solid #eee;-->
<!--}-->

<!--.answers-container {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 20px;-->
<!--}-->

<!--.answer-card {-->
<!--  transition: all 0.3s ease;-->
<!--  margin-bottom: 15px;-->
<!--}-->

<!--.answer-card:hover {-->
<!--  transform: scale(1.02);-->
<!--  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);-->
<!--  z-index: 1;-->
<!--}-->

<!--.answer-header {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  margin-bottom: 15px;-->
<!--  padding-bottom: 10px;-->
<!--  border-bottom: 1px solid #f0f0f0;-->
<!--}-->

<!--.expert-info {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--}-->

<!--.expert-info > div {-->
<!--  margin-left: 10px;-->
<!--}-->

<!--.expert-title {-->
<!--  display: block;-->
<!--  color: #888;-->
<!--  font-size: 12px;-->
<!--}-->

<!--.answer-content {-->
<!--  line-height: 1.6;-->
<!--  margin-bottom: 15px;-->
<!--  padding: 0 10px;-->
<!--}-->

<!--.answer-footer {-->
<!--  text-align: right;-->
<!--  padding-top: 10px;-->
<!--  border-top: 1px solid #f0f0f0;-->
<!--}-->

<!--/* 问题图片样式 */-->
<!--.question-images, .answer-images {-->
<!--  margin-top: 20px;-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.image-gallery {-->
<!--  display: flex;-->
<!--  flex-wrap: wrap;-->
<!--  gap: 10px;-->
<!--  margin-top: 10px;-->
<!--}-->

<!--.question-image, .answer-image {-->
<!--  width: 150px;-->
<!--  height: 150px;-->
<!--  border-radius: 4px;-->
<!--  overflow: hidden;-->
<!--  cursor: pointer;-->
<!--  border: 1px solid #eee;-->
<!--}-->

<!--.image-slot {-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  background: #f5f5f5;-->
<!--  color: #999;-->
<!--  font-size: 24px;-->
<!--}-->

<!--:deep(.el-upload&#45;&#45;picture-card) {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--}-->
<!--</style>-->
<template>
  <div>
    <el-container>
      <el-aside width="200px">
        <expert-common-aside></expert-common-aside>
      </el-aside>
      <el-container>
        <el-header>
          <expert-common-header></expert-common-header>
        </el-header>
        <el-main>
          <div class="expert-answer-detail">
            <h2>问题详情</h2>

            <el-card shadow="hover" style="margin-bottom: 20px;">
              <div class="card-header" slot="header">
                <strong>{{ question.title }}</strong>
                <div class="tag">
                  <el-tag :type="question.answer_count > 0 ? 'success' : 'warning'">
                    {{ question.answer_count > 0 ? '已回答' : '未回答' }}
                  </el-tag>
                </div>
              </div>

              <div>
                <p><strong>提问者：</strong>{{ question.username || '匿名' }}</p>
                <p><strong>时间：</strong>{{ formatDate(question.created_at) }}</p>
                <p><strong>内容：</strong>{{ question.content }}</p>

                <!-- 问题图片展示 -->
                <div v-if="question.images && question.images.length > 0" class="question-images">
                  <p><strong>问题图片：</strong></p>
                  <div class="image-gallery">
                    <el-image
                        v-for="(image, index) in question.images"
                        :key="image.id"
                        :src="`http://localhost:3000${image.url}`"
                        :preview-src-list="getPreviewList(question.images)"
                        :initial-index="index"
                        class="question-image"
                        fit="cover"
                        lazy
                    >
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>
                </div>

                <!-- 回答表单 -->
                <el-form @submit.prevent="submitAnswer" label-width="80px">
                  <el-form-item label="回答">
                    <el-input v-model="answerContent" type="textarea" :rows="4" placeholder="请输入回答"/>
                  </el-form-item>

                  <!-- 回答图片上传区域 -->
                  <el-form-item label="回答图片">
                    <el-upload
                        ref="answerUpload"
                        v-model:file-list="answerFileList"
                        :auto-upload="false"
                        :multiple="true"
                        :limit="5"
                        :on-exceed="handleAnswerExceed"
                        :on-remove="handleAnswerRemove"
                        list-type="picture-card">
                      <el-icon><Plus /></el-icon>
                      <div class="el-upload__text">
                        点击上传图片 <br/>
                        <span style="font-size: 12px; color: #999;">最多可上传5张图片，每张不超过5MB</span>
                      </div>
                    </el-upload>
                  </el-form-item>

                  <el-button type="primary" native-type="submit" :loading="submitting">提交</el-button>
                  <el-button @click="$router.back()">取消</el-button>
                </el-form>
              </div>
            </el-card>
            <!-- 回答列表 -->
            <div class="answers-container">
              <el-card
                  v-for="answer in answers"
                  :key="answer.answer_id"
                  class="answer-card"
                  shadow="hover"
                  @click.native="viewAnswerDetail(answer.answer_id)"
              >
                <div class="answer-header">
      <span class="expert-info">
        <el-avatar
            @click="$router.push(`/expert/detail/${answer.expert_id}`)"
            :size="40"
            :src="answer.avatar_url || defaultAvatar"
        ></el-avatar>
        <div>
          <strong>{{ answer.real_name }}</strong>
          <span v-if="answer.title" class="expert-title">{{ answer.title }}</span>
        </div>
      </span>
                  <span class="answer-time">{{ formatDate(answer.answered_at) }}</span>
                </div>
                <div class="answer-content">{{ answer.content }}</div>

                <!-- 回答图片展示 -->
                <div v-if="answer.images && answer.images.length > 0" class="answer-images">
                  <div class="image-gallery">
                    <el-image
                        v-for="(image, index) in answer.images"
                        :key="image.id"
                        :src="`http://localhost:3000${image.url}`"
                        :preview-src-list="getAnswerPreviewList(answer.images)"
                        :initial-index="index"
                        class="answer-image"
                        fit="cover"
                        lazy
                    >
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>
                </div>

                <div class="answer-footer">
<!--                  <el-button type="text" icon="el-icon-thumb">{{ answer.upvotes || 0 }} 有用</el-button>-->
                  <!-- 添加删除按钮 -->
                  <el-button
                      v-if="answer.expert_id === userStore.userId"
                      type="text"
                      icon="el-icon-delete"
                      @click.stop="deleteAnswer(answer.answer_id)"
                      style="color: #f56c6c; margin-left: 10px;"
                  >
                    删除回答
                  </el-button>
                </div>
              </el-card>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'
import expertCommonAside from "@/components/expertCommonAside.vue";
import expertCommonHeader from "@/components/expertCommonHeader.vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

export default {
  components: {
    expertCommonHeader,
    expertCommonAside,
    Plus
  },
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    };
  },
  data() {
    return {
      question: {
        images: []
      },
      answers: [],
      answerContent: '',
      answerFileList: [], // 存储回答的图片文件列表
      defaultAvatar: require('@/assets/profile.jpg'),
      submitting: false
    };
  },
  created() {
    this.fetchQuestion();
    this.fetchAnswers();
  },
  methods: {
    viewAnswerDetail(answerId) {
      this.$router.push(`/expert/answer/${answerId}`);
    },
    async fetchQuestion() {
      try {
        const id = this.$route.params.id;
        const token = this.userStore.token;
        const response = await axios.get(`http://localhost:3000/api/question/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.question = response.data;
      } catch (error) {
        console.error('获取问题失败:', error);
      }
    },
    async fetchAnswers() {
      try {
        const id = this.$route.params.id;
        const token = this.userStore.token;
        const response = await axios.get(`http://localhost:3000/api/question/${id}/answers`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.answers = response.data.answers;
      } catch (error) {
        console.error('获取回答失败:', error);
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
    async submitAnswer() {
      if (!this.answerContent.trim()) {
        ElMessage.warning('请输入回答内容');
        return;
      }

      this.submitting = true;
      try {
        const token = this.userStore.token;

        // 创建 FormData 对象来支持图片上传
        const formData = new FormData();
        formData.append('content', this.answerContent);

        // 添加图片文件
        if (this.answerFileList.length > 0) {
          this.answerFileList.forEach(file => {
            formData.append('images', file.raw);
          });
        }

        await axios.post(
            `http://localhost:3000/api/questions/${this.question.question_id}/answers`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
        );

        ElMessage.success('回答成功');
        this.answerContent = ''; // 清空回答内容
        this.answerFileList = []; // 清空图片列表
        this.fetchAnswers(); // 重新获取回答列表
        this.fetchQuestion();
      } catch (error) {
        ElMessage.error('回答失败，请重试');
        console.error('提交回答失败:', error);
      } finally {
        this.submitting = false;
      }
    },
    // 删除回答功能
    async deleteAnswer(answerId) {
      try {
        await ElMessageBox.confirm(
            '确定要删除这个回答吗？此操作不可恢复',
            '确认删除',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        );

        const token = this.userStore.token;
        await axios.delete(`http://localhost:3000/api/answers/${answerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        ElMessage.success('回答删除成功');
        // 重新获取回答列表
        this.fetchAnswers();
        this.fetchQuestion();
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除回答失败: ' + (error.response?.data?.error || error.message));
          console.error('删除回答失败:', error);
        }
      }
    },
    // 获取问题图片预览列表
    getPreviewList(images) {
      return images.map(image => `http://localhost:3000${image.url}`);
    },
    // 获取回答图片预览列表
    getAnswerPreviewList(images) {
      return images.map(image => `http://localhost:3000${image.url}`);
    },
    // 处理回答图片超出限制
    handleAnswerExceed() {
      ElMessage.warning('最多只能上传5张图片');
    },
    // 处理回答图片移除
    handleAnswerRemove(file, fileList) {
      this.answerFileList = fileList;
    }
  }
};
</script>

<style scoped>
.expert-answer-detail {
  padding: 20px;
}

.el-header {
  padding: 0;
}

.answer-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.expert-info {
  display: flex;
  align-items: center;
}

.expert-info > div {
  margin-left: 10px;
}

.expert-title {
  display: block;
  color: #888;
  font-size: 12px;
}

.answer-time {
  color: #999;
  font-size: 13px;
}

.answer-content {
  line-height: 1.6;
  margin-bottom: 10px;
}

.answer-footer {
  text-align: right;
}

.tag {
  display: flex;
  gap: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.answers-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.answer-card {
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.answer-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.expert-info {
  display: flex;
  align-items: center;
}

.expert-info > div {
  margin-left: 10px;
}

.expert-title {
  display: block;
  color: #888;
  font-size: 12px;
}

.answer-content {
  line-height: 1.6;
  margin-bottom: 15px;
  padding: 0 10px;
}

.answer-footer {
  text-align: right;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

/* 问题图片样式 */
.question-images, .answer-images {
  margin-top: 20px;
  margin-bottom: 20px;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.question-image, .answer-image {
  width: 150px;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #eee;
}

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

:deep(.el-upload--picture-card) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
