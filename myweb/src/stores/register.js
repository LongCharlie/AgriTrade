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
        address_detail: ''
    }),
    persist: true,  // 启用持久化
});