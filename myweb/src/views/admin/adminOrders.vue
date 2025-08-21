<template>
  <div>
    <h1>售后审核</h1>
<!--    <el-button type="primary" @click="huifu2">删除审核理由</el-button>-->
    <div class="search-bar">
      <el-input v-model="searchId" placeholder="搜索编号" style="width: 200px; margin-bottom: 20px;"></el-input>
      <el-input v-model="searchProduct" placeholder="搜索产品种类" style="width: 200px; margin-bottom: 20px;"></el-input>
<!--      <el-input v-model="searchAddress" placeholder="搜索收货地" style="width: 200px; margin-bottom: 20px;"></el-input>-->
      <el-input v-model="filterYear" placeholder="年份" style="width: 120px; margin-bottom: 20px;"></el-input>
      <el-input v-model="filterMonth" placeholder="月份" style="width: 120px; margin-bottom: 20px;"></el-input>
      <el-input v-model="filterDay" placeholder="日期" style="width: 120px; margin-bottom: 20px;"></el-input>
      <el-select v-model="filterOption" placeholder="选择筛选" style="width: 200px; margin-bottom: 20px;">
        <el-option label="全部状态" value="all"></el-option>
        <el-option label="待审核" value="after_sale_requested"></el-option>
        <el-option label="同意" value="after_sale_resolved"></el-option>
        <el-option label="拒绝" value="completed"></el-option>
      </el-select>

      <el-button type="primary" @click="performSearch">确认搜索</el-button>
    </div>

    <el-table :data="paginatedData" style="width: 100%">
      <el-table-column prop="order_id" label="编号"></el-table-column>
      <el-table-column prop="product_name" label="产品种类"></el-table-column>
      <el-table-column prop="quantity" label="数量(kg)"></el-table-column>
      <el-table-column prop="price" label="价格(元/kg)"></el-table-column>
      <el-table-column prop="farmer_name" label="农户"></el-table-column>
      <el-table-column prop="buyer_name" label="采购方"></el-table-column>
      <el-table-column prop="created_at" label="时间"></el-table-column>
      <el-table-column prop="formatted_status" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button v-if="scope.row.status === 'completed'"  @click="viewFailReason(scope.row)" type="text" style="color: indianred;">[查看理由]</el-button>
          <el-button v-else-if="scope.row.status === 'after_sale_requested'" @click="viewReason(scope.row)" type="text">[审核]</el-button>
          <el-button v-else-if="scope.row.status === 'after_sale_resolved'" @click="viewSuccessReason(scope.row)" type="text" style="color: green;">[查看理由]</el-button>
        </template>
      </el-table-column>
    </el-table>

<!--    <el-pagination-->
<!--        @current-change="handlePageChange"-->
<!--        :current-page="currentPage"-->
<!--        :page-size="pageSize"-->
<!--        :total="filteredTableData.length"-->
<!--        layout="total, prev, pager, next, jumper"-->
<!--        style=" display: flex; justify-content: center; margin-top: 20px;"-->
<!--    ></el-pagination>-->

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

    <!-- 审核弹窗 -->
    <el-dialog v-model="reasonDialogVisible" title="售后审核">
      <div>
        <p><strong>售后原因:</strong></p>
        <div>{{ after_sale_reason }}</div>
        <p><strong>售后图片:</strong></p>
        <div style="margin-top: 10px;">
          <div class="image-container">
