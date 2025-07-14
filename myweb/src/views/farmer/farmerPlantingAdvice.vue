<template>
  <div>
    <h1>种植建议</h1>
    <p>表格列出上一年该地区所有订单的产品总数和均价 + 点击产品可以查看近几年的总数和均价趋势图</p>
    <div class="container">
      <div class="chart-container">
        <canvas ref="pieChartRef"></canvas>
      </div>

      <div class="table-container">
        <el-table :data="currentPageData" style="width: 100%">
          <el-table-column prop="name" label="产品种类" />
          <el-table-column prop="total" label="年平均总数(kg/年)" sortable :formatter="formatAverageTotal" />
          <el-table-column prop="averagePrice" label="平均单价(元/kg)" sortable :formatter="formatAveragePrice" />
        </el-table>

        <!-- 添加分页组件 -->
        <el-pagination
            @current-change="handlePageChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="sortedProductSummary.length"
            layout="total, prev, pager, next, jumper"
            style="display: flex; justify-content: center; margin-top: 20px;"
        />
      </div>
    </div>

    <br>
    <!-- 下拉选择 -->
    <div class="select-container">
      <label for="productSelect">选择产品：</label>
      <el-select
          v-model="selectedProduct"
          @change="updateTrendChart"
          placeholder="请选择产品"
          clearable
          filterable
          :style="{ width: '200px' }"
      >
        <el-option
            v-for="product in sortedProductSummary"
            :key="product.name"
            :label="product.name"
            :value="product.name"
        />
      </el-select>
    </div>

    <!-- 显示趋势图 -->
    <div class="trend-chart-container">
      <canvas ref="trendChartRef"></canvas>
      <div v-if="!selectedProduct" class="trend-placeholder">
        请选择产品查看趋势图
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { ElSelect, ElOption, ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { useUserStore } from '../../stores/user';
const userStore = useUserStore();

Chart.register(...registerables);

// 模拟的订单数据结构
const orders = [
  { order_id: 1, product_name: '黄豆', quantity: 80, price: 20, created_at: '2024-11-05', status: 'completed' },
  { order_id: 2, product_name: '黄豆', quantity: 60, price: 19, created_at: '2023-11-05', status: 'completed' },
  { order_id: 3, product_name: '黄豆', quantity: 100, price: 22, created_at: '2022-11-05', status: 'completed' },
  { order_id: 4, product_name: '番茄', quantity: 50, price: 15, created_at: '2024-10-01', status: 'completed' },
  { order_id: 5, product_name: '番茄', quantity: 30, price: 12, created_at: '2023-10-01', status: 'pending_shipment' },
  { order_id: 6, product_name: '番茄', quantity: 40, price: 14, created_at: '2022-10-01', status: 'completed' },
  { order_id: 7, product_name: '青椒', quantity: 30, price: 10, created_at: '2024-09-15', status: 'completed' },
  { order_id: 8, product_name: '青椒', quantity: 15, price: 8, created_at: '2023-09-15', status: 'shipped' },
  { order_id: 9, product_name: '青椒', quantity: 25, price: 11, created_at: '2022-09-15', status: 'completed' },
  { order_id: 10, product_name: '胡萝卜', quantity: 20, price: 5, created_at: '2024-08-20', status: 'shipped' },
  { order_id: 11, product_name: '胡萝卜', quantity: 15, price: 6, created_at: '2023-08-20', status: 'completed' },
  { order_id: 12, product_name: '黄豆', quantity: 120, price: 25, created_at: '2022-08-20', status: 'after_sale_resolved' },
  { order_id: 1, product_name: '黄豆2', quantity: 80, price: 20, created_at: '2024-11-05', status: 'completed' },
  { order_id: 2, product_name: '黄豆2', quantity: 60, price: 19, created_at: '2023-11-05', status: 'completed' },
  { order_id: 3, product_name: '黄豆2', quantity: 100, price: 22, created_at: '2022-11-05', status: 'completed' },
  { order_id: 4, product_name: '番茄2', quantity: 50, price: 15, created_at: '2024-10-01', status: 'completed' },
  { order_id: 5, product_name: '番茄2', quantity: 30, price: 12, created_at: '2023-10-01', status: 'pending_shipment' },
  { order_id: 6, product_name: '番茄2', quantity: 40, price: 14, created_at: '2022-10-01', status: 'completed' },
  { order_id: 7, product_name: '青椒2', quantity: 30, price: 10, created_at: '2024-09-15', status: 'completed' },
  { order_id: 8, product_name: '青椒2', quantity: 15, price: 8, created_at: '2023-09-15', status: 'shipped' },
  { order_id: 9, product_name: '青椒2', quantity: 25, price: 11, created_at: '2022-09-15', status: 'completed' },
  { order_id: 10, product_name: '胡萝卜2', quantity: 20, price: 5, created_at: '2024-08-20', status: 'shipped' },
  { order_id: 11, product_name: '胡萝卜2', quantity: 15, price: 6, created_at: '2023-08-20', status: 'completed' },
  { order_id: 12, product_name: '黄豆2', quantity: 120, price: 25, created_at: '2022-08-20', status: 'after_sale_resolved' },

];

// 定义图表引用
const pieChartRef = ref(null);
const trendChartRef = ref(null);

// 计算每种产品的总结
const productSummary = ref([]);
const sortedProductSummary = ref([]);
const selectedProduct = ref('');
const trendData = ref({ labels: [], quantities: [], prices: [] });

// 趋势图实例
let trendChartInstance = null;

// 排序状态
const sorting = ref({
  field: 'total', // 默认排序字段
  order: 'desc' // 默认排序顺序
});

// 添加分页相关变量
const currentPage = ref(1);
const pageSize = ref(6); // 每页显示记录的数量

// 计算当前页显示的数据
const currentPageData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return sortedProductSummary.value.slice(startIndex, endIndex);
});

