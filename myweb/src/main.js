import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //induct icon
import App from './App.vue'
import router from './router'
import store from './stores'

// 引入全局覆盖样式
import '@/assets/element-overrides.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.use(store)
//register icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')


// 防抖函数
function debounce(fn, delay) {
    let timer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
}

// 重写 ResizeObserver
const OriginalResizeObserver = window.ResizeObserver;
window.ResizeObserver = class DebouncedResizeObserver extends OriginalResizeObserver {
    constructor(callback) {
        super(debounce(callback, 100));
    }
};

