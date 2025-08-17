// src/stores/quote.js
import { defineStore } from 'pinia';

export const useQuoteStore = defineStore('quote', {
    state: () => ({
        currentQuote: null,  // 当前报价的信息
        currentOrder: null,  //如果生成订单，订单信息
    }),
    persist: true,  // 启用持久化
});