<template>
  <div class="container">
    <h1>数据统计</h1>

    <el-row gutter="20">
      <el-col :span="8">
        <el-card class="data-card">
          <h3>农户数量</h3>
          <el-tag class="data-tag">{{ farmerCount }}</el-tag>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="data-card">
          <h3>买家数量</h3>
          <el-tag class="data-tag">{{ buyerCount }}</el-tag>
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
        <el-card class="text-card" @click="seeData(weekOrderSum, 'week')">
          <h3>周订单总金额</h3>
          <el-tag class="text-tag">点击查看</el-tag>
<!--          <el-tag class="data-tag">¥ {{ weekOrderSum }}</el-tag>-->
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="text-card" @click="seeData(monthOrderSum, 'month')">
          <h3>月订单总金额</h3>
          <el-tag class="text-tag">点击查看</el-tag>
<!--          <el-tag class="data-tag">¥ {{ monthOrderSum }}</el-tag>-->
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="text-card" @click="seeData(yearOrderSum, 'year')">
          <h3>年订单总金额</h3>
          <el-tag class="text-tag">点击查看</el-tag>
<!--          <el-tag class="data-tag">¥ {{ yearOrderSum }}</el-tag>-->
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

<!--    <div class="table-container">-->
<!--      <el-table :data="weekData" style="width: 100%">-->
<!--        <el-table-column prop="period" label="日期" />-->
<!--        <el-table-column prop="total_amount" label="总金额" />-->
<!--        <el-table-column prop="order_count" label="数量" />-->
<!--      </el-table>-->
<!--    </div>-->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '../../stores/user';
import { useAdminDataStore } from '../../stores/adminData';
import {useRouter} from "vue-router";
const router = useRouter();

const userStore = useUserStore();
const adminDataStore = useAdminDataStore();

const buyerCount = ref(0);
const farmerCount = ref(0);
const expertCount = ref(0);
const weekOrderSum = ref([]);
const monthOrderSum = ref([]);
const yearOrderSum = ref([]);
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
      axios.get('http://localhost:3000/api/statistics/buyer-count', { headers: { 'Authorization': `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/farmer-count', { headers: { 'Authorization': `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/expert-count', { headers: { 'Authorization': `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/week-order-sum', { headers: { 'Authorization': `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/month-order-sum', { headers: { 'Authorization': `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/year-order-sum', { headers: { 'Authorization': `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/agriculture-count', { headers: { 'Authorization': `Bearer ${token}` } }),
    ]);

    buyerCount.value = buyerRes.data.data;
    farmerCount.value = farmerRes.data.count;
    expertCount.value = expertRes.data.count;

    weekOrderSum.value = weekSumRes.data.data || [];
    monthOrderSum.value = monthSumRes.data.data || [];
    yearOrderSum.value = yearSumRes.data.data || [];
    // agricultureCount.value = agriRes.data.count;
    agricultureCount.value = 14;
    console.log('管理员统计数据拿到数据');
    // console.log(buyerCount.value);
  } catch (error) {
    console.error('获取管理员统计数据失败，使用模拟数据:', error);
  }
};

const weekData = ref([]);
const getWeekData = async () => {
  const token = userStore.token;
  try {
    const weekSumRes = await axios.get('http://localhost:3000/api/week-order-sum', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
     //weekOrderSum.value = weekSumRes.data.data.reduce((sum, item) => sum + item.total_amount, 0);
     //weekOrderSum.value = weekSumRes.data.sum;
     //console.log('周' + weekOrderSum.value);
  } catch (error) {
    console.error('获取周总额失败，使用模拟数据:', error);

  }
};


const seeData = (orderSum, msg) => {
  adminDataStore.currentData = orderSum;
  adminDataStore.msg = msg;
  router.push('/admin/data/sum');
};

onMounted(() => {
  fetchData();
  getWeekData();
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

.text-card {
  text-align: center;
  min-height: 150px;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  transition: all 0.6s;
  cursor: pointer; /* 添加鼠标指针样式 */
}

.text-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.text-tag {
  font-size: 16px;
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