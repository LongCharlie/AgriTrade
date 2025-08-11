<template>
  <div>
    <h1>用户管理</h1>
    <el-button type="primary" @click="handleCreateUser" style="margin-bottom: 20px;">新建用户</el-button>
    <div class="search-bar">
      <el-input
          v-model="searchUserId"
          placeholder="搜索用户ID"
          style="width: 200px; margin-bottom: 20px;"
      ></el-input>
      <el-input
          v-model="searchUsername"
          placeholder="搜索用户名"
          style="width: 200px; margin-bottom: 20px;"
      ></el-input>
      <el-select v-model="filterRole" placeholder="选择角色" style="width: 200px; margin-bottom: 20px;">
        <el-option label="全部角色" value="all"></el-option>
        <el-option label="农民" value="farmer"></el-option>
        <el-option label="买家" value="buyer"></el-option>
        <el-option label="专家" value="expert"></el-option>
        <el-option label="管理员" value="admin"></el-option>
      </el-select>
      <el-input
          v-model.number="searchPhone"
          placeholder="搜索联系电话"
          style="width: 200px; margin-bottom: 20px;"
      ></el-input>
      <el-input
          v-model="searchProvince"
          placeholder="搜索省份"
          style="width: 200px; margin-bottom: 20px;"
      ></el-input>
      <el-input
          v-model="searchCity"
          placeholder="搜索城市"
          style="width: 200px; margin-bottom: 20px;"
      ></el-input>
      <el-input
          v-model="searchDistrict"
          placeholder="搜索区县"
          style="width: 200px; margin-bottom: 20px;"
      ></el-input>
      <el-date-picker
          v-model="searchJoinDate"
          type="date"
          placeholder="注册日期"
          style="width: 200px; margin-bottom: 20px;"
      ></el-date-picker>
      <el-button type="primary" @click="performSearch">确认搜索</el-button>
    </div>
    <div class="table-container">
      <el-table :data="paginatedData" style="width: 100%">
        <el-table-column prop="user_id" label="用户ID" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column label="用户角色">
          <template #default="scope">
            {{ getRoleInChinese(scope.row.role) }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="province" label="省份" />
        <el-table-column prop="city" label="城市" />
        <el-table-column prop="district" label="区县" />
        <el-table-column prop="join_date" label="注册时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" type="text">[编辑]</el-button>
            <el-button @click="() => handleDelete(scope.row.user_id)" type="text" style="color: red;">[删除]</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filteredTableData.length"
          layout="total, prev, pager, next, jumper"
          style="display: flex; justify-content: center; margin-top: 20px;"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '../../stores/user'; // 假设在这里获取用户信息
import { useRouter } from 'vue-router';
import { useAdminEditUserStore } from '../../stores/adminEditUser';
import {ElMessage} from "element-plus"; // 导入 Pinia store

const searchUserId = ref('');
const searchUsername = ref('');
const searchPhone = ref(null);
const filterRole = ref('all'); // 选择角色的状态
const searchProvince = ref('');
const searchCity = ref(''); // 新增城市搜索
const searchDistrict = ref(''); // 新增区县搜索
const searchJoinDate = ref(null); // 注册时间选择
const router = useRouter();
const userStore = useUserStore();
const adminEditUserStore = useAdminEditUserStore(); // 创建 store 实例

// 用于存储用户数据
const userData = ref([]);
const filteredTableData = ref([]);
const pageSize = ref(5); // 每页显示的项目数
const currentPage = ref(1); // 当前页码

const simulatedUserData = [
  {
    user_id: 7,
    username: 'yangqi',
    role: 'expert',
    phone: '13800000007',
    province: '陕西省',
    city: '西安市',
    district: '碑林区',
    address_detail: '某某街道7号',
    avatar_url: 'http://example.com/avatar7.png',
    join_date: '2023-07-15 15:30:00',
  },
];

const fetchData = async () => {
  const token = userStore.token; // 从用户存储中获取 token
  try {
    const response = await axios.get('http://localhost:3000/api/users', {
      headers: {
        'Authorization': `Bearer ${token}` // 设置 Authorization 头
      }
    });
    userData.value = response.data; // 假设 API 返回的数据就是我们需要的格式
  } catch (error) {
    console.error('获取用户数据失败，使用模拟数据:', error);
    userData.value = simulatedUserData; // 使用模拟数据
  }

  // 初始化过滤后的数据
  filteredTableData.value = userData.value;
};

// 将角色英文转换为中文
const getRoleInChinese = (role) => {
  const roleMap = {
    'farmer': '农民',
    'buyer': '买家',
    'expert': '专家',
    'admin': '管理员'
  };

  return roleMap[role] || role; // 如果角色未被定义，返回原角色
};

// 确认搜索的处理函数
const performSearch = () => {
  filteredTableData.value = userData.value.filter(item => {
    const matchesUserId = searchUserId.value ? item.user_id.toString() === searchUserId.value : true;
    const matchesUsername = item.username.includes(searchUsername.value);
    const matchesPhone = searchPhone.value ? item.phone.includes(searchPhone.value) : true;
    const matchesRole =
        filterRole.value === 'all' ||
        item.role === filterRole.value;
    const matchesProvince = item.province.includes(searchProvince.value);
    const matchesCity = item.city.includes(searchCity.value); // 新增城市匹配
    const matchesDistrict = item.district.includes(searchDistrict.value); // 新增区县匹配

    // 从用户数据中的 join_date 中提取日期
    const userJoinDate = new Date(item.join_date);
    const selectedJoinDate = searchJoinDate.value ? new Date(searchJoinDate.value) : null;

    const matchesJoinDate = selectedJoinDate ? userJoinDate.toDateString() === selectedJoinDate.toDateString() : true;

    return matchesUserId && matchesUsername && matchesPhone && matchesRole && matchesProvince && matchesCity && matchesDistrict && matchesJoinDate;
  });
  currentPage.value = 1; // 重置为第一页
};

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredTableData.value.slice(start, end);
});

// 分页处理
const handlePageChange = (page) => {
  currentPage.value = page; // 更新当前页
};

// 新建用户处理
const handleCreateUser = () => {
  router.push('/admin/user/new'); // 跳转至新建用户页面
};

// 编辑用户信息
const handleEdit = (row) => {
  console.log('编辑用户', row);
  adminEditUserStore.setUserData(row); // 将用户数据保存到 store
  router.push('/admin/user/edit'); // 跳转到报价页面
};

const handleDelete = async (userId) => {
  const token = userStore.token; // 获取用户的 Token
  try {
    await axios.delete(`http://localhost:3000/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      // data: {
      //   user_id: userId, // 发送需要删除的用户ID
      // }
    });
    ElMessage.success('用户删除成功'); // 删除成功的提示
    await fetchData(); // 重新获取用户列表以更新显示
  } catch (error) {
    console.error('删除用户失败:', error);
    ElMessage.error('删除用户失败，请重试'); // 删除失败的提示
  }
};

// 组件挂载后获取数据
onMounted(fetchData);
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  justify-content: flex-start;
  gap: 10px; /* 输入框之间的间距 */
}
</style>