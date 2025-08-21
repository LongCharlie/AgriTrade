<template>
  <div class="container">
    <div class="content-wrapper">

      <!-- 需求信息 -->
      <section class="form-section">
        <h2><i class="fas fa-edit"></i> 需求信息</h2>

        <div class="form-group">
          <label>作物种类:</label>
          <el-select
            v-model="formData.crop"
            placeholder="请选择作物种类"
            clearable
            filterable
            @change="loadPriceData"
          >
            <el-option
              v-for="(product, index) in crops"
              :key="product + index"
              :label="product"
              :value="product"
            />
          </el-select>
        </div>

        <div class="form-group">
          <label>需求数量 (kg)</label>
          <input
            type="number"
            v-model="formData.quantity"
            placeholder="请输入采购数量"
          />
        </div>

        <div class="button-group">
          <button id="submitBtn" @click="submitForm">
            <i class="fas fa-paper-plane"></i> 发布采购
          </button>
          <button id="cancelBtn" @click="resetForm">
            <i class="fas fa-times"></i> 取消
          </button>
        </div>
      </section>

      <!-- 价格展示 -->
      <section class="form-section">
        <h2><i class="fas fa-chart-line"></i> 价格信息</h2>

        <!-- 省份选择 -->
        <div class="form-group">
          <label>省份:</label>
          <el-select
            v-model="selectedProvince"
            placeholder="请选择省份"
            clearable
            filterable
            @change="loadPriceData"
          >
            <el-option
              v-for="(p, index) in provinces"
              :key="p + index"
              :label="p"
              :value="p"
            />
          </el-select>
        </div>

        <!-- 价格表 -->
        <div class="price-title">
          {{ productCnName }} - {{ priceData.province }} 平均价格
        </div>
        <el-table :data="priceData.data" border class="price-table">
          <el-table-column prop="province" label="省份" width="150" />
          <el-table-column prop="average_price" label="均价 (元/斤)" />
        </el-table>
        <div v-if="!priceData.data.length" class="no-data-tip">
          暂无 {{ formData.crop }} 在 {{ selectedProvince }} 的价格数据
        </div>

        <!-- 趋势图 -->
        <div class="trend-chart" ref="trendChart"></div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()

// 中文 → 拼音映射表
const cropNameMap = {
  '辣椒': 'lajiao', '白菜': 'baicai', '菠菜': 'bocai',
  '葱': 'cong', '豆角': 'doujiao', '番茄': 'fanqie',
  '黄瓜': 'huanggua', '萝卜': 'luobo', '南瓜': 'nangua',
  '茄子': 'qiezi', '山药': 'shanyao', '蒜': 'suan',
  '土豆': 'tudou', '莴苣': 'woju'
}

// 构造反向映射表（拼音 → 中文）
const cropNameMapReverse = {}
for (const [cn, py] of Object.entries(cropNameMap)) {
  cropNameMapReverse[py] = cn
}

const crops = ref(Object.keys(cropNameMap))
const provinces = ref([
  '北京', '天津', '上海', '重庆',
  '河北', '山西', '辽宁', '吉林', '黑龙江',
  '江苏', '浙江', '安徽', '福建', '江西', '山东',
  '河南', '湖北', '湖南', '广东', '海南',
  '四川', '贵州', '云南', '陕西', '甘肃', '青海',
  '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆',
  '香港', '澳门'
])

const selectedProvince = ref('甘肃')

const formData = ref({
  crop: '白菜',
  quantity: ''
})

const priceData = ref({ product: '', province: '', data: [] })
const trendData = ref([])

// 计算属性：显示用的中文名
const productCnName = computed(() => {
  const pinyin = priceData.value.product
  return cropNameMapReverse[pinyin] || formData.value.crop || pinyin
})

