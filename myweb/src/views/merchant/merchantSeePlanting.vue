<template>
  <div>
    <h1>种植详情</h1>
    <div class="form-container">
      <form class="activity-form">
        <div class="input-group">
          <label for="product_name">作物种类:</label>
          <el-input id="product_name" v-model="formData.product_name" placeholder="作物种类" disabled style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="created_at">开始日期:</label>
          <el-input id="created_at" v-model="formData.created_at" placeholder="开始日期" disabled style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="province">省份:</label>
          <el-input id="province" v-model="formData.province" placeholder="省份" disabled style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="history">历史记录:</label>
          <div class="history-timeline">
            <div v-for="record in historicalRecords" :key="record.activity_id" class="history-item">
              <div class="history-details">
                <p>{{ record.activity_date }} - {{ getChineseActivityType(record.activity_type) }}: {{ record.description }}</p>
              </div>
              <div class="history-images">
                <div class="history-image-wrapper" v-for="(image, index) in record.images.split(',')" :key="index">
                  <img :src="`http://localhost:3000/uploads/activity-images/${image}`" alt="历史记录图像" class="history-image" @click="openImage(image)"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <el-dialog v-model="dialogVisible" title="" @close="resetImage" append-to-body >
          <img :src="selectedImage" class="enlarged-image" />
        </el-dialog>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
// import { ElMessage } from 'element-plus';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();
const token = userStore.token; // 从用户存储中获取 token


import { useSeeRecordStore } from '@/stores/seeRecord'; // 确保路径正确
const seeRecordStore = useSeeRecordStore();
const recordId = seeRecordStore.recordId; // 获取保存的record_id

// 更新的表单数据结构
const formData = ref({
  record_id: recordId,
  product_name: '',
  province: '',
  growth_status: '',
  created_at: '',
  activity_id: '',
  activity_date: '',
  activity_type: '',
  description: '',
  images: '',
});

//种植信息
const fetchRecords = async () => {
  try {
    const growthRecordsResponse = await axios.get(`http://localhost:3000/api/planting_record/${recordId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    formData.value.product_name = growthRecordsResponse.product_name;
    formData.value.province = growthRecordsResponse.province;
    formData.value.created_at = growthRecordsResponse.created_at;
    formData.value.growth_status = growthRecordsResponse.growth_status;
    console.log(growthRecordsResponse.data);
  } catch (error) {
    console.error('获取种植信息失败，使用模拟数据:', error);
  }
};


// 历史记录
const historicalRecords = ref([]);
// 模拟数据
const mockHistoricalRecords = [
 ];
const fetchHistoricalRecords = async () => {
  const recordId = formData.value.record_id; // 从表单数据中获取 record_id
  try {
    const response = await axios.get(`http://localhost:3000/api/historical-activity/${recordId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    historicalRecords.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('获取历史活动失败，使用模拟数据:', error);
    // 使用模拟数据
    historicalRecords.value = mockHistoricalRecords;
  }
};

const dialogVisible = ref(false);
const selectedImage = ref('');

const openImage = (image) => {
  selectedImage.value = image;
  dialogVisible.value = true;
};

const resetImage = () => {
  selectedImage.value = '';
};

// 在组件挂载时初始化表单数据和获取历史记录
onMounted(async () => {
  await fetchHistoricalRecords();
  await fetchRecords();
});


// 添加一个函数用于将英文类型翻译为中文
const getChineseActivityType = (type) => {
  const typeMapping = {
    seeding: '播种',
    fertilizing: '施肥',
    pesticide: '喷药',
    harvest: '收获',
    other: '其他',
  };
  return typeMapping[type] || type; // 如果未找到对应类型，返回原值
};

</script>

<style scoped>
.activity-form {
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
.history-timeline {
  display: flex;
  flex-direction: column;
}
.history-item {
  display: flex;
  align-items: flex-start; /* 对齐方式调整为 flex-start */
  margin-bottom: 10px;
}
.history-details {
  margin-right: 10px; /* 加一些右边距以便与图片分开 */
}
.history-images {
  display: flex;
  flex-wrap: wrap;   /* 使得图像可以换行，适应容器 */
}
.history-image-wrapper {
  display: flex; /* 使用flex，使得图片在横向排列时更加灵活 */
  flex-direction: column; /* 使得文字显示在图片上方 */
  align-items: center; /* 图像居中对齐 */
}
.history-image {
  width: auto; /* 定义宽度 */
  height: 60px; /* 保持图片的纵横比例 */
  margin-top: 5px; /* 文字和图片之间的间隙 */
  margin-left: 10px;
  border: 1px solid #D0D0D0; /* 添加浅灰色边框 */
  cursor: pointer; /* 添加鼠标指针样式 */
}
.enlarged-image {
  max-width: 100%; /* 确保图片在对话框中不溢出 */
  max-height: 80vh; /* 设置最大高度为视口的80% */
  display: block; /* 使其为块级元素 */
  margin: 0 auto; /* 在对话框中居中 */
}
</style>