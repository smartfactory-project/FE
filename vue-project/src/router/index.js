// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomePage.vue') },
  { path: '/register', name: 'register', component: () => import('@/pages/RegisterForm.vue') }, 
  { path: '/posts', name: 'posts', component: () => import('@/views/PostsPage.vue') },
  { path: '/schedule', name: 'schedule', component: () => import('@/views/SchedulePage.vue') },
]

export default createRouter({ history: createWebHistory(), routes,
  scrollBehavior() {
  return { left: 0, top: 0 }
  },
 })
