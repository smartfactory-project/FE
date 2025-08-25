// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomePage.vue') },
  { path: '/register', name: 'register', component: () => import('@/pages/RegisterForm.vue') }, 
]

export default createRouter({ history: createWebHistory(), routes })
