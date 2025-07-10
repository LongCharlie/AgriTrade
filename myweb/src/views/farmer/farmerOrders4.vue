<template>
  <div>
    <h1>我的订单</h1>
    <h1>总收入: ¥ {{ totalRevenue }}</h1>

    <div class="search-bar">
      <el-input v-model="searchId" placeholder="搜索编号" style="width: 200px; margin-bottom: 20px;"></el-input>
      <el-input v-model="searchProduct" placeholder="搜索产品种类" style="width: 200px; margin-bottom: 20px;"></el-input>
      <el-input v-model="searchAddress" placeholder="搜索收货地" style="width: 200px; margin-bottom: 20px;"></el-input>
      <el-input v-model="filterYear" placeholder="年份" style="width: 120px; margin-bottom: 20px;"></el-input>
      <el-input v-model="filterMonth" placeholder="月份" style="width: 120px; margin-bottom: 20px;"></el-input>
      <el-input v-model="filterDay" placeholder="日期" style="width: 120px; margin-bottom: 20px;"></el-input>
      <el-select v-model="filterOption" placeholder="选择筛选" style="width: 200px; margin-bottom: 20px;">
        <el-option label="全部" value="all"></el-option>
        <el-option label="待发货" value="pending_shipment"></el-option>
        <el-option label="已发货" value="shipped"></el-option>
        <el-option label="已完成" value="completed"></el-option>
        <el-option label="售后中" value="after_sale_requested"></el-option>
        <el-option label="已售后" value="after_sale_resolved"></el-option>
      </el-select>

      <el-button type="primary" @click="performSearch">确认搜索</el-button>
    </div>

    <el-table :data="paginatedData" style="width: 100%">
      <el-table-column prop="order_id" label="编号"></el-table-column>
      <el-table-column prop="product_name" label="产品种类"></el-table-column>
      <el-table-column prop="quantity" label="数量(kg)"></el-table-column>
      <el-table-column prop="price" label="价格(元/kg)"></el-table-column>
      <el-table-column prop="delivery_location" label="收货地"></el-table-column>
      <el-table-column prop="buyer_name" label="采购方"></el-table-column>
      <el-table-column prop="phone" label="联系方式"></el-table-column>
      <el-table-column prop="created_at" label="时间"></el-table-column>
      <el-table-column prop="formatted_status" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button v-if="scope.row.status === 'pending_shipment'" @click="confirmDelivery(scope.row)" type="text">[确认发货]</el-button>
          <el-button v-else-if="scope.row.status === 'shipped'" type="text" disabled>[无操作]</el-button>
          <el-button v-else-if="scope.row.status === 'completed'" type="text" disabled>[无操作]</el-button>
          <el-button v-else-if="scope.row.status === 'after_sale_requested'" @click="viewReason(scope.row)" type="text">[查看原因]</el-button>
          <el-button v-else-if="scope.row.status === 'after_sale_resolved'" @click="viewSuccessReason(scope.row)" type="text">[查看理由]</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="filteredTableData.length"
        layout="total, prev, pager, next, jumper"
        style=" display: flex; justify-content: center; margin-top: 20px;"
    ></el-pagination>

    <!-- 物流信息弹窗 -->
    <el-dialog v-model="dialogVisible" title="确认发货">
      <el-input
          type="textarea"
          v-model="logisticsInfo"
          placeholder="描述物流信息，如运输工具和方式等相关信息"
          class="logistics-input"
          :rows="4"
      ></el-input>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitDelivery">确认发货</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 退货原因弹窗 -->
    <el-dialog v-model="reasonDialogVisible" title="售后原因">
      <div>{{ reason }}</div>
    </el-dialog>

    <!-- 售后通过理由弹窗 -->
    <el-dialog v-model="successReasonDialogVisible" title="售后通过理由">
      <div>
        <p>售后原因: {{ reason }}</p>
        <p>通过理由: {{ successReason }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '../../stores/user';
const userStore = useUserStore();

const statusMap = {
  pending_shipment: '待发货',
  shipped: '已发货',
  completed: '已完成',
  after_sale_requested: '售后中',
  after_sale_resolved: '已售后',
};

const searchId = ref('');
const searchProduct = ref('');
const searchAddress = ref('');
const filterYear = ref('');
const filterMonth = ref('');
const filterDay = ref('');
const filterOption = ref('all');
const dialogVisible = ref(false);
const logisticsInfo = ref('');
const reasonDialogVisible = ref(false);
const successReasonDialogVisible = ref(false);
const reason = ref('');
const successReason = ref('');
const currentOrder = ref(null); // 新增，用于存储当前确认发货的订单

const pageSize = ref(5);
const currentPage = ref(1);

// 模拟订单数据
const simulatedTableData = [
  { order_id: 1, product_name: '白米', quantity: 100, price: 15, delivery_location: '北京', buyer_id: '1', buyer_name: 'A老板', phone: '123456789', created_at: '2023-10-01', status: 'pending_shipment' },
  { order_id: 2, product_name: '西瓜', quantity: 200, price: 10, delivery_location: '河北', buyer_id: '2', buyer_name: '老王', phone: '987654321', created_at: '2023-10-02', status: 'completed' },
  { order_id: 3, product_name: '白米', quantity: 50, price: 8, delivery_location: '广东', buyer_id: '3', buyer_name: '孙经理', phone: '135792468', created_at: '2024-10-03', status: 'shipped' },
  { order_id: 4, product_name: '玉米', quantity: 150, price: 12, delivery_location: '四川', buyer_id: '4', buyer_name: '小李', phone: '159753864', created_at: '2024-10-04', status: 'after_sale_requested', after_sale_reason: '玉米变质（附图）' },
  { order_id: 5, product_name: '黄豆', quantity: 80, price: 20, delivery_location: '江苏', buyer_id: '5', buyer_name: '老张', phone: '246813579', created_at: '2024-11-05', status: 'after_sale_resolved', after_sale_reason: '变质（附图）', reason: '同意' },
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

// 处理分页
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredTableData.value.slice(start, end).map(order => ({
    ...order,
    formatted_status: statusMap[order.status] || order.status // 添加格式化状态
  }));
});

