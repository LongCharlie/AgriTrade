<template>
  <div class="container">
    <h1>{{ msg == 'week' ? '周' : msg == 'month' ? '月' : '年' }}订单金额统计</h1>
    <div class="table-container">
      <el-table :data="orderSum" style="width: 100%">
        <el-table-column prop="period" :formatter="formatDate" label="开始日期" />
        <el-table-column prop="total_amount" label="订单总金额" />
        <el-table-column prop="order_count" label="订单总数量" />
      </el-table>
    </div>
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

const orderSum = adminDataStore.currentData;
const msg = adminDataStore.msg;

// 格式化日期函数
const formatDate = (row, column, cellValue) => {
  if (!cellValue) return '';

  // 使用正则表达式提取日期部分
  const dateStr = cellValue.match(/\d{4}-\d{2}-\d{2}/);
  if (dateStr) {
    return dateStr[0].replace(/-/g, '/');
  }

  // 如果正则匹配失败，使用Date对象处理
  try {
    const date = new Date(cellValue);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  } catch (e) {
    return cellValue; // 如果解析失败，返回原始值
  }
};
onMounted(() => {
});
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
  color: #333;
}

</style>