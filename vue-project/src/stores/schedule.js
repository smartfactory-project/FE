// src/stores/schedule.js
import { defineStore } from 'pinia'
import scheduleAPI from '@/services/schedule.js'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedules: [],
    tasks: [],
    todaySchedules: [],
    upcomingSchedules: [],
    todayTasks: [],
    pendingTasks: [],
    stats: {
      todayCount: 0,
      upcomingCount: 0,
      completedCount: 0,
      totalCount: 0
    },
    loading: false,
    error: null,
    filters: {
      type: 'all',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    }
  }),

  getters: {
    // 날짜별로 일정을 그룹핑 - 시간대 문제 해결
    schedulesByDate: (state) => {
      const grouped = {}
      state.schedules.forEach(schedule => {
        // 로컬 시간대 기준으로 날짜 추출
        const date = new Date(schedule.startDateTime)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const dateStr = `${year}-${month}-${day}`
        
        if (!grouped[dateStr]) {
          grouped[dateStr] = []
        }
        grouped[dateStr].push(schedule)
      })
      return grouped
    },

    // 완료된 할일들
    completedTasks: (state) => {
      return state.tasks.filter(task => task.status === 'completed')
    },

    // 진행중인 할일들  
    activeTasks: (state) => {
      return state.tasks.filter(task => task.status !== 'completed')
    }
  },

  actions: {
    // 스케줄 관련
    async fetchSchedules(filters = {}) {
      this.loading = true
      this.error = null
      try {
        const params = { ...this.filters, ...filters }
        this.schedules = await scheduleAPI.getSchedules(params)
      } catch (error) {
        this.error = error.response?.data?.message || '일정을 불러오는데 실패했습니다.'
        console.error('Failed to fetch schedules:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchTodaySchedules() {
      try {
        this.todaySchedules = await scheduleAPI.getTodaySchedules()
      } catch (error) {
        console.error('Failed to fetch today schedules:', error)
      }
    },

    async fetchUpcomingSchedules(days = 7) {
      try {
        this.upcomingSchedules = await scheduleAPI.getUpcomingSchedules(days)
      } catch (error) {
        console.error('Failed to fetch upcoming schedules:', error)
      }
    },

    async createSchedule(scheduleData) {
      this.loading = true
      this.error = null
      try {
        const { data } = await scheduleAPI.createSchedule(scheduleData)
        
        // 현재 필터에 해당하는 일정이면 목록에 추가
        const scheduleDate = new Date(data.startDateTime)
        if (scheduleDate.getFullYear() === this.filters.year && 
            scheduleDate.getMonth() + 1 === this.filters.month) {
          this.schedules.push(data)
        }
        
        return data
      } catch (error) {
        this.error = error.response?.data?.message || '일정 생성에 실패했습니다.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSchedule(scheduleId, scheduleData) {
      this.loading = true
      this.error = null
      try {
        const { data } = await scheduleAPI.updateSchedule(scheduleId, scheduleData)
        
        // 목록에서 해당 일정 업데이트 (다양한 ID 필드 고려)
        const updateScheduleInList = (list) => {
          const index = list.findIndex(s => s.scheduleId === scheduleId || s.id === scheduleId)
          if (index !== -1) {
            list[index] = data
          }
        }
        
        updateScheduleInList(this.schedules)
        updateScheduleInList(this.todaySchedules)
        updateScheduleInList(this.upcomingSchedules)
        
        return data
      } catch (error) {
        this.error = error.response?.data?.message || '일정 수정에 실패했습니다.'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ✅ 새로 추가: 일정 상태 변경 (완료/취소 등)
    async updateScheduleStatus(scheduleId, status) {
      try {
        console.log('Updating schedule status:', scheduleId, status)
        const { data } = await scheduleAPI.updateScheduleStatus(scheduleId, status)
        
        // 모든 일정 목록에서 업데이트
        const updateSchedule = (schedules) => {
          const index = schedules.findIndex(s => s.scheduleId === scheduleId || s.id === scheduleId)
          if (index !== -1) {
            schedules[index] = data
            console.log('Updated schedule:', schedules[index])
          }
        }
        
        updateSchedule(this.schedules)
        updateSchedule(this.todaySchedules)
        updateSchedule(this.upcomingSchedules)
        
        // 통계 새로 가져오기
        await this.fetchStats()
        
        return data
      } catch (error) {
        console.error('Schedule status update error:', error.response?.data || error.message)
        this.error = error.response?.data?.message || '일정 상태 변경에 실패했습니다.'
        throw error
      }
    },

    // 수정된 deleteSchedule 액션
    async deleteSchedule(scheduleId) {
      this.loading = true
      this.error = null
      try {
        await scheduleAPI.deleteSchedule(scheduleId)
        
        // 모든 목록에서 해당 일정 제거 (다양한 ID 필드 고려)
        const removeFromList = (list) => {
          return list.filter(s => s.scheduleId !== scheduleId && s.id !== scheduleId)
        }
        
        this.schedules = removeFromList(this.schedules)
        this.todaySchedules = removeFromList(this.todaySchedules)
        this.upcomingSchedules = removeFromList(this.upcomingSchedules)
        
        console.log('일정이 성공적으로 삭제되었습니다.')
      } catch (error) {
        this.error = error.response?.data?.message || '일정 삭제에 실패했습니다.'
        console.error('Delete schedule error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 할일 관련
    async fetchTasks() {
      try {
        this.tasks = await scheduleAPI.getTasks()
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      }
    },

    async fetchTodayTasks() {
      try {
        this.todayTasks = await scheduleAPI.getTodayTasks()
      } catch (error) {
        console.error('Failed to fetch today tasks:', error)
      }
    },

    async fetchPendingTasks() {
      try {
        this.pendingTasks = await scheduleAPI.getPendingTasks()
      } catch (error) {
        console.error('Failed to fetch pending tasks:', error)
      }
    },

    async createTask(taskData) {
      try {
        const { data } = await scheduleAPI.createTask(taskData)
        this.tasks.push(data)
        
        // 오늘 할일이면 todayTasks에도 추가
        if (!taskData.dueDate || new Date(taskData.dueDate).toDateString() === new Date().toDateString()) {
          this.todayTasks.push(data)
        }
        
        return data
      } catch (error) {
        this.error = error.response?.data?.message || '할일 생성에 실패했습니다.'
        throw error
      }
    },

    async updateTask(taskId, taskData) {
      try {
        console.log('Updating task:', taskId, taskData) // 디버깅용
        const { data } = await scheduleAPI.updateTask(taskId, taskData)
        
        // 모든 할일 목록에서 업데이트
        const updateTask = (tasks) => {
          const index = tasks.findIndex(t => t.taskId === taskId || t.id === taskId)
          if (index !== -1) {
            tasks[index] = data
          }
        }
        
        updateTask(this.tasks)
        updateTask(this.todayTasks)
        updateTask(this.pendingTasks)
        
        return data
      } catch (error) {
        console.error('Task update error:', error.response?.data || error.message)
        this.error = error.response?.data?.message || '할일 수정에 실패했습니다.'
        throw error
      }
    },

    async updateTaskStatus(taskId, status) {
      try {
        console.log('Updating task status:', taskId, status) // 디버깅용
        const { data } = await scheduleAPI.updateTaskStatus(taskId, status)
        
        // 모든 할일 목록에서 업데이트
        const updateTask = (tasks) => {
          const index = tasks.findIndex(t => t.taskId === taskId || t.id === taskId)
          if (index !== -1) {
            tasks[index] = data
            console.log('Updated task:', tasks[index]) // 디버깅용
          }
        }
        
        updateTask(this.tasks)
        updateTask(this.todayTasks)
        updateTask(this.pendingTasks)
        
        // 통계 새로 가져오기
        await this.fetchStats()
        
        return data
      } catch (error) {
        console.error('Task status update error:', error.response?.data || error.message)
        this.error = error.response?.data?.message || '할일 상태 변경에 실패했습니다.'
        throw error
      }
    },

    async deleteTask(taskId) {
      try {
        await scheduleAPI.deleteTask(taskId)
        
        // 모든 할일 목록에서 제거
        const removeFromList = (list) => {
          return list.filter(t => t.taskId !== taskId && t.id !== taskId)
        }
        
        this.tasks = removeFromList(this.tasks)
        this.todayTasks = removeFromList(this.todayTasks)
        this.pendingTasks = removeFromList(this.pendingTasks)
      } catch (error) {
        this.error = error.response?.data?.message || '할일 삭제에 실패했습니다.'
        throw error
      }
    },

    // 통계
    async fetchStats() {
      try {
        this.stats = await scheduleAPI.getScheduleStats()
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    },

    // 필터 변경
    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },

    // 월 변경
    changeMonth(year, month) {
      this.updateFilters({ year, month })
      this.fetchSchedules()
    },

    // 초기 데이터 로드
    async loadInitialData() {
      await Promise.all([
        this.fetchSchedules(),
        this.fetchTodaySchedules(),
        this.fetchUpcomingSchedules(),
        this.fetchTodayTasks(),
        this.fetchPendingTasks(),
        this.fetchStats()
      ])
    },

    // 에러 클리어
    clearError() {
      this.error = null
    }
  }
})