// 搜索功能
const performSearch = () => {
  filteredTableData.value = tableData.value.filter(item => {
    const matchesId = item.order_id.toString().includes(searchId.value);
    const matchesProduct = item.product_name.includes(searchProduct.value);
    const matchesAddress = item.delivery_location.includes(searchAddress.value);

    const matchesDate = (date) => {
      const [year, month, day] = date.split('-');
      return (!filterYear.value || year === filterYear.value) &&
          (!filterMonth.value || month === filterMonth.value) &&
          (!filterDay.value || day === filterDay.value);
    };

    const matchesUpdateTime = matchesDate(item.created_at);

    const matchesFilterOption =
        filterOption.value === 'all' ||
        (filterOption.value === 'pending_shipment' && item.status === 'pending_shipment') ||
        (filterOption.value === 'shipped' && item.status === 'shipped') ||
        (filterOption.value === 'completed' && item.status === 'completed') ||
        (filterOption.value === 'after_sale_requested' && item.status === 'after_sale_requested') ||
        (filterOption.value === 'after_sale_resolved' && item.status === 'after_sale_resolved');

    return matchesId && matchesProduct && matchesAddress && matchesUpdateTime && matchesFilterOption;
  });
  currentPage.value = 1; // 重置为第1页
};

// 分页处理
const handlePageChange = (page) => {
  currentPage.value = page;
};

// 操作处理函数
const confirmDelivery = (order) => {
  currentOrder.value = order; // 保存当前订单
  dialogVisible.value = true; // 显示对话框
};

const submitDelivery = async () => {
  const token = userStore.token; // 获取 token
  const orderId = currentOrder.value.order_id; // 获取订单 ID

  try {
    // 调用接口1: 更新订单状态为 shipped
    await axios.post(`http://localhost:3000/api/orders/${orderId}/status`, {
      status: 'shipped'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // 调用接口2: 上传物流信息
    await axios.post('http://localhost:3000/api/orders/${orderId}/logistics', {
      logisticsInfo: logisticsInfo.value
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // 更新本地订单状态
    currentOrder.value.status = 'shipped';
    dialogVisible.value = false; // 关闭对话框
    logisticsInfo.value = ''; // 清空物流信息输入框
    console.log('发货成功');
  } catch (error) {
    console.error('发货失败', error);
    alert('发货失败，请重试');
  }
};

const viewReason = (order) => {
  console.log('查看原因', order);
  reason.value = order.after_sale_reason;
  reasonDialogVisible.value = true;
};

const viewSuccessReason = (order) => {
  console.log('查看通过理由', order);
  reason.value = order.after_sale_reason;
  successReason.value = order.reason;
  successReasonDialogVisible.value = true;
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

/* 通过深度选择器修改输入框样式（scoped 模式下需穿透） */
::v-deep .logistics-input {
  margin-bottom: 10px;  /* 输入框与底部按钮的间距 */
}

/* 关键：仅控制弹窗容器居中，不影响内部内容布局 */
::v-deep .el-dialog {
  position: fixed !important;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) !important;
  margin: 0 !important;
}
</style>