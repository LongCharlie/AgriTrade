<template>
  <div class="buyer-home-container">
    <!-- 头部欢迎 -->
    <h2>您好，{{ buyer.buyerName }}！</h2>
    <p>欢迎回到耘联农业平台，快来交易吧！</p>

    <!-- 卡片信息 -->
    <el-row :gutter="20" class="info-cards">
      <el-col :span="8">
        <el-card class="info-card home-card" @click="goToHome">
          <div slot="header">
            <strong>我的主页</strong>
          </div>
          <div class="card-content">
            <p>查看或修改个人信息</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="info-card order-card" @click="goToOrders">
          <div slot="header">
            <strong>查看订单</strong>
          </div>
          <div class="card-content">
            <p>管理您的订单</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="info-card recommendation-card" @click="goToPurchases">
          <div slot="header">
            <strong>发布采购</strong>
          </div>
          <div class="card-content">
            <p>管理您的采购</p>
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

// 从用户状态中获取信息
const buyer = ref({
  buyerName: userStore.username || '默认'
});

// 页面导航函数
const goToHome = () => {
  router.push('/merchant/profile');
};

const goToOrders = () => {
  router.push('/merchant/order');
};

const goToPurchases = () => {
  router.push('/merchant/purchases');
};
</script>

<style scoped>
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