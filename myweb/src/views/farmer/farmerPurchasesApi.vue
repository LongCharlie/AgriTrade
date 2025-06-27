<template>
  <div>
    <h1>采购大厅</h1>
    <div class="search-bar">
      <el-input
          v-model="searchProduct"
          placeholder="搜索产品种类"
          style="width: 200px; margin-bottom: 20px;"
      ></el-input>
      <el-input
          v-model="searchaddress"
          placeholder="搜索收货地"
          style="width: 200px; margin-bottom: 20px;"
      ></el-input>
      <el-input
          v-model.number="searchQuantity"
          placeholder="搜索采购量(kg)"
          style="width: 200px; margin-bottom: 20px;"
          type="number"
      ></el-input>
      <el-button type="primary" @click="sortByQuantity">按数量升序</el-button>
    </div>

    <el-table :data="filteredTableData" style="width: 100%">
      <el-table-column prop="product" label="产品种类" />
      <el-table-column prop="quantity" label="采购量(kg)" />
      <el-table-column prop="buyer" label="采购方" />
      <el-table-column prop="address" label="收货地" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="handleQuote(scope.row)" type="text">[去报价]</el-button>
          <el-button @click="handleModify(scope.row)" type="text">[修改]</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios'; // 导入 axios
import { useQuoteStore } from '../../stores/quote'; // 导入报价 Store
import { useRouter } from 'vue-router';

const searchProduct = ref('');
const searchaddress = ref('');
const searchQuantity = ref(null);
const router = useRouter();
const quoteStore = useQuoteStore(); // 使用报价 Store

// 初始化表格数据
const tableData = ref([]);

// 当组件挂载时从 API 获取数据
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/all-purchases'); // 替换为真实的 API 地址
    tableData.value = response.data; // 假设接口返回的数据为数组形式
  } catch (error) {
    console.error('获取数据失败:', error);
  }
});

const filteredTableData = computed(() => {
  return tableData.value.filter(item => {
    const matchesProduct = item.product.includes(searchProduct.value);
    const matchesaddress = item.address.includes(searchaddress.value);
    const matchesQuantity = searchQuantity.value ? item.quantity >= searchQuantity.value : true;

    return matchesProduct && matchesaddress && matchesQuantity;
  });
});

// 按数量排序的函数
const sortByQuantity = () => {
  tableData.value.sort((a, b) => a.quantity - b.quantity);
};

const handleQuote = (row) => {
  quoteStore.currentQuote = row; // 保存当前行的表格信息到 Store
  router.push('/farmer/purchases/quote'); // 跳转到报价页面
};

const handleModify = (row) => {
  quoteStore.currentQuote = row; // 保存当前行的表格信息到 Store
  router.push('/farmer/purchases/quotemodify'); // 跳转到修改页面
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  justify-content: flex-start;
  gap: 10px; /* 输入框之间的间距 */
}
</style>