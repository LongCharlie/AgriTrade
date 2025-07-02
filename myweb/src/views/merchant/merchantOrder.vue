<template>
  <div class="buyer-container">
    <div class="header">
      <h1>我的采购订单</h1>
      <div class="stats-card">
        <div class="title">总支出</div>
        <div class="value">¥ {{ totalExpense.toLocaleString() }}</div>
      </div>
    </div>
    
    <div class="search-section">
      <div class="search-title">
        <i class="el-icon-search"></i>
        <h2>订单筛选</h2>
      </div>
      <div class="search-bar">
        <!-- 第一行：订单编号、产品、发货地 -->
        <div class="row-1">
          <el-input
            v-model="searchId"
            placeholder="搜索订单编号"
            clearable
          >
            <template #prefix>
              <i class="el-icon-document"></i>
            </template>
          </el-input>
          
          <el-input
            v-model="searchProduct"
            placeholder="搜索产品种类"
            clearable
          >
            <template #prefix>
              <i class="el-icon-goods"></i>
            </template>
          </el-input>
          
          <el-input
            v-model="searchAddress"
            placeholder="搜索发货地"
            clearable
          >
            <template #prefix>
              <i class="el-icon-location-outline"></i>
            </template>
          </el-input>
        </div>
        
        <!-- 第二行：订单状态、日期范围 -->
        <div class="row-2">
          <el-date-picker
            v-model="filterDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
          
          <el-select 
            v-model="filterOption" 
            placeholder="订单状态"
            clearable
          >
            <el-option label="全部订单" value="all"></el-option>
            <el-option label="待付款" value="pendingPayment"></el-option>
            <el-option label="待发货" value="pendingDelivery"></el-option>
            <el-option label="待收货" value="pendingReceipt"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="售后中" value="afterSaleRequested"></el-option>
            <el-option label="已售后" value="afterSaleResolved"></el-option>
          </el-select>
        </div>
        
        <!-- 第三行：搜索和重置按钮 -->
        <div class="row-3">
          <el-button type="primary" @click="performSearch">
            <i class="el-icon-search"></i> 搜索订单
          </el-button>
          <el-button @click="resetSearch">
            <i class="el-icon-refresh"></i> 重置筛选
          </el-button>
        </div>
      </div>

    </div>
    
    <div class="table-container">
      <el-table 
        :data="filteredTableData" 
        v-loading="loading"
        :empty-text="emptyText"
        stripe
      >
        <el-table-column prop="id" label="订单编号" width="140" sortable>
          <template #default="scope">
            <span style="color: #1890ff; font-weight: 500;">#{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="product" label="产品" width="140">
          <template #default="scope">
            <div style="display: flex; align-items: center;">
              <div :style="{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: productColors[scope.row.product] || '#1890ff',
                marginRight: '8px'
              }"></div>
              {{ scope.row.product }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="quantity" label="数量(kg)" width="120" align="center" sortable />
        
        <el-table-column prop="price" label="价格(元/kg)" width="130" align="center">
          <template #default="scope">
            <span style="color: #f56c6c;">¥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="shipFrom" label="发货地" width="120" />
        
        <el-table-column prop="contact" label="联系方式" width="140" />
        
        <el-table-column prop="orderTime" label="下单时间" width="180" sortable />
        
        <el-table-column prop="status" label="状态" width="130">
          <template #default="scope">
            <span :class="`status-tag status-${getStatusClass(scope.row.status)}`">
              {{ scope.row.status }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <div style="display: flex; gap: 10px;">
              <template v-if="scope.row.status === '待付款'">
                <span class="operation-btn" @click="payOrder(scope.row)">
                  <i class="el-icon-shopping-bag-1"></i> 去支付
                </span>
                <span class="operation-btn" @click="cancelOrder(scope.row)" style="color: #f56c6c;">
                  <i class="el-icon-close"></i> 取消
                </span>
              </template>
              
              <template v-else-if="scope.row.status === '待发货'">
                <span class="operation-btn" @click="remindDelivery(scope.row)">
                  <i class="el-icon-bell"></i> 催发货
                </span>
              </template>
              
              <template v-else-if="scope.row.status === '待收货'">
                <span class="operation-btn" @click="confirmReceipt(scope.row)" style="color: #52c41a;">
                  <i class="el-icon-circle-check"></i> 确认收货
                </span>
              </template>
              
              <template v-else-if="scope.row.status === '已完成'">
                <span class="operation-btn" @click="applyAfterSale(scope.row)">
                  <i class="el-icon-warning-outline"></i> 申请售后
                </span>
              </template>
              
              <template v-else-if="scope.row.status === '售后中'">
                <span class="operation-btn" @click="viewAfterSale(scope.row)">
                  <i class="el-icon-view"></i> 查看进度
                </span>
              </template>
              
              <template v-else-if="scope.row.status === '已售后'">
                <span class="operation-btn" @click="viewAfterSaleResult(scope.row)">
                  <i class="el-icon-document"></i> 查看结果
                </span>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="totalOrders"
          v-model:current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 搜索和筛选变量
const searchId = ref('');
const searchProduct = ref('');
const searchAddress = ref('');
const filterDate = ref('');
const filterOption = ref('');
const loading = ref(false);
const emptyText = ref('正在加载订单数据...');
const currentPage = ref(1);
const pageSize = ref(10);
const totalOrders = ref(0);

// 产品颜色映射
const productColors = ref({
  '白米': '#52c41a',
  '西瓜': '#fa8c16',
  '玉米': '#fadb14',
  '黄豆': '#722ed1',
  '小麦': '#13c2c2',
  '苹果': '#f5222d'
});

// 模拟订单数据
const tableData = ref([
  { id: 1001, product: '白米', quantity: 100, price: 15, shipFrom: '黑龙江', seller: '东北米业', contact: '139****1234', orderTime: '2023-10-01 14:30', status: '已完成' },
  { id: 1002, product: '西瓜', quantity: 200, price: 10, shipFrom: '海南', seller: '热带果园', contact: '138****5678', orderTime: '2023-10-02 10:15', status: '待发货' },
  { id: 1003, product: '白米', quantity: 50, price: 8, shipFrom: '江苏', seller: '江南粮仓', contact: '137****9012', orderTime: '2023-10-03 09:45', status: '待收货' },
  { id: 1004, product: '玉米', quantity: 150, price: 12, shipFrom: '山东', seller: '鲁农集团', contact: '136****3456', orderTime: '2023-10-04 16:20', status: '售后中' },
  { id: 1005, product: '黄豆', quantity: 80, price: 20, shipFrom: '河南', seller: '中原豆业', contact: '135****7890', orderTime: '2023-10-05 11:05', status: '已售后' },
  { id: 1006, product: '白米', quantity: 100, price: 8, shipFrom: '湖南', seller: '湘米供应商', contact: '134****2345', orderTime: '2023-10-06 13:40', status: '待付款' },
  { id: 1007, product: '小麦', quantity: 300, price: 9, shipFrom: '河北', seller: '冀北农场', contact: '133****6789', orderTime: '2023-10-07 15:10', status: '已完成' },
  { id: 1008, product: '苹果', quantity: 120, price: 18, shipFrom: '陕西', seller: '秦果贸易', contact: '132****0123', orderTime: '2023-10-08 08:50', status: '待收货' },
  { id: 1009, product: '玉米', quantity: 180, price: 11, shipFrom: '吉林', seller: '长白山农产', contact: '131****4567', orderTime: '2023-10-09 17:30', status: '已完成' },
  { id: 1010, product: '黄豆', quantity: 90, price: 22, shipFrom: '安徽', seller: '皖江豆制品', contact: '130****8901', orderTime: '2023-10-10 12:25', status: '待付款' },
  { id: 1011, product: '西瓜', quantity: 150, price: 9, shipFrom: '广西', seller: '桂南果业', contact: '139****2345', orderTime: '2023-10-11 14:15', status: '待发货' },
  { id: 1012, product: '白米', quantity: 120, price: 16, shipFrom: '辽宁', seller: '辽河米业', contact: '138****6789', orderTime: '2023-10-12 10:50', status: '已完成' },
  { id: 1013, product: '苹果', quantity: 100, price: 20, shipFrom: '新疆', seller: '天山果园', contact: '137****0123', orderTime: '2023-10-13 09:30', status: '售后中' },
  { id: 1014, product: '小麦', quantity: 250, price: 8, shipFrom: '内蒙古', seller: '草原粮仓', contact: '136****4567', orderTime: '2023-10-14 16:45', status: '待收货' },
  { id: 1015, product: '玉米', quantity: 200, price: 10, shipFrom: '四川', seller: '川粮集团', contact: '135****8901', orderTime: '2023-10-15 11:20', status: '已完成' }
]);

// 过滤后的表格数据
const filteredTableData = ref([]);

// 计算总支出
const totalExpense = computed(() => {
  return tableData.value
    .filter(order => order && order.status === '已完成')
    .reduce((sum, order) => sum + (order.quantity * order.price), 0);
});

// 获取状态对应的样式类
const getStatusClass = (status) => {
  const map = {
    '待付款': 'pending',
    '待发货': 'delivery',
    '待收货': 'delivery',
    '已完成': 'completed',
    '售后中': 'aftersale',
    '已售后': 'resolved'
  };
  return map[status] || 'completed';
};

// 执行搜索和过滤
const performSearch = () => {
  loading.value = true;
  emptyText.value = '没有找到符合条件的订单';
  
  // 模拟API请求延迟
  setTimeout(() => {
    try {
      const filtered = tableData.value.filter(item => {
        if (!item) return false;
        
        // 匹配ID
        const idString = item.id?.toString() || '';
        if (searchId.value && !idString.includes(searchId.value.trim())) {
          return false;
        }
        
        // 匹配产品
        const product = item.product?.toString().toLowerCase() || '';
        if (searchProduct.value && !product.includes(searchProduct.value.trim().toLowerCase())) {
          return false;
        }
        
        // 匹配地址
        const shipFrom = item.shipFrom?.toString().toLowerCase() || '';
        if (searchAddress.value && !shipFrom.includes(searchAddress.value.trim().toLowerCase())) {
          return false;
        }
        
        // 匹配日期
        if (filterDate.value && filterDate.value.length === 2) {
          const orderDate = new Date(item.orderTime.split(' ')[0]);
          const startDate = new Date(filterDate.value[0]);
          const endDate = new Date(filterDate.value[1]);
          endDate.setDate(endDate.getDate() + 1); // 包含结束日期
          
          if (orderDate < startDate || orderDate >= endDate) {
            return false;
          }
        }
        
        // 匹配状态筛选
        if (filterOption.value) {
          const statusMap = {
            'pendingPayment': '待付款',
            'pendingDelivery': '待发货',
            'pendingReceipt': '待收货',
            'completed': '已完成',
            'afterSaleRequested': '售后中',
            'afterSaleResolved': '已售后'
          };
          
          if (filterOption.value !== 'all' && item.status !== statusMap[filterOption.value]) {
            return false;
          }
        }
        
        return true;
      });
      
      totalOrders.value = filtered.length;
      updatePagination(filtered);
    } catch (error) {
      console.error('搜索过程中发生错误:', error);
      ElMessage.error('搜索过程中发生错误');
      filteredTableData.value = [...tableData.value];
    } finally {
      loading.value = false;
    }
  }, 600);
};

// 更新分页数据
const updatePagination = (data) => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  filteredTableData.value = data.slice(start, end);
};

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  performSearch();
};

