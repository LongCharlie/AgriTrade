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

    <!-- 添加搜索栏 -->
    <div class="search-bar">
      <el-input
          v-model="searchTerm"
          placeholder="搜索作物种类"
          style="width: 200px"
          clearable
          @clear="handleSearchClear"
      >
        <!--        <template #prefix>-->
        <!--          <el-icon><Search /></el-icon>-->
        <!--        </template>-->
      </el-input>
      <el-button type="primary" @click="performSearch">搜索</el-button>
<!--      <el-button @click="resetSearch">重置</el-button>-->
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
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :total="filteredGrowthRecords.length"
        layout="total, sizes, prev, pager, next, jumper"
        style=" display: flex; justify-content: center; margin-top: 20px;"
    ></el-pagination>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user';
import { usePlantingStore } from '../../stores/planting';
import axios from "axios";
import { Search } from '@element-plus/icons-vue'; // 添加搜索图标

const router = useRouter();
const userStore = useUserStore();
const plantingStore = usePlantingStore();

const mockGrowthRecords = [];
const growthRecords = ref(mockGrowthRecords);
const filter = ref('all');
const searchTerm = ref(''); // 搜索关键词
const isSearching = ref(false); // 是否正在搜索

const pageSize = ref(10); // 每页显示的条目数
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
  } catch (error) {
    console.error('获取种植记录数据失败，使用模拟数据:', error);
    growthRecords.value = mockGrowthRecords;
  }
});

// 修改过滤逻辑，加入搜索功能
const filteredGrowthRecords = computed(() => {
  let records = growthRecords.value;

  // 应用状态过滤
  if (filter.value === 'growing') {
    records = records.filter(record => record.growth_status === 'growing');
  } else if (filter.value === 'ended') {
    records = records.filter(record => record.growth_status === 'harvested');
  }

  // 应用搜索过滤
  if (isSearching.value && searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    records = records.filter(record =>
        record.product_name.toLowerCase().includes(term)
    );
  }

  return records;
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

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 重置到第一页
};

// 执行搜索
const performSearch = () => {
  if (searchTerm.value.trim()) {
    isSearching.value = true;
    currentPage.value = 1; // 重置到第一页
  }
};

// 重置搜索
const resetSearch = () => {
  searchTerm.value = '';
  isSearching.value = false;
  currentPage.value = 1; // 重置到第一页
};

// 清除搜索
const handleSearchClear = () => {
  resetSearch();
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

/* 添加搜索栏样式 */
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar .el-input {
  margin-right: 10px;
}

.search-bar .el-button {
  margin-right: 10px;
}
</style>
