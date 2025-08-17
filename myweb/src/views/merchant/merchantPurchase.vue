<template>
  <div class="container">
    <header>
      <div class="header-title">
        <h1>我的采购信息</h1>
      </div>
      <div class="header-buttons">
        <button class="toggle-btn" @click="toggleShowClosed">
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
                <span class="label"> 采购量</span>
                <span class="value">{{ purchase.quantity }}</span>
              </div>
              <div class="meta-item">
                <span class="label"> 创建时间</span>
                <span class="value">{{ purchase.creationDate }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="action-btn detail-btn" @click.stop="viewPurchase(purchase)">
           查看申请
          </button>
          <button class="action-btn close-btn" @click.stop="closePurchase(purchase)">
           关闭申请
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

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 原始数据列表
const purchases = ref([])

// 视图控制
const showClosed = ref(false)
const currentPage = ref(1)
const pageSize = 6 // 每页显示数量

//格式化日期
const formatDate = (val) => {
  if (!val) return ''
  const d = typeof val === 'string' || typeof val === 'number' ? new Date(val) : val
  if (Number.isNaN(d.getTime())) return String(val)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

//状态归一
const normalizeStatus = (s) => {
  if (!s) return 'open'
  const t = String(s).toLowerCase()
  if (['closed', 'close', 'ended', 'finished', 'done'].includes(t)) return 'closed'
  if (['已关闭', '关闭', '已结束', '结束', '完成'].some(k => t.includes(k))) return 'closed'
  if (['open', 'opening', 'active'].includes(t)) return 'open'
  if (['进行中', '打开', '发布中'].some(k => t.includes(k))) return 'open'
  return t
}

const isClosed = (status) => normalizeStatus(status) === 'closed'

// 正常化一条采购数据，后端字段可能不统一，这里做兼容映射
const normalizePurchase = (d, index) => {
  const id = d.id ?? d.demand_id ?? d.purchase_id ?? d.pk ?? index + 1
  const title = d.title ?? d.product_name ?? `采购 #${id}`
  const status = normalizeStatus(d.status ?? d.state ?? d.phase)
  const quantity = d.quantity ?? d.amount ?? d.count ?? 0
  const created = d.updated_at ?? d.creationDate ?? d.created_at ?? d.createdAt ?? d.create_time;
  const deliveryAddress =
    d.deliveryAddress ??
    d.delivery_address ??
    d.address ??
    [d.province, d.city, d.district, d.address_detail].filter(Boolean).join(' ')
  const ownerId = d.ownerId ?? d.user_id ?? d.creator_id ?? d.merchant_id ?? d.publisher_id

  return {
    id,
    title,
    status,
    quantity,
    creationDate: formatDate(created),
    deliveryAddress: deliveryAddress || '',
    ownerId
  }
}

// 拉取数据
const isLoading = ref(false)
const fetchPurchases = async () => {
  try {
    isLoading.value = true
    const res = await axios.get('http://localhost:3000/api/demands/all', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    const list = Array.isArray(res.data) ? res.data : []
    purchases.value = list.map((d, i) => normalizePurchase(d, i))
    console.log('原始采购数据:', res.data);

    // 拉取后重置页码，避免页码越界
    currentPage.value = 1
  } catch (err) {
    console.error('获取采购需求失败:', err)
    ElMessage.error(err.response?.data?.error || '获取采购需求失败')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchPurchases)

const myPurchases = computed(() => {
  const uid = userStore.userId
  const hasOwnerKey = purchases.value.some(p => p.ownerId !== undefined && p.ownerId !== null && p.ownerId !== '')
  if (!hasOwnerKey || !uid) return purchases.value
  return purchases.value.filter(p => String(p.ownerId) === String(uid))
})

// 状态过滤
const filteredPurchases = computed(() => {
  return myPurchases.value.filter(p => {
    const closed = isClosed(p.status)
    return showClosed.value ? closed : !closed
  })
})

// 分页
const totalPages = computed(() => Math.max(1, Math.ceil(filteredPurchases.value.length / pageSize)))
const paginatedPurchases = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPurchases.value.slice(start, start + pageSize)
})

// 切换查看关闭/打开
const toggleShowClosed = () => {
  showClosed.value = !showClosed.value
  currentPage.value = 1
}

// 新增采购
const addPurchase = () => {
  router.push('/merchant/addpurchase')
}

// 查看某个采购详情/申请
const viewPurchase = (purchase) => {
  router.push(`/merchant/purchases/${purchase.id}`)
}

// 查看某个采购详情/申请
const closePurchase = (purchase) => {
  router.push(`/merchant/purchases/${purchase.id}`)
}

const statusClass = (status) => {
  const s = normalizeStatus(status)
  return {
    'status-open': s === 'open',
    'status-closed': s === 'closed',
    'status-pending': s === 'pending'
  }
}

// 保证在切换视图时回到第一页
watch(showClosed, () => { currentPage.value = 1 })
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
  height: 250px;
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
  background: #ffffff;
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

.close-btn {
  background: linear-gradient(135deg, #f7898971, #f23939ac);
  color: white;
  box-shadow: 0 4px 10px rgba(254, 255, 166, 0.25);
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