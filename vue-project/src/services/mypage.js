import apiClient from './api.js'

export const mypageAPI = {
  profile: async () => (await apiClient.get('/api/me/profile')).data,
  written: async (params = {}) => (await apiClient.get('/api/me/posts', { params })).data,
  liked:   async (params = {}) => (await apiClient.get('/api/me/likes', { params })).data,
  scraps:  async (params = {}) => (await apiClient.get('/api/me/bookmarks', { params })).data,
}

export default mypageAPI
