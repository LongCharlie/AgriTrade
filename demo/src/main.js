import { createApp } from 'vue'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.use(router)

//全局前置守卫
	router.beforeEach((to, from, next) => {
	    console.log("to:",to) //即将进入的路由的信息
	    console.log("from:",from) //当前即将离开的路由信息

	    next()

	    /*
	        if(to.name == "history"){
	            next(false) //拦截
	        }else{
	            next() //继续
	        }
	    */
	})
app.mount('#app')