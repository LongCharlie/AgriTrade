import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' //导入 node.js path

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
      alias: { //配置路径别名
        '@': path.resolve(__dirname, 'src')
      }
    }
})
