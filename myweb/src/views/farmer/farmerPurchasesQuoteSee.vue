<template>
  <div>
    <h1>查看报价</h1>

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
              disabled
              style="width: 200px;"
          />
        </div>

        <div class="input-group">
          <label for="price">报价 (元/kg):</label>
          <el-input-number
              id="price"
              v-model="formData.price"
              style="width: 200px;"
          />
        </div>

        <div class="input-group">
          <label for="price">报价 (元/kg):</label>
          <el-input
              id="order"
              v-model="formData.orderID"
              style="width: 200px;"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDemandStore } from '../../stores/demand';
import { useQuoteStore } from '../../stores/quote';
// import { useUserStore } from '../../stores/user'; // 导入用户存储
// import { useRouter } from 'vue-router';
// import axios from 'axios';

// const router = useRouter();
const demandStore = useDemandStore();
const quoteStore = useQuoteStore();
// const userStore = useUserStore(); // 使用用户存储

const currentDemand = demandStore.currentDemand;
const currentQuote = quoteStore.currentQuote;
const currentOrder = quoteStore.currentOrder;
const formData = ref({
  quantity: currentQuote ? currentQuote.quantity : null,
  price: currentQuote ? currentQuote.price : null,
  orderID: currentOrder ? currentOrder.order_id : null,
});


onMounted(async () => {
});

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

</style>