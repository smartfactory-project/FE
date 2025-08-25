import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/globals.css' // Next의 globals.css 대응


createApp(App).use(router).mount('#app')