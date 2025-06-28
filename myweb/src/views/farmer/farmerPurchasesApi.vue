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
          v-model.number="searchQuantity"
          placeholder="采购量大于(kg)"
          style="width: 200px; margin-bottom: 20px;"
          type="number"
      ></el-input>
      <el-button type="primary" @click="sortByQuantity">按数量升序</el-button>
      <el-input
          v-model="searchaddress"
          placeholder="搜索收货地"
          style="width: 200px; margin-bottom: 20px;"
      ></el-input>
      <el-select v-model="filterOption" placeholder="选择筛选" style="width: 200px; margin-bottom: 20px;">
        <el-option label="全部" value="all"></el-option>
        <el-option label="已报价" value="quoted"></el-option>
        <el-option label="未报价" value="notQuoted"></el-option>
      </el-select>
    </div>

    <el-table :data="filteredTableData" style="width: 100%">
      <el-table-column prop="product" label="产品种类" />
      <el-table-column prop="quantity" label="采购量(kg)" />
      <el-table-column prop="buyer" label="采购方" />
      <el-table-column prop="address" label="收货地" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="handleQuote(scope.row)" type="text" v-if="!isQuoted(scope.row)">[去报价]</el-button>
          <el-button @click="handleModify(scope.row)" type="text" v-else>[修改]</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuoteStore } from '../../stores/quote'; // 导入报价 Store
import { useRouter } from 'vue-router';
import axios from 'axios'; // 导入 axios
import { useUserStore } from '../../stores/user'; // 用户 Store

const searchProduct = ref('');
const searchaddress = ref('');
const searchQuantity = ref(null);
const filterOption = ref('all'); // 选择筛选的状态
const router = useRouter();
const quoteStore = useQuoteStore(); // 使用报价 Store
const userStore = useUserStore(); // 使用用户 Store

// 采购需求数据
const tableData = ref([]); // 采购数据

// 已报价的记录ID
const quotedIds = ref([]); // 存储已报价记录的 ID

// 获取当前用户 ID
const userId = userStore.currentUserId; // 假设存储用户信息的 Store

// 在组件挂载时获取数据
onMounted(async () => {
  try {
    // 获取采购需求数据
    const purchasesResponse = await axios.get('http://localhost:3000/api/purchases-all');
    tableData.value = purchasesResponse.data; // 假设返回的数据是数组

    // 获取已报价记录的 ID
    const quotedResponse = await axios.get(`http://localhost:3000/api/quotedIds?userId=${userId}`);
    quotedIds.value = quotedResponse.data; // 假设返回的数据是数组
  } catch (error) {
    console.error('获取数据失败:', error);
  }
});

// 过滤表格数据
const filteredTableData = computed(() => {
  return tableData.value.filter(item => {
    const matchesProduct = item.product.includes(searchProduct.value);
    const matchesaddress = item.address.includes(searchaddress.value);
    const matchesQuantity = searchQuantity.value ? item.quantity >= searchQuantity.value : true;
    const matchesFilterOption =
        filterOption.value === 'all' ||
        (filterOption.value === 'quoted' && quotedIds.value.includes(item.id)) ||
        (filterOption.value === 'notQuoted' && !quotedIds.value.includes(item.id));

    return matchesProduct && matchesaddress && matchesQuantity && matchesFilterOption;
  });
});

// 判断是否已报价
const isQuoted = (row) => {
  return quotedIds.value.includes(row.id);
};

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