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
      <el-button type="primary" @click="performSearch">确认搜索</el-button>
    </div>
    <div class="table-container">
      <el-table :data="paginatedData" style="width: 100%">
        <el-table-column prop="product_name" label="产品种类" />
        <el-table-column prop="quantity" label="采购量(kg)" />
        <el-table-column prop="buyerName" label="采购方" />
        <el-table-column prop="address" label="收货地" />
        <el-table-column prop="updated_at" label="更新时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="handleQuote(scope.row)" type="text" v-if="!isQuoted(scope.row)">[去报价]</el-button>
            <el-button @click="handleModify(scope.row)" type="text" v-else>[修改]</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filteredTableData.length"
          layout="total, prev, pager, next, jumper"
          style=" display: flex;
                justify-content: center;
                margin-top: 20px;"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useDemandStore } from '../../stores/demand';
import { useQuoteStore } from '../../stores/quote';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user'; // 假设在这里获取用户信息

const searchProduct = ref('');
const searchaddress = ref('');
const searchQuantity = ref(null);
const filterOption = ref('all'); // 选择筛选的状态
const router = useRouter();
const demandStore = useDemandStore();
const quoteStore = useQuoteStore();
const userStore = useUserStore();

// 用于存储采购需求数据和已报价数据
const motableData = ref([]);
const moquotedIds = ref([]);
const filteredTableData = ref([]);
const pageSize = ref(5); // 每页显示的项目数
const currentPage = ref(1); // 当前页码

// 模拟数据
const simulatedMotableData = [
  { demand_id: 21, product_name: '番茄', quantity: 100, buyerName: 'A老板', buyer_id: 7, address: '北京市', updated_at: '2025-07-01 12:30:45.123' },
  { demand_id: 22, product_name: '黄瓜', quantity: 200, buyerName: '老王', buyer_id: 7, address: '河北省', updated_at: '2025-06-02 12:30:45.123' },
  { demand_id: 23, product_name: '萝卜', quantity: 50, buyerName: '孙经理', buyer_id: 7, address: '广东省', updated_at: '202-07-02 12:30:45.123' },
];

const simulatedMoquotedIds = [
  { application_id: 1, demand_id: 21, record_id: 56, quantity: 70, price: 15, province: '河北省' },
  { application_id: 2, demand_id: 23, record_id: 57, quantity: 45, price: 20, province: '陕西省' },
];

const fetchData = async () => {
  const token = userStore.token; // 从用户存储中获取 token
  try {
    const productResponse = await axios.get('http://localhost:3000/api/demands/all', {
      headers: {
        'Authorization': `Bearer ${token}` // 设置 Authorization 头
      }
    });
    motableData.value = productResponse.data; // 假设 API 返回的数据就是我们需要的格式
    console.log('采购需求' + motableData.value);
  } catch (error) {
    console.error('获取采购需求数据失败，使用模拟数据', error);
    motableData.value = simulatedMotableData; // 使用模拟数据
  }

  try {
    const quotedResponse = await axios.get('http://localhost:3000/api/quotes', {
      headers: {
        'Authorization': `Bearer ${token}` // 设置 Authorization 头
      }
    });
    console.log('成功获取已报价数据');
    moquotedIds.value = quotedResponse.data; // 假设 API 返回的数据就是我们需要的格式
  } catch (error) {
    console.error('获取已报价数据失败，使用模拟数据', error);
    moquotedIds.value = simulatedMoquotedIds; // 使用模拟数据
  }

  // 初始化过滤后的数据
  filteredTableData.value = motableData.value;
};

// 确认搜索的处理函数
const performSearch = () => {
  filteredTableData.value = motableData.value.filter(item => {
    const matchesProduct = item.product_name.includes(searchProduct.value);
    const matchesaddress = item.address.includes(searchaddress.value);
    const matchesQuantity = searchQuantity.value ? item.quantity >= searchQuantity.value : true;
    const matchesFilterOption =
        filterOption.value === 'all' ||
        (filterOption.value === 'quoted' && moquotedIds.value.some(quoted => quoted.demand_id === item.demand_id)) ||
        (filterOption.value === 'notQuoted' && !moquotedIds.value.some(quoted => quoted.demand_id === item.demand_id));

    return matchesProduct && matchesaddress && matchesQuantity && matchesFilterOption;
  });
  currentPage.value = 1; // 重置为第一页
};

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredTableData.value.slice(start, end);
});

// 分页处理
const handlePageChange = (page) => {
  currentPage.value = page; // 更新当前页
};

// 判断是否已报价
const isQuoted = (row) => {
  return moquotedIds.value.some(quoted => quoted.demand_id === row.demand_id);
};

// 跳转到报价页面
const handleQuote = (row) => {
  demandStore.currentDemand = row; // 保存当前行的表格信息到 Store
  router.push('/farmer/purchases/quote'); // 跳转到报价页面
};

// 跳转到修改页面
const handleModify = (row) => {
  demandStore.currentDemand = row; // 保存当前行的表格信息到 Store
  // 查找对应的报价信息
  const currentQuote = moquotedIds.value.find(quoted => quoted.demand_id === row.demand_id);
  if (currentQuote) {
    quoteStore.currentQuote = currentQuote;
  } else {
    quoteStore.currentQuote = null;
  }
  router.push('/farmer/purchases/quotemodify'); // 跳转到修改页面
};

// 组件挂载后获取数据
onMounted(fetchData);
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