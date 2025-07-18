import { defineStore } from 'pinia';

export const useAdminEditUserStore = defineStore('adminEditUser', {
    state: () => ({
        userData: {
            user_id: null,
            username: '',
            phone: '',
            role: '',
            province: '',
            city: '',
            district: '',
            address_detail: '',
            join_date: '',
            avatar_url: '',
        }
    }),
    actions: {
        setUserData(data) {
            this.userData = { ...data };
        },
        clearUserData() {
            this.userData = {
                user_id: null,
                username: '',
                phone: '',
                role: '',
                province: '',
                city: '',
                district: '',
                address_detail: '',
                join_date: '',
                avatar_url: '',
            };
        }
    }
});