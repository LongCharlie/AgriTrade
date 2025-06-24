Vue 3 + Pinia + Element Plus + Vite



### 运行：

```bash
cd demo
npm run dev
```



### 基于Vite创建Vue3项目

``` bash
npm create vite@latest

Ok to proceed? (y) » y
Project name: » demo
Select a framework: » Vue
Select a variant: » JavaScript

Done. Now run:
cd demo
npm install
npm run dev
Local: http://localhost:5173
```





### 安装路由

``` bash
npm install vue-router@4
```





### 安装Pinia和Pinia 持久化存储插件

```bash
npm install pinia
npm i pinia-plugin-persistedstate
```



```javascript
//导入Pinia的createPinia方法,用于创建Pinia实例(状态管理库)
import { createPinia } from 'pinia'

//从 pinia-plugin-persistedstate 模块中导入 piniaPluginPersistedstate
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

//创建一个Pinia实例,用于在应用中集中管理状态(store)
const pinia = createPinia()

//将插件添加到 pinia 实例上
pinia.use(piniaPluginPersistedstate)
```



### 安装 Element Plus

```bash
npm install element-plus --save
```



```javascript
//整体导入 ElementPlus 组件库
	import ElementPlus from 'element-plus' //导入 ElementPlus 组件库的所有模块和功能 
	import 'element-plus/dist/index.css' //导入 ElementPlus 组件库所需的全局 CSS 样式
```
