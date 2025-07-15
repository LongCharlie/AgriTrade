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
            <el-button @click="handleDelete(scope.row)" type="text" style="color: red;">[删除]</el-button>
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

// 用于存储用户数据
const userData = ref([]);
const filteredTableData = ref([]);
const pageSize = ref(5); // 每页显示的项目数
const currentPage = ref(1); // 当前页码

const simulatedUserData = [
  {
    user_id: 1,
    username: 'zhangsan',
    password: 'hashed_password_1',
    role: 'farmer',
    phone: '13800000001',
    province: '河南省',
    city: '郑州市',
    district: '管城区',
    address_detail: '某某街道1号',
    avatar_url: 'http://example.com/avatar1.png',
    join_date: '2023-01-15 10:30:00',
  },
  {
    user_id: 2,
    username: 'lisi',
    password: 'hashed_password_2',
    role: 'buyer',
    phone: '13800000002',
    province: '江苏省',
    city: '南京市',
    district: '鼓楼区',
    address_detail: '某某街道2号',
    avatar_url: 'http://example.com/avatar2.png',
    join_date: '2023-02-20 14:45:00',
  },
  {
    user_id: 3,
    username: 'wangwu',
    password: 'hashed_password_3',
    role: 'expert',
    phone: '13800000003',
    province: '浙江省',
    city: '杭州市',
    district: '西湖区',
    address_detail: '某某街道3号',
    avatar_url: 'http://example.com/avatar3.png',
    join_date: '2022-11-05 09:15:00',
  },
  {
    user_id: 4,
    username: 'zhaoliu',
    password: 'hashed_password_4',
    role: 'admin',
    phone: '13800000004',
    province: '广东省',
    city: '广州市',
    district: '天河区',
    address_detail: '某某街道4号',
    avatar_url: 'http://example.com/avatar4.png',
    join_date: '2023-05-30 16:00:00',
  },
  {
    user_id: 5,
    username: 'sunqi',
    password: 'hashed_password_5',
    role: 'farmer',
    phone: '13800000005',
    province: '山东省',
    city: '青岛市',
    district: '市南区',
    address_detail: '某某街道5号',
    avatar_url: 'http://example.com/avatar5.png',
    join_date: '2023-08-10 11:00:00',
  },
  {
    user_id: 6,
    username: 'liangba',
    password: 'hashed_password_6',
    role: 'buyer',
    phone: '13800000006',
    province: '湖北省',
    city: '武汉市',
    district: '江岸区',
    address_detail: '某某街道6号',
    avatar_url: 'http://example.com/avatar6.png',
    join_date: '2023-09-01 12:00:00',
  },
  {
    user_id: 7,
    username: 'yangqi',
    password: 'hashed_password_7',
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
    const response = await axios.get('http://localhost:3000/api/users/all', {
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
  // 可能需要将用户信息传递到编辑页面
  router.push('/admin/user/edit'); // 跳转到报价页面
  // router.push({ name: 'EditUser', params: { userId: row.user_id } });
};

// 删除用户
const handleDelete = (row) => {
  console.log('删除用户', row);
  // 在这里实现删除逻辑
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