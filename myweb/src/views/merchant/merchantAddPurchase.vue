<template>
  <div class="container">
    <div class="content-wrapper">
      <!-- 发布采购表单 -->
      <section class="form-section">
        <h2><i class="fas fa-edit"></i> 需求信息</h2>
        <div class="form-group">
          <label for="crop">作物种类:</label>
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
          <label for="quantity">需求数量 (kg)</label>
          <input
            type="number"
            id="quantity"
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

      <!-- 价格信息展示 -->
      <section v-if="priceData.data.length" class="price-section">
        <div class="price-title">
          {{ priceData.product }} - {{ priceData.province }} 平均价格
        </div>
        <el-table :data="priceData.data" border class="price-table">
          <el-table-column prop="province" label="省份" width="150" />
          <el-table-column prop="avg_price" label="均价 (元/斤)" />
        </el-table>
        <div class="trend-chart" ref="trendChart"></div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
// 表单数据
const formData = ref({
  crop: '',
  quantity: ''
})

// 作物选项
const crops = ref(['辣椒', '白菜', '菠菜', '葱', '豆角', 
        '番茄', '黄瓜', '萝卜', '南瓜', '茄子', 
        '山药', '蒜', '土豆', '莴苣'])

// 价格数据
const priceData = ref({ product: '', province: '', data: [] })
const trendData = ref([])

const province = '甘肃省' // 这里你可以绑定到用户选择的省份

// 获取价格数据
const loadPriceData = async () => {
  if (!formData.value.crop) return

  const { data } = await axios.get('http://localhost:3000/api/product-price', {
    params: { productName: formData.value.crop, province },
    headers: { Authorization: `Bearer ${userStore.token}` }
  })
  priceData.value = data

  const resTrend = await axios.get('http://localhost:3000/api/price-trends', {
    params: { product: formData.value.crop, province },
    headers: { Authorization: `Bearer ${userStore.token}` }
  })
  trendData.value = resTrend.data

  await nextTick()
  drawChart()
}

// 绘制价格趋势图
const drawChart = () => {
  const chart = echarts.init(document.querySelector('.trend-chart'))
  chart.setOption({
    title: { text: '价格趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: trendData.value.map(t => t.update_date) },
    yAxis: { type: 'value' },
    series: [
      {
        data: trendData.value.map(t => t.avg),
        type: 'line',
        smooth: true
      }
    ]
  })
}

// 发布采购
const submitForm = async () => {
  await axios.post(
    'http://localhost:3000/api/demands',
    {
      product_name: formData.value.crop,
      quantity: formData.value.quantity
    },
    {
      headers: { Authorization: `Bearer ${userStore.token}` }
    }
  )
  alert('采购发布成功')
  resetForm()
}

// 重置表单
const resetForm = () => {
  router.push('/merchant/purchases');
}
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