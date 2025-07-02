<template>
  <div class="container">
    <header>
      <div class="header-title">
        <h1>我的采购信息</h1>
      </div>
      <button class="add-btn" @click="addPurchase">
        <i class="fas fa-plus"></i>
        添加新采购
      </button>
    </header>
    
    <div class="purchase-container">
      
      <!-- 采购信息卡片 -->
      <div class="purchase-card" v-for="purchase in paginatedPurchases" :key="purchase.id">
        <div class="card-content">
          <h3>{{ purchase.title }}</h3>
          <div class="card-meta">
  <div class="meta-row">
    <div class="meta-item">
      <span class="label">需求量</span>
      <span class="value demand-value">{{ purchase.demand }}</span>
    </div>
    <div class="meta-item">
      <span class="label">创建时间</span>
      <span class="value">{{ purchase.creationDate }}</span>
    </div>
  </div>
  <div class="meta-row">
    <div class="meta-item">
      <span class="label">状态</span>
      <span class="value">{{ purchase.status }}</span>
    </div>
    <div class="meta-item">
      <span class="label">收货地</span>
      <span class="value">{{ purchase.deliveryAddress }}</span>
    </div>
  </div>
  <div class="meta-row">
    <div class="meta-item-full">
      <span class="label">是否全国范围</span>
      <span class="value">{{ purchase.isnot }}</span>
    </div>
  </div>
</div>
</div>
        <div class="action-buttons">
          <div class="action-btn detail-btn" @click.stop="editPurchase(purchase)">
            <i class="fas fa-edit"></i>
            查看申请
          </div>
          <div class="action-btn delete-btn" @click.stop="deletePurchase(purchase)">
            <i class="fas fa-trash"></i>
            删除
          </div>
        </div>
      </div>
      
      <!-- 空状态提示 -->
      <div class="empty-state" v-if="paginatedPurchases.length === 0 && purchases.length === 0">
        <div class="empty-icon">
          <i class="fas fa-clipboard-list"></i>
        </div>
        <div class="empty-text">您还没有发布任何采购信息</div>
        <button class="add-btn" @click="addPurchase">
          <i class="fas fa-plus"></i>
          发布第一个采购
        </button>
      </div>
    </div>
    
    <!-- 分页导航 -->
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
      purchases: [
        {
          id: 1,
          title: "新鲜有机蔬菜",
          description: "需要各类有机蔬菜，包括西红柿、黄瓜、菠菜等，要求无农药残留，新鲜采摘。",
          image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          demand: "500 kg/天",
          creationDate: "2023-12-15",
          status: "进行中",
          deliveryAddress: "北京市朝阳区",
          isnot:"是"
        },
        {
          id: 2,
          title: "优质水果",
          description: "采购苹果、香蕉、橙子等当季水果，要求产地直供，新鲜无损伤。",
          image: "https://images.unsplash.com/photo-1467453678174-768ec283a940?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          demand: "300 kg/周",
          creationDate: "2023-12-20",
          status: "待处理",
          deliveryAddress: "上海市浦东新区",
          isnot:"是"
        },
        {
          id: 3,
          title: "有机大米",
          description: "采购东北有机大米，要求无添加剂，真空包装，月供量稳定。",
          image: "https://images.unsplash.com/photo-1559715541-5daf8a0296d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          demand: "2000 kg/月",
          creationDate: "2024-01-10",
          status: "已完成",
          deliveryAddress: "广州市天河区",
          isnot:"是"
        },
        {
          id: 4,
          title: "优质食用油",
          description: "采购非转基因食用油，要求品牌可靠，品质有保障。",
          image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          demand: "1500 L/月",
          creationDate: "2023-12-15",
          status: "进行中",
          deliveryAddress: "深圳市南山区",
          isnot:"否"
        },
        {
          id: 5,
          title: "冷冻水产品",
          description: "采购各类冷冻海鲜产品，包括虾、鱼、贝类等，要求新鲜冷冻，品质优良。",
          image: "https://images.unsplash.com/photo-1511556532299-8f680e7e1f4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          demand: "800 kg/周",
          creationDate: "2023-12-25",
          status: "待处理",
          deliveryAddress: "杭州市西湖区",
          isnot:"否"
        },
        {
          id: 6,
          title: "鲜奶制品",
          description: "采购各类鲜奶及奶制品，要求保质期新鲜，符合国家标准。",
          image: "https://images.unsplash.com/photo-1563636676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          demand: "1000 L/周",
          creationDate: "2023-12-18",
          status: "已完成",
          deliveryAddress: "成都市武侯区",
          isnot:"否"
        },
        {
          id: 7,
          title: "烘焙原料",
          description: "采购面粉、酵母、黄油等烘焙原料，要求高品质，适合面包、蛋糕制作。",
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          demand: "500 kg/月",
          creationDate: "2023-12-20",
          status: "进行中",
          deliveryAddress: "南京市鼓楼区",
          isnot:"否"
        },
        {
          id: 8,
          title: "调味品及酱料",
          description: "采购各类调味品，包括酱油、醋、盐、糖、鸡精等，要求品牌可靠，口味纯正。",
          image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          demand: "200 kg/月",
          creationDate: "2023-12-25",
          status: "待处理",
          deliveryAddress: "重庆市渝中区",
          isnot:"否"
        },
        {
          id: 9,
          title: "鲜肉及家禽",
          description: "采购各类鲜肉和家禽产品，包括猪肉、牛肉、鸡肉等，要求新鲜无添加。",
          image: "https://images.unsplash.com/photo-1522247020649-aa54b62886e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          demand: "1200 kg/周",
          creationDate: "2023-12-15",
          status: "已完成",
          deliveryAddress: "武汉市洪山区",
          isnot:"否"
        },
        {
          id: 10,
          title: "烘焙工具及消耗品",
          description: "采购烘焙工具，包括烤箱、模具、烘焙纸等，要求质量可靠，品牌知名。",
          image: "https://images.unsplash.com/photo-1576164771414-6391573b204b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          demand: "每季度一批",
          creationDate: "2023-12-31",
          status: "进行中",
          deliveryAddress: "西安市雁塔区",
          isnot:"否"
        },
        {
          id: 11,
          title: "茶叶及咖啡",
          description: "采购各类茶叶及咖啡，包括红茶、绿茶、咖啡豆等，要求品质优，香气足。",
          image: "https://images.unsplash.com/photo-1556679343-c1c4b73b204e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          demand: "300 kg/月",
          creationDate: "2023-12-20",
          status: "待处理",
          deliveryAddress: "长沙市岳麓区",
          isnot:"否"
        },
        {
          id: 12,
          title: "饮料及果汁",
          description: "采购各类饮料及果汁，包括矿泉水、果汁饮料、茶饮料等，要求品牌可靠，品质优。",
          image: "https://images.unsplash.com/photo-1589730801753-91b50b1f9e2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          demand: "500 L/周",
          creationDate: "2023-12-25",
          status: "已完成",
          deliveryAddress: "郑州市金水区",
          isnot:"否"
        }
      ]
    };
  },
  computed: {
    paginatedPurchases() {
      const pageSize = 9;
      return this.purchases.slice(
        (this.currentPage - 1) * pageSize,
        this.currentPage * pageSize
      );
    },
    totalPages() {
      const pageSize = 9;
      return Math.ceil(this.purchases.length / pageSize);
    }
  },
  methods: {

    addPurchase() {
      // alert('跳转到添加采购页面');
      this.$router.push('/addPurchase');
    },
    editPurchase(purchase) {
      alert(`打开申请: ${purchase.title}`);
      this.$router.push('/purchaseDetail');
    },
    deletePurchase(purchase) {
      if (confirm(`确定要删除采购 "${purchase.title}" 吗？`)) {
        this.purchases = this.purchases.filter(p => p.id !== purchase.id);
        
        // 调整分页，如果删除后当前页没有数据且不是第一页，就跳转到上一页
        if (this.currentPage > 1 && this.paginatedPurchases.length === 0) {
          this.currentPage--;
        }
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
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
    
body {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
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
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
    
.header-title h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 5px;
}
    
.header-title p {
  color: #7f8c8d;
  font-size: 16px;
}
    
.add-btn {
  background: linear-gradient(135deg, #3498db, #2c3e50);
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
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}
    
.add-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}
    
.purchase-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}
    
.purchase-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  height: 350px;
  display: flex;
  flex-direction: column;
}
    
.purchase-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}
    
