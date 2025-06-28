import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        username: '',
        role: '',
        userId: null,
    }),
    persist: true,  // 启用持久化
});

