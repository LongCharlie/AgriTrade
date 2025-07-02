<template>
  <div class="container">
    <!-- 内联SVG叶子装饰 -->
    <svg class="leaf-decoration leaf-1" viewBox="0 0 24 24">
      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
    </svg>
    
    <svg class="leaf-decoration leaf-2" viewBox="0 0 24 24">
      <path d="M2,21C8,16 8,10 8,10C8,10 12.89,7 20,10C20,10 19,21 19,21C19,21 15,21 13,17C11,13 11,10 11,10C11,10 8,3 2,21Z" />
    </svg>
    
    <svg class="leaf-decoration leaf-3" viewBox="0 0 24 24">
      <path d="M12,3C12,3 7,10 7,14C7,17.31 9.69,20 13,20C16.31,20 19,17.31 19,14C19,10 12,3 12,3Z" />
    </svg>
    <header>
      <div class="greeting">
        <svg style="width:18px;height:18px;vertical-align:-4px;fill:#4caf50" viewBox="0 0 24 24">
          <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 4,12A8,8 0 0,1 12,20C16.41,20 20,16.41 20,12A8,8 0 0,1 12,4M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" />
        </svg>
        欢迎回来，今天是{{ currentDate }},祝您工作愉快！
      </div>
    </header>
    
    <div class="profile-container">
      <section class="profile-card">
        <div class="avatar-container">
          <img :src="profile.avatar" alt="商户头像" class="avatar">
          <div class="change-avatar">
            <svg class="camera-icon" viewBox="0 0 24 24">
              <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
            </svg>
          </div>
        </div>
        
        <h2 class="merchant-name">{{ profile.name }}</h2>
        <p class="merchant-id">商户ID: {{ profile.merchantId }}</p>
        
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">{{ profile.stats.orders }}</div>
            <div class="stat-label">成交订单</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ profile.stats.years }}</div>
            <div class="stat-label">商户年限</div>
          </div>
        </div>
        <div class="merchant-level">
          <div class="level-card">
            <h3>
              <svg class="trophy-icon" viewBox="0 0 24 24">
                <path d="M18,2C17.1,2 16,3 16,4H8C8,3 6.9,2 6,2H2V11C2,12 3,13 4,13H6.2C6.6,15 7.9,16.7 11,17V19.08C8,19.54 8,22 8,22H16C16,22 16,19.54 13,19.08V17C16.1,16.7 17.4,15 17.8,13H20C21,13 22,12 22,11V2H18M6,11H4V4H6V11M20,11H18V4H20V11Z" />
              </svg>
              商户等级
            </h3>
            <div class="level-progress">
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
              <div class="level-name">{{ profile.level }}</div>
            </div>
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
            <button class="edit-btn" disabled>
              <svg class="lock-icon" viewBox="0 0 24 24">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
              </svg>
            </button>
          </div>
          <div class="info-row">
            <div class="info-label">昵称</div>
            <div class="info-value">{{ profile.nickname }}</div>
            <button class="edit-btn">
              <svg class="edit-icon" viewBox="0 0 24 24">
                <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>
            </button>
          </div>
          <div class="info-row">
            <div class="info-label">联系电话</div>
            <div class="info-value">{{ profile.phone }}</div>
            <button class="edit-btn">
              <svg class="edit-icon" viewBox="0 0 24 24">
                <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="info-group">
          <h3>
            <svg style="width:22px;height:22px;vertical-align:-5px;fill:#4caf50" viewBox="0 0 24 24">
              <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
            </svg>
            安全设置
          </h3>
          <div class="info-row">
            <div class="info-label">登录密码</div>
            <div class="info-value">••••••••</div>
            <button class="edit-btn">
              <svg class="edit-icon" viewBox="0 0 24 24">
                <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>
            </button>
          </div>
          <div class="password-strength">
            <div class="password-strength-bar"></div>
          </div>
          <p style="font-size: 0.9rem; color: #4caf50; margin-top: 5px;">
            <svg style="width:14px;height:14px;vertical-align:-2px;fill:#4caf50" viewBox="0 0 24 24">
              <path d="M12,20A8,8 0 0,0 4,12A8,8 0 0,0 12,4A8,8 0 0,0 20,12A8,8 0 0,0 12,20M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M5,10H19" />
            </svg>
            上次修改时间: {{ profile.lastPasswordChange }}
          </p>
        </div>
        
        <div class="info-group">
          <h3>
            <svg style="width:22px;height:22px;vertical-align:-5px;fill:#4caf50" viewBox="0 0 24 24">
              <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
            </svg>
            收货地址
          </h3>
          <div class="address-list">
            <div class="address-item">
              <p><strong>{{ address.name }}</strong> {{ address.phone }}</p>
              <p>{{ address.street }}</p>
              <p>邮编: {{ address.postalCode }}</p>
              <div class="address-actions">
                <button class="address-btn edit">
                  <svg class="btn-icon" viewBox="0 0 24 24">
                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                  </svg>
                  修改
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-save">
            <svg style="width:20px;height:20px;fill:white" viewBox="0 0 24 24">
              <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
            </svg>
            保存更改
          </button>
          <button class="btn btn-logout">
            <svg style="width:20px;height:20px;fill:white" viewBox="0 0 24 24">
              <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
            </svg>
            退出登录
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MerchantProfile',
  data() {
    return {
      currentDate: this.getFormattedDate(),
      profile: {
        name: '张明远',
        merchantId: 'MER20230715',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
        stats: {
          orders: '128',
          positiveRate: '96%',
          years: '3年'
        },
        level: '黄金商户',
        nickname: '明远商贸',
        phone: '138****5678',
        lastPasswordChange: '2025-06-15'
      },
      address: {
        name: '张明远',
        phone: '138****5678',
        street: '北京市朝阳区建国路88号华贸中心3号楼1502室',
        postalCode: '100025'
      }
    }
  },
  mounted() {
    // 头像上传功能
    const changeAvatar = document.querySelector('.change-avatar');
    changeAvatar.addEventListener('click', function() {
      alert('头像上传功能已触发，您可以选择新头像进行上传');
    });
    
    // 编辑按钮功能
    const editButtons = document.querySelectorAll('.edit-btn:not([disabled])');
    editButtons.forEach(button => {
      button.addEventListener('click', function() {
        const row = this.closest('.info-row');
        const label = row.querySelector('.info-label').textContent;
        alert(`准备编辑: ${label}`);
      });
    });
    
    // 地址操作功能
    const addressActions = document.querySelectorAll('.address-btn');
    addressActions.forEach(button => {
      button.addEventListener('click', function() {
        const action = this.textContent;
        alert(`执行操作: ${action} 地址`);
      });
    });
    
    // 保存按钮
    const saveBtn = document.querySelector('.btn-save');
    saveBtn.addEventListener('click', function() {
      alert('所有更改已保存成功！');
    });
    
    // 退出登录
    const logoutBtn = document.querySelector('.btn-logout');
    logoutBtn.addEventListener('click', function() {
      if(confirm('确定要退出登录吗？')) {
        alert('您已成功退出登录，正在跳转到首页...');
        // 实际应用中这里会跳转到登录页
      }
    });
  },
  methods: {
    getFormattedDate() {
      const now = new Date();
      return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    }
  }
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

