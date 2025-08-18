//Create an instance of the router
import {createWebHistory, createRouter } from 'vue-router'
import { useUserStore } from '@/stores/user';  // 导入 Pinia store

import visitor from '@/views/visitor.vue';

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
import expertAnswerDetail from "@/views/expert/expertAnswerDetail.vue"

import Merchant from '@/views/merchant.vue'
import MerchantOrder from '@/views/merchant/merchantOrder.vue'
import merchantPurchaseDetails from '@/views/merchant/merchantPurchaseDetails.vue'
import MerchantPurchase from '@/views/merchant/merchantPurchase.vue';
import MerchantAddPurchase from '@/views/merchant/merchantAddPurchase.vue';
import MerchantMain from '@/views/merchant/merchantMain.vue'
import MerchantHome from '@/views/merchant/merchantHome.vue'
import MerchantMessage from '@/views/merchant/merchantMessage.vue'



const routes = [
    { path: '', component: () => import("../views/welcom.vue")},

    { path: '/notice', component: () => import("../views/notice.vue")},

    { path: '/visitor', component: visitor},

    { path: '/login', component: () => import("../views/login.vue")},

    { path: '/register', component: () => import("../views/register.vue")},

    {
        path: '/expert',
        redirect: '/expert/home', //removal
        component: expertMain,
        // meta: { requiresAuth: true, role: ['expert'] },
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
            { path: '/expert/answer/:id', component: expertAnswerDetail },
        ]
    },
    {
        path: '/expert/detail/:id',
        component: expertDetail,
        // meta: { requiresAuth: true, role: ['expert'] },
    },
    {
        path: '/expert/ques/:id/answer',
        component: expertAnswer,
        meta: { requiresAuth: true, role: ['expert'] }
    },
    {
        path: "/farmer",
        redirect: '/farmer/home',
        component: () => import("../views/farmer.vue"),
        // meta: { requiresAuth: true, role: ['farmer'] },
        children: [ // 子路由
            { path: 'home', component: () => import("../views/farmer/farmerMain.vue") },  // 默认子路由
            { path: 'purchases', component: () => import("../views/farmer/farmerPurchases.vue") },
            { path: 'purchases/quote', component: () => import("../views/farmer/farmerPurchasesQuote.vue") },
            { path: 'purchases/quoteModify', component: () => import("../views/farmer/farmerPurchasesQuoteModify.vue") },
            { path: 'purchases/quoteSee', component: () => import("../views/farmer/farmerPurchasesQuoteSee.vue") },
            { path: 'orders', component: () => import("../views/farmer/farmerOrders.vue") },
            { path: 'messages', component: () => import("../views/farmer/farmerMessages.vue") },
            { path: 'planting', component: () => import("../views/farmer/farmerPlanting.vue") },
            { path: 'planting/advice', component: () => import("../views/farmer/farmerPlantingAdvice.vue") },
            { path: 'planting/ai', component: () => import("../views/farmer/farmerPlantingAi.vue") },
            { path: 'planting/add', component: () => import("../views/farmer/farmerPlantingAdd.vue") },
            { path: 'planting/new', component: () => import("../views/farmer/farmerPlantingNew.vue") },
            { path: 'share', component: () => import("../views/farmer/farmerShare.vue") },
            { path: 'sharedetails/:experience_id', name: 'ShareDetails', component: () => import("../views/farmer/shareDetails.vue") },
            { path: 'questions', component: () => import("../views/farmer/farmerQuestions.vue") },
            { path: 'ques/:id/answer', component: () => import("../views/farmer/farmerAnswer.vue") },
            { path: 'profile', component: () => import("../views/farmer/farmerProfile.vue"),meta: { requiresAuth: true, role: ['farmer'] } },
            { path: 'answer/:id', component: () => import("../views/farmer/farmerAnswerDetail.vue") },
            { path: 'post-question', component: () => import("../views/farmer/farmerPostQuestion.vue"),meta: { requiresAuth: true, role: ['farmer'] } },
            { path: 'detail/:id', component: () => import("../views/farmer/farmerExpertDetail.vue") },

        ]
},
    {
        path: "/admin",
        redirect: '/admin/home',
        component: () => import("../views/admin/admin.vue"),
        // meta: { requiresAuth: true, role: ['admin'] },
        children: [ // 子路由
            { path: 'home',  component: () => import("../views/admin/adminHome.vue") },
            { path: 'user', component: () => import("../views/admin/adminUser.vue") },
            { path: 'user/edit', component: () => import("../views/admin/adminUserEdit.vue") },
            { path: 'user/new', component: () => import("../views/admin/adminUserNew.vue") },
            { path: 'data', component: () => import("../views/admin/adminData.vue") },
            { path: 'data/sum', component: () => import("../views/admin/adminDataSum.vue") },
            { path: 'orders', component: () => import("../views/admin/adminOrders.vue") },
            { path: 'cert', component: () => import("../views/admin/adminCert.vue") },
            { path: 'ques', component: () => import("../views/admin/adminQues.vue") },
            { path: 'ques/:id', component: () => import("../views/admin/adminAnswers.vue") },
            { path: 'answer/:id', component: () => import("../views/admin/adminAnswerDetail.vue") },
            { path: 'share', component: () => import("../views/admin/adminShare.vue") },
            { path : 'shareComment', component: () =>import('../views/admin/ShareCommentCheck.vue')},
            { path: 'test', component: () => import("../views/admin/test.vue") },
        ]
    },
      {
          path: '/merchant',
          redirect: 'merchant/main',
          component: Merchant,
          // meta: { requiresAuth: true, role: ['buyer'] },
          children: [
              {path: '', name: 'Main', component: MerchantMain},
              {path: 'order', name: 'Order', component: MerchantOrder},
              {path: 'purchases', name: 'Purchases', component: MerchantPurchase},
              {path: 'purchases/:id/applications', name: 'PurchaseDetail', component: merchantPurchaseDetails},
              {path: 'purchaseDetail/record', name: 'Record', component: () => import("../views/merchant/merchantSeePlanting.vue") },
              {path: 'addPurchase', name: 'AddPurchase', component: MerchantAddPurchase},
              {path: 'home', name: 'MerchantHome', component: MerchantHome},
              {path: 'message', name: 'MerchantMessage', component: MerchantMessage},
       ]
  }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


// 添加路由守卫
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();  // 获取 Pinia store 的实例
    const token = userStore.token;      // 获取 token
    const userRole = userStore.role;    // 获取用户角色

    if (to.meta.requiresAuth) {
        if (!token) {
            // 如果没有 token，重定向到登录页面
            next('/login');
        } else if (to.meta.role && !to.meta.role.includes(userRole)) {
            next('/login');
            // 如果角色不匹配，重定向到403页面或首页
            // next('/403'); // 或者 next('/')
        } else {
            next(); // 允许访问目标页面
        }
    } else {
        next(); // 不需要验证，直接允许访问
    }
});


export default router