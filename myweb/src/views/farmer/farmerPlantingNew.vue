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
          <el-input id="startDate" v-model="formattedStartDate" disabled style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="province">省份:</label>
          <el-input id="province" v-model="formData.province" placeholder="跟随农户地址" disabled style="width: 200px;" />
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
import { useUserStore } from '../../stores/user'; // 引入 Pinia 用户存储
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore(); // 获取用户状态
const token = userStore.token; // 从用户存储中获取 token

// 表单数据结构
const formData = ref({
  crop: '',
  province: userStore.province,
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
  try {
    const response = await axios.post('http://localhost:3000/api/planting-records', {
      product_name: formData.value.crop, // 作物种类
      province: formData.value.province // 省份
    }, {
      headers: {
        'Authorization': `Bearer ${token}`, // 设置 Authorization 头
      }
    });
    ElMessage.success('成功创建种植记录');
    router.push('/farmer/planting');
  } catch (error) {
    console.error('创建种植记录失败:', error);
    ElMessage.error('创建种植记录失败，请重试！');
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