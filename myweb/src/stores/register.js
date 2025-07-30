// src/stores/register.js
import { defineStore } from 'pinia';

export const useRegisterStore = defineStore('register', {
    state: () => ({
        username: '',
        password: '',
        role: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        address_detail: '',
        // 专家字段
        real_name: '',
        title: '',
        institution: '',
        expertise: '',
        bio: ''
    }),
    persist: true,  // 启用持久化
});