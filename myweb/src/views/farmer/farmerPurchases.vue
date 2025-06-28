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
      <el-button type="primary" @click="performSearch">确认搜索</el-button> <!-- 确认搜索按钮 -->
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
import { ref, computed } from 'vue';
import { useQuoteStore } from '../../stores/quote'; // 导入报价 Store
import { useRouter } from 'vue-router';

const searchProduct = ref('');
const searchaddress = ref('');
const searchQuantity = ref(null);
const filterOption = ref('all'); // 选择筛选的状态
const router = useRouter();
const quoteStore = useQuoteStore(); // 使用报价 Store

// 模拟的采购需求数据
const tableData = ref([
  { id: 1, product: '白米', quantity: 100, buyer: 'A老板', address: '北京', updateTime: '1小时前' },
  { id: 2, product: '西瓜', quantity: 200, buyer: '老王', address: '河北', updateTime: '3小时前' },
  { id: 3, product: '红薯', quantity: 50, buyer: '孙经理', address: '广东', updateTime: '1天前' },
]);

// 模拟已报价的记录ID
const quotedIds = ref([1, 3]); // 假设农户已在这两个记录中报价

// 用于存储过滤后的表格数据
const filteredTableData = ref(tableData.value); // 初始化为全部

// 确认搜索的处理函数
const performSearch = () => {
  filteredTableData.value = tableData.value.filter(item => {
    const matchesProduct = item.product.includes(searchProduct.value);
    const matchesaddress = item.address.includes(searchaddress.value);
    const matchesQuantity = searchQuantity.value ? item.quantity >= searchQuantity.value : true;
    const matchesFilterOption =
        filterOption.value === 'all' ||
        (filterOption.value === 'quoted' && quotedIds.value.includes(item.id)) ||
        (filterOption.value === 'notQuoted' && !quotedIds.value.includes(item.id));

    return matchesProduct && matchesaddress && matchesQuantity && matchesFilterOption;
  });
};

// 判断是否已报价
const isQuoted = (row) => {
  return quotedIds.value.includes(row.id);
};

// 跳转到报价页面
const handleQuote = (row) => {
  quoteStore.currentQuote = row; // 保存当前行的表格信息到 Store
  router.push('/farmer/purchases/quote'); // 跳转到报价页面
};

// 跳转到修改页面
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