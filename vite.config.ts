import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
// 引入 AutoImport
import AutoImport from 'unplugin-auto-import/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  // 配置AutoImport
  AutoImport({
    imports:["vue","vue-router"],
    dts:'src/auto-import.d.ts'    // 路径下自动生成文件夹存放全局指令
  }),
  ],
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
