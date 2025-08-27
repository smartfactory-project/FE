import { defineStore } from 'pinia'

function isTokenValid(token) {
  try {
    // JWT라면 exp(초) 확인
    const { exp } = JSON.parse(atob(token.split('.')[1]))
    return exp * 1000 > Date.now()
  } catch {
    // JWT가 아니면 존재 여부만으로 판단(서버 401로 최종 보정)
    return !!token
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),
  getters: {
    isAuthenticated: (s) => !!s.token && isTokenValid(s.token),
  },
  actions: {
    login({ token, user }) {
      this.token = token
      this.user = user
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user || null))
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    rehydrate() {
      const t = localStorage.getItem('token')
      if (!t || !isTokenValid(t)) this.logout()
      else {
        this.token = t
        this.user = JSON.parse(localStorage.getItem('user') || 'null')
      }
    },
  },
})
