// stores/seeRecord.js
import { defineStore } from 'pinia';

export const useSeeRecordStore = defineStore('seeRecord', {
    state: () => ({
        recordId: null, // 用来存储record_id
    }),
    actions: {
        setRecordId(id) {
            this.recordId = id;
        },
    },
});