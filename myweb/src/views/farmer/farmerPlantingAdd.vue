<template>
  <div>
    <h1>种植详情</h1>

    <div class="form-container">
      <form @submit.prevent="submitActivity" class="activity-form">
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
                  <img :src="image" alt="历史记录图像" class="history-image" @click="openImage(image)"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <el-dialog v-model="dialogVisible" title="" @close="resetImage" append-to-body >
          <img :src="selectedImage" class="enlarged-image" />
        </el-dialog>



        <div class="input-group" v-if="formData.growth_status !== 'harvested'">
          <label for="activityImages">上传活动图片:</label>
          <el-upload
              id="activityImages"
              class="upload-image"
              multiple
              :show-file-list="false"
              :on-change="handleImageChange"
              :before-upload="beforeImageUpload"
          >
            <el-button>点击上传</el-button>
          </el-upload>
          <div class="uploaded-images">
            <img v-for="(image, index) in activityImages" :key="index" :src="image" class="uploaded-image" />
          </div>
        </div>

        <div class="input-group" v-if="formData.growth_status !== 'harvested'">
          <label for="activity_date">新增活动日期:</label>
          <el-input id="activity_date" v-model="formattedStartDate" placeholder="新增活动日期" disabled style="width: 200px;" />
        </div>

        <div class="input-group" v-if="formData.growth_status !== 'harvested'">
          <label for="activity_type">当前活动类型:</label>
          <el-select
              id="activity_type"
              v-model="formData.activity_type"
              placeholder="选择活动类型"
              style="width: 200px;"
          >
            <el-option label="播种" value="seeding"></el-option>
            <el-option label="施肥" value="fertilizing"></el-option>
            <el-option label="喷药" value="pesticide"></el-option>
            <el-option label="收获" value="harvest"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </div>

        <div class="input-group" v-if="formData.growth_status !== 'harvested'">
          <label for="description">阶段描述:</label>
          <el-input
              id="description"
              v-model="formData.description"
              placeholder="请输入阶段描述"
              type="textarea"
              style="width: 600px;"
          />
        </div>

        <el-button type="primary" @click="submitActivity" class="submit-button" v-if="formData.growth_status !== 'harvested'">确定添加</el-button>
        <el-button type="danger" @click="finishPlanting" class="finish-button" v-if="formData.growth_status !== 'harvested'">结束种植</el-button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../../stores/user';
import { usePlantingStore } from '../../stores/planting'; // 导入种植存储
import cropPhoto from '../../assets/platform_logo2.png';

const router = useRouter();
const userStore = useUserStore();
const plantingStore = usePlantingStore(); // 使用种植存储

const token = userStore.token; // 从用户存储中获取 token

// 更新的表单数据结构
const formData = ref({
  record_id: '',
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

// 初始化从 Pinia 获取的数据
const initializeForm = () => {
  if (plantingStore.currentRecord) {
    formData.value.product_name = plantingStore.currentRecord.product_name; // 从记录中获取作物类型
    formData.value.province = plantingStore.currentRecord.province; // 从记录中获取省份
    formData.value.created_at = plantingStore.currentRecord.created_at; // 从记录中获取创建时间
    formData.value.growth_status = plantingStore.currentRecord.growth_status; // 从记录中获取生长状态
    formData.value.record_id = plantingStore.currentRecord.record_id;
  }
};

// 活动图片数组
const activityImages = ref([]);

// 历史记录
const historicalRecords = ref([]);

// 模拟数据
const mockHistoricalRecords = [
  { activity_id: 1, activity_date: '2023-05-01', activity_type: 'seeding', description: '使用XX牌种子', images: `${cropPhoto},${cropPhoto}` },
  { activity_id: 2, activity_date: '2023-05-05', activity_type: 'fertilizing', description: '施用氮肥', images: cropPhoto },
  { activity_id: 3, activity_date: '2023-05-07', activity_type: 'pesticide', description: '喷洒病虫害防治药物', images: `${cropPhoto},${cropPhoto},${cropPhoto}` },
  { activity_id: 4, activity_date: '2023-05-15', activity_type: 'harvest', description: '首次收获', images: cropPhoto },
];

// // 获取历史记录
// const fetchHistoricalRecords = async () => {
//   const recordId = formData.value.record_id; // 从表单数据中获取 record_id
//   try {
//     const response = await axios.get(`http://localhost:3000/api/historical-activity`, {
//       headers: {
//         'Authorization': `Bearer ${token}`, // 设置 Authorization 头
//       },
//       params: {
//         record_id: recordId // 将 record_id 作为查询参数传递
//       }
//     });
//     historicalRecords.value = response.data; // 假设接口返回的数据符合预期
//   } catch (error) {
//     console.error('获取历史活动失败，使用模拟数据:', error);
//     // 使用模拟数据
//     historicalRecords.value = mockHistoricalRecords;
//   }
// };

const fetchHistoricalRecords = async () => {
  const recordId = formData.value.record_id; // 从表单数据中获取 record_id
  try {
    const response = await axios.get(`http://localhost:3000/api/historical-activity/${recordId}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // 设置 Authorization 头
      }
    });
    historicalRecords.value = response.data; // 假设接口返回的数据符合预期
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

const currentDate = new Date();
const formattedStartDate = computed(() => {
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

// 在组件挂载时初始化表单数据和获取历史记录
onMounted(async () => {
  initializeForm();
  await fetchHistoricalRecords();
});

// 处理图片变化
const handleImageChange = (file) => {
  if (file.status === 'success') {
    activityImages.value.push(file.response.url); // 假设响应中返回了图片的 URL
    ElMessage.success('活动图片上传成功');
  } else if (file.status === 'fail') {
    ElMessage.error('活动图片上传失败');
  }
};

// 图片上传前的验证
const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片格式的文件!');
    return false;
  }
  return true; // 允许上传
};

// 提交活动
const submitActivity = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/planting-activities', {
      record_id: formData.value.record_id,
      activity_date: formattedStartDate.value,
      activity_type: formData.value.activity_type,
      description: formData.value.description,
      images: activityImages.value,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`, // 设置 Authorization 头
      }
    });

    ElMessage.success('成功创建活动');
    router.push('/farmer/activities');
  } catch (error) {
    console.error('提交失败:', error);
    ElMessage.error('提交失败，请重试！');
  }
};

const finishPlanting = async () => {
  const recordId = formData.value.record_id; // 获取记录 ID
  console.log('ID:', recordId);
  try {
    const response = await axios.patch(`http://localhost:3000/api/planting-records/${recordId}/status`, null, {
      headers: {
        'Authorization': `Bearer ${token}`, // 设置 Authorization 头
      }
    });
    ElMessage.success('成功结束种植活动');
    router.push('/farmer/activities'); // 跳转到活动页面
  } catch (error) {
    console.error('结束种植失败:', error);
    ElMessage.error('结束种植失败，请重试！');
  }
};

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
.uploaded-images {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.uploaded-image {
  width: auto; /* 统一的图片高度 */
  height: 60px; /* 统一的图片高度 */
  margin-left: 10px;
}
.submit-button, .finish-button {
  margin-top: 15px;
  cursor: pointer;
}
.finish-button {
  margin-left: 10px;
}
</style>