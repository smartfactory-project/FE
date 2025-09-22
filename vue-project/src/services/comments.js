import apiClient from './api.js'

export const commentAPI = {
  list: async (postId) =>
    (await apiClient.get(`/api/posts/${postId}/comments`)).data,

  create: async (postId, payload) =>
    (await apiClient.post(`/api/posts/${postId}/comments`, payload)).data,
}

export default commentAPI