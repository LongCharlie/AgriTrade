<template>
  <div class="container">
    <header>
      <div class="greeting">
        欢迎回来，今天是 {{ currentDate }}，祝您工作愉快！
      </div>
    </header>

    <div class="profile-container">
      <!-- 左侧卡片 -->
      <section class="profile-card">
        <div class="avatar-container">
          <img :src="user.avatar_url" alt="商户头像" class="avatar" />
          <div class="change-avatar" @click="triggerAvatar">
            <svg class="camera-icon" viewBox="0 0 24 24">
              <path
                d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"
              />
            </svg>
          </div>
          <!-- 隐藏的文件选择框 -->
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleAvatarChange"
          />
        </div>

        <h2 class="merchant-name">{{ user.nickname }}</h2>

        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">{{ user.stats?.orders || 0 }}</div>
            <div class="stat-label">成交订单</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ user.stats?.purchases || 0 }}</div>
            <div class="stat-label">采购信息</div>
          </div>
        </div>
      </section>

      <!-- 右侧信息 -->
      <section class="info-card">
        <!-- 1️⃣ 基本信息 -->
        <div class="info-group">
          <h3>
            <svg style="width:22px;height:22px;vertical-align:-5px;fill:#4caf50" viewBox="0 0 24 24">
              <path
                d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
              />
            </svg>
            基本信息
          </h3>

          <div v-if="!editingProfile">
            <div class="info-row">
              <div class="info-label">商户ID</div>
              <div class="info-value">{{ user.id }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">昵称</div>
              <div class="info-value">{{ user.nickname }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">联系电话</div>
              <div class="info-value">{{ user.phone }}</div>
            </div>
            <button class="btn btn-edit" @click="startEditProfile">编辑</button>
          </div>

          <div v-else>
            <div class="info-row">
              <div class="info-label">昵称</div>
              <input class="info-input" v-model="draftProfile.nickname" />
            </div>
            <div class="info-row">
              <div class="info-label">联系电话</div>
              <input class="info-input" v-model="draftProfile.phone" />
            </div>
            <div class="btn-group">
              <button class="btn btn-save" @click="saveProfile">保存</button>
              <button class="btn btn-cancel" @click="cancelEditProfile">取消</button>
            </div>
            <p v-if="profileError" class="error-tip">{{ profileError }}</p>
          </div>
        </div>

        <!-- 2️⃣ 收货地址 -->
        <div class="info-group">
          <h3>
            <svg style="width:22px;height:22px;vertical-align:-5px;fill:#4caf50" viewBox="0 0 24 24">
              <path
                d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"
              />
            </svg>
            收货地址
          </h3>

          <div v-if="!editingAddress">
            <p>{{ user.province }} {{ user.city }} {{ user.district }}</p>
            <p>{{ user.address_detail }}</p>
            <button class="btn btn-edit" @click="startEditAddress">修改</button>
          </div>

          <div v-else>
            <el-cascader
              class="new-cascader"
              :options="areaOptions"
              v-model="draftAddress.area"
              placeholder="请选择省、市、区"
              clearable
            />
            <div class="form-group" style="margin-top:10px;">
              <label>详细地址</label>
              <input type="text" class="form-control" v-model="draftAddress.street" />
            </div>
            <div class="btn-group" style="margin-top:10px;">
              <button class="btn btn-save" @click="saveAddress">保存</button>
              <button class="btn btn-cancel" @click="cancelEditAddress">取消</button>
            </div>
            <p v-if="addressError" class="error-tip">{{ addressError }}</p>
          </div>
        </div>

        <!-- 3️⃣ 安全设置（密码） -->
        <div class="info-group">
          <h3>
            <svg style="width:22px;height:22px;vertical-align:-5px;fill:#4caf50" viewBox="0 0 24 24">
              <path
                d="M12,15C10.9,15 10,14.1 10,13C10,11.9 10.9,11 12,11C13.1,11 14,11.9 14,13C14,14.1 13.1,15 12,15M6,20V10H18V20H6M6,8H18V6H6V8M20,4H4V20H20V4M22,2V22H2V2H22Z"
              />
            </svg>
            安全设置
          </h3>

          <div v-if="!editingPassword">
            <button class="btn btn-change" @click="startEditPassword">修改密码</button>
          </div>

          <div v-else>
            <div class="password-row">
              <input type="password" class="password-input" placeholder="旧密码" v-model="draftPassword.old" />
            </div>
            <div class="password-row">
              <input type="password" class="password-input" placeholder="新密码" v-model="draftPassword.new" />
            </div>
            <div class="password-row">
              <input type="password" class="password-input" placeholder="确认新密码" v-model="draftPassword.confirm" />
            </div>
            <div class="btn-group">
              <button class="btn btn-save" @click="savePassword">保存</button>
              <button class="btn btn-cancel" @click="cancelEditPassword">取消</button>
            </div>
            <p v-if="passwordError" class="error-tip">{{ passwordError }}</p>
          </div>
        </div>

        <!-- 退出登录 -->
        <div class="action-buttons">
          <button class="btn btn-logout" @click="handleLogout">
            <svg style="width:20px;height:20px;fill:white" viewBox="0 0 24 24">
              <path
                d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"
              />
            </svg>
            退出登录
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted ,reactive} from 'vue';
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { pcaTextArr } from 'element-china-area-data';
import defaultAvatar from '@/assets/logo.png';

const userStore = useUserStore();
const API_BASE_URL = 'http://localhost:3000/api';
const AVATAR_BASE_URL = 'http://localhost:3000/uploads/avatars/';

const currentDate = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const user = ref({
  id: null,
  nickname: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  address_detail: '',
  avatar_url: defaultAvatar,
  stats: { orders: 0, purchases: 0 },
});

const areaOptions = pcaTextArr;
const avatarInput = ref(null);
function triggerAvatar() {
  avatarInput.value.click();
}

onMounted(async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    const d = res.data;
    Object.assign(user.value, {
      id: userStore.userId,
      nickname: d.nickname || userStore.username,
      phone: d.phone || '',
      province: d.province || '',
      city: d.city || '',
      district: d.district || '',
      address_detail: d.address_detail || '',
      avatar_url: d.avatar_url ? AVATAR_BASE_URL + d.avatar_url : defaultAvatar,
      stats: { orders: d.orders || 0, purchases: d.purchases || 0 },
    });
  } catch (e) {
    ElMessage.error('获取用户信息失败');
  }
});

