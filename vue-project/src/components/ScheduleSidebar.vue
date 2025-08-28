<template>
  <div class="space-y-6">
    <!-- 다가오는 일정 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="flex items-center text-lg text-foreground">
          <Clock class="w-5 h-5 mr-2 text-primary" /> 다가오는 일정
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <div v-if="scheduleStore.loading" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
        <div v-else-if="scheduleStore.upcomingSchedules.length === 0" class="text-center py-4">
          <p class="text-sm text-muted-foreground">다가오는 일정이 없습니다.</p>
        </div>
        <div v-else>
          <div
            v-for="(event, index) in scheduleStore.upcomingSchedules.slice(0, 4)"
            :key="event.id"
            class="p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors cursor-pointer"
            :class="{ 'opacity-60': event.status === 'completed' }"
            @click="selectSchedule(event)"
          >
            <div class="flex items-start justify-between mb-2">
              <h4 :class="[
                'font-medium text-foreground text-sm',
                event.status === 'completed' ? 'line-through text-muted-foreground' : ''
              ]">
                {{ event.title }}
              </h4>
              <div class="flex items-center gap-1">
                <CheckCircle v-if="event.status === 'completed'" 
                            class="w-4 h-4 text-green-500 flex-shrink-0" />
                <AlertCircle v-else-if="event.isUrgent" 
                            class="w-4 h-4 text-red-500 flex-shrink-0" />
              </div>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">
                {{ formatRelativeDate(event.startDateTime) }} {{ formatTime(event.startDateTime) }}
              </span>
              <Badge variant="secondary" 
                     class="text-xs" 
                     :class="[
                       getBadgeClass(event.type),
                       event.status === 'completed' ? 'opacity-60' : ''
                     ]">
                {{ getTypeLabel(event.type) }}
              </Badge>
            </div>
            <div v-if="event.location" class="text-xs text-muted-foreground mt-1">
              📍 {{ event.location }}
            </div>
          </div>
        </div>
        <Button variant="outline" class="w-full bg-transparent text-sm">
          전체 일정 보기
        </Button>
      </CardContent>
    </Card>

    <!-- 오늘의 할 일 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="flex items-center text-lg text-foreground">
          <CheckCircle class="w-5 h-5 mr-2 text-primary" /> 오늘의 할 일
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="scheduleStore.todayTasks.length === 0" class="text-center py-4">
          <p class="text-sm text-muted-foreground">오늘 할 일이 없습니다.</p>
        </div>
        <div v-else class="space-y-2">
          <div 
            v-for="(task, index) in scheduleStore.todayTasks.slice(0, 5)" 
            :key="task.id" 
            class="flex items-center space-x-2 group hover:bg-background/30 p-2 rounded transition-colors"
            :class="{ 'opacity-60': task.status === 'completed' }"
          >
            <button
              @click="toggleTaskStatus(task)"
              :class="[
                'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                task.status === 'completed' 
                  ? 'bg-primary border-primary' 
                  : 'border-muted-foreground hover:border-primary'
              ]"
            >
              <CheckCircle2 v-if="task.status === 'completed'" class="w-3 h-3 text-primary-foreground" />
            </button>
            <div class="flex-1 min-w-0">
              <span 
                :class="[
                  'text-sm block',
                  task.status === 'completed' 
                    ? 'text-muted-foreground line-through' 
                    : 'text-foreground'
                ]"
              >
                {{ task.title }}
              </span>
              <div class="flex items-center gap-2 mt-1">
                <button
                  @click="cyclePriority(task)"
                  :class="[
                    'text-xs px-2 py-1 rounded border transition-colors cursor-pointer hover:opacity-80',
                    task.status === 'completed' 
                      ? 'border-green-300 text-green-700 bg-green-50' 
                      : getPriorityClass(task.priority)
                  ]"
                  :disabled="task.status === 'completed'"
                  :title="task.status === 'completed' ? '완료된 할일은 중요도를 변경할 수 없습니다' : '클릭하여 중요도 변경'"
                >
                  {{ task.status === 'completed' ? '완료' : getPriorityLabel(task.priority) }}
                </button>
                <span v-if="task.dueDate" class="text-xs text-muted-foreground">
                  마감: {{ formatTime(task.dueDate) }}
                </span>
                <span v-else class="text-xs text-muted-foreground">
                  생성: {{ formatTime(task.createdAt) }}
                </span>
              </div>
            </div>
            <button 
              @click="deleteTask(task.id)"
              class="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-opacity"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <!-- 할일 추가 -->
        <div class="mt-4 pt-4 border-t border-border">
          <div class="space-y-3">
            <div class="flex gap-2">
              <Input 
                v-model="newTaskTitle"
                placeholder="새 할일 추가..."
                class="flex-1 text-sm"
                @keyup.enter="addTask"
              />
              <Button class="text-sm px-3" @click="addTask" :disabled="!newTaskTitle.trim()">
                <Plus class="w-4 h-4" />
              </Button>
            </div>
            <!-- 중요도 선택 -->
            <div class="flex items-center gap-2">
              <Label class="text-sm text-muted-foreground">중요도:</Label>
              <div class="flex gap-1">
                <button 
                  v-for="priority in priorities" 
                  :key="priority.value"
                  @click="selectedPriority = priority.value"
                  :class="[
                    'px-2 py-1 text-xs rounded border transition-colors',
                    selectedPriority === priority.value 
                      ? priority.activeClass 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  {{ priority.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 일정 통계 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="flex items-center text-lg text-foreground">
          <TrendingUp class="w-5 h-5 mr-2 text-primary" /> 일정 통계
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 gap-3">
          <div class="text-center p-3 rounded-lg bg-background/50">
            <Clock class="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p class="text-lg font-bold text-foreground">{{ scheduleStore.stats.todayCount }}</p>
            <p class="text-xs text-muted-foreground">오늘 일정</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-background/50">
            <Calendar class="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p class="text-lg font-bold text-foreground">{{ scheduleStore.stats.upcomingCount }}</p>
            <p class="text-xs text-muted-foreground">이번 주</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-background/50">
            <CheckCircle class="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <p class="text-lg font-bold text-foreground">{{ completedPercentage }}%</p>
            <p class="text-xs text-muted-foreground">완료율</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-background/50">
            <Users class="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <p class="text-lg font-bold text-foreground">{{ scheduleStore.stats.totalCount }}</p>
            <p class="text-xs text-muted-foreground">총 일정</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  Clock, Users, TrendingUp, AlertCircle, CheckCircle, CheckCircle2, 
  Plus, X, Calendar
} from 'lucide-vue-next'

import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'

import { useScheduleStore } from '@/stores/schedule.js'

const scheduleStore = useScheduleStore()
const newTaskTitle = ref('')
const selectedPriority = ref('medium')

// 중요도 옵션들
const priorities = [
  { value: 'low', label: '낮음', activeClass: 'bg-green-100 border-green-300 text-green-700' },
  { value: 'medium', label: '보통', activeClass: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { value: 'high', label: '높음', activeClass: 'bg-red-100 border-red-300 text-red-700' }
]

// ✅ 수정된 완료율 계산 (백엔드에서 제공하는 데이터 활용)
const completedPercentage = computed(() => {
  // 백엔드에서 이미 계산해서 제공하는 완료율 사용
  return scheduleStore.stats.completionRate || 0
})

// 시간 포맷
const formatTime = (dateTimeString) => {
  const date = new Date(dateTimeString)
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

// 시간대 문제 해결을 위한 formatRelativeDate 함수 수정
const formatRelativeDate = (dateTimeString) => {
  const eventDate = new Date(dateTimeString)
  const today = new Date()

  // 로컬 시간대 기준으로 날짜만 비교
  const eventDateOnly = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate()
  )
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  // 차이 계산 (밀리초 -> 일)
  const diffDays = Math.round((eventDateOnly - todayOnly) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '내일'
  if (diffDays === -1) return '어제'
  if (diffDays > 1) return `${diffDays}일 뒤`
  if (diffDays < -1) return `${Math.abs(diffDays)}일 전`

  return eventDate.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

const getBadgeClass = (type) => {
  switch (type) {
    case 'meeting': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'task': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'review': return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'training': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'milestone': return 'bg-red-100 text-red-700 border-red-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const getTypeLabel = (type) => {
  const labels = { meeting: '회의', task: '업무', review: '검토', training: '교육', milestone: '마일스톤' }
  return labels[type] || type
}

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'urgent': return 'border-red-300 text-red-700'
    case 'high': return 'border-orange-300 text-orange-700'
    case 'medium': return 'border-yellow-300 text-yellow-700'
    case 'low': return 'border-green-300 text-green-700'
    default: return 'border-gray-300 text-gray-700'
  }
}

const getPriorityLabel = (priority) => {
  const labels = { urgent: '긴급', high: '높음', medium: '보통', low: '낮음' }
  return labels[priority] || priority
}

// 액션 함수들
const selectSchedule = (schedule) => {
  console.log('Selected schedule:', schedule)
}

const showAllSchedules = () => {
  console.log('Show all schedules')
}

const toggleTaskStatus = async (task) => {
  try {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    await scheduleStore.updateTaskStatus(task.id, newStatus)
  } catch (error) {
    console.error('할일 상태 변경 실패:', error)
  }
}

const deleteTask = async (taskId) => {
  if (!confirm('정말로 이 할일을 삭제하시겠습니까?')) return
  try {
    await scheduleStore.deleteTask(taskId)
  } catch (error) {
    console.error('할일 삭제 실패:', error)
  }
}

const addTask = async () => {
  if (!newTaskTitle.value.trim()) return
  try {
    await scheduleStore.createTask({ title: newTaskTitle.value.trim(), priority: selectedPriority.value })
    newTaskTitle.value = ''
    selectedPriority.value = 'medium'
  } catch (error) {
    console.error('할일 추가 실패:', error)
  }
}

const cyclePriority = async (task) => {
  if (task.status === 'completed') return
  const priorityOrder = ['low', 'medium', 'high']
  const currentIndex = priorityOrder.indexOf(task.priority)
  const nextIndex = (currentIndex + 1) % priorityOrder.length
  const newPriority = priorityOrder[nextIndex]

  try {
    await scheduleStore.updateTask(task.id, {
      title: task.title, description: task.description, priority: newPriority, dueDate: task.dueDate
    })
  } catch (error) {
    console.error('중요도 변경 실패:', error)
  }
}

// 데이터 로드
onMounted(() => {
  if (scheduleStore.todayTasks.length === 0) scheduleStore.fetchTodayTasks()
  if (scheduleStore.upcomingSchedules.length === 0) scheduleStore.fetchUpcomingSchedules()
  if (scheduleStore.stats.totalCount === 0) scheduleStore.fetchStats()
})
</script>