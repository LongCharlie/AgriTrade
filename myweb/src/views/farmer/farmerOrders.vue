<template>
  <div>
    <h1>我的订单</h1>
    <h1>总收入: ¥ {{ totalRevenue }}</h1>

    <div class="search-bar">
      <el-input v-model="searchId" placeholder="搜索编号" style="width: 200px; margin-bottom: 20px;"></el-input>
      <el-input v-model="searchProduct" placeholder="搜索产品种类" style="width: 200px; margin-bottom: 20px;"></el-input>
      <el-input v-model="searchAddress" placeholder="搜索收货地" style="width: 200px; margin-bottom: 20px;"></el-input>
<!--      <el-input v-model="filterYear" placeholder="年份" style="width: 120px; margin-bottom: 20px;"></el-input>-->
<!--      <el-input v-model="filterMonth" placeholder="月份" style="width: 120px; margin-bottom: 20px;"></el-input>-->
<!--      <el-input v-model="filterDay" placeholder="日期" style="width: 120px; margin-bottom: 20px;"></el-input>-->
      <el-input
          v-model.number="filterYear"
          placeholder="年份"
          type="number"
          style="width: 120px; margin-bottom: 20px;"
      ></el-input>
      <el-input
          v-model.number="filterMonth"
          placeholder="月份"
          type="number"
          min="1"
          max="12"
          style="width: 120px; margin-bottom: 20px;"
      ></el-input>
      <el-input
          v-model.number="filterDay"
          placeholder="日期"
          type="number"
          min="1"
          max="31"
          style="width: 120px; margin-bottom: 20px;"
      ></el-input>

      <el-select v-model="filterOption" placeholder="选择筛选" style="width: 200px; margin-bottom: 20px;">
        <el-option label="全部状态" value="all"></el-option>
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
      <el-table-column prop="province" label="收货地"></el-table-column>
      <el-table-column prop="buyer_name" label="采购方"></el-table-column>
      <el-table-column prop="buyer_phone" label="联系方式"></el-table-column>
<!--      <el-table-column label="沟通">-->
<!--        <el-button @click="handleMessage(scope.row)" >发消息</el-button>-->
<!--      </el-table-column>-->
      <el-table-column prop="created_at" label="时间"></el-table-column>
      <el-table-column prop="formatted_status" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button v-if="scope.row.status === 'pending_shipment'" @click="confirmDelivery(scope.row)" type="text">[确认发货]</el-button>
          <el-button v-else-if="scope.row.status === 'shipped'"  @click="seeLogistics(scope.row)" type="text">[发货信息]</el-button>
          <el-button v-else-if="scope.row.status === 'completed'" type="text" disabled>[无操作]</el-button>
          <el-button v-if="scope.row.status === 'after_sale_requested'" @click="viewReason(scope.row)" type="text">[查看原因]</el-button>
          <el-button v-else-if="scope.row.status === 'after_sale_resolved'" @click="viewSuccessReason(scope.row)" type="text">[查看理由]</el-button>
        </template>
      </el-table-column>
    </el-table>

