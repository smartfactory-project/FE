import apiClient from './api.js'

export const mypageAPI = {
  profile: async () => (await apiClient.get('/me/profile')).data,
  written: async (params = {}) => (await apiClient.get('/me/posts', { params })).data,
  liked:   async (params = {}) => (await apiClient.get('/me/likes', { params })).data,
  scraps:  async (params = {}) => (await apiClient.get('/me/bookmarks', { params })).data,
}

export default mypageAPI
