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
          placeholder="搜索采购量(数量)"
          style="width: 200px; margin-bottom: 20px;"
          type="number"
      ></el-input>
      <el-button type="primary" @click="sortByQuantity">按数量升序</el-button>
    </div>

    <el-table :data="filteredTableData" style="width: 100%">
      <el-table-column prop="product" label="产品种类" />
      <el-table-column prop="quantity" label="采购量" />
      <el-table-column prop="buyer" label="采购方" />
      <el-table-column prop="address" label="收货地" />
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
import { ref, computed } from 'vue';

const searchProduct = ref('');
const searchStorage = ref('');
const searchaddress = ref('');
const searchQuantity = ref(null);

const tableData = ref([
  { product: '白米', quantity: 100, buyer: 'A老板', address:'北京', updateTime: '1小时前' },
  { product: '西瓜', quantity: 200,  buyer: '老王', address:'河北', updateTime: '3小时前' },
  { product: '红薯', quantity: 50, buyer: '孙经理', address:'广东',updateTime: '1天前' },
]);

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

const handleReport = (row) => {
  console.log('报价:', row);
};

const handleModify = (row) => {
  console.log('修改:', row);
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