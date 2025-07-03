<template>
  <div>
    <h1>种植建议</h1>
    <p>表格列出上一年的总数和均价 + 点击产品可以查看近几年的总数和均价趋势图</p>
  </div>
  <div class="container">
    <div class="chart-container">
      <canvas ref="pieChart"></canvas>
    </div>

    <div class="table-container">
      <el-table :data="sortedProductSummary" style="width: 100%">
        <el-table-column prop="name" label="产品种类"></el-table-column>
        <el-table-column prop="total" label="总数(kg)" sortable></el-table-column>
        <el-table-column prop="averagePrice" label="平均单价(元/kg)" sortable :formatter="formatAveragePrice"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// 扩充后的数据结构 (产品种类, 数量, 单价)
const products = [
  { name: '番茄', quantity: 10, price: 3 },
  { name: '黄瓜', quantity: 15, price: 2 },
  { name: '西红柿', quantity: 25, price: 4 },
  { name: '番茄', quantity: 10, price: 6 },
  { name: '黄瓜', quantity: 15, price: 4 },
  { name: '西红柿', quantity: 25, price: 8 },
  { name: '胡萝卜', quantity: 10, price: 1 },
  { name: '生菜', quantity: 5, price: 2.5 },
  { name: '青椒', quantity: 20, price: 1.5 },
  { name: '南瓜', quantity: 12, price: 0.8 },
  { name: '香蕉', quantity: 18, price: 2 },
  { name: '苹果', quantity: 30, price: 1 },
  { name: '梨', quantity: 22, price: 2.2 },
  { name: '白菜', quantity: 100, price: 0.5 },
];

// 计算每种产品的总结
const productSummary = ref([]);
const sortedProductSummary = ref([]);

// 排序状态
const sorting = ref({
  field: 'total', // 默认排序字段
  order: 'desc' // 默认排序顺序
});

// 计算总数和平均价格
const calculateTotal = () => {
  const summaryMap = {};

  products.forEach(product => {
    if (summaryMap[product.name]) {
      summaryMap[product.name].quantity += product.quantity;
      summaryMap[product.name].totalPrice += product.quantity * product.price;
    } else {
      summaryMap[product.name] = {
        name: product.name,
        quantity: product.quantity,
        totalPrice: product.quantity * product.price,
      };
    }
  });

  for (const key in summaryMap) {
    const totalQuantity = summaryMap[key].quantity;
    const averagePrice = summaryMap[key].totalPrice / totalQuantity;

    productSummary.value.push({
      name: summaryMap[key].name,
      total: totalQuantity,
      averagePrice: averagePrice // 计算平均单价
    });
  }

  // 初始排序，使用已计算好的 productSummary 直接排序
  sort('total'); // 默认按总数排序
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
  const ctx = document.querySelector('canvas').getContext('2d');
  const labels = sortedProductSummary.value.map(item => item.name);
  const data = sortedProductSummary.value.map(item => item.total);
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
          position: 'top',
        },
        title: {
          display: true,
          text: '种植建议扇形图'
        }
      }
    }
  });
};

// 格式化平均单价为两位小数
const formatAveragePrice = (row, column, cellValue) => {
  return cellValue ? cellValue.toFixed(2) : '0.00';
};

onMounted(() => {
  calculateTotal();
  // 默认按照总数降序排列
  sort('total'); // 确保在加载时按照总数降序排列
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

.sort-icon {
  margin-left: 5px;
  font-size: 0.8em;
  color: #ccc; /* 默认颜色 */
}

.sort-icon.active {
  color: #ff6600; /* 高亮颜色 - 可以根据需求定制 */
}
</style>