async function handleAvatarChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
    ElMessage.error('请上传 ≤5MB 的图片');
    return;
  }
  try {
    const fd = new FormData();
    fd.append('avatar', file);
    const { data } = await axios.post(`${API_BASE_URL}/upload/avatar`, fd, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    const url = AVATAR_BASE_URL + data.avatarUrl;
    user.value.avatar_url = url;
    userStore.avatar_url = data.avatarUrl;
    await axios.patch(
      `${API_BASE_URL}/user/profile`,
      { avatar_url: data.avatarUrl },
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );
    ElMessage.success('头像更新成功');
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || '头像上传失败');
  }
}

/* ---------- 编辑状态 ---------- */
const editingProfile = ref(false);
const editingAddress = ref(false);
const editingPassword = ref(false);

const draftProfile = reactive({ nickname: '', phone: '' });
const draftAddress = reactive({ area: [], street: '' });
const draftPassword = reactive({ old: '', new: '', confirm: '' });

const profileError = ref('');
const addressError = ref('');
const passwordError = ref('');

function startEditProfile() {
  draftProfile.nickname = user.value.nickname;
  draftProfile.phone = user.value.phone;
  profileError.value = '';
  editingProfile.value = true;
}
function cancelEditProfile() {
  editingProfile.value = false;
}

function startEditAddress() {
  draftAddress.area = [user.value.province, user.value.city, user.value.district].filter(Boolean);
  draftAddress.street = user.value.address_detail;
  addressError.value = '';
  editingAddress.value = true;
}
function cancelEditAddress() {
  editingAddress.value = false;
}

function startEditPassword() {
  Object.assign(draftPassword, { old: '', new: '', confirm: '' });
  passwordError.value = '';
  editingPassword.value = true;
}
function cancelEditPassword() {
  editingPassword.value = false;
}

async function saveProfile() {
  try {
    await axios.patch(
      `${API_BASE_URL}/user/profile`,
      { nickname: draftProfile.nickname, phone: draftProfile.phone },
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );
    user.value.nickname = draftProfile.nickname;
    user.value.phone = draftProfile.phone;
    editingProfile.value = false;
    ElMessage.success('基本信息已更新');
  } catch (e) {
    profileError.value = e?.response?.data?.message || '修改失败';
  }
}

async function saveAddress() {
  if (draftAddress.area.length !== 3) {
    addressError.value = '请选择完整的省/市/区';
    return;
  }
  const [province, city, district] = draftAddress.area;
  try {
    await axios.patch(
      `${API_BASE_URL}/user/address`,
      { province, city, district, address_detail: draftAddress.street },
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );
    Object.assign(user.value, { province, city, district, address_detail: draftAddress.street });
    editingAddress.value = false;
    ElMessage.success('地址已更新');
  } catch (e) {
    addressError.value = e?.response?.data?.message || '修改失败';
  }
}

async function savePassword() {
  if (draftPassword.new !== draftPassword.confirm) {
    passwordError.value = '两次密码不一致';
    return;
  }
  try {
    await axios.post(
      `${API_BASE_URL}/user/password`,
      {
        oldPassword: draftPassword.old,
        newPassword: draftPassword.new,
      },
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );
    editingPassword.value = false;
    ElMessage.success('密码已修改');
  } catch (e) {
    passwordError.value = e?.response?.data?.message || '修改失败';
  }
}

