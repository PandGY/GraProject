import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
import router from '@/router/index'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { Buffer } from 'buffer'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 将Buffer挂载在全局对象
if (!window.Buffer) {
  window.Buffer = Buffer
}

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')

