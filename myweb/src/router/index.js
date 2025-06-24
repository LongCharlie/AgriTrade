//Create an instance of the router
import {createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Main from '../views/Main.vue'

const routes = [
    //main router
    {
        path: '/expert',
        component: Main,
        //subrouter
        children: [
            { path: '/home', component: Home },
            { path: '/user', component: User },
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