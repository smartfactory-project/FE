// src/services/schedule.js
import apiClient from './api.js'

export const scheduleAPI = {
  // 스케줄 관련
  createSchedule: (payload) => apiClient.post('/schedules', payload),
  
  getSchedules: async (params = {}) => {
    const { data } = await apiClient.get('/schedules', { params })
    return data
  },
  
  getTodaySchedules: async () => {
    const { data } = await apiClient.get('/schedules/today')
    return data
  },
  
  getUpcomingSchedules: async (days = 7) => {
    const { data } = await apiClient.get('/schedules/upcoming', { params: { days } })
    return data
  },
  
  updateSchedule: (scheduleId, payload) => 
    apiClient.put(`/schedules/${scheduleId}`, payload),
  
  // ✅ 새로 추가: 일정 상태 변경 (완료/취소 등)
  updateScheduleStatus: (scheduleId, status) => {
    console.log('API call - updateScheduleStatus:', scheduleId, status)
    return apiClient.put(`/schedules/${scheduleId}/status`, { status })
  },
  
  deleteSchedule: (scheduleId) => 
    apiClient.delete(`/schedules/${scheduleId}`),

  // 할일 관련
  createTask: (payload) => apiClient.post('/schedules/tasks', payload),
  
  getTasks: async () => {
    const { data } = await apiClient.get('/schedules/tasks')
    return data
  },
  
  getTodayTasks: async () => {
    const { data } = await apiClient.get('/schedules/tasks/today')
    return data
  },
  
  getPendingTasks: async () => {
    const { data } = await apiClient.get('/schedules/tasks/pending')
    return data
  },
  
  updateTask: (taskId, payload) => 
    apiClient.put(`/schedules/tasks/${taskId}`, payload),
  
  updateTaskStatus: (taskId, status) => {
    console.log('API call - updateTaskStatus:', taskId, status) // 디버깅용
    // PATCH 대신 PUT 사용 (CORS 문제 임시 해결)
    return apiClient.put(`/schedules/tasks/${taskId}/status`, { status })
  },
  
  deleteTask: (taskId) => 
    apiClient.delete(`/schedules/tasks/${taskId}`),

  // 통계
  getScheduleStats: async () => {
    const { data } = await apiClient.get('/schedules/stats')
    return data
  }
}

export default scheduleAPI