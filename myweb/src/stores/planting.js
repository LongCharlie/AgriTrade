// src/stores/planting.js
import { defineStore } from 'pinia';

export const usePlantingStore = defineStore('planting', {
    state: () => ({
        currentRecord: null, // 用于存储所选的种植记录
    }),
    actions: {
        setCurrentRecord(record) {
            this.currentRecord = record; // 设置当前记录
        },
        clearCurrentRecord() {
            this.currentRecord = null; // 清空当前记录
        },
    },
});