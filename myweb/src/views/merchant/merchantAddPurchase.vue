<template>
  <div class="container">
    <header>
      <h1><i class="fas fa-file-contract"></i> 采购发布</h1>
      <p>发布您的采购需求，获取市场最新价格预测与分析</p>
    </header>

    <div class="content-wrapper">
      <section class="form-section">
        <h2><i class="fas fa-edit"></i> 需求信息</h2>

        <div class="form-group">
          <label for="productName">产品名称</label>
          <input type="text" id="productName" placeholder="请输入产品名称">
        </div>

        <div class="form-group">
          <label for="quantity">需求数量</label>
          <input type="number" id="quantity" placeholder="请输入采购数量">
        </div>

        <div class="form-group">
          <label>发货位置限制</label>
          <div class="radio-group">
            <div class="radio-option">
              <input type="radio" id="limitYes" name="locationLimit" value="yes">
              <label for="limitYes">是</label>
            </div>
            <div class="radio-option">
              <input type="radio" id="limitNo" name="locationLimit" value="no" checked>
              <label for="limitNo">否</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="deliveryDate">期望交付日期</label>
          <input type="date" id="deliveryDate">
        </div>

        <div class="form-group">
          <label for="notes">补充说明</label>
          <textarea id="notes" rows="4" placeholder="其他需求说明..."></textarea>
        </div>

        <button id="submitBtn">
          <i class="fas fa-paper-plane"></i> 发布采购
        </button>
      </section>

      <section class="prediction-section">
        <div class="prediction-header">
          <h2><i class="fas fa-chart-line"></i> 价格预测分析</h2>
          <select id="productFilter">
            <option value="all">所有产品</option>
            <option value="apple" selected>苹果</option>
            <option value="orange">橙子</option>
            <option value="banana">香蕉</option>
          </select>
        </div>

        <div class="info-box">
          <p><i class="fas fa-info-circle"></i> 价格预测基于历史数据和市场趋势分析，数据每日更新，供采购决策参考。</p>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>日期</th>
                <th class="province-header">北京</th>
                <th class="province-header">上海</th>
                <th class="province-header">广东</th>
                <th class="province-header">浙江</th>
                <th class="province-header">四川</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-07-10</td>
                <td>¥5.80 <span class="price-down">↓3%</span></td>
                <td>¥6.20 <span class="price-down">↓2%</span></td>
                <td class="highlight">¥5.50 <span class="price-down">↓4%</span></td>
                <td>¥5.90 <span class="price-down">↓1%</span></td>
                <td>¥5.40 <span class="price-down">↓2%</span></td>
              </tr>
              <tr>
                <td>2025-07-17</td>
                <td>¥5.75 <span class="price-down">↓1%</span></td>
                <td>¥6.15 <span class="price-down">↓1%</span></td>
                <td>¥5.45 <span class="price-down">↓1%</span></td>
                <td>¥5.85 <span class="price-down">↓1%</span></td>
                <td class="highlight">¥5.35 <span class="price-down">↓1%</span></td>
              </tr>
              <tr>
                <td>2025-07-24</td>
                <td>¥5.85 <span class="price-up">↑2%</span></td>
                <td>¥6.30 <span class="price-up">↑2%</span></td>
                <td>¥5.60 <span class="price-up">↑3%</span></td>
                <td>¥6.00 <span class="price-up">↑3%</span></td>
                <td>¥5.45 <span class="price-up">↑2%</span></td>
              </tr>
              <tr>
                <td>2025-07-31</td>
                <td class="highlight">¥6.00 <span class="price-up">↑3%</span></td>
                <td>¥6.45 <span class="price-up">↑2%</span></td>
                <td>¥5.75 <span class="price-up">↑3%</span></td>
                <td>¥6.15 <span class="price-up">↑3%</span></td>
                <td>¥5.60 <span class="price-up">↑3%</span></td>
              </tr>
              <tr>
                <td>2025-08-07</td>
                <td>¥6.15 <span class="price-up">↑3%</span></td>
                <td class="highlight">¥6.60 <span class="price-up">↑2%</span></td>
                <td>¥5.90 <span class="price-up">↑3%</span></td>
                <td>¥6.30 <span class="price-up">↑2%</span></td>
                <td>¥5.75 <span class="price-up">↑3%</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="info-box">
          <p><i class="fas fa-lightbulb"></i> 采购建议：根据预测，未来两周价格呈下降趋势，建议把握采购窗口期。广东地区价格最优。</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemandPlatform',
  mounted() {
    // 设置默认日期为3天后
    const deliveryDate = document.getElementById('deliveryDate');
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);

    const formattedDate = threeDaysLater.toISOString().split('T')[0];
    deliveryDate.value = formattedDate;
    deliveryDate.min = formattedDate;

    // 提交按钮事件
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', function() {
      const productName = document.getElementById('productName').value;
      const quantity = document.getElementById('quantity').value;

      if (!productName || !quantity) {
        alert('请填写产品名称和需求数量');
        return;
      }
      alert(`需求发布成功！\n产品：${productName}\n数量：${quantity}`);
      this.$router.push('/purchases');
    });

    // 产品筛选事件
    const productFilter = document.getElementById('productFilter');
    productFilter.addEventListener('change', function() {
      alert(`已切换到产品: ${this.options[this.selectedIndex].text}`);
    });
  }
}
</script>

<style scoped>
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
  width: 100%;
  margin-top: 10px;
}

button:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.table-container {
  overflow-x: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
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
  width: 200px;
  padding: 10px;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  header h1 {
    font-size: 2.2rem;
  }
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
</style>