// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue' // Header 포함된 레이아웃

const routes = [
  // 로그인 / 회원가입 (레이아웃 없음)
  { path: '/login', name: 'login', component: () => import('@/pages/LoginForm.vue') },
  { path: '/register', name: 'register', component: () => import('@/pages/RegisterForm.vue') },

  // DefaultLayout 아래 children
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: () => import('@/views/HomePage.vue') },
      { path: 'production', name: 'production', component: () => import('@/views/ProductionPage.vue') },
      { path: 'charts', name: 'charts', component: () => import('@/views/Charts.vue') },
      { path: 'posts', name: 'posts', component: () => import('@/views/PostsPage.vue') },
      { path: 'productionManagement', name: 'posts', component: () => import('@/views/ProductionManagementPage.vue') },
      { path: 'posts/:id', name: 'post-detail', component: () => import('@/views/PostDetailPage.vue') },
      { path: 'posts/create', name: 'post-create', component: () => import('@/views/PostCreatePage.vue'), meta: { requiresAuth: true } },
      { path: 'schedule', name: 'schedule', component: () => import('@/views/SchedulePage.vue') },
      { path: 'announcements', name: 'announcements', component: () => import('@/views/AnnouncementsPage.vue') },
      { path: 'mypage', name: 'mypage', component: () => import('@/views/MyPage.vue'), meta: { requiresAuth: true } },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

// 전역 가드
router.beforeEach((to) => {
  if (to.matched.some(r => r.meta.requiresAuth)) {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('로그인이 필요합니다.')
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }
})

export default router
