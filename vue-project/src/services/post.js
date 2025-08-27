import apiClient from './api.js'

export const postAPI = {
  create: async (payload) => (await apiClient.post('/posts', payload)).data,
  list: async (params) => (await apiClient.get('/posts', { params })).data,
  detail: async (id) => (await apiClient.get(`/posts/${id}`)).data,

  likeStatus: (id) => apiClient.get(`/posts/${id}/like`).then(r => r.data),
  like: (id) => apiClient.put(`/posts/${id}/like`).then(r => r.data),
  unlike: (id) => apiClient.delete(`/posts/${id}/like`).then(r => r.data),

  bookmarkStatus: (id) => apiClient.get(`/posts/${id}/bookmark`).then(r => r.data),
  bookmark: (id) => apiClient.put(`/posts/${id}/bookmark`).then(r => r.data),
  unbookmark: (id) => apiClient.delete(`/posts/${id}/bookmark`).then(r => r.data),

  view:   async (id)     => (await apiClient.post(`/posts/${id}/view`)).data,
}

export default postAPI
