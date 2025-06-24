// import { createApp } from 'vue'
// import App from './App.vue'
//
// createApp(App).mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router' //induct router
<<<<<<< HEAD
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //induct icon
=======
import { createPinia  } from "pinia";
>>>>>>> ba10ed2876cd1d5004d11a7637be55e25387fc6b

const app = createApp(App)
const pinia = createPinia()
app.use(ElementPlus)
app.use(router) //register as a plugin
<<<<<<< HEAD
app.mount('#app')

//register icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
=======
app.use(pinia)
app.mount('#app')
>>>>>>> ba10ed2876cd1d5004d11a7637be55e25387fc6b
