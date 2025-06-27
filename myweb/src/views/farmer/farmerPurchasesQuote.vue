<template>
  <div>
    <h1>报价页面</h1>
    <el-table v-if="currentQuote" :data="[currentQuote]" style="width: 100%; border: 2px solid #dcdfe6;">
      <el-table-column property="product" label="产品种类" />
      <el-table-column property="quantity" label="采购量" />
      <el-table-column property="buyer" label="采购方" />
      <el-table-column property="address" label="收货地" />
      <el-table-column property="updateTime" label="更新时间" />
      <el-table-column property="growthRecordId" label="种植记录ID" />
    </el-table>

    <div v-else>
      <p>未选择任何产品进行报价。</p>
    </div>

    <div class="form-container" v-if="currentQuote">
      <form @submit.prevent="submitQuote" class="quote-form">
        <div class="input-group">
          <label for="quantity">数量 (kg):</label>
          <el-input-number id="quantity" v-model="formData.quantity" min="0" style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="address">货源地:</label>
          <el-input id="address" v-model="userAddress" placeholder="农户个人信息地址" disabled style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="price">报价 (元/kg):</label>
          <el-input id="price" v-model="formData.price" placeholder="请输入报价" style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="growthRecord">种植记录:</label>
          <el-select
              id="growthRecord"
              v-model="formData.growthRecord"
              placeholder="请选择种植记录"
              style="width: 200px;"
          >
            <el-option
                v-for="record in growthRecords"
                :key="record.id"
                :label="`id: ${record.id} - 种类：${record.product} - 结束时间：${record.time}`"
                :value="record.id"
            />
          </el-select>
        </div>

        <el-button type="primary" @click="submitQuote" class="submit-button">提交报价</el-button> <!-- 使用 Element Plus 的 el-button -->
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuoteStore } from '../../stores/quote'; // 导入报价 Store
import { useRouter } from 'vue-router'; // 使用 Router
import axios from 'axios'; // 导入 axios

const router = useRouter();
const quoteStore = useQuoteStore(); // 使用报价 Store

// 获取当前报价信息
const currentQuote = quoteStore.currentQuote;

// 用户个人信息中的地址
const userAddress = ref(''); // 初始化货源地

// 初始化报价表单数据
const formData = ref({
  quantity: null,
  price: '',
  growthRecord: ''
});

// 种植记录的模拟数据
const growthRecords = ref([
  { id: 1, product: '白米', time: '2024/01' },
  { id: 2, product: '西瓜', time: '2024/06' },
  { id: 3, product: '红薯', time: '2023/12' },
  { id: 4, product: '玉米', time: '2024/05' },
  { id: 5, product: '青菜', time: '2025/03' },
]);

// 在组件挂载时获取用户信息和种植记录
onMounted(async () => {
  try {
    // 获取用户信息
    const userInfoResponse = await axios.get('http://localhost:3000/api/userInfo'); // 用户信息 API
    userAddress.value = userInfoResponse.data.address; // 假设用户信息中包含地址

    // 获取种植记录
    const recordsResponse = await axios.get('http://localhost:3000/api/growthRecords'); // 种植记录 API
    growthRecords.value = recordsResponse.data; // 假设 API 返回种植记录的数组
  } catch (error) {
    console.error('获取数据失败:', error);
  }
});

// 提交报价的处理函数
const submitQuote = () => {
  const { quantity, price, growthRecord } = formData.value;

  // 处理提交的报价数据
  console.log('提交的报价信息:', {
    product: currentQuote.product,
    quantity,
    price,
    growthRecord,
    buyer: currentQuote.buyer,
    address: currentQuote.address,
  });

  // 提交后返回采购页面或执行其他操作
  router.push('/farmer/purchases'); // 跳转到采购页面（或其他适当的页面）
};
</script>

<style scoped>
.quote-form {
  margin-top: 50px; /* 表单和上方的表格之间的间距 */
  margin-left: 20px; /* 增加左边距 */
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* 输入组之间的间距 */
}

.input-group label {
  margin-right: 5px; /* 标签和输入框之间的间距 */
  min-width: 100px; /* 标签最小宽度 */
}

.submit-button {
  margin-top: 15px;
  cursor: pointer; /* 鼠标为手型 */
}
</style>