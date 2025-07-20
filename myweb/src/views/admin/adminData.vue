<template>
  <div>
    <h1>我的订单</h1>
    <h1>总收入: ¥ {{ totalRevenue }}</h1>
    </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '../../stores/user';
const userStore = useUserStore();
import Photo from "@/assets/platform_logo2.png";



// 模拟订单数据
const simulatedTableData = [
  { order_id: 1, product_name: '白米', quantity: 100, price: 15, delivery_location: '北京', buyer_id: '1', buyer_name: 'A老板', phone: '123456789', created_at: '2023-10-01', status: 'pending_shipment' },
  { order_id: 2, product_name: '西瓜', quantity: 200, price: 10, delivery_location: '河北', buyer_id: '2', buyer_name: '老王', phone: '987654321', created_at: '2023-10-02', status: 'completed' },
  { order_id: 3, product_name: '白米', quantity: 50, price: 8, delivery_location: '广东', buyer_id: '3', buyer_name: '孙经理', phone: '135792468', created_at: '2024-10-03', status: 'shipped' },
  { order_id: 4, product_name: '玉米', quantity: 150, price: 12, delivery_location: '四川', buyer_id: '4', buyer_name: '小李', phone: '159753864', created_at: '2024-10-04', status: 'after_sale_requested', after_sale_reason: '玉米变质（附图）', after_sale_reason_images: `${Photo},${Photo},${Photo},${Photo}` },
  { order_id: 5, product_name: '黄豆', quantity: 80, price: 20, delivery_location: '江苏', buyer_id: '5', buyer_name: '老张', phone: '246813579', created_at: '2024-11-05', status: 'after_sale_resolved', after_sale_reason: '变质（附图）', after_sale_reason_images: `${Photo},${Photo}`, reason: '同意'},
  { order_id: 6, product_name: '白米', quantity: 100, price: 8, delivery_location: '广东', buyer_id: '3', buyer_name: '孙经理', phone: '135792468', created_at: '2024-11-03', status: 'completed' },
  { order_id: 7, product_name: '玉米', quantity: 150, price: 12, delivery_location: '四川', buyer_id: '4', buyer_name: '小李', phone: '159753864', created_at: '2024-11-04', status: 'completed' },
  { order_id: 8, product_name: '黄豆', quantity: 80, price: 20, delivery_location: '江苏', buyer_id:'5', buyer_name: '老张', phone: '246813579', created_at: '2024-11-05', status: 'shipped' },
  { order_id: 9, product_name: '玉米', quantity: 150, price: 12, delivery_location: '四川', buyer_id:'4', buyer_name: '小李', phone: '159753864', created_at: '2024-11-04', status: 'pending_shipment' },
  { order_id: 10, product_name: '黄豆', quantity: 80, price: 20, delivery_location: '江苏', buyer_id:'5', buyer_name: '老张', phone: '246813579', created_at: '2024-11-05', status: 'pending_shipment' },
  { order_id: 11, product_name: '玉米', quantity: 150, price: 12, delivery_location: '四川', buyer_id:'4', buyer_name: '小李', phone: '159753864', created_at: '2024-10-04', status: 'completed'},
];

// 表格数据
const tableData = ref([]); // 初始化表格数据为一个空数组
const filteredTableData = ref([]); // 初始化过滤后的数据

const fetchData = async () => {
  const token = userStore.token; // 从用户存储中获取 token
  try {
    const response = await axios.get('http://localhost:3000/api/orders/all', {
      headers: {
        'Authorization': `Bearer ${token}` // 设置 Authorization 头
      }
    });
    tableData.value = response.data || []; // 假设 API 返回的数据就是我们需要的格式
    filteredTableData.value = [...tableData.value]; // 同步过滤后的数据
  } catch (error) {
    console.error('获取采购需求数据失败，使用模拟数据', error);
    tableData.value = simulatedTableData; // 使用模拟数据
    filteredTableData.value = [...simulatedTableData]; // 同步过滤后的数据
  }
};

// 在组件挂载时调用 fetchData
onMounted(() => {
  fetchData();
});

// 计算总收入
const totalRevenue = computed(() => {
  return (filteredTableData.value || []).filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (order.quantity * order.price), 0);
});

</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}

</style>
<script setup lang="ts">
</script>