// 重置搜索条件
const resetSearch = () => {
  searchId.value = '';
  searchProduct.value = '';
  searchAddress.value = '';
  filterDate.value = '';
  filterOption.value = '';
  currentPage.value = 1;
  performSearch();
};

// 买家操作函数
const payOrder = (order) => {
  ElMessageBox.confirm(`确定要支付订单 #${order.id} 吗？金额: ¥${order.quantity * order.price}`, '确认支付', {
    confirmButtonText: '确认支付',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === order.id);
    if (index !== -1) {
      tableData.value[index].status = '待发货';
      performSearch();
      ElMessage.success('支付成功，等待卖家发货');
    }
  }).catch(() => {});
};

const cancelOrder = (order) => {
  ElMessageBox.confirm(`确定要取消订单 #${order.id} 吗？`, '取消订单', {
    confirmButtonText: '确定取消',
    cancelButtonText: '再想想',
    type: 'warning'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === order.id);
    if (index !== -1) {
      tableData.value.splice(index, 1);
      performSearch();
      ElMessage.success('订单已取消');
    }
  }).catch(() => {});
};

const remindDelivery = (order) => {
  ElMessage.info(`已向卖家发送发货提醒: 订单 #${order.id}`);
};

const confirmReceipt = (order) => {
  ElMessageBox.confirm(`请确认您已收到订单 #${order.id} 的货物`, '确认收货', {
    confirmButtonText: '确认收货',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === order.id);
    if (index !== -1) {
      tableData.value[index].status = '已完成';
      performSearch();
      ElMessage.success('收货确认成功');
    }
  }).catch(() => {});
};

