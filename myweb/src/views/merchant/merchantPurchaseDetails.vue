<template>
  <div class="container">

    <div class="search-filter-container">
      <div class="search-box">
        <i class="fas fa-search search-icon"></i>
        <input type="text" placeholder="搜索农户、产品或地点...">
      </div>

      <div class="filter-section">
        <select class="filter-select">
          <option>所有状态</option>
          <option>待处理</option>
          <option>已批准</option>
          <option>已拒绝</option>
        </select>

        <select class="filter-select">
          <option>所有地区</option>
          <option>华东地区</option>
          <option>华南地区</option>
          <option>华北地区</option>
          <option>西部地区</option>
        </select>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-card">
        <h3>总申请数</h3>
        <div class="stat-value">42</div>
      </div>

      <div class="stat-card">
        <h3>平均报价</h3>
        <div class="stat-value">¥128.50</div>
      </div>

    </div>

    <div class="applications-container">
      <div class="section-header">
        <h2><i class="fas fa-file-alt"></i> 采购申请列表</h2>
        <div>
          <span>排序: </span>
          <select class="filter-select" style="width: auto;">
            <option>最新申请</option>
            <option>价格最低</option>
            <option>价格最高</option>
            <option>评级最高</option>
          </select>
        </div>
      </div>

      <div class="application-list">
        <div class="application-card" v-for="(application, index) in applications" :key="index">
          <span :class="['status-badge', `status-${application.status}`]">
            {{ getStatusText(application.status) }}
          </span>

          <div class="card-header">
            <img :src="application.farmerAvatar" alt="农户头像" class="farmer-avatar">
            <div class="farmer-info">
              <div class="farmer-name">{{ application.farmerName }}</div>
              <div class="farmer-rating">
                <div v-for="n in 5" :key="n">
                  <i v-if="n <= application.rating" class="fas fa-star"></i>
                  <i v-else-if="n - 0.5 === application.rating" class="fas fa-star-half-alt"></i>
                  <i v-else class="far fa-star"></i>
                </div>
                <span>{{ `${application.rating} (${application.reviews}评价)` }}</span>
              </div>
            </div>
          </div>

          <div class="application-details">
            <div class="detail-row">
              <div class="detail-label">报价:</div>
              <div class="detail-value">
                <span class="price-tag">{{ application.price }}</span> ({{ application.quantity }})
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-label">发货地:</div>
              <div class="detail-value">{{ application.shippingLocation }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">申请时间:</div>
              <div class="detail-value">{{ application.applicationTime }}</div>
            </div>
          </div>

          <div class="card-actions">
            <button class="action-btn profile" @click="handleAction(application.farmerName, 'profile')">
              <i class="fas fa-user"></i> 查看主页
            </button>
            <button class="action-btn message" @click="handleAction(application.farmerName, 'message')">
              <i class="fas fa-comment"></i> 消息
            </button>
            <button class="action-btn record" @click="handleAction(application.farmerName, 'record')">
              <i class="fas fa-seedling"></i> 查看详情
            </button>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button class="pagination-btn">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="pagination-btn active">1</button>
        <button class="pagination-btn">2</button>
        <button class="pagination-btn">3</button>
        <button class="pagination-btn">4</button>
        <button class="pagination-btn">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      applications: [
        {
          status: 'pending',
          farmerName: '李大山',
          rating: 4.5,
          reviews: 86,
          product: '有机西红柿',
          price: '¥125.00/箱',
          quantity: '20kg',
          shippingLocation: '山东省寿光市',
          applicationTime: '2025-07-01 14:30',
          farmerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
        },
        {
          status: 'approved',
          farmerName: '张翠花',
          rating: 5.0,
          reviews: 142,
          product: '绿色苹果',
          price: '¥98.50/箱',
          quantity: '15kg',
          shippingLocation: '陕西省延安市',
          applicationTime: '2025-06-28 10:15',
          farmerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80'
        },
        {
          status: 'pending',
          farmerName: '王建国',
          rating: 4.0,
          reviews: 64,
          product: '有机大米',
          price: '¥210.00/袋',
          quantity: '25kg',
          shippingLocation: '黑龙江省五常市',
          applicationTime: '2025-06-30 16:45',
          farmerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
        },
        {
          status: 'rejected',
          farmerName: '刘彩云',
          rating: 3.5,
          reviews: 45,
          product: '生态茶叶',
          price: '¥350.00/斤',
          quantity: '500g',
          shippingLocation: '浙江省杭州市',
          applicationTime: '2025-06-25 09:20',
          farmerAvatar: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
        }
      ]
    };
  },
  methods: {
    getStatusText(status) {
      const statusMap = {
        'pending': '待处理',
        'approved': '已批准',
        'rejected': '已拒绝'
      };
      return statusMap[status] || status;
    },
    handleAction(farmerName, actionType) {
      if (actionType === 'profile') {
        alert(`查看 ${farmerName} 的农户主页`);
      } else if (actionType === 'message') {
        alert(`与 ${farmerName} 互通消息`);
      } else if (actionType === 'record') {
        alert(`查看 ${farmerName} 的种植记录`);
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'Microsoft YaHei', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
  line-height: 1.6;
  padding: 20px;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

header {
  text-align: center;
  padding: 30px 0;
  margin-bottom: 20px;
  position: relative;
}

header h1 {
  font-size: 2.8rem;
  color: #1b5e20;
  margin-bottom: 10px;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
  position: relative;
  display: inline-block;
}

header h1::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: #4caf50;
  border-radius: 2px;
}

.header-desc {
  font-size: 1.2rem;
  color: #388e3c;
  max-width: 700px;
  margin: 20px auto 0;
  padding: 10px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
}

.search-filter-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(46, 125, 50, 0.1);
  border: 1px solid #c5e1a5;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 14px 20px 14px 50px;
  border: 1px solid #c5e1a5;
  border-radius: 50px;
  font-size: 1rem;
  background: #f1f8e9;
  color: #1b5e20;
  transition: all 0.3s;
}

.search-box input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3);
  border-color: #4caf50;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #4caf50;
  font-size: 1.2rem;
}