.leaf-decoration {
  position: absolute;
  width: 120px;
  height: 120px;
  opacity: 0.15;
  z-index: 1;
}

.leaf-1 {
  top: 50px;
  right: 50px;
  transform: rotate(25deg);
}

.leaf-2 {
  bottom: 100px;
  left: 50px;
  transform: rotate(-15deg);
}

.leaf-3 {
  bottom: 200px;
  right: 100px;
  transform: rotate(45deg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

header {
  text-align: center;
  padding: 30px 0;
  margin-bottom: 30px;
  position: relative;
}

header h1 {
  font-size: 2.8rem;
  color: #1b5e20;
  margin-bottom: 10px;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
  position: relative;
  display: inline-block;
}

header h1::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: #4caf50;
  border-radius: 2px;
}

header p {
  font-size: 1.2rem;
  color: #388e3c;
  max-width: 700px;
  margin: 20px auto 0;
  padding: 10px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
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

.merchant-id {
  font-size: 1.1rem;
  color: #388e3c;
  margin-bottom: 20px;
  background: #e8f5e9;
  padding: 5px 15px;
  border-radius: 20px;
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

.edit-btn {
  margin-left: 10px;
  background: #4CAF50;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn:hover {
  background: #388E3C;
  transform: scale(1.05);
}

.lock-icon {
  width: 16px;
  height: 16px;
  fill: #7F8C8D;
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

.address-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.address-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
}

.address-btn.edit {
  background: #4CAF50;
  color: white;
}

.address-btn.set-default {
  background: #43A047;
  color: white;
}

.address-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.add-address {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 12px;
  background: #E8F5E9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px dashed #4CAF50;
  color: #2E7D32;
  font-weight: 600;
  gap: 8px;
}

.add-address:hover {
  background: #4CAF50;
  color: white;
}

.plus-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.password-strength {
  height: 8px;
  background: #C8E6C9;
  border-radius: 4px;
  margin-top: 8px;
  overflow: hidden;
}

.password-strength-bar {
  height: 100%;
  width: 70%;
  background: #43A047;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
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

.btn-save {
  background: #43A047;
  color: white;
  flex: 1;
  box-shadow: 0 4px 6px rgba(67, 160, 71, 0.3);
}

.btn-logout {
  background: #E74C3C;
  color: white;
  flex: 1;
  box-shadow: 0 4px 6px rgba(231, 76, 60, 0.3);
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1);
}

.trophy-icon {
  width: 24px;
  height: 24px;
  fill: #FF9800;
}

.level-card {
  background: #E8F5E9;
  padding: 15px;
  border-radius: 10px;
  margin-top: 25px;
}

.level-card h3 {
  margin-bottom: 10px;
  color: #2E7D32;
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: #C8E6C9;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 85%;
  background: #4CAF50;
  border-radius: 5px;
}

.level-name {
  font-weight: bold;
  color: #1B5E20;
  min-width: 80px;
}

footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px;
  color: #4CAF50;
  font-size: 0.9rem;
  border-top: 1px solid #C8E6C9;
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }
  
  header h1 {
    font-size: 2.2rem;
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-label {
    margin-bottom: 5px;
    width: 100%;
  }
}
</style>