//Create an instance of the router
import {createWebHistory, createRouter } from 'vue-router'

import expertHome from '@/views/expert/expertHome.vue'
import expertRank from '@/views/expert/expertRank.vue'
import expertMain from '@/views/expert/expertMain.vue'
import expertCert from "@/views/expert/expertCert.vue";
import expertQues from "@/views/expert/expertQues.vue";

const routes = [
    { path: '', component: () => import("../views/welcom.vue")},

    { path: '/login', component: () => import("../views/login.vue")},

    { path: '/register', component: () => import("../views/register.vue")},

    {
        path: '/expert',
        redirect: '/expert/home', //removal
        component: expertMain,
        //subrouter
        children: [
            { path: '/expert/home', component: expertHome },
            { path: '/expert/rank', component: expertRank },
            { path: '/expert/cert', component: expertCert },
            { path: '/expert/ques', component: expertQues },
        ]
    },
    {
        path: "/farmer",
        component: () => import("../views/farmer.vue"),
        children: [ // 子路由
            { path: '', name: 'FarmerHome', component: () => import("../views/farmer/farmerMain.vue") },  // 默认子路由
            { path: 'purchases', component: () => import("../views/farmer/farmerPurchases.vue") },
            { path: 'purchases/quote', component: () => import("../views/farmer/farmerPurchasesQuote.vue") },
            { path: 'purchases/quotemodify', component: () => import("../views/farmer/farmerPurchasesQuoteModify.vue") },
            { path: 'orders', component: () => import("../views/farmer/farmerOrders.vue") },
            { path: 'messages', component: () => import("../views/farmer/farmerMessages.vue") },
            { path: 'planting', component: () => import("../views/farmer/farmerPlanting.vue") },
            { path: 'share', component: () => import("../views/farmer/farmerShare.vue") },
            { path: 'questions', component: () => import("../views/farmer/farmerQuestions.vue") },
            { path: 'profile', component: () => import("../views/farmer/farmerProfile.vue") }
        ]
}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router