// 处理页码变化事件
const handlePageChange = (page) => {
  currentPage.value = page;
};

// 计算总数和平均价格
const calculateTotal = () => {
  const summaryMap = {};
  productSummary.value = []; // 清空数组避免重复添加

  const startDate = new Date('2022-01-01');
  const endDate = new Date('2024-12-31');

  orders.forEach(order => {
    const orderDate = new Date(order.created_at);

    // 只考虑在设定日期范围内的已完成订单
    if (order.status === 'completed' && orderDate >= startDate && orderDate <= endDate) {
      const productName = order.product_name;
      if (summaryMap[productName]) {
        summaryMap[productName].quantity += order.quantity;
        summaryMap[productName].totalPrice += order.quantity * order.price;
      } else {
        summaryMap[productName] = {
          name: productName,
          quantity: order.quantity,
          totalPrice: order.quantity * order.price,
        };
      }
    }
  });

  // 计算产品的总数和均价
  for (const key in summaryMap) {
    const totalQuantity = summaryMap[key].quantity;
    const averagePrice = summaryMap[key].totalPrice / totalQuantity;

    productSummary.value.push({
      name: summaryMap[key].name,
      total: totalQuantity / 3, // 计算年平均总数
      averagePrice: averagePrice // 计算平均单价
    });
  }

  // 初始排序
  sort('total');
};

// 排序函数
const sort = (field) => {
  if (sorting.value.field === field) {
    sorting.value.order = sorting.value.order === 'asc' ? 'desc' : 'asc'; // 切换顺序
  } else {
    sorting.value.field = field; // 切换字段
    sorting.value.order = 'desc'; // 默认降序
  }

  sortedProductSummary.value = [...productSummary.value].sort((a, b) => {
    if (sorting.value.order === 'asc') {
      return a[field] - b[field];
    } else {
      return b[field] - a[field];
    }
  });
};

// 生成 HSL 颜色函数
const generateHSLColor = (index) => {
  const hue = (index * 30) % 360; // 色相，每个颜色间隔30度
  const saturation = '70%'; // 饱和度
  const lightness = '50%'; // 亮度
  return `hsl(${hue}, ${saturation}, ${lightness})`;
};

