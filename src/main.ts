import { createApp } from 'vue'
import {createPinia} from 'pinia'
import router from "./router";
// import axios from '@/network/index';
const store = createPinia();
import VueWechatTitle from 'vue-wechat-title';


// 引入ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入ElementPlus icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
let app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


app.use(store)
app.use(ElementPlus)
app.use(router)
app.use(VueWechatTitle)
// app.config.globalProperties.axios = axios
app.mount('#app')

