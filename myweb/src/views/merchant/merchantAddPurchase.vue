<template>
  <div class="container">
    <div class="content-wrapper">
      <section class="form-section">
        <h2><i class="fas fa-edit"></i> 需求信息</h2>

        <div class="form-group">
          <label for="crop">作物种类:</label>
          <el-select
              v-model="formData.crop"
              placeholder="请选择作物种类"
              clearable
              filterable
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
          <input type="number" id="quantity" v-model="formData.quantity" placeholder="请输入采购数量">
        </div>

        <div class="form-group">
          <label for="deliveryAddress">收货地址</label>
          <el-cascader
            v-model="selectedText"
            :options="areaOptions"
            :props="{ value: 'label', label: 'label', children: 'children' }"
            @change="handleLocationChange"
            placeholder="请选择省、市、区"
            clearable
          />
        </div>
        
        <div class="form-group" style="grid-column: span 2;">
          <label>详细地址</label>
          <input 
            type="text" 
            v-model="detailAddress"
            placeholder="街道、门牌号等详细信息"
            class="form-control"
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

      <section class="prediction-section">
        <div class="prediction-header">
          <h2><i class="fas fa-chart-line"></i> 价格参考</h2>
          <select id="productFilter" v-model="selectedCrop">
            <option v-for="(crop, index) in crops" :key="crop + index" :value="crop">{{ crop }}</option>
          </select>
        </div>
        
        <p class="update-info">最近更新: {{ lastUpdate }}</p>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>省份</th>
                <th>今日价格 (元/公斤)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in priceData" :key="row.province" :class="{highlight: row.highlight}">
                <td>{{ row.province }}</td>
                <td>{{ row.price }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { pcaTextArr} from "element-china-area-data";

export default {
  data() {
    return {
      areaOptions: pcaTextArr,
      province: '',             // 存储选择的省份
      city: '',                 // 存储选择的城市
      district: '',             // 存储选择的区县
      detailAddress: '',        // 存储详细地址
      selectedText: [],
      selectedLocation: [],     // 用于绑定级联选择器的值（代码数组）
      crops: [
        '辣椒', '白菜', '菠菜', '葱', '豆角', 
        '番茄', '黄瓜', '萝卜', '南瓜', '茄子', 
        '山药', '蒜', '土豆', '莴苣'
      ],
      formData: {
        crop: '辣椒',
        quantity: '',
        address: ''
      },
      selectedCrop: '辣椒',
      lastUpdate: '2025-08-02 10:30',
      priceData: []
    };
  },
  watch: {
    selectedCrop(newCrop) {
      this.updatePriceData(newCrop);
    }
  },
  mounted() {
    this.updatePriceData('辣椒');
  },
  methods: {
    // 处理地址选择变化
   handleLocationChange(textArr) {
    [this.province, this.city, this.district] = textArr || [];
  },
    
    updatePriceData(crop) {
      // 模拟不同作物的价格数据
      const mockData = {
        '辣椒': [
          { province: '北京', price: '¥6.80', weekChange: 1.2, monthChange: 5.4, highlight: true },
          { province: '上海', price: '¥7.20', weekChange: 0.8, monthChange: 4.8 },
          { province: '广东', price: '¥6.50', weekChange: -0.5, monthChange: 3.7 },
          { province: '浙江', price: '¥6.90', weekChange: 1.5, monthChange: 5.1 },
          { province: '四川', price: '¥6.20', weekChange: -1.2, monthChange: 2.9 }
        ],
        '白菜': [
          { province: '北京', price: '¥2.50', weekChange: 0.4, monthChange: 3.2 },
          { province: '上海', price: '¥2.80', weekChange: -0.3, monthChange: 2.7, highlight: true },
          { province: '广东', price: '¥2.30', weekChange: 0.7, monthChange: 4.1 },
          { province: '浙江', price: '¥2.60', weekChange: -0.8, monthChange: 1.9 },
          { province: '四川', price: '¥2.20', weekChange: 1.1, monthChange: 3.5 }
        ],
        '番茄': [
          { province: '北京', price: '¥5.20', weekChange: 2.1, monthChange: 8.3 },
          { province: '上海', price: '¥5.60', weekChange: 1.8, monthChange: 7.5, highlight: true },
          { province: '广东', price: '¥4.90', weekChange: -0.4, monthChange: 5.2 },
          { province: '浙江', price: '¥5.30', weekChange: 1.2, monthChange: 6.8 },
          { province: '四川', price: '¥4.80', weekChange: 0.9, monthChange: 6.1 }
        ],
        '土豆': [
          { province: '北京', price: '¥3.20', weekChange: 0.5, monthChange: 2.1 },
          { province: '上海', price: '¥3.50', weekChange: 0.3, monthChange: 1.8 },
          { province: '广东', price: '¥2.90', weekChange: -0.2, monthChange: 1.2, highlight: true },
          { province: '浙江', price: '¥3.30', weekChange: 0.7, monthChange: 2.3 },
          { province: '四川', price: '¥2.80', weekChange: 0.9, monthChange: 2.5 }
        ]
      };
      
      // 如果没有特定作物的数据，使用辣椒的数据
      this.priceData = mockData[crop] || mockData['辣椒'];
      
      // 更新最后更新时间
      const now = new Date();
      this.lastUpdate = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    },
    
    submitForm() {
      // 检查是否选择了完整的省市区
      if (!this.province || !this.city || !this.district) {
        this.$message.error('请选择完整的省市区');
        return;
      }
      
      // 组合完整地址
      const fullAddress = `${this.province}${this.city}${this.district}${this.detailAddress}`;
      
      if (!this.formData.crop) {
        this.$message.error('请选择作物种类');
        return;
      }
      
      if (!this.formData.quantity || isNaN(this.formData.quantity) || this.formData.quantity <= 0) {
        this.$message.error('请输入有效的需求数量');
        return;
      }
      
      if (!this.detailAddress) {
        this.$message.error('请输入详细地址');
        return;
      }
      
      this.$message.success(`采购需求发布成功！作物：${this.formData.crop}，数量：${this.formData.quantity}公斤，地址：${fullAddress}`);
      this.resetForm();
    },
    
    resetForm() {
      this.$router.push('/purchases');
    }
  }
};
</script>

<style scoped>
/* 原有样式保持不变 */
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