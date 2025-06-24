//Create an instance of the router
import { createMemoryHistory, createRouter } from 'vue-router'

import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Main from '../views/Main.vue'

const routes = [
    //main router
    {
        path: '/',
        component: Main,
        //subrouter
        children: [
            { path: '/home', component: Home },
            { path: '/user', component: User },
        ]
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router