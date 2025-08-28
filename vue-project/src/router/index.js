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
  { path: '/login', name: 'login', component: () => import('@/pages/LoginForm.vue')},
  { path: '/posts/create', name: 'post-create', component: () => import('@/views/PostCreatePage.vue'), meta: { requiresAuth: true } },
  { path: '/mypage', name: 'mypage', component: () => import('@/views/MyPage.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

// 전역 가드: 인증 필요한 라우트 차단 
router.beforeEach((to) => {
  if (to.matched.some(r => r.meta.requiresAuth)) {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('로그인이 필요합니다.')
      // 로그인 후 다시 돌아올 경로를 전달
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }
})

export default router
