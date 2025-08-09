<template>
  <div class="container">
    <h1>数据统计</h1>

    <el-row gutter="20">
      <el-col :span="8">
        <el-card class="data-card">
          <h3>买家数量</h3>
          <el-tag class="data-tag">{{ buyerCount }}</el-tag>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="data-card">
          <h3>农户数量</h3>
          <el-tag class="data-tag">{{ farmerCount }}</el-tag>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="data-card">
          <h3>专家数量</h3>
          <el-tag class="data-tag">{{ expertCount }}</el-tag>
        </el-card>
      </el-col>
    </el-row>

    <el-row gutter="20">
      <el-col :span="8">
        <el-card class="data-card">
          <h3>周订单总金额</h3>
          <el-tag class="data-tag">¥ {{ weekOrderSum }}</el-tag>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="data-card">
          <h3>月订单总金额</h3>
          <el-tag class="data-tag">¥ {{ monthOrderSum }}</el-tag>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="data-card">
          <h3>年订单总金额</h3>
          <el-tag class="data-tag">¥ {{ yearOrderSum }}</el-tag>
        </el-card>
      </el-col>
    </el-row>

    <el-row gutter="20">
      <el-col :span="8">
        <el-card class="data-card">
          <h3>农产品种类数</h3>
          <el-tag class="data-tag">{{ agricultureCount }}</el-tag>
        </el-card>
      </el-col>
<!--      <el-col :span="8">-->
<!--        <el-card class="data-card">-->
<!--          <div class="vegetable-list">-->
<!--            <div class="vegetable-item" v-for="(vegetable, index) in vegetables" :key="index">-->
<!--              {{ vegetable }}-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
      <el-col :span="8">
        <el-card class="data-card">
          <div class="vegetable-list">
            <div v-for="(vegetable, index) in vegetables" :key="index">
              <el-tag class="vegetable-item">{{ vegetable }}</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();
const buyerCount = ref(0);
const farmerCount = ref(0);
const expertCount = ref(0);
const weekOrderSum = ref(0);
const monthOrderSum = ref(0);
const yearOrderSum = ref(0);
const agricultureCount = ref(14);

// 新增蔬菜列表
const vegetables = ref([
  '辣椒', '白菜', '菠菜', '葱', '豆角',
  '番茄', '黄瓜', '萝卜', '南瓜', '茄子',
  '山药', '蒜', '土豆', '莴苣'
]);

const fetchData = async () => {
  const token = userStore.token;

  try {
    const [buyerRes, farmerRes, expertRes, weekSumRes, monthSumRes, yearSumRes, agriRes] = await Promise.all([
      axios.get('http://localhost:3000/api/admin/statistics/buyer-count', { headers: { 'Authorization': `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/farmer-count', { headers: { 'Authorization': `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/expert-count', { headers: { 'Authorization': `Bearer ${token}` } }),
      // axios.get('http://localhost:3000/api/admin/week-order-sum', { headers: { 'Authorization': `Bearer ${token}` } }),
      // axios.get('http://localhost:3000/api/admin/month-order-sum', { headers: { 'Authorization': `Bearer ${token}` } }),
      // axios.get('http://localhost:3000/api/admin/year-order-sum', { headers: { 'Authorization': `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/agriculture-count', { headers: { 'Authorization': `Bearer ${token}` } }),
    ]);

    buyerCount.value = buyerRes.data.data;
    farmerCount.value = farmerRes.data.count;
    expertCount.value = expertRes.data.count;
    weekOrderSum.value = weekSumRes.data.sum;
    monthOrderSum.value = monthSumRes.data.sum;
    yearOrderSum.value = yearSumRes.data.sum;
    // agricultureCount.value = agriRes.data.count;
    agricultureCount.value = 14;
  } catch (error) {
    console.error('获取管理员统计数据失败，使用模拟数据:', error);
    // buyerCount.value = 5;
    // farmerCount.value = 5;
    // expertCount.value = 5;
    // weekOrderSum.value = 7000;
    // monthOrderSum.value = 12000;
    // yearOrderSum.value = 365000;
    // agricultureCount.value = 14;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
  color: #333;
}

.data-card {
  text-align: center;
  min-height: 150px;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  transition: all 0.6s;
}

.data-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.data-tag {
  font-size: 24px;
  color: #409EFF;
}

.vegetable-list {
  margin-top: 10px; /* 上方间距 */
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  justify-content: center; /* 居中对齐 */
}

.vegetable-item {
  background-color: #f2f8ff; /* 背景色 */
  border: 1px solid powderblue; /* 边框色 */
  border-radius: 4px; /* 圆角 */
  padding: 8px 12px; /* 内边距 */
  margin: 5px; /* 外边距 */
  font-size: 14px; /* 字体大小 */
  color: #333; /* 字体颜色 */
  transition: all 0.3s; /* 添加过渡效果 */
}

/* 鼠标悬停时的样式 */
.vegetable-item:hover {
  background-color: #e0f0ff; /* 背景色变化 */
  border-color: #008CBA; /* 边框颜色变化 */
  transform: scale(1.05); /* 放大效果 */
}

</style>