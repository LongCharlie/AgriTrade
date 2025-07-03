<template>
  <div>
    <h1>我的订单</h1>
    <h1>总收入: ¥ {{ totalRevenue }}</h1>

    <div class="search-bar">
      <el-input
          v-model="searchId"
          placeholder="搜索编号"
          style="width: 200px; margin-bottom: 20px;"
      ></el-input>
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
      <!-- 年、月、日筛选 -->
      <el-input
          v-model="filterYear"
          placeholder="年份"
          style="width: 120px; margin-bottom: 20px;"
      ></el-input>
      <el-input
          v-model="filterMonth"
          placeholder="月份"
          style="width: 120px; margin-bottom: 20px;"
      ></el-input>
      <el-input
          v-model="filterDay"
          placeholder="日期"
          style="width: 120px; margin-bottom: 20px;"
      ></el-input>

      <el-select v-model="filterOption" placeholder="选择筛选" style="width: 200px; margin-bottom: 20px;">
        <el-option label="全部" value="all"></el-option>
        <el-option label="待发货" value="pendingDelivery"></el-option>
        <el-option label="待确认" value="pendingConfirmation"></el-option>
        <el-option label="已完成" value="completed"></el-option>
        <el-option label="售后中" value="afterSaleRequested"></el-option>
        <el-option label="已售后" value="afterSaleResolved"></el-option>
      </el-select>

      <el-button type="primary" @click="performSearch">确认搜索</el-button> <!-- 确认搜索按钮 -->
    </div>

    <el-table :data="filteredTableData" style="width: 100%">
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="product" label="产品种类" />
      <el-table-column prop="quantity" label="数量(kg)" />
      <el-table-column prop="price" label="价格(元/kg)" />
      <el-table-column prop="address" label="收货地" />
      <el-table-column prop="buyer" label="采购方" />
      <el-table-column prop="contact" label="联系方式" />
      <el-table-column prop="updateTime" label="时间" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
              v-if="scope.row.status === '待发货'"
              @click="confirmDelivery(scope.row)"
              type="text">[确认发货]</el-button>
          <el-button v-else-if="scope.row.status === '待确认'" type="text" disabled>[无操作]</el-button>
          <el-button v-else-if="scope.row.status === '已完成'" type="text" disabled>[无操作]</el-button>
          <el-button v-else-if="scope.row.status === '售后中'"
                     @click="viewReason(scope.row)"
                     type="text">[查看原因]</el-button>
          <el-button v-else-if="scope.row.status === '已售后'"
                     @click="viewSuccessReason(scope.row)"
                     type="text">[查看理由]</el-button>
        </template>
      </el-table-column>
    </el-table>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const searchId = ref('');
const searchProduct = ref('');
const searchaddress = ref('');
const filterYear = ref('');
const filterMonth = ref('');
const filterDay = ref('');
const filterOption = ref('all'); // 选择筛选的状态
const router = useRouter();

// 模拟订单数据
const tableData = ref([
  { id: 1, product: '白米', quantity: 100, price: 15, address: '北京', buyer: 'A老板', contact: '123456789', updateTime: '2023-10-01', status: '待发货' },
  { id: 2, product: '西瓜', quantity: 200, price: 10, address: '河北', buyer: '老王', contact: '987654321', updateTime: '2023-10-02', status: '已完成' },
  { id: 3, product: '白米', quantity: 50, price: 8, address: '广东', buyer: '孙经理', contact: '135792468', updateTime: '2024-10-03', status: '已完成' },
  { id: 4, product: '玉米', quantity: 150, price: 12, address: '四川', buyer: '小李', contact: '159753864', updateTime: '2024-10-04', status: '售后中' },
  { id: 5, product: '黄豆', quantity: 80, price: 20, address: '江苏', buyer: '老张', contact: '246813579', updateTime: '2024-11-05', status: '已售后' },
  { id: 6, product: '白米', quantity: 100, price: 8, address: '广东', buyer: '孙经理', contact: '135792468', updateTime: '2024-11-03', status: '已完成' },
  { id: 7, product: '玉米', quantity: 150, price: 12, address: '四川', buyer: '小李', contact: '159753864', updateTime: '2024-11-04', status: '已完成' },
  { id: 8, product: '黄豆', quantity: 80, price: 20, address: '江苏', buyer: '老张', contact: '246813579', updateTime: '2024-11-05', status: '已完成' },
  { id: 9, product: '玉米', quantity: 150, price: 12, address: '四川', buyer: '小李', contact: '159753864', updateTime: '2024-11-04', status: '已完成' },
  { id: 10, product: '黄豆', quantity: 80, price: 20, address: '江苏', buyer: '老张', contact: '246813579', updateTime: '2024-11-05', status: '已完成' },
  { id: 11, product: '白米', quantity: 100, price: 15, address: '北京', buyer: 'A老板', contact: '123456789', updateTime: '2023-10-01', status: '待发货' },
  { id: 12, product: '西瓜', quantity: 200, price: 10, address: '河北', buyer: '老王', contact: '987654321', updateTime: '2023-10-02', status: '已完成' },
  { id: 13, product: '白米', quantity: 50, price: 8, address: '广东', buyer: '孙经理', contact: '135792468', updateTime: '2024-10-03', status: '已完成' },
  { id: 14, product: '玉米', quantity: 150, price: 12, address: '四川', buyer: '小李', contact: '159753864', updateTime: '2024-10-04', status: '售后中' },
  { id: 15, product: '黄豆', quantity: 80, price: 20, address: '江苏', buyer: '老张', contact: '246813579', updateTime: '2024-11-05', status: '已售后' },
  { id: 16, product: '白米', quantity: 100, price: 8, address: '广东', buyer: '孙经理', contact: '135792468', updateTime: '2024-11-03', status: '已完成' },
  ]);

// 计算总收入
const totalRevenue = computed(() => {
  return (filteredTableData.value || []).filter(order => order.status === '已完成') // 只计算已完成的订单
      .reduce((sum, order) => sum + (order.quantity * order.price), 0);
});

// 过滤表格数据
const filteredTableData = ref(tableData.value); // Initial state is the same as tableData

const performSearch = () => {
  filteredTableData.value = tableData.value.filter(item => {
    const matchesId = item.id.toString().includes(searchId.value);
    const matchesProduct = item.product.includes(searchProduct.value);
    const matchesaddress = item.address.includes(searchaddress.value);

    const matchesDate = (date) => {
      const [year, month, day] = date.split('-');
      return (!filterYear.value || year === filterYear.value) &&
          (!filterMonth.value || month === filterMonth.value) &&
          (!filterDay.value || day === filterDay.value);
    };

    const matchesUpdateTime = matchesDate(item.updateTime);

    const matchesFilterOption =
        filterOption.value === 'all' ||
        (filterOption.value === 'pendingDelivery' && item.status === '待发货') ||
        (filterOption.value === 'pendingConfirmation' && item.status === '待确认') ||
        (filterOption.value === 'completed' && item.status === '已完成') ||
        (filterOption.value === 'afterSaleRequested' && item.status === '售后中') ||
        (filterOption.value === 'afterSaleResolved' && item.status === '已售后');

    return matchesId && matchesProduct && matchesaddress && matchesUpdateTime && matchesFilterOption;
  });
};

// 操作处理函数
const confirmDelivery = (order) => {
  console.log('确认发货', order);
  // 这里可以处理确认发货逻辑
};

const viewReason = (order) => {
  console.log('查看原因', order);
  // 这里可以处理查看售后原因
};

const viewSuccessReason = (order) => {
  console.log('查看理由', order);
  // 这里可以处理查看同意售后理由
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