<template>
  <div class="container">
    <header>
      <div class="greeting">
        欢迎回来，今天是{{ currentDate }},祝您工作愉快！
      </div>
    </header>
    
    <div class="profile-container">
      <section class="profile-card">
        <div class="avatar-container">
          <img :src="profile.avatar" alt="商户头像" class="avatar">
          <div class="change-avatar" @click="handleChangeAvatar">
            <svg class="camera-icon" viewBox="0 0 24 24">
              <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
            </svg>
          </div>
        </div>
        
        <h2 class="merchant-name">{{ profile.name }}</h2>
        
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">{{ profile.stats.orders }}</div>
            <div class="stat-label">成交订单</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ profile.stats.purchases }}</div>
            <div class="stat-label">采购信息</div>
          </div>
        </div>
      </section>
      
      <section class="info-card">
        <h2>
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
          </svg>
          账户信息
        </h2>
        
        <div class="info-group">
          <h3>
            <svg style="width:22px;height:22px;vertical-align:-5px;fill:#4caf50" viewBox="0 0 24 24">
              <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
            </svg>
            基本信息
          </h3>
          <div class="info-row">
            <div class="info-label">商户ID</div>
            <div class="info-value">{{ profile.merchantId }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">昵称</div>
            <div v-if="!editingProfile" class="info-value">{{ profile.nickname }}</div>
            <input v-else class="info-input" v-model="editProfile.nickname">
          </div>
          <div class="info-row">
            <div class="info-label">联系电话</div>
            <div v-if="!editingProfile" class="info-value">{{ profile.phone }}</div>
            <input v-else class="info-input" v-model="editProfile.phone">
          </div>
          
          <div v-if="!editingProfile" class="btn-group">
            <button class="btn btn-edit" @click="startEditingProfile">
              <i class="fas fa-edit"></i>
              编辑个人信息
            </button>
          </div>
          
          <div v-else class="btn-group">
            <button class="btn btn-save" @click="confirmProfileEdit">
              <i class="fas fa-check"></i>
              提交修改
            </button>
            <button class="btn btn-cancel" @click="cancelProfileEdit">
              <i class="fas fa-times"></i>
              取消
            </button>
          </div>
        </div>
        
        <div class="info-group">
          <h3>
            <svg style="width:22px;height:22px;vertical-align:-5px;fill:#4caf50" viewBox="0 0 24 24">
              <path d="M12,15C10.9,15 10,14.1 10,13C10,11.9 10.9,11 12,11C13.1,11 14,11.9 14,13C14,14.1 13.1,15 12,15M6,20V10H18V20H6M6,8H18V6H6V8M20,4H4V20H20V4M22,2V22H2V2H22Z" />
            </svg>
            安全设置
          </h3>
          
          <button v-if="!editingPassword" class="btn btn-change" @click="startEditingPassword">
            <i class="fas fa-lock"></i>
            修改密码
          </button>
          
          <div v-else class="password-form">
            <div class="password-row">
              <input type="password" class="password-input" placeholder="旧密码" v-model="password.oldPassword">
            </div>
            <div class="password-row">
              <input type="password" class="password-input" placeholder="新密码" v-model="password.newPassword">
            </div>
            <div class="password-row">
              <input type="password" class="password-input" placeholder="确认新密码" v-model="password.confirmPassword">
            </div>
            
            <div class="btn-group">
              <button class="btn btn-save" @click="confirmPasswordChange">
                <i class="fas fa-check"></i>
                确认修改
              </button>
              <button class="btn btn-cancel" @click="cancelPasswordChange">
                <i class="fas fa-times"></i>
                取消
              </button>
            </div>
          </div>
        </div>
        
        <div class="info-group">
      <h3>
        <svg style="width:22px;height:22px;vertical-align:-5px;fill:#4caf50" viewBox="0 0 24 24">
          <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
        </svg>
        收货地址
      </h3>
      
      <div v-if="!editingAddress" class="address-item">
        <p>{{ profile.address.province }} {{ profile.address.city }} {{ profile.address.district }}</p>
        <p>{{ profile.address.street }}</p>
        
        <button class="btn btn-edit" @click="startEditingAddress" style="margin-top: 15px;">
          <i class="fas fa-edit"></i>
          修改收货地址
        </button>
      </div>
      
      <div v-else class="address-form">

        <el-cascader
          class="new-cascader"
          :options="areaOptions"
          v-model="selectedLocation"
          @change="handleLocationChange"
          placeholder="请选择省、市、区"
          clearable
        />
        
        <div class="form-group" style="grid-column: span 2;">
          <label>详细地址</label>
          <input type="text" class="form-control" v-model="editAddress.street">
        </div>
        
        <div class="btn-group" style="grid-column: span 2;">
          <button class="btn btn-save" @click="confirmAddressEdit">
            <i class="fas fa-check"></i>
            保存地址
          </button>
          <button class="btn btn-cancel" @click="cancelAddressEdit">
            <i class="fas fa-times"></i>
            取消
          </button>
        </div>
      </div>
    </div>
        
        <div class="action-buttons">
          <button class="btn btn-logout" @click="handleLogout">
            <svg style="width:20px;height:20px;fill:white" viewBox="0 0 24 24">
              <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
            </svg>
            退出登录
          </button>
        </div>
      </section>
    </div>
    
    <!-- 确认弹窗 -->
    <div class="modal" v-if="showConfirmation">
      <div class="modal-content">
        <h3 class="modal-title">确认修改</h3>
        <p class="modal-message">确定要保存修改吗？</p>
        <div class="modal-buttons">
          <button class="btn btn-save btn-modal" @click="saveChanges">
            <i class="fas fa-check"></i>
            确认
          </button>
          <button class="btn btn-cancel btn-modal" @click="cancelChanges">
            <i class="fas fa-times"></i>
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pcaTextArr, codeToText } from "element-china-area-data";
export default {
  data() {
    return {
      areaOptions: pcaTextArr,  // 使用导入的数据
      selectedLocation: [],     // 用于绑定级联选择器的值
      currentDate: this.getFormattedDate(),

      editingProfile: false,
      editingPassword: false,
      editingAddress: false,
      showConfirmation: false,
      pendingAction: null,
      loadingAddressData: false,
      profile: {
        name: '张明远',
        merchantId: 'MER20230715',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
        stats: {
          orders: '128',
          purchases: '24'
        },
        nickname: '明远商贸',
        phone: '13883785678',
        address: {
          name: '张明远',
          phone: '13883785678',
          province: '上海市', // 初始为空，等待API数据
          city: '',
          district: '宝山区',
          street: '建国路88号华贸中心3号楼1502室',
        }
      },
      editProfile: {
        nickname: '',
        phone: ''
      },
      password: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      editAddress: {
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        street: ''
      },
      // 数据结构调整为包含value和label的对象数组
      provinces: [],
      cities: [],
      districts: [],
    };
  },
  
  mounted() {
    // 初始化编辑数据
    this.editProfile.nickname = this.profile.nickname;
    this.editProfile.phone = this.profile.phone;
    this.editAddress = {...this.profile.address};
  },
  methods: {
    startEditingAddress() {
      this.editingAddress = true;
      // 初始化编辑数据
      this.editAddress = {...this.profile.address};
      
      // 如果已有地址数据，设置级联选择器的值
      if (this.profile.address.province && this.profile.address.city && this.profile.address.district) {
        const provinceCode = Object.keys(codeToText).find(
          key => codeToText[key] === this.profile.address.province
        );
        const cityCode = Object.keys(codeToText).find(
          key => codeToText[key] === this.profile.address.city
        );
        const districtCode = Object.keys(codeToText).find(
          key => codeToText[key] === this.profile.address.district
        );
        
        if (provinceCode && cityCode && districtCode) {
          this.selectedLocation = [provinceCode, cityCode, districtCode];
        }
      }
    },
    
    // 修正位置变化处理方法
    handleLocationChange(selected) {
      if (selected && selected.length >= 1) {
        this.editAddress.province = codeToText[selected[0]];
      }
      if (selected && selected.length >= 2) {
        this.editAddress.city = codeToText[selected[1]];
      }
      if (selected && selected.length >= 3) {
        this.editAddress.district = codeToText[selected[2]];
      }
    },
    // 获取格式化日期
    getFormattedDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
      const weekday = weekdays[now.getDay()];
      return `${year}年${month}月${day}日 星期${weekday}`;
    },
    
    // API请求方法
    
    // 事件处理
    onProvinceChange() {
      this.loadCities(this.editAddress.province);
    },
    
    onCityChange() {
      this.loadDistricts(this.editAddress.city);
    },
    
    // 其他方法保持不变
    handleChangeAvatar() {
      alert('头像上传功能已触发，您可以选择新头像进行上传');
    },
    startEditingProfile() {
      this.editingProfile = true;
    },
    startEditingPassword() {
      this.editingPassword = true;
    },
    confirmProfileEdit() {
      this.showConfirmation = true;
      this.pendingAction = 'profile';
    },
    confirmPasswordChange() {
      if (this.password.newPassword !== this.password.confirmPassword) {
        alert('两次输入的新密码不一致');
        return;
      }
      if (this.password.newPassword.length < 6) {
        alert('新密码长度至少为6位');
        return;
      }
      this.showConfirmation = true;
      this.pendingAction = 'password';
    },
    confirmAddressEdit() {
      if (!this.editAddress.name || !this.editAddress.phone || !this.editAddress.street) {
        alert('请填写完整的收货地址信息');
        return;
      }
      this.showConfirmation = true;
      this.pendingAction = 'address';
    },
    cancelProfileEdit() {
      this.editingProfile = false;
      this.editProfile.nickname = this.profile.nickname;
      this.editProfile.phone = this.profile.phone;
    },
    cancelPasswordChange() {
      this.editingPassword = false;
      this.password = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    },
    cancelAddressEdit() {
      this.editingAddress = false;
      this.editAddress = {...this.profile.address};
    },
    saveChanges() {
      if (this.pendingAction === 'profile') {
        this.profile.nickname = this.editProfile.nickname;
        this.profile.phone = this.editProfile.phone;
        this.editingProfile = false;
        alert('个人信息修改成功！');
      } else if (this.pendingAction === 'password') {
        // 实际应用中这里会有密码验证和更新逻辑
        this.editingPassword = false;
        this.password = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        alert('密码修改成功！');
      } else if (this.pendingAction === 'address') {
        this.profile.address = {...this.editAddress};
        this.editingAddress = false;
        alert('收货地址更新成功！');
      }
      
      this.showConfirmation = false;
      this.pendingAction = null;
    },
    cancelChanges() {
      this.showConfirmation = false;
      this.pendingAction = null;
    },
    handleLogout() {
      if (confirm('确定要退出登录吗？')) {
        alert('您已成功退出登录，正在跳转到首页...');
      }
    }
  }
};
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