.card-image {
  height: 180px;
  overflow: hidden;
  background: #ecf0f1;
  display: flex;
  align-items: center;
  justify-content: center;
}
    
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
    
.purchase-card:hover .card-image img {
  transform: scale(1.05);
}
    
.card-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
    
.card-content h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #2c3e50;
}
    
.card-content p {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 15px;
  line-height: 1.5;
}
    
.card-meta {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
    
.meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  width: 48%; /* 两个信息项并排显示 */
}

.meta-item-full {
  width: 100%; /* 最后一个信息项单独占据一行 */
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.value {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.demand-value {
  color: #2c3e50;
  font-weight: bold;
}
    
.add-card {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border: 2px dashed #adb5bd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}
    
.add-card:hover {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  border-color: #6c757d;
}
    
.add-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: white;
  font-size: 30px;
  transition: all 0.3s ease;
}
    
.add-card:hover .add-icon {
  transform: scale(1.1);
  background: #2980b9;
}
    
.add-text {
  font-size: 18px;
  color: #6c757d;
  font-weight: 500;
}
    
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}
    
.empty-icon {
  font-size: 80px;
  color: #bdc3c7;
  margin-bottom: 20px;
}
    
.empty-text {
  font-size: 22px;
  color: #7f8c8d;
  margin-bottom: 25px;
}
    
.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
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
  position: relative;
  top: -30px;
}
    
.detail-btn {
  background: #f1f8ff;
  color: #0366d6;
  border: 1px solid #d1e5fa;
}
    
.delete-btn {
  background: #fff0f0;
  color: #d73a49;
  border: 1px solid #f9d1d1;
}
    
.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
    
.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}
    
.pagination button {
  padding: 8px 15px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}
    
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
    
.pagination button:hover:not(:disabled) {
  background: #f8f9fa;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
    
@media (max-width: 768px) {
  header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
    
  .purchase-container {
    grid-template-columns: 1fr;
  }
    
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>