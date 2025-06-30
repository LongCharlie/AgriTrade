<template>
  <div>
    <h1>新建种植记录</h1>

    <div class="form-container">
      <form @submit.prevent="submitQuote" class="quote-form">
        <div class="input-group">
          <label for="crop">作物种类:</label>
          <el-input id="crop" v-model="formData.crop" placeholder="请输入作物种类" style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="startDate">开始日期:</label>
          <el-input id="startDate" v-model="formattedStartDate" placeholder="选择开始日期" disabled style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="province">省份:</label>
          <el-input id="province" v-model="formData.province" placeholder="请输入省份" style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="city">城市:</label>
          <el-input id="city" v-model="formData.city" placeholder="请输入城市" style="width: 200px;" />
        </div>

        <el-button type="primary" @click="submitQuote" class="submit-button">确认创建</el-button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // 引入 axios
import { useUserStore } from '@/stores/user'; // 引入 Pinia 用户存储

const router = useRouter();
const userStore = useUserStore(); // 获取用户状态

// 表单数据结构
const formData = ref({
  crop: '',
  province: '',
  city: '',
});

// 格式化开始日期
const currentDate = new Date();
const formattedStartDate = computed(() => {
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
});

// 提交表单的处理程序
const submitQuote = async () => {
  formData.value.startDate = formattedStartDate.value; // 在提交时添加格式化的日期
  console.log('提交的表单数据:', formData.value);

  try {
    const response = await axios.post('/api/planting-records', {
      product_name: formData.value.crop,
      province: formData.value.province,
      city: formData.value.city,
      userId: userStore.userId, // 从 Pinia 获取用户 ID
    });

    console.log('成功创建记录:', response.data);
    router.push('/farmer/planting'); // 成功后重定向
  } catch (error) {
    console.error('提交失败:', error);
    // 可在此处理错误通知
  }
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