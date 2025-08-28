import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/globals.css' // Next의 globals.css 대응


createApp(App).use(createPinia()).use(router).mount('#app')
// useAuthStore().rehydrate()