.filter-section {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 12px 20px;
  border-radius: 50px;
  border: 1px solid #c5e1a5;
  background: #f1f8e9;
  color: #1b5e20;
  font-size: 1rem;
  min-width: 180px;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3);
  border-color: #4caf50;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(46, 125, 50, 0.1);
  border: 1px solid #c5e1a5;
  transition: all 0.3s;
  text-align: center;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(46, 125, 50, 0.15);
}

.stat-card h3 {
  font-size: 1.1rem;
  color: #4caf50;
  margin-bottom: 15px;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1b5e20;
  margin-bottom: 10px;
}

.stat-desc {
  color: #388e3c;
  font-size: 0.95rem;
}

.applications-container {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(46, 125, 50, 0.1);
  border: 1px solid #c5e1a5;
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e8f5e9;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #2e7d32;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-header i {
  color: #4caf50;
}

.application-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.application-card {
  background: #f1f8e9;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(46, 125, 50, 0.08);
  border: 1px solid #c5e1a5;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.application-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(46, 125, 50, 0.15);
  border-color: #4caf50;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e8f5e9;
}

.farmer-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e8f5e9;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  margin-right: 15px;
}

.farmer-info {
  flex: 1;
}

.farmer-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1b5e20;
  margin-bottom: 5px;
}

.farmer-rating {
  display: flex;
  align-items: center;
  color: #ff9800;
  font-size: 0.9rem;
}

.application-details {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  margin-bottom: 12px;
}

.detail-label {
  width: 100px;
  font-weight: 600;
  color: #1b5e20;
}

.detail-value {
  flex: 1;
  color: #2e7d32;
}

.price-tag {
  font-weight: 700;
  font-size: 1.2rem;
  color: #e74c3c;
}

.status-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-pending {
  background: #ffecb3;
  color: #f57c00;
}

.status-approved {
  background: #c8e6c9;
  color: #2e7d32;
}

.status-rejected {
  background: #ffcdd2;
  color: #c62828;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: #4caf50;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-btn:hover {
  opacity: 0.9;
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.4);
}

.action-btn.profile {
  background: #1b5e20;
}

.action-btn.message {
  background: #3498db;
}

.action-btn.record {
  background: #9c27b0;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #c5e1a5;
  background: white;
  color: #2e7d32;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.pagination-btn:hover, .pagination-btn.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.pagination-btn i {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .search-filter-container {
    flex-direction: column;
  }
  
  .filter-section {
    width: 100%;
  }
  
  .filter-select {
    flex: 1;
  }
  
  .application-list {
    grid-template-columns: 1fr;
  }
  
  .card-actions {
    flex-wrap: wrap;
  }
  
  .action-btn {
    min-width: calc(50% - 5px);
  }
}
</style>