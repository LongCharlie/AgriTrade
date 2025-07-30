<template>
  <div class="expert-home-container">
    <!-- 头部欢迎 -->
    <h2>您好，{{ expert.expertName }}！</h2>
    <p>欢迎回到耘联农业平台，快来答疑解惑吧！</p>

    <!-- 卡片信息 -->
    <el-row :gutter="20" class="info-cards">
      <el-col :span="6">
        <el-card class="info-card home-card" @click="$router.push('/expert/profile')">
          <div slot="header">
            <strong>我的主页</strong>
          </div>
          <div class="card-content">
            <p>查看或修改个人信息</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="info-card order-card" @click="$router.push('/expert/ques')">
          <div slot="header">
            <strong>解答问题</strong>
          </div>
          <div class="card-content">
            <p>查看或解答农户提问</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="info-card recommendation-card" @click="$router.push('/expert/rank')">
          <div slot="header">
            <strong>排行榜</strong>
          </div>
          <div class="card-content">
            <p>查看个人排名</p>
          </div>
        </el-card>
      </el-col>


      <el-col :span="6">
        <el-card class="info-card question-card" @click="$router.push('/expert/cert')">
          <div slot="header">
            <strong>知识认证</strong>
          </div>
          <div class="card-content">
            <p>查看或编辑我的证书</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user'; // 导入用户状态 Store

const router = useRouter();
const userStore = useUserStore(); // 使用用户 Store

// 从用户状态中获取农户信息
const expert = ref({
  expertName: userStore.username || '默认专家' // 默认为 '农户' 如果未登录
});
</script>

<style scoped>
.expert-home-container {
  padding: 20px;
}

.info-cards .info-card {
  margin-top: 40px;
  margin-bottom: 20px; /* 统一每个卡片的下边距 */
  cursor: pointer; /* 添加鼠标指针样式 */
  min-height: 200px; /* 使卡片高度一致 */
  transition: transform 0.2s ease; /* 添加平滑过渡效果 */
}

.info-cards .info-card:hover {
  transform: scale(1.05); /* 鼠标悬停时放大 */
}

.home-card {
  background-color: #e6f7ff; /* 浅蓝色背景 */
}
.order-card {
  background-color: #fff7e6; /* 浅橙色背景 */
}
.recommendation-card {
  background-color: #f9f9f9; /* 浅灰色背景 */
}
.question-card {
  background-color: #f0f9eb; /* 浅绿色背景 */
}

.card-content {
  text-align: center; /* 内容居中对齐 */
}

.card-content p {
  font-size: 24px; /* 字体大小 */
  font-weight: bold; /* 加粗文字 */
  color: #333; /* 字体颜色 */
}
</style>