<template>
  <div>
    <h1>修改报价</h1>
    <el-table v-if="currentDemand" :data="[currentDemand]" style="width: 100%; border: 2px solid #dcdfe6;">
      <el-table-column property="product_name" label="产品种类" />
      <el-table-column property="quantity" label="采购量" />
      <el-table-column property="buyerName" label="采购方" />
      <el-table-column property="address" label="收货地" />
      <el-table-column property="updated_at" label="更新时间" />
    </el-table>

    <div v-else>
      <p>未选择任何产品进行报价。</p>
    </div>

    <div class="form-container" v-if="currentDemand">
      <form @submit.prevent="submitQuote" class="quote-form">
        <div class="input-group">
          <label for="quantity">数量 (kg):</label>
          <el-input-number id="quantity" v-model="formData.quantity" min="0" placeholder="30" style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="address">货源地:</label>
          <el-input id="address" v-model="userAddress" placeholder="农户个人信息地址" disabled style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="price">报价 (元/kg):</label>
          <el-input id="price" v-model="formData.price" placeholder="15" style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="growthRecord">种植记录:</label>
          <el-select id="growthRecord" v-model="formData.growthRecord" placeholder="请选择种植记录" style="width: 200px;">
            <el-option
                v-for="record in filteredGrowthRecords"
                :key="record.record_id"
                :label="`id: ${record.record_id} - 种类：${record.product_name} - 创建时间：${record.created_at}`"
                :value="record.record_id"
            />
          </el-select>
        </div>

        <el-button type="primary" class="submit-button">确认修改</el-button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useDemandStore } from '../../stores/demand';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const demandStore = useDemandStore();

// 获取当前报价信息
const currentDemand = demandStore.currentDemand;

// 用户个人信息中的地址
const userAddress = ref('');

// 初始化报价表单数据，设置默认值
const formData = ref({
  quantity: 30, // 默认数量
  price: 15,    // 默认报价
  growthRecord: 2 // 默认选择为id = 2
});

// 种植记录的接受选项
const growthRecords = ref([
  { record_id: 1, product_name: '萝卜', province: '陕西', growth_status: 'harvested', created_at: '2024/01/03' },
  { record_id: 6, product_name: '萝卜', province: '陕西', growth_status: 'harvested', created_at: '2024/08/25' },
  { record_id: 7, product_name: '萝卜', province: '陕西', growth_status: 'growing', created_at: '2024/10/11' },
  { record_id: 2, product_name: '南瓜', province: '陕西', growth_status: 'harvested', created_at: '2024/06/09' },
  { record_id: 3, product_name: '黄瓜', province: '陕西', growth_status: 'harvested', created_at: '2023/12/14' },
  { record_id: 4, product_name: '番茄', province: '陕西', growth_status: 'harvested', created_at: '2024/05/07' },
  { record_id: 5, product_name: '辣椒', province: '陕西', growth_status: 'harvested', created_at: '2025/03/22' },
]);

// 计算属性，用于过滤种植记录
const filteredGrowthRecords = computed(() => {
  if (!currentDemand) return []; // Check if currentDemand is available
  return growthRecords.value.filter(record =>
      record.growth_status === 'harvested' && record.product_name === currentDemand.product_name
  );
});

// 在组件挂载时获取用户信息
onMounted(async () => {
  try {
    const userInfoResponse = await axios.get('http://localhost:3000/api/userInfo'); // 假设的用户信息 API
    userAddress.value = userInfoResponse.data.address; // 假设用户信息中包含地址
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
});

// 提交报价的处理函数
const submitQuote = () => {
  const { quantity, price, growthRecord } = formData.value;

  // 数据验证
  if (quantity <= 0) {
    alert("数量必须大于零");
    return;
  }
  if (price <= 0) {
    alert("价格必须大于零");
    return;
  }

  // 处理提交的报价数据
  console.log('提交的报价信息:', {
    product: currentDemand ? currentDemand.product_name : '未选择产品',
    quantity,
    price,
    growthRecord,
    buyer: currentDemand ? currentDemand.buyerName : '未知买家',
    address: userAddress.value || '地址未设置',
  });

  // 提交后返回采购页面
  router.push('/farmer/purchases'); // 跳转到采购页面
};
</script>

<style scoped>
.form-container {
  margin-top: 50px; /* 表单和上方的表格之间的间距 */
  margin-left: 20px; /* 增加左边距 */
}

.quote-form {
  width: 100%; /* 使表单占满可用宽度 */
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