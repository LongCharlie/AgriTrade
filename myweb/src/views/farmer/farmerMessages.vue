<template>
  <div>
    <h1>上传农事活动图片</h1>
    <el-upload
        class="upload-image"
        multiple
        :limit="5"
    :show-file-list="false"
    :on-change="handleImageChange"
    :before-upload="beforeImageUpload"
    :http-request="uploadImage"
    >
    <el-button>点击上传图片</el-button>
    </el-upload>
    <div class="uploaded-images">
      <img v-for="(image, index) in activityImages" :key="index" :src="image" class="uploaded-image" />
    </div>
    <div class="uploaded-images">
      <img :src="avatar" alt="User Avatar" class="user-avatar"/>
      <img src="http://localhost:3000/uploads/activity-images/806effee-b2c6-41a9-a5cb-5b7594ced725.png" class="uploaded-image" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../../stores/user'; // 确保此路径正确
const userStore = useUserStore();
const token = userStore.token;
const avatar = 'http://localhost:3000/uploads/activity-images/806effee-b2c6-41a9-a5cb-5b7594ced725.png'
// 用于存储上传的图片 URL
const activityImages = ref([]);

// 自定义上传图片的方法
const uploadImage = async ({ file, onSuccess, onError }) => {
  const formData = new FormData();
  formData.append('images', file); // 确保字段名与后端约定一致

  try {
    const response = await axios.post('http://localhost:3000/api/uploads/activity-images', formData, {
      headers: {
        'Authorization': `Bearer ${token}`, // 使用从用户 store 获取的 token
        'Content-Type': 'multipart/form-data',
      },
    });

    // 成功上传后，获取返回的图片 URL
    const imageUrlArray = response.data.images; // 后端返回的图片 URL 数组
    console.log(imageUrlArray);
    // 添加前缀
    const fullImageUrls = imageUrlArray.map(image => `http://localhost:3000/uploads/activity-images/${image}`);
    activityImages.value.push(...fullImageUrls); // 将返回的 URL 添加到活动图片数组
    console.log(fullImageUrls);
    onSuccess(); // 调用成功回调
    ElMessage.success('活动图片上传成功');
  } catch (error) {
    console.error('活动图片上传失败:', error);
    onError(); // 调用失败回调
    ElMessage.error('活动图片上传失败');
  }
};

// 图片上传前的验证
const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片格式的文件!');
    return false; // 阻止上传
  }
  return true; // 允许上传
};

// 图片变化处理（可选，用于其他逻辑）
const handleImageChange = (file) => {
  // 如果需要在文件状态改变时进行其他处理，可以在这里实现
};

</script>

<style scoped>
.uploaded-images {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.uploaded-image {
  width: auto;
  height: 60px; /* 统一的图片高度 */
  margin-left: 10px;
}
</style>