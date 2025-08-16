<template>
  <div class="container">
    <h1>{{ msg == 'week' ? '周' : msg == 'month' ? '月' : '年' }}订单金额统计</h1>
    <div class="table-container">
      <el-table :data="orderSum" style="width: 100%">
        <el-table-column prop="period" label="开始日期" />
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


onMounted(() => {
});
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
  color: #333;
}

</style>