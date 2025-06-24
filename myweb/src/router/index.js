//Create an instance of the router
import {createWebHistory, createRouter } from 'vue-router'

import expertHome from '@/views/expert/expertHome.vue'
import expertRank from '@/views/expert/expertRank.vue'
import expertMain from '@/views/expert/expertMain.vue'
import expertCert from "@/views/expert/expertCert.vue";
import expertQues from "@/views/expert/expertQues.vue";

const routes = [
    //main router
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
        alias:"/farmer/home",
        component: () => import("../views/farmer/farmerMain.vue"),
        children: [ // 子路由
            {
                path: '/farmer/more',
                component: () => import("../views/farmer/farmerMain.vue")
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router