const renderChart = () => {
  if (!pieChartRef.value) return;

  const ctx = pieChartRef.value.getContext('2d');
  const labels = sortedProductSummary.value.map(item => item.name);
  const data = sortedProductSummary.value.map(item => item.total.toFixed(2)); // 保留两位小数作为字符串
  const colors = sortedProductSummary.value.map((_, index) => generateHSLColor(index));

  const pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false, // 取消显示图例
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const value = tooltipItem.raw; // 获取值
              return `${tooltipItem.label}: ${parseFloat(value).toFixed(2)} kg`; // 自定义提示信息并格式化为两位小数
            }
          }
        },
        title: {
          display: true,
          text: '年平均产品售出总数扇形图'
        }
      }
    }
  });
};

// 显示趋势图
const updateTrendChart = () => {
  // 如果选择了"空"选项，清除趋势图
  if (!selectedProduct.value) {
    clearTrendChart();
    return;
  }

  const productOrders = orders.filter(order => order.product_name === selectedProduct.value);

  // 清空之前的数据
  trendData.value.labels = [];
  trendData.value.quantities = [];
  trendData.value.prices = [];

  const yearlyData = {};

  productOrders.forEach(order => {
    const year = new Date(order.created_at).getFullYear();
    if (!yearlyData[year]) {
      yearlyData[year] = { totalQuantity: 0, totalPrice: 0, count: 0 };
    }

    yearlyData[year].totalQuantity += order.quantity;
    yearlyData[year].totalPrice += order.quantity * order.price;
    yearlyData[year].count += order.quantity;
  });

  for (const year in yearlyData) {
    trendData.value.labels.push(year);
    trendData.value.quantities.push(yearlyData[year].totalQuantity);
    trendData.value.prices.push((yearlyData[year].totalPrice / yearlyData[year].count).toFixed(2));
  }

  renderTrendChart();
};

// 新增清除趋势图的方法
const clearTrendChart = () => {
  trendData.value = { labels: [], quantities: [], prices: [] };

  if (trendChartInstance) {
    trendChartInstance.destroy();
    trendChartInstance = null;
  }
};

const renderTrendChart = () => {
  if (!trendChartRef.value) return;

  const ctx = trendChartRef.value.getContext('2d');

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (trendChartInstance) {
    trendChartInstance.destroy();
  }

  trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: trendData.value.labels,
      datasets: [
        {
          label: '总量 (kg)',
          data: trendData.value.quantities,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
        {
          label: '平均单价 (元/kg)',
          data: trendData.value.prices,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: true,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: selectedProduct.value ? `${selectedProduct.value} 产品趋势图` : '产品趋势图'
        },
        tooltip: {
          mode: 'index'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

// 格式化年平均总数为两位小数
const formatAverageTotal = (row, column, cellValue) => {
  return cellValue ? cellValue.toFixed(2) : '0.00';
};

// 格式化平均单价为两位小数
const formatAveragePrice = (row, column, cellValue) => {
  return cellValue ? cellValue.toFixed(2) : '0.00';
};

const fetchData = async () => {
  const token = userStore.token; // 从用户存储中获取 token
  try {
    const response = await axios.get('http://localhost:3000/api/orders/province', {
      headers: {
        'Authorization': `Bearer ${token}` // 设置 Authorization 头
      }
    });
    orders.value = response.data || []; // 假设 API 返回的数据就是我们需要的格式
  } catch (error) {
    console.error('获取农户地区订单数据失败，使用模拟数据', error);
    // tableData.value = simulatedTableData; // 使用模拟数据
  }
};

onMounted(() => {
  fetchData();
  calculateTotal();
  sort('total'); // 默认按照总数降序排列
  renderChart();
});
</script>

<style scoped>
.container {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  justify-content: space-between;
  margin-top: 20px;
}

.select-container {
  margin-bottom: 20px;
}

.chart-container {
  flex: 1;
  padding: 20px;
}

.table-container {
  flex: 1;
  padding: 20px;
  overflow-x: auto;
  border-left: 1px solid #ccc;
}

.trend-chart-container {
  position: relative;
  width: 80%;
  height: 80%;
  margin: 20px auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
  cursor: pointer;
}

th {
  background-color: #f4f4f4;
}

/* 新增趋势图占位符样式 */
.trend-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  color: #888;
  font-style: italic;
  background-color: #f9f9f9;
  border: 1px dashed #ddd;
}
</style>