// src/stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        username: '',
        role: '',
        userId: '',
        phone: '',         // 用户电话
        avatar_url: '',    // 用户头像 URL
        province: '',      // 用户省份
        city: '',          // 用户城市
        district: '',      // 用户区县
        address_detail: '', // 用户详细地址
    }),
    persist: true,  // 启用持久化
    actions: {
        setUser(userData) {
            this.username = userData.username;
            this.phone = userData.phone;
            this.role = userData.role;
            this.userId = userData.userId;
            this.avatar_url = userData.avatar_url;
            this.province = userData.province;
            this.city = userData.city;
            this.district = userData.district;
            this.address_detail = userData.address_detail;
        },
    }
});