<!--    <el-button type="primary" @click="huifu">待发货</el-button>-->
<!--    <el-button type="primary" @click="huifu2">已完成</el-button>-->

    <div class="pagination-container">
      <el-pagination
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="filteredTableData.length"
          layout="total, sizes, prev, pager, next, jumper"
          style=" display: flex; justify-content: center; margin-top: 20px;"
      ></el-pagination>
    </div>

    <!-- 物流信息弹窗 -->
    <el-dialog v-model="dialogVisible" title="确认发货">
      <p><strong>买家详细地址：</strong></p>
      <div style="margin-bottom: 20px;">
        {{ currentOrder.province }}，{{ currentOrder.city }}，{{ currentOrder.district }}，{{ currentOrder.address_detail }}
      </div>
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

    <!-- 查看物流信息 -->
    <el-dialog v-model="logisticsDialogVisible" title="查看物流信息">
      <p><strong>买家详细地址：</strong></p>
      <div style="margin-bottom: 20px;">
        {{ currentOrder.province }}，{{ currentOrder.city }}，{{ currentOrder.district }}，{{ currentOrder.address_detail }}
      </div>
      <p><strong>我的发货物流：</strong></p>
      <div style="margin-bottom: 20px;">
        {{ seeLogisticsInfo }}
      </div>
    </el-dialog>

    <!-- 退货原因弹窗 -->
    <el-dialog v-model="reasonDialogVisible" title="售后原因">
      <p><strong>售后原因:</strong></p>
      <div>{{ after_sale_reason }}</div>
      <div v-if="afterSaleReasonImages.length > 0" style="margin-top: 10px;">
        <div class="image-container">
          <div v-for="(image, index) in afterSaleReasonImages" :key="index">
            <img :src="image" alt="售后理由图片" class="responsive-image"/>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 售后通过理由弹窗 -->
    <el-dialog v-model="successReasonDialogVisible" title="售后通过理由">
      <div>
        <p><strong>售后原因:</strong></p>
        <div>{{ after_sale_reason }}</div>
        <div v-if="afterSaleReasonImages.length > 0" style="margin-top: 10px;">
          <div class="image-container">
            <div v-for="(image, index) in afterSaleReasonImages" :key="index">
              <img :src="image" alt="售后理由图片" class="responsive-image"/>
            </div>
          </div>
        </div>
        <p><strong>通过理由:</strong></p>
        <p>{{ successReason }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '../../stores/user';
const userStore = useUserStore();
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
const router = useRouter();

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
const logisticsDialogVisible = ref(false);
const successReasonDialogVisible = ref(false);
const seeLogisticsInfo = ref('');
const reason = ref('');
const after_sale_reason = ref('');
const successReason = ref('');
const currentOrder = ref(null); // 用于存储当前确认发货的订单
const afterSaleReasonImages = ref([]); // 用于存储售后原因图片

const pageSize = ref(10);
const currentPage = ref(1);

const huifu = async () => {
  const token = userStore.token; // 获取 token
  const orderId = 13; // 获取订单 ID
  try {
    await axios.post(`http://localhost:3000/api/${orderId}/status`, {
      status: 'pending_shipment'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    // 更新本地订单状态
    fetchData();
    console.log('恢复成功');
  } catch (error) {
    console.error('恢复失败', error);
    ElMessage.error('恢复失败，请重试');
  }
};
const huifu2 = async () => {
  const token = userStore.token; // 获取 token
  const orderId = 5; // 获取订单 ID
  try {
    await axios.post(`http://localhost:3000/api/${orderId}/status`, {
      status: 'completed'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    // 更新本地订单状态
    fetchData();
    console.log('恢复成功');
  } catch (error) {
    console.error('恢复失败', error);
    ElMessage.error('恢复失败，请重试');
  }
};

// 模拟订单数据
const simulatedTableData = [
  // { order_id: 1, product_name: '白米', quantity: 100, price: 15, delivery_location: '北京', buyer_id: '1', buyer_name: 'A老板', phone: '123456789', created_at: '2023-10-01', status: 'pending_shipment' },
  // { order_id: 2, product_name: '西瓜', quantity: 200, price: 10, delivery_location: '河北', buyer_id: '2', buyer_name: '老王', phone: '987654321', created_at: '2023-10-02', status: 'completed' },
 ];

// 表格数据
const tableData = ref([]); // 初始化表格数据为一个空数组
const filteredTableData = ref([]); // 初始化过滤后的数据

const fetchData = async () => {
  const token = userStore.token; // 从用户存储中获取 token
  try {
    const response = await axios.get('http://localhost:3000/api/all', {
      headers: {
        'Authorization': `Bearer ${token}` // 设置 Authorization 头
      }
    });
    tableData.value = response.data || []; // 假设 API 返回的数据就是我们需要的格式
    filteredTableData.value = [...tableData.value]; // 同步过滤后的数据
    console.log('订单数据'+ tableData.value);
  } catch (error) {
    console.error('获取订单数据失败，使用模拟数据', error);
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
    // 检查属性是否存在，如果不存在则使用空字符串
    const orderId = item.order_id ? item.order_id.toString() : '';
    const productName = item.product_name || '';
    const deliveryLocation = item.province || '';

    const matchesId = orderId.includes(searchId.value);
    const matchesProduct = productName.includes(searchProduct.value);
    const matchesAddress = deliveryLocation.includes(searchAddress.value);

    // 日期比较逻辑（全部使用数字比较）
    const matchesDate = (date) => {
      if (!date) return false;
      const [year, month, day] = date.split('-');

      // 转换为数字进行比较
      const yearNum = parseInt(year, 10);
      const monthNum = parseInt(month, 10);
      const dayNum = parseInt(day, 10);

      // 用户输入的值（已经是数字，因为使用了v-model.number）
      const yearMatch = filterYear.value ? yearNum === filterYear.value : true;
      const monthMatch = filterMonth.value ? monthNum === filterMonth.value : true;
      const dayMatch = filterDay.value ? dayNum === filterDay.value : true;

      return yearMatch && monthMatch && dayMatch;
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
// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 重置到第一页
};


// 跳转到聊天页面
const handleMessage = (order) => {
  currentOrder.value = order; // 保存当前订单
  const buyerID = order.buyer_id;
  const farmerID = userStore.userId;
  router.push('/farmer/messages'); // 跳转
};

// 操作处理函数
const confirmDelivery = (order) => {
  currentOrder.value = order; // 保存当前订单
  dialogVisible.value = true; // 显示对话框
};

// 确认发货
const submitDelivery = async () => {
  const token = userStore.token; // 获取 token
  const orderId = currentOrder.value.order_id; // 获取订单 ID

  try {
    // 调用接口1: 更新订单状态为 shipped
    await axios.post(`http://localhost:3000/api/${orderId}/status`, {
      status: 'shipped'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // 调用接口2: 上传物流信息
    await axios.patch(`http://localhost:3000/api/${orderId}/logistics`, {
      logistics_info: logisticsInfo.value
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // 更新本地订单状态
    fetchData();
    dialogVisible.value = false; // 关闭对话框
    logisticsInfo.value = ''; // 清空物流信息输入框
    console.log('发货成功');
  } catch (error) {
    console.error('发货失败', error);
    ElMessage.error('发货失败，请重试');
  }
};

const seeLogistics = (order) => {
  console.log('查看物流', order);
  currentOrder.value = order; // 保存当前订单
  seeLogisticsInfo.value = order.logistics_info;
  logisticsDialogVisible.value = true;
};

const viewReason = (order) => {
  console.log('查看原因', order);
  after_sale_reason.value = order.after_sale_reason;
  reasonDialogVisible.value = true;

  // 处理图片显示
  if (order.after_sale_reason_images) {
    afterSaleReasonImages.value = order.after_sale_reason_images.split(','); // 按逗号分隔提取图片地址
  } else {
    afterSaleReasonImages.value = []; // 如果没有图片，清空
  }
};

const viewSuccessReason = (order) => {
  console.log('查看通过理由', order);
  after_sale_reason.value = order.after_sale_reason;
  successReason.value = order.reason;
  successReasonDialogVisible.value = true;

  // 重用 after_sale_reason_images 来显示成功理由的图片
  if (order.after_sale_reason_images) {
    afterSaleReasonImages.value = order.after_sale_reason_images.split(','); // 按逗号分隔提取图片地址
  } else {
    afterSaleReasonImages.value = []; // 如果没有图片，清空
  }
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


.image-container {
  display: flex;              /* 使用flex布局 */
  flex-wrap: wrap;           /* 能够换行 */
  margin-top: 10px;          /* 上方的margin */
  max-height: 300px;         /* 限制最大高度可选 */
  overflow-y: auto;          /* 允许竖向滚动 */
}

.responsive-image {
  max-width: 200px;          /* 最大宽度 */
  height: auto;              /* 高度自适应 */
  margin-right: 10px;        /* 图片之间的间距 */
}
</style>