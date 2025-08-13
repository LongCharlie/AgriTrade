<template>
  <div class="weekly-order-summary">
    <h2>周订单统计</h2>
    <el-table :data="weekData" style="width: 100%">
      <el-table-column prop="period" label="日期" />
      <el-table-column
          prop="total_amount"
          label="总金额"
          :formatter="formatCurrency"
      />
      <el-table-column prop="order_count" label="数量" />
    </el-table>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();
const weekData = ref([]);
const loading = ref(true);
const error = ref(null);

// 数据格式化函数
const formatCurrency = (row, column, value) => {
  return `¥ ${value.toFixed(2)}`;
}

const fetchWeeklyData = async () => {
  const token = userStore.token;
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('http://localhost:3000/api/week-order-sum', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    weekData.value = response.data.data;  // 确保取出 data 字段下的内容
  } catch (err) {
    error.value = '获取周订单数据失败';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchWeeklyData();
});
</script>

<style scoped>
.loading {
  text-align: center;
  font-size: 18px;
  color: #666;
}

.error {
  color: red;
  text-align: center;
}
</style>