<!--            <div v-for="(image, index) in afterSaleReasonImages" :key="index">-->
<!--              <img :src="image" alt="售后理由图片" class="responsive-image"/>-->
<!--            </div>-->
            <div v-if="afterSaleReasonImages.length"
                 v-for="(image, index) in afterSaleReasonImages"
                 :key="index">
              <img :src="`http://localhost:3000/uploads/activity-images/${image}`"
                   alt="售后理由图片"
                   class="responsive-image" />
            </div>
          </div>
        </div>

        <p><strong>审核理由:</strong></p>
        <el-input v-model="reviewReason" type="textarea" placeholder="填写审核理由" rows="3" style="margin-top: 0px;"></el-input>
        <div style="margin-top: 10px;">
          <el-button type="success" @click="handleApproval">同意</el-button>
          <el-button type="danger" @click="handleRejection">拒绝</el-button>
        </div>

      </div>
    </el-dialog>

    <!-- 售后通过理由弹窗 -->
    <el-dialog v-model="successReasonDialogVisible" title="售后通过理由">
      <div>
        <p><strong>售后原因:</strong></p>
        <div>{{ after_sale_reason }}</div>
        <p><strong>售后图片:</strong></p>
        <div v-if="afterSaleReasonImages.length > 0" style="margin-top: 10px;">
          <div class="image-container">
            <div
                 v-for="(image, index) in afterSaleReasonImages"
                 :key="index">
              <img :src="`http://localhost:3000/uploads/activity-images/${image}`"
                   alt="售后理由图片"
                   class="responsive-image" />
            </div>
          </div>
        </div>
        <p><strong>审核理由:</strong></p>
        <p>{{ successReason }}</p>
      </div>
    </el-dialog>

    <!-- 售后拒绝理由弹窗 -->
    <el-dialog v-model="failReasonDialogVisible" title="售后拒绝理由">
      <div>
        <p><strong>售后原因:</strong></p>
        <div>{{ after_sale_reason }}</div>
        <p><strong>售后图片:</strong></p>
        <div v-if="afterSaleReasonImages.length > 0" style="margin-top: 10px;">
          <div class="image-container">
            <div
                 v-for="(image, index) in afterSaleReasonImages"
                 :key="index">
              <img :src="`http://localhost:3000/uploads/activity-images/${image}`"
                   alt="售后理由图片"
                   class="responsive-image" />
            </div>
          </div>
        </div>
        <p><strong>审核理由:</strong></p>
        <p>{{ failReason }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '../../stores/user';
const userStore = useUserStore();
import Photo from "@/assets/platform_logo2.png";
import {ElMessage} from "element-plus";

const statusMap = {
  pending_shipment: '待发货',
  shipped: '已发货',
  completed: '拒绝',
  after_sale_requested: '待审核',
  after_sale_resolved: '同意',
};

const searchId = ref('');
const searchProduct = ref('');
const searchAddress = ref('');
const filterYear = ref('');
const filterMonth = ref('');
const filterDay = ref('');
const filterOption = ref('all');
const reasonDialogVisible = ref(false);
const successReasonDialogVisible = ref(false);
const failReasonDialogVisible = ref(false);
const after_sale_reason = ref('');
const successReason = ref('');
const failReason = ref(''); // 存储拒绝理由的状态
const reviewReason = ref(''); // 用于填写审核理由
const currentOrder = ref(null); // 用于存储当前审核的订单
const afterSaleReasonImages = ref([]); // 用于存储售后原因图片

const pageSize = ref(10);
const currentPage = ref(1);

// 模拟订单数据
const simulatedTableData = [
  // { order_id: 1, product_name: '白米', quantity: 100, price: 15, farmer_id: '1', farmer_name: '农户1', delivery_location: '北京', buyer_id: '1', buyer_name: 'A老板', phone: '123456789', created_at: '2023-10-01', status: 'after_sale_requested', after_sale_reason: '玉米变质（附图）', after_sale_reason_images: `${Photo},${Photo},${Photo},${Photo}` },
  // { order_id: 2, product_name: '西瓜', quantity: 200, price: 10, farmer_id: '1', farmer_name: '农户1', delivery_location: '河北', buyer_id: '2', buyer_name: '老王', phone: '987654321', created_at: '2023-10-02', status: 'after_sale_requested' , after_sale_reason: '玉米变质（附图）', after_sale_reason_images: Photo},
  // { order_id: 3, product_name: '白米', quantity: 50, price: 8, farmer_id: '1', farmer_name: '农户1', delivery_location: '广东', buyer_id: '3', buyer_name: '孙经理', phone: '135792468', created_at: '2024-10-03', status: 'after_sale_requested' , after_sale_reason: '玉米变质（附图）', after_sale_reason_images: Photo},
  // { order_id: 4, product_name: '玉米', quantity: 150, price: 12, farmer_id: '2', farmer_name: '农户2', delivery_location: '四川', buyer_id: '4', buyer_name: '小李', phone: '159753864', created_at: '2024-10-04', status: 'after_sale_requested', after_sale_reason: '玉米变质（附图）', after_sale_reason_images: Photo},
  // { order_id: 5, product_name: '黄豆', quantity: 80, price: 20, farmer_id: '2', farmer_name: '农户2', delivery_location: '江苏', buyer_id: '5', buyer_name: '老张', phone: '246813579', created_at: '2024-11-05', status: 'after_sale_resolved', after_sale_reason: '变质（附图）', after_sale_reason_images: Photo, reason: '同意'},
  // { order_id: 6, product_name: '白米', quantity: 100, price: 8, farmer_id: '2', farmer_name: '农户2', delivery_location: '广东', buyer_id: '3', buyer_name: '孙经理', phone: '135792468', created_at: '2024-11-03', status: 'after_sale_requested', after_sale_reason: '玉米变质（附图）', after_sale_reason_images: Photo },
  // { order_id: 7, product_name: '玉米', quantity: 150, price: 12, farmer_id: '3', farmer_name: '农户3', delivery_location: '四川', buyer_id: '4', buyer_name: '小李', phone: '159753864', created_at: '2024-11-04', status: 'after_sale_resolved',after_sale_reason: '变质（附图）', after_sale_reason_images: Photo, reason: '同意' },
  // { order_id: 8, product_name: '黄豆', quantity: 80, price: 20, farmer_id: '3', farmer_name: '农户3', delivery_location: '江苏', buyer_id:'5', buyer_name: '老张', phone: '246813579', created_at: '2024-11-05', status: 'after_sale_resolved',after_sale_reason: '变质（附图）', after_sale_reason_images: Photo, reason: '同意' },
  // { order_id: 9, product_name: '玉米', quantity: 150, price: 12, farmer_id: '3', farmer_name: '农户3', delivery_location: '四川', buyer_id:'4', buyer_name: '小李', phone: '159753864', created_at: '2024-11-04', status: 'completed',after_sale_reason: '变质（附图）', after_sale_reason_images: Photo, reason: '拒绝' },
  // { order_id: 10, product_name: '黄豆', quantity: 80, price: 20, farmer_id: '4', farmer_name: '农户4', delivery_location: '江苏', buyer_id:'5', buyer_name: '老张', phone: '246813579', created_at: '2024-11-05', status: 'completed',after_sale_reason: '变质（附图）', after_sale_reason_images: Photo, reason: '拒绝'  },
  // { order_id: 11, product_name: '玉米', quantity: 150, price: 12, farmer_id: '4', farmer_name: '农户4', delivery_location: '四川', buyer_id:'4', buyer_name: '小李', phone: '159753864', created_at: '2024-10-04', status: 'completed',after_sale_reason: '变质（附图）', after_sale_reason_images: Photo, reason: '拒绝' },
];

// 表格数据
const tableData = ref([]); // 初始化表格数据为一个空数组
const filteredTableData = ref([]); // 初始化过滤后的数据

const huifu2 = async () => {
  const token = userStore.token; // 获取 token
  try {
    await axios.delete(`http://localhost:3000/api/delete`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('恢复成功');
  } catch (error) {
    console.error('恢复失败', error);
    ElMessage.error('恢复失败，请重试');
  }
};



const fetchData = async () => {
  const token = userStore.token; // 从用户存储中获取 token
  try {
    const response = await axios.get('http://localhost:3000/api/orders/after-sale', {
      headers: {
        'Authorization': `Bearer ${token}` // 设置 Authorization 头
      }
    });
    tableData.value = response.data || []; // 假设 API 返回的数据就是我们需要的格式
    filteredTableData.value = [...tableData.value]; // 同步过滤后的数据
    console.log('成功获取售后订单', response.data);
  } catch (error) {
    console.error('获取售后订单数据失败，使用模拟数据', error);
    tableData.value = simulatedTableData; // 使用模拟数据
    filteredTableData.value = [...simulatedTableData]; // 同步过滤后的数据
  }
};

// 在组件挂载时调用 fetchData
onMounted(() => {
  fetchData();
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
// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 重置到第一页
};

// 查看原因的处理函数
const viewReason = (order) => {
  console.log('查看原因', order);
  after_sale_reason.value = order.after_sale_reason;
  reviewReason.value = ''; // 清空审核理由输入框
  currentOrder.value = order; // 确保把当前订单赋值给 currentOrder
  reasonDialogVisible.value = true;

  // 处理图片显示
  if (order.after_sale_reason_images) {
    afterSaleReasonImages.value = order.after_sale_reason_images.split(','); // 按逗号分隔提取图片地址
  } else {
    afterSaleReasonImages.value = []; // 如果没有图片，清空
  }
};

// 同意审核逻辑
const handleApproval = async () => {
  if (!currentOrder.value) {
    alert('未选择任何订单！');
    return;
  }

  const token = userStore.token; // 获取 token
  const orderId = currentOrder.value.order_id;

  try {
    // 1: 调用接口更新订单状态
    await axios.patch(`http://localhost:3000/api/orders/${orderId}/status`, {
      status: 'after_sale_resolved',
      reason: reviewReason.value
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // 2:提交审核成功理由
    await axios.post(`http://localhost:3000/api/orders/${orderId}/resolved-reason`, {
      decision: 'approve',
      reason: reviewReason.value
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // 更新状态
    currentOrder.value.status = 'after_sale_resolved';
    reasonDialogVisible.value = false; // 关闭对话框
    reviewReason.value = ''; // 重置审核理由
    alert('审核成功，已同意该售后请求');
  } catch (error) {
    console.error('审核失败', error);
    alert('审核失败，请重试');
  }
};

// 拒绝审核逻辑
const handleRejection = async () => {
  if (!currentOrder.value) {
    alert('未选择任何订单！');
    return;
  }

  const token = userStore.token; // 获取 token
  const orderId = currentOrder.value.order_id;

  try {
    // 1: 调用接口更新订单状态
    await axios.patch(`http://localhost:3000/api/orders/${orderId}/status`, {
      status: 'completed',
      reason: reviewReason.value
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // 2: 提交审核拒绝理由
    await axios.post(`http://localhost:3000/api/orders/${orderId}/resolved-reason`, {
      decision: 'reject',
      reason: reviewReason.value,
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // 更新状态
    currentOrder.value.status = 'completed';
    reasonDialogVisible.value = false; // 关闭对话框
    reviewReason.value = ''; // 重置审核理由
    alert('审核成功，已拒绝该售后请求');
  } catch (error) {
    console.error('审核失败', error);
    alert('审核失败，请重试');
  }
};

// 查看成功理由的处理函数
const viewSuccessReason = (order) => {
  console.log('查看通过理由', order);
  after_sale_reason.value = order.after_sale_reason;
  successReason.value = order.reason;
  successReasonDialogVisible.value = true;

  // 显示成功理由的图片
  if (order.after_sale_reason_images) {
    afterSaleReasonImages.value = order.after_sale_reason_images.split(','); // 按逗号分隔提取图片地址
  } else {
    afterSaleReasonImages.value = []; // 如果没有图片，清空
  }
};

// 查看拒绝理由的处理函数
const viewFailReason = (order) => {
  console.log('查看拒绝理由', order);
  after_sale_reason.value = order.after_sale_reason; // 显示售后原因
  failReason.value = order.reason; // 显示拒绝理由
  failReasonDialogVisible.value = true; // 打开拒绝理由弹窗

  // 处理图片显示
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