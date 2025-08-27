import apiClient from './api.js'

export const commentAPI = {
  list: async (postId) =>
    (await apiClient.get(`/posts/${postId}/comments`)).data,

  create: async (postId, payload) =>
    (await apiClient.post(`/posts/${postId}/comments`, payload)).data,
}

export default commentAPI