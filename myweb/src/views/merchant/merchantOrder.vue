<template>
  <div id="app">
    <div class="filters">
      <h2><i class="fas fa-filter"></i> 筛选</h2>
      <div class="filter-horizontal">
        <div class="filter-group">
          <h3><i class="far fa-calendar"></i> 时间范围</h3>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="filter-input"
          ></el-date-picker>
        </div>
        <div class="filter-group">
          <h3><i class="fas fa-apple-alt"></i> 产品种类</h3>
          <input 
            type="text" 
            class="filter-input" 
            placeholder="输入产品种类"
            v-model="filters.productType"
          >
        </div>
        <div class="filter-group">
          <h3><i class="fas fa-tasks"></i> 订单状态</h3>
          <select class="filter-input" v-model="filters.status">
            <option value="">全部订单</option>
            <option value="待发货">待发货</option>
            <option value="待收货">待收货</option>
            <option value="已完成">已完成</option>
            <option value="售后中">售后中</option>
            <option value="已售后">已售后</option>
          </select>
        </div>
      </div>
      <div class="filter-buttons">
        <button class="btn btn-reset" @click="resetFilters">
          <i class="fas fa-redo"></i> 重置筛选
        </button>
      </div>
    </div>
    
    <div class="orders">
      <div class="table-container">
        <table v-if="filteredOrders.length > 0">
          <thead>
            <tr>
              <th>订单号</th>
              <th>产品种类</th>
              <th>数量(kg)</th>
              <th>价格(元/kg)</th>
              <th>收货地</th>
              <th>发货人</th>
              <th>联系方式</th>
              <th>时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td>{{ order.orderId }}</td>
              <td>{{ order.productType }}</td>
              <td>{{ order.quantity }}</td>
              <td>{{ order.price }}</td>
              <td>{{ order.destination }}</td>
              <td>{{ order.sender }}</td>
              <td>{{ order.contact }}</td>
              <td>{{ order.time }}</td>
              <td>
                <span :class="getStatusClass(order.status)">{{ order.status }}</span>
              </td>
              <td>
                <template v-if="order.status === '待发货'">
                  <button class="action-btn btn-view" @click="openShippingModal(order)">
                    <i class="fas fa-truck"></i> 发货信息
                  </button>
                </template>
                <template v-else-if="order.status === '待收货'">
                  <button class="action-btn btn-confirm" @click="confirmReceipt(order)">
                    <i class="fas fa-check-circle"></i> 确认收货
                  </button>
                  <button class="action-btn btn-refund" @click="openRefundModal(order)">
                    <i class="fas fa-undo"></i> 请求售后
                  </button>
                </template>
                <template v-else-if="order.status === '售后中'">
                  <button class="action-btn btn-view" @click="openRefundReasonModal(order)">
                    <i class="fas fa-eye"></i> 售后详情
                  </button>
                </template>
                <template v-else-if="order.status === '已售后'">
                  <button class="action-btn btn-view" @click="openAuditReasonModal(order)">
                    <i class="fas fa-file-alt"></i> 审核详情
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="no-results">
          <i class="fas fa-inbox"></i>
          <p>没有找到匹配的订单</p>
        </div>
      </div>
    </div>
    
    <!-- 发货信息模态框部分 -->
    <div class="modal-overlay" v-if="shippingModalVisible">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fas fa-truck"></i> 发货信息</h3>
          <button class="close-btn" @click="shippingModalVisible = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="info-row">
            <div class="info-label">订单号：</div>
            <div class="info-value">{{ selectedOrder.orderId }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">产品：</div>
            <div class="info-value">{{ selectedOrder.productType }} ({{ selectedOrder.quantity }}kg)</div>
          </div>
          
          <div class="shipping-info">
            <!-- 直接显示发货信息字符串 -->
            <p>{{ shippingInfo }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="shippingModalVisible = false">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 售后申请模态框 -->
    <div class="modal-overlay" v-if="refundModalVisible">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fas fa-undo"></i> 申请售后</h3>
          <button class="close-btn" @click="refundModalVisible = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="info-row">
            <div class="info-label">订单号：</div>
            <div class="info-value">{{ selectedOrder.orderId }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">产品：</div>
            <div class="info-value">{{ selectedOrder.productType }} ({{ selectedOrder.quantity }}kg)</div>
          </div>
          
          <h4 style="margin: 20px 0 10px;">售后原因：</h4>
          <textarea v-model="refundReason" placeholder="请详细描述您需要售后的原因..."></textarea>
          
          <h4 style="margin: 20px 0 10px;">上传凭证：</h4>
          <div class="upload-area" @click="triggerFileInput">
            <div class="upload-icon">
              <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <div class="upload-text">点击或拖拽文件到此处上传</div>
            <div class="upload-btn">
              <i class="fas fa-plus"></i> 选择图片
            </div>
            <input type="file" ref="fileInput" style="display: none" multiple @change="handleFileUpload">
          </div>
          
          <div class="preview-container" v-if="uploadedFiles.length > 0">
            <div class="preview-item" v-for="(file, index) in uploadedFiles" :key="index">
              <img :src="file.url" class="preview-image" alt="凭证图片">
              <button class="remove-btn" @click="removeImage(index)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="refundModalVisible = false">取消</button>
          <button class="btn btn-submit" @click="submitRefund">提交申请</button>
        </div>
      </div>
    </div>
    
    <!-- 售后详情模态框 -->
    <div class="modal-overlay" v-if="refundReasonModalVisible">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fas fa-file-invoice"></i> 售后详情</h3>
          <button class="close-btn" @click="refundReasonModalVisible = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="info-row">
            <div class="info-label">订单号：</div>
            <div class="info-value">{{ selectedOrder.orderId }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">产品：</div>
            <div class="info-value">{{ selectedOrder.productType }} ({{ selectedOrder.quantity }}kg)</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">售后原因：</div>
            <div class="info-value">
              <p style="background: #f8fafc; padding: 12px; border-radius: 8px;">
                {{ refundDetail.reason }}
              </p>
            </div>
          </div>
          
          <h4 style="margin: 20px 0 10px;">凭证图片：</h4>
          <div class="preview-container">
            <div class="preview-item" v-for="(img, index) in refundDetail.evidenceImages" :key="index">
              <img :src="img" class="preview-image" alt="凭证图片">
            </div>
          </div>
          
          <div class="info-row">
            <div class="info-label">处理状态：</div>
            <div class="info-value">
              <span class="status status-refund">{{ refundDetail.processStatus }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="refundReasonModalVisible = false">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 审核详情模态框 -->
    <div class="modal-overlay" v-if="auditReasonModalVisible">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fas fa-file-alt"></i> 售后处理结果</h3>
          <button class="close-btn" @click="auditReasonModalVisible = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="info-row">
            <div class="info-label">订单号：</div>
            <div class="info-value">{{ selectedOrder.orderId }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">产品：</div>
            <div class="info-value">{{ selectedOrder.productType }} ({{ selectedOrder.quantity }}kg)</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">售后原因：</div>
            <div class="info-value">
              <p style="background: #f8fafc; padding: 12px; border-radius: 8px;">
                {{ auditDetail.refundReason }}
              </p>
            </div>
          </div>
          
          <h4 style="margin: 20px 0 10px;">凭证图片：</h4>
          <div class="preview-container">
            <div class="preview-item" v-for="(img, index) in auditDetail.evidenceImages" :key="index">
              <img :src="img" class="preview-image" alt="凭证图片">
            </div>
          </div>
          
          <div class="audit-section">
            <h4><i class="fas fa-user-check"></i> 审核结果</h4>
            <div class="info-row">
              <div class="info-label">处理结果：</div>
              <div class="info-value">
                <span class="status status-refunded">{{ auditDetail.processResult }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">退款金额：</div>
              <div class="info-value">¥{{ auditDetail.refundAmount.toFixed(2) }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">审核说明：</div>
              <div class="info-value">
                <p style="background: #f0f7ff; padding: 12px; border-radius: 8px;">
                  {{ auditDetail.auditRemark }}
                </p>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">审核时间：</div>
              <div class="info-value">{{ auditDetail.auditTime }}</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="auditReasonModalVisible = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
export default {
  data() {
    return {
      dateRange: [] // 用于绑定日期选择器的值
    };
  },

  setup() {
    // 订单数据 - 模拟后端返回格式
    const orders = ref([]);
    
    // 筛选条件
    const filters = ref({
      startDate: '',
      endDate: '',
      productType: '',
      status: ''
    });
    
    // 模态框状态
    const shippingModalVisible = ref(false);
    const refundModalVisible = ref(false);
    const refundReasonModalVisible = ref(false);
    const auditReasonModalVisible = ref(false);
    const selectedOrder = ref({});
    
    const shippingInfo = ref('');
    
    // 售后详情 - 模拟后端返回数据
    const refundDetail = ref({
      reason: '',
      evidenceImages: [],
      processStatus: ''
    });
    
    // 审核详情 - 模拟后端返回数据
    const auditDetail = ref({
      refundReason: '',
      evidenceImages: [],
      processResult: '',
      refundAmount: 0,
      auditRemark: '',
      auditTime: '',
      auditor: ''
    });
    
    // 临时数据
    const refundReason = ref('');
    const uploadedFiles = ref([]);
    const fileInput = ref(null);
    
    // 计算总订单数
    const totalOrders = computed(() => orders.value.length);
    
    // 计算总交易额
    const totalAmount = computed(() => {
      return orders.value.reduce((sum, order) => sum + (order.quantity * order.price), 0);
    });
    
    // 计算待处理订单数
    const pendingOrders = computed(() => {
      return orders.value.filter(order => 
        order.status === '待发货' || order.status === '待收货' || order.status === '售后中'
      ).length;
    });
    
    // 过滤后的订单
    const filteredOrders = computed(() => {
      let result = [...orders.value];

      // 应用状态筛选
      if (filters.value.status) {
        result = result.filter(order => order.status === filters.value.status);
      }

      // 应用产品种类筛选
      if (filters.value.productType) {
        const keyword = filters.value.productType.toLowerCase();
        result = result.filter(order =>
          order.productType.toLowerCase().includes(keyword)
        );
      }

      // ✅ 应用日期范围筛选
      if (dateRange.value && dateRange.value.length === 2) {
        const [start, end] = dateRange.value;
        const startDate = new Date(start).setHours(0, 0, 0, 0);
        const endDate = new Date(end).setHours(23, 59, 59, 999);

        result = result.filter(order => {
          const orderDate = new Date(order.time).getTime();
          return orderDate >= startDate && orderDate <= endDate;
        });
      }

      return result;
    });

    
    // 模拟API请求 - 获取订单列表
    const fetchOrders = async () => {
      try {
        orders.value = [
          { id: 1, orderId: 'ORD20230810001', productType: '有机蔬菜', quantity: 50, price: 12.5, destination: '北京市朝阳区', sender: '张伟', contact: '138****5678', time: '2023-08-10 09:23', status: '待发货' },
          { id: 2, orderId: 'ORD20230809005', productType: '新鲜水果', quantity: 120, price: 8.8, destination: '上海市浦东新区', sender: '李明', contact: '139****1234', time: '2023-08-09 14:45', status: '待收货' },
          { id: 3, orderId: 'ORD20230808012', productType: '优质谷物', quantity: 200, price: 5.5, destination: '广州市天河区', sender: '王芳', contact: '137****9876', time: '2023-08-08 11:10', status: '已完成' },
          { id: 4, orderId: 'ORD20230807003', productType: '海鲜水产', quantity: 80, price: 25.0, destination: '深圳市南山区', sender: '赵刚', contact: '135****4567', time: '2023-08-07 16:30', status: '售后中' },
          { id: 5, orderId: 'ORD20230805008', productType: '肉类禽蛋', quantity: 150, price: 18.0, destination: '杭州市西湖区', sender: '刘强', contact: '136****2345', time: '2023-08-05 10:15', status: '已售后' }
        ];
      } catch (error) {
        console.error('获取订单失败:', error);
      }
    };
    
    // 模拟API请求 - 获取发货信息
  const fetchShippingInfo = async () => {
    try {
      // 实际项目中替换为真实API地址
      // const response = await import('axios').get(`/api/orders/${selectedOrder.value.orderId}/shipping`);
      // shippingInfo.value = response.data;
      
      // 模拟后端返回的虚拟数据 - 单个字符串字段
      shippingInfo.value = 
        `您的订单已由 顺丰速运 承运，运单号为 SF1234567890，已于 2023-08-10 14:30 从青岛发出，预计将在 2023-08-12 18:00前 送达。`;
    } catch (error) {
      console.error('获取发货信息失败:', error);
      shippingInfo.value = '无法获取发货信息';
    }
  };
    
    // 模拟API请求 - 获取售后详情
    const fetchRefundDetail = async () => {
      try {
        // 实际项目中替换为真实API地址
        // const response = await import('axios').get(`/api/orders/${selectedOrder.value.orderId}/refund`);
        // refundDetail.value = response.data;
        
        // 模拟后端返回的虚拟数据
        refundDetail.value = {
          reason: '收到货物时发现包装破损严重，部分水果已经挤压变形，无法正常食用。',
          evidenceImages: [
            'https://images.unsplash.com/photo-1574856344991-aaa31b6f4c1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
          ],
          processStatus: '审核中'
        };
      } catch (error) {
        console.error('获取售后详情失败:', error);
      }
    };
    
    // 模拟API请求 - 获取审核详情
    const fetchAuditDetail = async () => {
      try {
        // 实际项目中替换为真实API地址
        // const response = await import('axios').get(`/api/orders/${selectedOrder.value.orderId}/audit`);
        // auditDetail.value = response.data;
        
        // 模拟后端返回的虚拟数据
        auditDetail.value = {
          refundReason: '收到货物后发现部分肉类产品存在异味，怀疑运输过程中未保持冷链。',
          evidenceImages: [
            'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
          ],
          processResult: '已通过',
          refundAmount: selectedOrder.value.quantity * selectedOrder.value.price,
          auditRemark: '经审核，您提供的照片和描述情况属实。根据我们的售后政策，已为您办理全额退款。退款金额将在1-3个工作日内原路返回。',
          auditTime: '2023-08-10 14:30',
          auditor: '张经理 (工号: SF00234)'
        };
      } catch (error) {
        console.error('获取审核详情失败:', error);
      }
    };
    
// 模拟API请求 - 提交售后申请
    const submitRefundApi = async () => {
      try {
        // 使用条件编译来区分真实API和模拟数据，避免不可达代码
        const useMockData = true; // 切换此值来使用真实API或模拟数据
        
        if (useMockData) {
          // 模拟后端处理成功
          return { success: true };
        } else {
          // 实际项目中替换为真实API地址并使用图片数据
          const imageUrls = uploadedFiles.value.map(file => file.url);
          const response = await import('axios').post(`/api/orders/${selectedOrder.value.orderId}/refund`, {
            refundReason: refundReason.value,
            imageUrls
          });
          return response.data;
        }
      } catch (error) {
        console.error('提交售后申请失败:', error);
        return { success: false };
      }
    };
    
    // 模拟API请求 - 确认收货
    const confirmReceiptApi = async () => {
      try {
        // 使用条件编译来区分真实API和模拟数据，避免不可达代码
        const useMockData = true; // 切换此值来使用真实API或模拟数据
        
        if (useMockData) {
          // 模拟后端处理成功
          return { success: true };
        } else {
          // 实际项目中替换为真实API地址
          const response = await import('axios').post(`/api/orders/${selectedOrder.value.orderId}/confirm`);
          return response.data;
        }
      } catch (error) {
        console.error('确认收货失败:', error);
        return { success: false };
      }
    };
    
    // 重置筛选
    const resetFilters = () => {
      filters.value = {
        startDate: '',
        endDate: '',
        productType: '',
        status: ''
      };
      fetchOrders(); // 重新获取所有订单
    };
    
    // 获取状态对应的CSS类
    const getStatusClass = (status) => {
      switch(status) {
        case '待发货': return 'status status-pending';
        case '待收货': return 'status status-todeliver';
        case '已完成': return 'status status-delivered';
        case '售后中': return 'status status-refund';
        case '已售后': return 'status status-refunded';
        default: return 'status';
      }
    };
    
    // 打开发货信息模态框
    const openShippingModal = (order) => {
      selectedOrder.value = order;
      fetchShippingInfo(); // 获取发货信息
      shippingModalVisible.value = true;
    };
    
    // 打开售后申请模态框
    const openRefundModal = (order) => {
      selectedOrder.value = order;
      refundReason.value = '';
      uploadedFiles.value = [];
      refundModalVisible.value = true;
    };
    
    // 打开售后详情模态框
    const openRefundReasonModal = (order) => {
      selectedOrder.value = order;
      fetchRefundDetail(); // 获取售后详情
      refundReasonModalVisible.value = true;
    };
    
    // 打开审核详情模态框
    const openAuditReasonModal = (order) => {
      selectedOrder.value = order;
      fetchAuditDetail(); // 获取审核详情
      auditReasonModalVisible.value = true;
    };
    
    // 确认收货
    const confirmReceipt = async (order) => {
      if(confirm(`确定要确认收货订单 ${order.orderId} 吗？`)) {
        const result = await confirmReceiptApi();
        if (result.success) {
          order.status = '已完成';
        } else {
          alert('确认收货失败，请稍后重试');
        }
      }
    };
    
    // 触发文件上传
    const triggerFileInput = () => {
      fileInput.value.click();
    };
    
    // 处理文件上传
    const handleFileUpload = (event) => {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.match('image.*')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            uploadedFiles.value.push({
              name: file.name,
              url: e.target.result,
              file: file
            });
          };
          reader.readAsDataURL(file);
        }
      }
      event.target.value = '';
    };
    
    // 移除图片
    const removeImage = (index) => {
      uploadedFiles.value.splice(index, 1);
    };
    
    // 提交售后申请
    const submitRefund = async () => {
      if (!refundReason.value.trim()) {
        alert('请填写售后原因');
        return;
      }
      
      if (uploadedFiles.value.length === 0) {
        if (!confirm('您没有上传任何凭证图片，确定要提交吗？')) {
          return;
        }
      }
      
      // 调用API提交售后申请
      const result = await submitRefundApi();
      
      if (result.success) {
        // 更新本地订单状态
        const order = orders.value.find(o => o.id === selectedOrder.value.id);
        if (order) {
          order.status = '售后中';
        }
        
        alert('售后申请已提交，客服将在24小时内处理！');
        refundModalVisible.value = false;
      } else {
        alert('提交失败，请稍后重试');
      }
    };
    
    // 初始化页面时获取订单数据
    onMounted(() => {
      fetchOrders();
      
      // 设置默认日期范围
      const today = new Date().toISOString().split('T')[0];
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];
      
      filters.value.startDate = oneWeekAgoStr;
      filters.value.endDate = today;
    });
    
    return {
      orders,
      filters,
      totalOrders,
      totalAmount,
      pendingOrders,
      filteredOrders,
      applyFilters,
      resetFilters,
      getStatusClass,
      confirmReceipt,
      shippingModalVisible,
      refundModalVisible,
      refundReasonModalVisible,
      auditReasonModalVisible,
      openShippingModal,
      openRefundModal,
      openRefundReasonModal,
      openAuditReasonModal,
      selectedOrder,
      shippingInfo,
      refundDetail,
      auditDetail,
      refundReason,
      uploadedFiles,
      fileInput,
      triggerFileInput,
      handleFileUpload,
      removeImage,
      submitRefund
    };
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Noto Sans SC', sans-serif;
}

body {
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
  padding: 20px;
}

#app {
  max-width: 1400px;
  margin: 0 auto;
}

header {
  background: white;
  color: white;
  padding: 20px 30px;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

h1 {
  font-size: 28px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 20px;
  border-radius: 10px;
  min-width: 140px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.filters {
  border: 1px solid #e7e7e7;
  border-radius: 4px;
  padding: 16px;
  background-color: #ffffff;
}

.filter-horizontal {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-group {
  flex: 1;
}

.filter-group h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #333;
}

.filter-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.filter-input::placeholder {
  color: #000000;
}

.filter-buttons {
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #409eff;
  color: white;
}

.btn-primary:hover {
  background-color: #66b1ff;
}

.btn-reset {
  background-color: #f56c6c;
  color: white;
}

.btn-reset:hover {
  background-color: #f78989;
}

.orders {
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

th {
  background-color: #f8fafc;
  text-align: left;
  padding: 16px 15px;
  font-weight: 600;
  color: #000000;
  border-bottom: 2px solid #f0f4f8;
}

td {
  padding: 16px 15px;
  border-bottom: 1px solid #f0f4f8;
  color: #4a5568;
}

tr:hover {
  background-color: #f8fafc;
}

.status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  display: inline-block;
}

.status-pending {
  background-color: #ffedd5;
  color: #c2410c;
}

.status-todeliver {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.status-delivered {
  background-color: #dcfce7;
  color: #166534;
}

.status-refund {
  background-color: #fef3c7;
  color: #b45309;
}

.status-refunded {
  background-color: #ede9fe;
  color: #6d28d9;
}

.action-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-right: 6px;
  margin-bottom: 5px;
}

.btn-view {
  background-color: #e0f2fe;
  color: #0369a1;
}

.btn-confirm {
  background-color: #dcfce7;
  color: #166534;
}

.btn-refund {
  background-color: #ffedd5;
  color: #c2410c;
}

.btn-view:hover, .btn-confirm:hover, .btn-refund:hover {
  opacity: 0.85;
  transform: translateY(-2px);
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #a0aec0;
  font-size: 16px;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f4f8;
}

.info-label {
  width: 100px;
  font-weight: 500;
  color: #4a6583;
}

.info-value {
  flex: 1;
}

.shipping-info {
  background-color: #f0f7ff;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  border-left: 4px solid #4b6cb7;
}

.shipping-info p {
  line-height: 1.6;
  margin-bottom: 10px;
}

.shipping-detail {
  display: flex;
  margin-top: 15px;
}

.shipping-detail div {
  flex: 1;
}

.shipping-detail .label {
  font-weight: 500;
  color: #4a6583;
  margin-bottom: 5px;
}

.upload-area {
  border: 2px dashed #dce4ec;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  margin: 20px 0;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #4b6cb7;
  background-color: #f8fafc;
}

.upload-icon {
  font-size: 48px;
  color: #4b6cb7;
  margin-bottom: 15px;
}

.upload-text {
  margin-bottom: 15px;
  color: #4a5568;
}

.upload-btn {
  background: #f0f4f8;
  color: #4a6583;
  padding: 8px 16px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #dce4ec;
  border-radius: 8px;
  min-height: 120px;
  margin: 15px 0;
  resize: vertical;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel {
  background: #f0f4f8;
  color: #4a6583;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.btn-submit {
  background: linear-gradient(135deg, #4b6cb7, #182848);
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.audit-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #eee;
}

.audit-section h4 {
  margin-bottom: 10px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-horizontal {
    flex-direction: column;
  }
  
  .filter-group {
    min-width: 100%;
    width: 100%;
  }
  
  .action-btn {
    margin-bottom: 8px;
    width: 100%;
  }
  
  .modal-content {
    width: 95%;
  }
  
  .shipping-detail {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
