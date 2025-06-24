// import { createApp } from 'vue'
// import App from './App.vue'
//
// createApp(App).mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router' //induct router
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //induct icon

const app = createApp(App)
app.use(ElementPlus)
app.use(router) //register as a plugin
app.mount('#app')

//register icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}