const applyAfterSale = (order) => {
  ElMessage.info(`跳转到订单 #${order.id} 的售后申请页面`);
};

const viewAfterSale = (order) => {
  ElMessageBox.alert(`订单 #${order.id} 的售后申请正在处理中，当前进度：审核通过，等待退款`, '售后进度', {
    confirmButtonText: '知道了',
  });
};

const viewAfterSaleResult = (order) => {
  ElMessageBox.alert(`订单 #${order.id} 的售后已完成处理：已退款 ¥${order.quantity * order.price * 0.8}`, '售后结果', {
    confirmButtonText: '知道了',
  });
};

// 初始化
onMounted(() => {
  totalOrders.value = tableData.value.length;
  updatePagination(tableData.value);
  
  // 模拟加载完成
  setTimeout(() => {
    loading.value = false;
    emptyText.value = '暂无订单数据';
  }, 1000);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.buyer-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  padding: 30px;
}



.header {
  display: flex;
  justify-content: flex-start; /* 修改为左对齐 */
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
  gap: 350px; /* 添加间隙 */
}

.header h1 {
  margin-right: 20px; /* 添加右边距 */
}


.stats-card {
  background: linear-gradient(135deg, #3a8ffe 0%, #096dd9 100%);
  color: white;
  border-radius: 10px;
  padding: 20px;
  width: 350px;
  box-shadow: 0 4px 12px rgba(58, 143, 254, 0.3);
  margin-left: 0; /* 移除左边距 */
}

.stats-card .title {
  font-size: 16px;
  margin-bottom: 10px;
  opacity: 0.9;
}

.stats-card .value {
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 1px;
}

.search-section {
  background: #f8fafc;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.search-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.search-title i {
  font-size: 20px;
  margin-right: 10px;
  color: #3a8ffe;
}

.search-bar {
  display: flex;
  width: 70%;
  flex-direction: column; /* 改为垂直排列 */
  gap: 20px; /* 行之间的间距 */
  margin-bottom: 15px;
}

.row-1, .row-2, .row-3 {
  display: flex;
  flex-wrap: wrap; /* 允许在小屏幕上换行 */
  gap: 15px; /* 元素之间的间距 */
}

.row-1 > * {
  flex: 1; /* 每个元素占据相等的空间 */
  min-width: 200px; /* 设置最小宽度，确保在小屏幕上不会太窄 */
}

.row-2 > * {
  flex: 1;
  min-width: 220px;
}

.row-3 {
  justify-content: flex-end; /* 按钮右对齐 */
  gap: 15px; /* 按钮之间的间距 */
}

/* 确保每个输入框和选择框有足够的宽度 */
.el-input, .el-select, .el-date-picker {
  width: 100%;
}

@media (max-width: 768px) {
  .row-1, .row-2 {
    flex-direction: column; /* 在小屏幕上垂直排列 */
  }
  
  .row-3 {
    flex-direction: column; /* 在小屏幕上垂直排列 */
    align-items: flex-end; /* 按钮右对齐 */
  }
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.table-container {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  min-height: 500px;
}

.status-tag {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.status-delivery {
  background-color: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.status-completed {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-aftersale {
  background-color: #fff2f0;
  color: #f5222d;
  border: 1px solid #ffccc7;
}

.status-resolved {
  background-color: #f9f0ff;
  color: #722ed1;
  border: 1px solid #d3adf7;
}

.operation-btn {
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.operation-btn:hover {
  background-color: #e6f7ff;
  color: #1890ff;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 25px;
  padding: 15px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

.empty-state i {
  font-size: 70px;
  margin-bottom: 20px;
  color: #c5c5c5;
}

.empty-state p {
  font-size: 16px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stats-card {
    width: 100%;
    margin-top: 20px;
  }
  
  .search-bar {
    grid-template-columns: 1fr;
  }
}
</style>