function handleLogout() {
  userStore.clearUser();
  ElMessage.success('已退出登录');

  router.push('/login');
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'Microsoft YaHei', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
  line-height: 1.6;
  padding: 20px;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

header {
  background: transparent !important;
  text-align: center;
  padding: 30px 0;
  margin-bottom: 30px;
  position: relative;
}

.greeting {
  text-align: center;
  margin-top: 10px;
  font-size: 1.1rem;
  color: #388e3c;
  background: rgba(232, 245, 233, 0.7);
  padding: 8px 15px;
  border-radius: 20px;
  display: inline-block;
}

.profile-container {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.profile-card {
  flex: 1;
  min-width: 300px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(46, 125, 50, 0.1);
  padding: 30px;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(to bottom, #ffffff, #f1f8e9);
  border: 1px solid #c5e1a5;
  position: relative;
  overflow: hidden;
}

.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(46, 125, 50, 0.15);
}

.info-card {
  flex: 2;
  min-width: 300px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(46, 125, 50, 0.1);
  padding: 30px;
  transition: transform 0.3s ease;
  background: linear-gradient(to bottom, #ffffff, #f1f8e9);
  border: 1px solid #c5e1a5;
  position: relative;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(46, 125, 50, 0.15);
}

h2 {
  font-size: 1.8rem;
  color: #2e7d32;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e8f5e9;
  display: flex;
  align-items: center;
}

.icon {
  width: 28px;
  height: 28px;
  margin-right: 12px;
  fill: #43a047;
}

.avatar-container {
  position: relative;
  margin-bottom: 25px;
}

.avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #e8f5e9;
  box-shadow: 0 5px 15px rgba(46, 125, 50, 0.1);
  background: #c8e6c9;
}

.change-avatar {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #4caf50;
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(76, 175, 80, 0.4);
  transition: all 0.3s;
}

.change-avatar:hover {
  background: #388e3c;
  transform: scale(1.1);
}

.camera-icon {
  width: 24px;
  height: 24px;
  fill: white;
}

.merchant-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1b5e20;
  margin-bottom: 5px;
}

.stats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 20px 0;
  padding: 15px 0;
  border-top: 1px solid #e8f5e9;
  border-bottom: 1px solid #e8f5e9;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2e7d32;
}

.stat-label {
  font-size: 0.9rem;
  color: #4caf50;
}

.info-group {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8f5e9;
}

.info-group h3 {
  color: #388e3c;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  font-size: 1.3rem;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
}

.info-label {
  width: 150px;
  font-weight: 600;
  color: #1b5e20;
  font-size: 1.1rem;
}

.info-value {
  flex: 1;
  font-size: 1.1rem;
  padding: 10px 15px;
  background: #e8f5e9;
  border-radius: 8px;
  color: #2e7d32;
}

.info-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #a5d6a7;
  border-radius: 8px;
  font-size: 1.1rem;
  background: #f1f8e9;
  color: #1b5e20;
  transition: all 0.3s;
}

.info-input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
}

.address-list {
  margin-top: 15px;
}

.address-item {
  background: #E8F5E9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  position: relative;
  border-left: 4px solid #4CAF50;
  transition: all 0.3s;
}

.address-item:hover {
  background: #E1F2E4;
  transform: translateX(5px);
}

.address-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}


.form-group{
  margin-bottom: 15px;
}

.form-group label{
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1b5e20;
}

.form-control{
  width: 100%;
  padding: 12px;
  border: 1px solid #a5d6a7;
  border-radius: 8px;
  font-size: 1rem;
  background: #f1f8e9;
  color: #1b5e20;
}

.form-control:focus{
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn-group {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.btn {
  padding: 14px 25px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-edit {
  background: #8db0f1c8;
  color: white;
}

.btn-save {
  background: #43A047;
  color: white;
  box-shadow: 0 4px 6px rgba(67, 160, 71, 0.3);
}

.btn-cancel {
  background: #f1f5f9;
  color: #334155;
}

.btn-change {
  background: #8db0f1c8;
  color: white;
}

.btn-logout {
  background: #E74C3C;
  color: white;
  box-shadow: 0 4px 6px rgba(231, 76, 60, 0.3);
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1);
}

.password-form {
  margin-top: 20px;
  padding: 20px;
  background: #f1f8e9;
  border-radius: 10px;
  border: 1px solid #c5e1a5;
}

.password-row {
  margin-bottom: 15px;
}

.password-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #a5d6a7;
  border-radius: 8px;
  background: #f1f8e9;
  color: #1b5e20;
  font-size: 1rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.modal-message {
  font-size: 18px;
  color: #7f8c8d;
  margin-bottom: 30px;
  text-align: center;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn-modal {
  min-width: 120px;
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-label {
    margin-bottom: 5px;
    width: 100%;
  }

  .address-form {
    grid-template-columns: 1fr;
  }
}
</style>