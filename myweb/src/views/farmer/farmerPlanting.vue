<template>
  <div class="farmer-plant-container">
    <el-row :gutter="40" class="info-cards">
      <el-col :span="12">
        <el-card class="info-card advice-card" @click="goToAdvice">
          <div class="card-content">
            <p>种植建议</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="info-card ai-card" @click="goToAskAI">
          <div class="card-content">
            <p>问问AI</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <h2 class="planting-record-title">我的种植记录</h2>

    <div class="filter-buttons">
      <el-button :type="filter === 'all' ? 'primary' : 'default'" @click="filterRecords('all')">全部</el-button>
      <el-button :type="filter === 'growing' ? 'primary' : 'default'" @click="filterRecords('growing')">种植中</el-button>
      <el-button :type="filter === 'ended' ? 'primary' : 'default'" @click="filterRecords('ended')">已结束</el-button>
    </div>

    <el-row :gutter="40" class="crop-cards">
      <el-col :span="8" @click="goToAddNewCrop">
        <el-card class="crop-card add-card">
          <div class="card-content">
            <p>+</p>
            <p>创建新的记录</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8" v-for="(record, index) in paginatedRecords" :key="record.record_id" @click="goToAdd(record)">
        <el-card class="crop-card">
          <div class="card-header">
            <span class="crop-name">{{ record.product_name }}</span>
            <el-button type="text" class="delete-button" @click.stop="deleteRecord(record.record_id)">删除</el-button>
          </div>
          <div class="card-footer">
            <span class="start-time">创建于 {{ record.created_at }}</span>
            <span class="status">{{ record.growth_status === 'growing' ? '种植中' : record.growth_status === 'harvested' ? '已结束' : record.growth_status }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="filteredGrowthRecords.length"
        layout="total, prev, pager, next, jumper"
        style="display: flex; justify-content: center; margin-top: 20px;"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user';
import { usePlantingStore } from '../../stores/planting';
import axios from "axios";

const router = useRouter();
const userStore = useUserStore();
const plantingStore = usePlantingStore();

// const mockGrowthRecords = [
//   { record_id: 51, product_name: '萝卜', province: '陕西省', growth_status: 'harvested', created_at: '2024-01-03' },
//   { record_id: 56, product_name: '番茄', province: '河北省', growth_status: 'harvested', created_at: '2024-08-25' },
//   { record_id: 57, product_name: '萝卜', province: '广东省', growth_status: 'harvested', created_at: '2024-10-11' },
//   { record_id: 52, product_name: '南瓜', province: '陕西省', growth_status: 'growing', created_at: '2024-06-09' },
//   { record_id: 53, product_name: '黄瓜', province: '陕西省', growth_status: 'harvested', created_at: '2023-12-14' },
//   { record_id: 54, product_name: '番茄', province: '陕西省', growth_status: 'harvested', created_at: '2024-05-07' },
//   { record_id: 55, product_name: '辣椒', province: '陕西省', growth_status: 'harvested', created_at: '2025-03-22' },
// ];
const mockGrowthRecords = [
  ];
const growthRecords = ref(mockGrowthRecords);
const filter = ref('all');

const pageSize = ref(5); // 每页显示的条目数
const currentPage = ref(1); // 当前页

onMounted(async () => {
  const token = userStore.token;
  try {
    const growthRecordsResponse = await axios.get('http://localhost:3000/api/growth-records', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    growthRecords.value = growthRecordsResponse.data;
    // console.log(growthRecordsResponse.data);
  } catch (error) {
    console.error('获取种植记录数据失败，使用模拟数据:', error);
    growthRecords.value = mockGrowthRecords;
  }
});

const filteredGrowthRecords = computed(() => {
  if (filter.value === 'growing') {
    return growthRecords.value.filter(record => record.growth_status === 'growing');
  } else if (filter.value === 'ended') {
    return growthRecords.value.filter(record => record.growth_status === 'harvested');
  }
  return growthRecords.value; // 默认返回所有记录
});

// 计算分页后的列表
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredGrowthRecords.value.slice(start, start + pageSize.value);
});

// 手动更新页码
const handlePageChange = (page) => {
  currentPage.value = page;
};

// 删除记录
const deleteRecord = async (recordId) => {
  const token = userStore.token;
  try {
    await axios.delete(`http://localhost:3000/api/growth-records/${recordId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // 更新本地状态，删除该记录
    growthRecords.value = growthRecords.value.filter(record => record.record_id !== recordId);
  } catch (error) {
    console.error('删除记录失败:', error);
    alert('删除记录失败，请重试');
  }
};

// 跳转函数
const goToAdvice = () => { router.push('/farmer/planting/advice'); };
const goToAskAI = () => { router.push('/farmer/planting/ai'); };
const goToAddNewCrop = () => { router.push('/farmer/planting/new'); };
const goToAdd = (record) => {
  plantingStore.setCurrentRecord(record);
  router.push('/farmer/planting/add');
};

const filterRecords = (status) => {
  filter.value = status;
  currentPage.value = 1; // 重置为第一页
};
</script>

<style scoped>
.info-cards .info-card {
  margin-top: 0px;
  margin-bottom: 0px;
  cursor: pointer; /* 添加鼠标指针样式 */
  min-height: 50px; /* 使卡片高度一致 */
  transition: transform 0.2s ease; /* 添加平滑过渡效果 */
}

.info-cards .info-card:hover {
  transform: scale(1.05); /* 鼠标悬停时放大 */
}

.advice-card {
  background-color: #e6f7ff; /* 浅蓝色背景 */
}

.ai-card {
  background-color: #fff7e6; /* 浅橙色背景 */
}

.card-content {
  text-align: center; /* 内容居中对齐 */
}

.card-content p {
  font-size: 20px; /* 字体大小 */
  font-weight: bold; /* 加粗文字 */
  color: #333; /* 字体颜色 */
}

.crop-cards {
  margin-top: 16px;
}

.crop-card {
  width: 100%; /* 适应父容器宽度 */
  margin: 20px 0; /* 上下间距 */
  cursor: pointer;
  height: 150px; /* 固定高度 */
}

.add-card {
  text-align: center;
  cursor: pointer;
  background-color: #f5f5f5; /* 浅灰色背景 */
  border: 1px dashed #ccc; /* 虚线边框 */
  min-height: 100px; /* 设置最小高度 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; /* 添加卡片头部和底部之间的间距 */
  font-size: 20px; /* 字体大小 */
  font-weight: bold; /* 加粗文字 */
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px 0;
}

.crop-image {
  width: auto; /* 自适应宽度 */
  height: 130px; /* 固定高度 */
  object-fit: cover; /* 保持高宽比，剪切多余部分 */
}

.card-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
}

.planting-record-title {
  margin-top: 40px; /* 添加上边距 */
  margin-bottom: 16px; /* 添加下边距，分隔与下面的元素 */
}

.filter-buttons {
  margin-top: 20px; /* 上边距 */
  display: flex;
  justify-content: flex-end; /* 靠右对齐按钮 */
}

.delete-button {
  color: #f56c6c;
  font-size: 14px; /* 字体大小 */
}
</style>