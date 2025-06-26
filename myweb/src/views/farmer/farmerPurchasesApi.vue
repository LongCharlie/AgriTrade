<template>
  <div>
    <h1>采购大厅</h1>
    <div class="search-bar">
      <el-input
          v-model="searchProduct"
          placeholder="搜索产品种类"
          style="width: 200px; margin-bottom: 20px;"
      />
      <el-input
          v-model="searchStorage"
          placeholder="搜索收货地"
          style="width: 200px; margin-bottom: 20px;"
      />
      <el-input
          v-model="searchAddress"
          placeholder="搜索采购地"
          style="width: 200px; margin-bottom: 20px;"
      />
      <el-input
          v-model.number="searchQuantity"
          placeholder="搜索采购量(数量)"
          style="width: 200px; margin-bottom: 20px;"
          type="number"
      />
      <el-button type="primary" @click="sortByQuantity">按数量升序</el-button>
    </div>

    <el-table :data="filteredTableData" style="width: 100%">
      <el-table-column prop="product" label="产品种类" />
      <el-table-column prop="quantity" label="采购量" />
      <el-table-column prop="storage" label="收货地" />
      <el-table-column prop="buyer" label="采购方" />
      <el-table-column prop="address" label="采购地" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="handleReport(scope.row)" type="text">[去报价]</el-button>
          <el-button @click="handleModify(scope.row)" type="text">[修改]</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios'; // 导入 axios

const searchProduct = ref('');
const searchStorage = ref('');
const searchAddress = ref('');
const searchQuantity = ref(null);
const tableData = ref([]); // 用于存储从 API 获取的数据

// 获取数据的函数
const fetchData = async () => {
  try {
    const response = await axios.get('/api/purchases'); // 请求后端接口
    tableData.value = response.data; // 将返回的数据保存在响应式变量中
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

// 在组件挂载时调用 fetchData
onMounted(() => {
  fetchData();
});

const filteredTableData = computed(() => {
  return tableData.value.filter(item => {
    const matchesProduct = item.product.includes(searchProduct.value);
    const matchesStorage = item.storage.includes(searchStorage.value);
    const matchesAddress = item.address.includes(searchAddress.value);
    const matchesQuantity = searchQuantity.value ? item.quantity >= searchQuantity.value : true;

    return matchesProduct && matchesStorage && matchesAddress && matchesQuantity;
  });
});

// 按数量排序的函数
const sortByQuantity = () => {
  tableData.value.sort((a, b) => a.quantity - b.quantity);
};

const handleReport = (row) => {
  console.log('报价:', row);
};

const handleModify = (row) => {
  console.log('修改:', row);
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  justify-content: flex-start;
  gap: 10px; /* 输入框之间的间距 */
}
</style>