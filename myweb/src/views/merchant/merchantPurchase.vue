<template>
  <div class="container">
    <header>
      <div class="header-title">
        <h1>我的采购信息</h1>
      </div>
      <div class="header-buttons">
        <button class="toggle-btn" @click="toggleShowClosed">
          <i class="fas fa-sync"></i>
          {{ showClosed ? '查看打开采购' : '查看已关闭采购' }}
        </button>
        <button class="add-btn" @click="addPurchase">
          <i class="fas fa-plus"></i>
          添加新采购
        </button>
      </div>
    </header>

    <div class="purchase-container">
      <!-- 采购卡片 -->
      <div class="purchase-card" v-for="purchase in paginatedPurchases" :key="purchase.id">
        <div class="card-header">
          <div class="card-header-title">
            <h3>{{ purchase.title }}</h3>
          </div>
          <div class="status-badge" :class="statusClass(purchase.status)">
            {{ purchase.status }}
          </div>
        </div>
        
        <div class="card-content">
          <div class="card-meta">
            <div class="meta-row">
              <div class="meta-item">
                <span class="label"><i class="fas fa-weight-hanging"></i> 采购量</span>
                <span class="value">{{ purchase.quantity }}</span>
              </div>
              <div class="meta-item">
                <span class="label"><i class="far fa-calendar"></i> 创建时间</span>
                <span class="value">{{ purchase.creationDate }}</span>
              </div>
            </div>

            <div class="meta-row">
              <div class="meta-item-full">
                <span class="label"><i class="fas fa-truck"></i> 收货地址</span>
                <div class="delivery-info">
                  {{ purchase.deliveryAddress }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="action-btn detail-btn" @click.stop="viewPurchase(purchase)">
            <i class="fas fa-eye"></i> 查看申请
          </button>
          <button class="action-btn modify-btn" @click.stop="modifyPurchase(purchase)">
            <i class="fas fa-edit"></i> 修改采购
          </button>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div class="empty-state" v-if="paginatedPurchases.length === 0">
        <div class="empty-icon"><i class="fas fa-clipboard-list"></i></div>
        <div class="empty-text">
          {{ showClosed ? '您没有已关闭的采购' : '您还没有发布任何采购信息' }}
        </div>
        <button class="add-btn" @click="addPurchase">
          <i class="fas fa-plus"></i>
          {{ showClosed ? '发布新采购' : '发布第一个采购' }}
        </button>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <button @click="currentPage = 1" :disabled="currentPage === 1">第一页</button>
      <button @click="currentPage--" :disabled="currentPage === 1">上一页</button>
      <span>第{{ currentPage }}页，共{{ totalPages }}页</span>
      <button @click="currentPage++" :disabled="currentPage === totalPages">下一页</button>
      <button @click="currentPage = totalPages" :disabled="currentPage === totalPages">最后一页</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      showClosed: false,
      purchases: [
        {
          id: 1,
          title: '西红柿',
          quantity: 500,
          unit: '公斤',
          creationDate: '2023-12-15',
          status: '打开',
          deliveryAddress: '北京市朝阳区',
          isnot: '否',
          deliveryProvinces: ['北京', '天津']
        },
        {
          id: 2,
          title: '凤梨',
          quantity: 300,
          unit: '箱',
          creationDate: '2023-12-20',
          status: '打开',
          deliveryAddress: '上海市浦东新区',
          isnot: '是'
        },
        {
          id: 3,
          title: '大米',
          quantity: 2000,
          unit: '吨',
          creationDate: '2024-01-10',
          status: '关闭',
          deliveryAddress: '广州市天河区',
          isnot: '是'
        },
        {
          id: 5,
          title: '西兰花',
          quantity: 800,
          unit: '公斤',
          creationDate: '2023-12-25',
          status: '打开',
          deliveryAddress: '杭州市西湖区',
          isnot: '否',
          deliveryProvinces: ['浙江', '江苏']
        },
        {
          id: 6,
          title: '土豆',
          quantity: 1000,
          unit: '公斤',
          creationDate: '2023-12-18',
          status: '关闭',
          deliveryAddress: '成都市武侯区',
          isnot: '否',
          deliveryProvinces: ['四川', '重庆']
        },
        {
          id: 7,
          title: '荔枝',
          quantity: 500,
          unit: '箱',
          creationDate: '2023-12-20',
          status: '打开',
          deliveryAddress: '南京市鼓楼区',
          isnot: '是'
        },
        {
          id: 8,
          title: '贵妃芒',
          quantity: 200,
          unit: '箱',
          creationDate: '2023-12-25',
          status: '打开',
          deliveryAddress: '重庆市渝中区',
          isnot: '否',
          deliveryProvinces: ['重庆', '四川']
        },
        {
          id: 9,
          title: '鲜肉',
          quantity: 1200,
          unit: '公斤',
          creationDate: '2023-12-15',
          status: '关闭',
          deliveryAddress: '武汉市洪山区',
          isnot: '是'
        },
        {
          id: 10,
          title: '脐橙',
          quantity: 300,
          unit: '箱',
          creationDate: '2023-12-31',
          status: '打开',
          deliveryAddress: '西安市雁塔区',
          isnot: '否',
          deliveryProvinces: ['陕西', '山西']
        },
        {
          id: 11,
          title: '草莓',
          quantity: 300,
          unit: '盒',
          creationDate: '2023-12-31',
          status: '打开',
          deliveryAddress: '西安市雁塔区',
          isnot: '是'
        }
      ]
    };
  },
  computed: {
    // 筛选采购信息（根据状态）
    filteredPurchases() {
      return this.purchases.filter(p =>
        this.showClosed ? p.status === '关闭' : p.status === '打开'
      );
    },
    // 分页处理后的采购信息
    paginatedPurchases() {
      const pageSize = 9;
      return this.filteredPurchases.slice(
        (this.currentPage - 1) * pageSize,
        this.currentPage * pageSize
      );
    },
    // 总页数计算
    totalPages() {
      return Math.ceil(this.filteredPurchases.length / 9);
    }
  },
  methods: {
    // 切换显示打开/关闭的采购
    toggleShowClosed() {
      this.showClosed = !this.showClosed;
      this.currentPage = 1; // 切换时重置到第一页
    },
    // 获取状态标签的样式类
    statusClass(status) {
      return status === '打开' ? 'status-open' : 'status-closed';
    },
    // 添加新采购
    addPurchase() {
       this.$router.push('/merchant/addPurchase');
    },
    // 查看采购详情
    viewPurchase() {
      this.$router.push('/merchant/purchaseDetail');
    },
    // 修改采购信息
    modifyPurchase(purchase) {
      alert(`修改采购信息: ${purchase.title}`);
      // 实际应用中可使用this.$router.push(`/purchase/${purchase.id}/edit`)导航到编辑页
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

body {
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
  color: #333;
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 25px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 100%;
  background: linear-gradient(to bottom, #4caf50, #8bc34a);
}

.header-title h1 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 8px;
  padding-left: 15px;
}

.header-title p {
  color: #7f8c8d;
  font-size: 16px;
  padding-left: 15px;
}

.header-buttons {
  display: flex;
  gap: 20px;
  align-items: center;
}

.toggle-btn {
  background: linear-gradient(135deg, #81c784, #66bb6a);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(129, 199, 132, 0.3);
}

.toggle-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(129, 199, 132, 0.4);
}

.add-btn {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.add-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.purchase-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.purchase-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  position: relative;
  height: 350px;
  display: flex;
  flex-direction: column;
  border-top: 4px solid #ffffff;
}

.purchase-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px 20px 15px;
  border-bottom: 1px solid #f0f4f8;
  position: relative;
}

.card-header h3 {
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.card-header h3 i {
  color: #4caf50;
  margin-right: 10px;
  font-size: 20px;
}

.status-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.status-open {
  background: #e8f5e9;
  color: #42a147ca;
}

.status-closed {
  background: #ffebee;
  color: #c62828;
}

.card-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-meta {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
}

.meta-item {
  display: flex;
  flex-direction: column;
  width: 48%;
}

.label {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
}

.label i {
  margin-right: 8px;
  color: #81c784;
  font-size: 15px;
}

.value {
  font-size: 17px;
  font-weight: 600;
  color: #2c3e50;
}

.delivery-info {
  background: #f1f8e9;
  border-radius: 10px;
  padding: 12px 15px;
  margin-top: 5px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 15px;
  justify-content: center;
  padding: 0 20px 20px;
}

.action-btn {
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  font-weight: 500;
}

.detail-btn {
  background: linear-gradient(135deg, #29b5f671, #0289d1ac);
  color: white;
  box-shadow: 0 4px 10px rgba(41, 182, 246, 0.25);
}

.modify-btn {
  background: linear-gradient(135deg, #78b87bb7, #52af57be);
  color: white;
  box-shadow: 0 4px 10px rgba(102, 187, 106, 0.25);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.action-btn i {
  font-size: 14px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  margin-top: 20px;
}

.empty-icon {
  font-size: 80px;
  color: #c8e6c9;
  margin-bottom: 25px;
}

.empty-text {
  font-size: 24px;
  color: #7f8c8d;
  margin-bottom: 30px;
  font-weight: 500;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.pagination button {
  padding: 8px 18px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: #4caf50;
  color: white;
  box-shadow: 0 3px 8px rgba(76, 175, 80, 0.3);
}

.pagination span {
  padding: 0 15px;
  color: #7f8c8d;
  font-weight: 500;
}

.product-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e8f5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #4caf50;
}

.card-header-title {
  display: flex;
  align-items: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
    padding: 25px 15px;
  }
  
  header::before {
    width: 100%;
    height: 6px;
  }
  
  .header-title {
    width: 100%;
  }
  
  .header-buttons {
    width: 100%;
    flex-direction: column;
  }
  
  .purchase-container {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}
</style>