// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomePage.vue') },
  { path: '/register', name: 'register', component: () => import('@/pages/RegisterForm.vue') }, 
  { path: '/production', name: 'production', component: () => import('@/views/Production.vue') }, 
  { path: '/charts', name: 'charts', component: () => import('@/views/Charts.vue') }, 
  { path: '/posts', name: 'posts', component: () => import('@/views/PostsPage.vue') },
  { path: '/schedule', name: 'schedule', component: () => import('@/views/SchedulePage.vue') },
  { path: '/announcements', name: 'announcements', component: () => import('@/views/AnnouncementsPage.vue') },
  { path: '/posts/:id', name: 'post-detail', component: () => import('@/views/PostDetailPage.vue') },
  { path: '/posts/create', name: 'post-create', component: () => import('@/views/PostCreatePage.vue') },
]

export default createRouter({ history: createWebHistory(), routes,
  scrollBehavior() {
  return { left: 0, top: 0 }
  },
 })
