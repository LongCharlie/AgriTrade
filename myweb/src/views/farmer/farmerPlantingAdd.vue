<template>
  <div>
    <h1>添加种植活动</h1>

    <div class="form-container">
      <form @submit.prevent="submitActivity" class="activity-form">
        <div class="input-group">
          <label for="cropType">作物种类:</label>
          <el-input id="cropType" v-model="formData.cropType" placeholder="作物种类" disabled style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="startDate">开始日期:</label>
          <el-input id="startDate" v-model="formattedStartDate" placeholder="开始日期" disabled style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="province">省份:</label>
          <el-input id="province" v-model="formData.province" placeholder="省份" disabled style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="city">城市:</label>
          <el-input id="city" v-model="formData.city" placeholder="城市" disabled style="width: 200px;" />
        </div>

        <div class="input-group">
          <label for="history">历史记录:</label>
          <div class="history-timeline">
            <div v-for="record in historicalRecords" :key="record.id" class="history-item">
              <div class="history-details">
                <p>{{ record.date }} - {{ record.type }}: {{ record.description }}</p>
              </div>

              <div v-for="(image, index) in record.images" :key="index">
                <img :src="image" alt="历史记录图像" class="history-image" />
              </div>

            </div>
          </div>
        </div>

        <div class="input-group">
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

        <div class="input-group">
          <label for="activityType">当前活动类型:</label>
          <el-select
              id="activityType"
              v-model="formData.activityType"
              placeholder="选择活动类型"
              style="width: 200px;"
          >
            <el-option label="种子" value="seed"></el-option>
            <el-option label="肥料" value="fertilizer"></el-option>
            <el-option label="农药" value="pesticide"></el-option>
            <el-option label="收获" value="harvest"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </div>

        <div class="input-group">
          <label for="phaseDescription">阶段描述:</label>
          <el-input
              id="phaseDescription"
              v-model="formData.phaseDescription"
              placeholder="请输入阶段描述"
              type="textarea"
              style="width: 600px;"
          />
        </div>

        <el-button type="primary" @click="submitActivity" class="submit-button">确定添加</el-button>
        <el-button type="danger" @click="finishPlanting" class="finish-button">结束种植</el-button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const formData = ref({
  cropType: '',
  province: '',
  city: '',
  activityType: '',
  phaseDescription: '',
});

// 活动图片数组
const activityImages = ref([]);

// 历史记录，包含多个图片的记录
const historicalRecords = ref([
  {
    id: 1,
    date: '2023-05-01',
    type: '浇水',
    description: '第1次浇水',
    images: ['https://via.placeholder.com/50', 'https://via.placeholder.com/50'] // 添加多个图片
  },
  {
    id: 2,
    date: '2023-05-05',
    type: '施肥',
    description: '施用氮肥',
    images: ['https://via.placeholder.com/50']
  },
  {
    id: 3,
    date: '2023-05-07',
    type: '喷药',
    description: '喷洒病虫害防治药物',
    images: ['https://via.placeholder.com/50', 'https://via.placeholder.com/50', 'https://via.placeholder.com/50']
  },
  {
    id: 4,
    date: '2023-05-15',
    type: '收获',
    description: '首次收获',
    images: ['https://via.placeholder.com/50']
  },
]);

const currentDate = new Date();
const formattedStartDate = computed(() => {
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  console.log('提交的活动数据:', formData.value);
  try {
    const response = await axios.post('/api/planting-activities', {
      ...formData.value,
      userId: userStore.userId,
      startDate: formattedStartDate.value,
      activityImages: activityImages.value, // 提交的活动图片路径
    });

    console.log('成功创建活动:', response.data);
    router.push('/farmer/activities');
  } catch (error) {
    console.error('提交失败:', error);
  }
};

// 结束种植
const finishPlanting = () => {
  console.log('结束种植活动');
  // Logic to finish planting
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
  align-items: center;
  margin-bottom: 10px;
}
.history-image {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  border: 1px solid #D0D0D0; /* 添加浅灰色边框 */
}
.uploaded-images {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.uploaded-image {
  width: 50px; /* 统一的图片高度 */
  height: 50px; /* 统一的图片高度 */
  margin-right: 10px;
}
.submit-button, .finish-button {
  margin-top: 15px;
  cursor: pointer;
}
.finish-button {
  margin-left: 10px;
}
</style>