<template>
  <div>
    <h1>报价页面</h1>
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
          <el-input-number
              id="quantity"
              v-model="formData.quantity"
              min="0.01"
              step="0.01"
              style="width: 200px;"
              placeholder="最多两位小数"
              @change="validateDecimal('quantity')"
          />
        </div>

        <div class="input-group">
          <label for="price">报价 (元/kg):</label>
          <el-input-number
              id="price"
              v-model="formData.price"
              min="0.01"
              step="0.01"
              style="width: 200px;"
              placeholder="最多两位小数"
              @change="validateDecimal('price')"
          />
        </div>

        <div class="input-group">
          <label for="province">省份:</label>
          <el-input id="province" v-model="userProvince" placeholder="跟随种植记录" disabled style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="growthRecord">种植记录:</label>
          <el-select
              id="growthRecord"
              v-model="formData.growthRecord"
              placeholder="请选择种植记录"
              style="width: 200px;"
              @change="updateUserProvince"
          >
            <el-option
                v-for="record in filteredGrowthRecords"
                :key="record.record_id"
                :label="`id: ${record.record_id} - 种类：${record.product_name} - 创建时间：${record.created_at}`"
                :value="record.record_id"
            />
          </el-select>
        </div>

        <el-button type="primary" class="submit-button">提交报价</el-button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useDemandStore } from '../../stores/demand';
import { useUserStore } from '../../stores/user'; // 导入用户存储
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const demandStore = useDemandStore();
const userStore = useUserStore(); // 使用用户存储

const currentDemand = demandStore.currentDemand;
const userProvince = ref(''); // 改为存储省份
const formData = ref({
  quantity: null,
  price: null,
  growthRecord: ''
});

const mockGrowthRecords = [
  { record_id: 51, product_name: '萝卜', province: '陕西省', growth_status: 'harvested', created_at: '2024/01/03' },
  { record_id: 56, product_name: '番茄', province: '河北省', growth_status: 'harvested', created_at: '2024/08/25' },
  { record_id: 57, product_name: '萝卜', province: '广东省', growth_status: 'harvested', created_at: '2024/10/11' },
  { record_id: 52, product_name: '南瓜', province: '陕西省', growth_status: 'growing', created_at: '2024/06/09' },
  { record_id: 53, product_name: '黄瓜', province: '陕西省', growth_status: 'harvested', created_at: '2023/12/14' },
  { record_id: 54, product_name: '番茄', province: '陕西省', growth_status: 'harvested', created_at: '2024/05/07' },
  { record_id: 55, product_name: '辣椒', province: '陕西省', growth_status: 'harvested', created_at: '2025/03/22' },
];

const growthRecords = ref(mockGrowthRecords);

const filteredGrowthRecords = computed(() => {
  return growthRecords.value.filter(record =>
      record.growth_status === 'harvested' && record.product_name === currentDemand.product_name
  );
});

onMounted(async () => {
  const token = userStore.token; // 从用户存储中获取 token
  try {
    const growthRecordsResponse = await axios.get('http://localhost:3000/api/growth-records', {
      headers: {
        'Authorization': `Bearer ${token}` // 设置 Authorization 头
      }
    });
    growthRecords.value = growthRecordsResponse.data;
  } catch (error) {
    console.error('获取数据失败:', error);
    growthRecords.value = mockGrowthRecords;
  }
});

const updateUserProvince = () => {
  const selectedRecord = growthRecords.value.find(record => record.record_id === formData.value.growthRecord);
  userProvince.value = selectedRecord ? selectedRecord.province : '';
};

// 验证小数位数的函数
const validateDecimal = (field) => {
  if (formData.value[field] !== null) {
    // 将值转换为字符串并用正则表达式匹配最多两位小数
    const valueStr = formData.value[field].toString();
    const regex = /^\d+(\.\d{0,2})?$/;
    if (!regex.test(valueStr)) {
      // 如果不符合要求，重新赋值，去除多余的小数部分
      formData.value[field] = parseFloat(parseFloat(formData.value[field]).toFixed(2));
    }
  }
};

const submitQuote = async () => {
  const { quantity, price, growthRecord } = formData.value;

  // 检查必要的输入
  if (!quantity || quantity < 0.01) {
    alert("数量必须大于零");
    return;
  }
  if (!price || price < 0.01) {
    alert("价格必须大于零");
    return;
  }

  // 准备发送到后端的数据
  const requestData = {
    demand_id: currentDemand ? currentDemand.demand_id : null, // 获取 currentDemand 的 id
    quantity,
    price,
    record_id: growthRecord,
    province: userProvince.value, // 发送选中的省份
  };

  // 发送请求到后端
  try {
    const token = userStore.token; // 从用户存储中获取 token
    const response = await axios.post('http://localhost:3000/api/applications', requestData, {
      headers: {
        'Authorization': `Bearer ${token}` // 发送 token
      }
    });

    console.log('成功提交:', response.data);

    // 提交后重定向到采购页面
    router.push('/farmer/purchases');
  } catch (error) {
    console.error('提交失败:', error);
    alert("提交报价失败，请重试");
  }
};
</script>

<style scoped>
.quote-form {
  margin-top: 50px;
  margin-left: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-group label {
  margin-right: 5px;
  min-width: 100px;
}

.submit-button {
  margin-top: 15px;
  cursor: pointer;
}
</style>