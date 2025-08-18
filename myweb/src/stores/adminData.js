// src/stores/adminData.js
import { defineStore } from 'pinia';

export const useAdminDataStore = defineStore('demand', {
    state: () => ({
        currentData: null,  // 当前报价的信息
        msg: null,  // week 或 month 或 year
    }),
    persist: true,  // 启用持久化
});