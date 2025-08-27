import apiClient from './api.js'

export const postAPI = {
  create: (payload) => apiClient.post('/posts', payload),
  list: async (params) => (await apiClient.get('/posts', { params })).data,
  detail: async (id) => (await apiClient.get(`/posts/${id}`)).data,
}

export default postAPI
