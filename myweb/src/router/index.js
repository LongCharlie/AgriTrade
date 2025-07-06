//Create an instance of the router
import {createWebHistory, createRouter } from 'vue-router'

import visitorPurchase from '@/views/visitorPurchase.vue';

import expertHome from '@/views/expert/expertHome.vue'
import expertRank from '@/views/expert/expertRank.vue'
import expertMain from '@/views/expert/expertMain.vue'
import expertCert from "@/views/expert/expertCert.vue";
import expertQues from "@/views/expert/expertQues.vue";
import expertDetail from "@/views/expert/expertDetail.vue";
import expertProfile from "@/views/expert/expertProfile.vue";
import expertAnswer from "@/views/expert/expertAnswer.vue";
import expertCertAdd from "@/views/expert/expertCertAdd.vue";
import expertCertDetail from "@/views/expert/expertCertDetail.vue";

import MainLayout from '@/views/merchant/MainLayout.vue'
import MerchantOrder from '@/views/merchant/merchantOrder.vue'
import merchantPurchaseDetails from '@/views/merchant/merchantPurchaseDetails.vue'
import MerchantPurchase from '@/views/merchant/merchantPurchase.vue';
import MerchantAddPurchase from '@/views/merchant/merchantAddPurchase.vue';
import MerchantMain from '@/views/merchant/merchantMain.vue'
import MerchantHome from '@/views/merchant/merchantHome.vue'
import MerchantMessage from '@/views/merchant/merchantMessage.vue'

const routes = [
    { path: '', component: () => import("../views/welcom.vue")},

    { path: '/visitorPurchase', component: visitorPurchase},

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
            { path: '/expert/profile', component: expertProfile},
            { path: '/expert/detail/:id', component: expertDetail },
            { path: '/expert/cert/new', component: expertCertAdd },
            { path: '/expert/cert/detail/:id', component: expertCertDetail },
        ]
    },
    {
        path: '/expert/detail/:id',
        component: expertDetail,
        //meta: { requiresAuth: true } // 需要登录才能访问，连了数据库再开
    },
    {
        path: '/expert/ques/:id/answer',
        component: expertAnswer,
        meta: { requiresAuth: true, role: ['expert'] }
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
            { path: 'planting/advice', component: () => import("../views/farmer/farmerPlantingAdvice.vue") },
            { path: 'planting/ai', component: () => import("../views/farmer/farmerPlantingAi.vue") },
            { path: 'planting/add', component: () => import("../views/farmer/farmerPlantingAdd.vue") },
            { path: 'planting/new', component: () => import("../views/farmer/farmerPlantingNew.vue") },
            { path: 'share', component: () => import("../views/farmer/farmerShare.vue") },
            { path: 'questions', component: () => import("../views/farmer/farmerQuestions.vue") },
            { path: 'profile', component: () => import("../views/farmer/farmerProfile.vue") }
        ]
},
      {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'Main',
          component: MerchantMain
        },
        {
          path: '/order',
          name: 'Order',
          component: MerchantOrder
        },
        {
          path: '/purchases',
          name: 'Purchases',
          component: MerchantPurchase
        },
        {
          path: '/purchaseDetail',
          name: 'PurchaseDetail',
          component: merchantPurchaseDetails
        },
        {
          path: '/addPurchase',
          name: 'AddPurchase',
          component: MerchantAddPurchase
        },
        {
          path: '/merchantHome',
          name: 'MerchantHome',
          component: MerchantHome
        },
        {
          path: '/merchantMessage',
          name: 'MerchantMessage',
          component: MerchantMessage
        }
      ]
  }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router