const loadPriceData = async () => {
  if (!formData.value.crop || !selectedProvince.value) return

  const cropPinyin = cropNameMap[formData.value.crop] || formData.value.crop

  try {
    const { data } = await axios.get('http://localhost:3000/api/product-price', {
      params: { productName: cropPinyin, province: selectedProvince.value },
      headers: { Authorization: `Bearer ${userStore.token}` }
    })

    priceData.value = data
    if (data.data.length === 0) {
      ElMessage.warning(`暂无 ${formData.value.crop} 在 ${selectedProvince.value} 的价格数据`)
    }
  } catch (err) {
    ElMessage.error('价格数据加载失败，请稍后重试')
    priceData.value = { product: '', province: '', data: [] }
  }

  try {
    const resTrend = await axios.get('http://localhost:3000/api/price-trends', {
      params: { product: cropPinyin, province: selectedProvince.value },
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    trendData.value = resTrend.data
  } catch (err) {
    ElMessage.warning('价格趋势加载失败')
    trendData.value = []
  }

  await nextTick()
  drawChart()
}

import dayjs from 'dayjs'

const drawChart = () => {
  const el = document.querySelector('.trend-chart')
  if (!el) return

  const chart = echarts.init(el)

  // 格式化时间戳为日期字符串
  const formattedDates = trendData.value.map(t => dayjs(t.update_date).format('YYYY-MM-DD'))

  chart.setOption({
    title: { text: '价格趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: formattedDates },
    yAxis: { type: 'value' },
    series: [{ data: trendData.value.map(t => t.avg), type: 'line', smooth: true }]
  })
}


const submitForm = async () => {
  if (!formData.value.crop || !formData.value.quantity) {
    ElMessage.warning('请填写完整的采购信息')
    return
  }

  try {
    await axios.post(
      'http://localhost:3000/api/demands',
      {
        product_name: formData.value.crop, // ✅ 使用中文作物名，如“葱”
        quantity: formData.value.quantity
      },
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    )
    ElMessage.success('采购发布成功')
    resetForm()
  } catch (err) {
    ElMessage.error('采购发布失败，请稍后重试')
  }
}


const resetForm = () => {
  formData.value.crop = ''
  formData.value.quantity = ''
  router.push('/merchant/purchases')
}

onMounted(() => {
  loadPriceData()
})
</script>

<style scoped>

.form-section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.price-section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
}

.price-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.trend-chart {
  margin-top: 20px;
  height: 300px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  color: #333;
  line-height: 1.6;
  padding: 20px;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  padding: 30px 0;
  margin-bottom: 30px;
}

header h1 {
  font-size: 2.8rem;
  color: #2c3e50;
  margin-bottom: 10px;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
}

header p {
  font-size: 1.2rem;
  color: #7f8c8d;
  max-width: 700px;
  margin: 0 auto;
}

.content-wrapper {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.form-section {
  flex: 1;
  min-width: 300px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 30px;
  transition: transform 0.3s ease;
}

.form-section:hover {
  transform: translateY(-5px);
}

.prediction-section {
  flex: 1;
  min-width: 300px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 30px;
  transition: transform 0.3s ease;
}

.prediction-section:hover {
  transform: translateY(-5px);
}

h2 {
  font-size: 1.8rem;
  color: #3498db;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f3f7;
  display: flex;
  align-items: center;
}

h2 i {
  margin-right: 10px;
  color: #3498db;
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

input, select, textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radio-option input {
  width: auto;
}

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.button-group button {
  flex: 1;
}

button {
  background: #3498db;
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

button:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

#cancelBtn {
  background: #95a5a6;
}

#cancelBtn:hover {
  background: #7f8c8d;
}

button i {
  margin-right: 8px;
}

.table-container {
  overflow-x: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 350px;
}

th {
  background: #3498db;
  color: white;
  text-align: left;
  padding: 16px;
  font-weight: 600;
}

td {
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f9ff;
}

.price-up {
  color: #e74c3c;
  font-weight: bold;
}

.price-down {
  color: #27ae60;
  font-weight: bold;
}

.province-header {
  background: #2c3e50;
}

.highlight {
  background-color: #fffde7;
  font-weight: bold;
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.prediction-header select {
  width: 100px;
  padding: 10px;
}

.update-info {
  margin-top: 10px;
  text-align: right;
  font-size: 0.9rem;
  color: #7f8c8d;
  font-style: italic;
}

.info-box {
  background: #e3f2fd;
  border-left: 4px solid #3498db;
  padding: 15px;
  border-radius: 0 8px 8px 0;
  margin: 20px 0;
  font-size: 0.95rem;
}

.info-box i {
  color: #3498db;
  margin-right: 10px;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  header h1 {
    font-size: 2.2rem;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>