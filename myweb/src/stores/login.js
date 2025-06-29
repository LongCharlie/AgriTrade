// src/stores/login.js
import { defineStore } from 'pinia';

export const useLoginStore = defineStore('login', {
    state: () => ({
        username: '',
        password: '',
    }),
    persist: true,  // 启用持久化
});