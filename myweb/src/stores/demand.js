// src/stores/demand.js
import { defineStore } from 'pinia';

export const useDemandStore = defineStore('demand', {
    state: () => ({
        currentDemand: null,  // 当前报价的信息
    }),
    persist: true,  // 启用持久化
});