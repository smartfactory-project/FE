// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomePage.vue') },
  { path: '/register', name: 'register', component: () => import('@/pages/RegisterForm.vue') }, 
  { path: '/announcements', name: 'announcements', component: () => import('@/pages/Announcements.vue') }, 
  { path: '/production', name: 'production', component: () => import('@/pages/Production.vue') }, 
  { path: '/charts', name: 'charts', component: () => import('@/pages/Charts.vue') }, 
]

export default createRouter({ history: createWebHistory(), routes })
