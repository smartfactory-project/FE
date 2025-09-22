import apiClient from './api.js'

export const postAPI = {
  create: async (payload) => (await apiClient.post('/api/posts', payload)).data,
  list: async (params) => (await apiClient.get('/api/posts', { params })).data,
  detail: async (id) => (await apiClient.get(`/api/posts/${id}`)).data,

  likeStatus: (id) => apiClient.get(`/api/posts/${id}/like`).then(r => r.data),
  like: (id) => apiClient.put(`/api/posts/${id}/like`).then(r => r.data),
  unlike: (id) => apiClient.delete(`/api/posts/${id}/like`).then(r => r.data),

  bookmarkStatus: (id) => apiClient.get(`/api/posts/${id}/bookmark`).then(r => r.data),
  bookmark: (id) => apiClient.put(`/api/posts/${id}/bookmark`).then(r => r.data),
  unbookmark: (id) => apiClient.delete(`/api/posts/${id}/bookmark`).then(r => r.data),

  view:   async (id)     => (await apiClient.post(`/api/posts/${id}/view`)).data,
  remove: async (id) => (await apiClient.delete(`/api/posts/${id}`)).data,
}

export default postAPI
