<template>
  <Card class="bg-card/50 backdrop-blur-sm border-border">
    <!-- 헤더: 월 이동 -->
    <div class="flex items-center justify-between px-6 pt-4">
      <h3 class="text-xl font-bold text-foreground">
        {{ year }}년 {{ month + 1 }}월
      </h3>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="icon" class="h-8 w-8" @click="prevMonth">
          <ChevronLeft class="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" class="h-8 w-8" @click="nextMonth">
          <ChevronRight class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <CardContent class="px-6 pb-6">
      <!-- 요일 -->
      <div class="grid grid-cols-7 text-center text-xs text-muted-foreground mb-2">
        <div v-for="w in weekdays" :key="w" class="py-2 font-medium">{{ w }}</div>
      </div>

      <!-- 달력 -->
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(cell, i) in cells"
          :key="i"
          class="aspect-square rounded-lg p-2 text-sm relative cursor-pointer"
          :class="[ 
            cell.isCurrentMonth ? 'bg-background hover:bg-muted/50' : 'bg-muted/30 text-muted-foreground',
            isToday(cell.date) ? 'ring-2 ring-offset-2 ring-[var(--ring)] ring-opacity-50' : '',
            'transition-colors'
          ]"
          @click="selectDate(cell.date)"
        >
          <div class="flex items-start justify-between">
            <span class="font-medium">{{ cell.date.getDate() }}</span>
            <span
              v-if="getEventsForDate(cell.date).length > 0"
              class="inline-block w-2 h-2 rounded-full bg-primary mt-1"
              :title="`이 날에 ${getEventsForDate(cell.date).length}개의 일정이 있습니다`"
            />
          </div>

          <!-- 일정 미리보기 (최대 2개) -->
          <div class="mt-2 space-y-1">
            <div
              v-for="(ev, idx) in getEventsForDate(cell.date).slice(0, 2)"
              :key="idx"
              class="px-2 py-1 rounded text-xs truncate"
              :class="[
                getBadgeClass(ev.type),
                ev.status === 'completed' ? 'opacity-60 line-through' : ''
              ]"
              :title="`${ev.title} (${formatTime(ev.startDateTime)})`"
            >
              {{ ev.title }}
            </div>
            <div v-if="getEventsForDate(cell.date).length > 2" class="text-[11px] text-muted-foreground">
              +{{ getEventsForDate(cell.date).length - 2 }} 더보기
            </div>
          </div>
        </div>
      </div>

      <!-- 로딩 표시 -->
      <div v-if="scheduleStore.loading" class="text-center py-4">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <p class="text-sm text-muted-foreground mt-2">일정을 불러오는 중...</p>
      </div>

      <!-- 에러 표시 -->
      <div v-if="scheduleStore.error" class="text-center py-4">
        <p class="text-sm text-red-500">{{ scheduleStore.error }}</p>
        <Button size="sm" variant="outline" @click="scheduleStore.fetchSchedules()" class="mt-2">
          다시 시도
        </Button>
      </div>
    </CardContent>

    <!-- 날짜별 일정 상세 모달 -->
    <div v-if="showDateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card class="w-[800px] max-w-[90vw] max-h-[80vh] overflow-hidden">
        <CardHeader class="flex flex-row items-center justify-between">
          <CardTitle>{{ formatSelectedDate(selectedDate) }} 일정</CardTitle>
          <Button variant="ghost" size="sm" @click="closeDateModal">
            <X class="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent class="p-0">
          <div class="flex h-[500px]">
            <!-- 왼쪽: 새 일정 추가 폼 -->
            <div class="flex-1 p-6 border-r border-border overflow-y-auto">
              <h4 class="font-medium text-lg mb-4">새 일정 추가</h4>
              <div class="space-y-4">
                <div>
                  <Label>제목</Label>
                  <Input v-model="newSchedule.title" placeholder="일정 제목을 입력하세요" />
                </div>
                <div>
                  <Label>설명</Label>
                  <Textarea v-model="newSchedule.description" placeholder="일정 설명 (선택사항)" rows="3" />
                </div>
                <div>
                  <Label>타입</Label>
                  <Select v-model="newSchedule.type">
                    <option value="meeting">회의</option>
                    <option value="task">업무</option>
                    <option value="review">검토</option>
                    <option value="training">교육</option>
                    <option value="milestone">마일스톤</option>
                  </Select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <Label>시작 시간</Label>
                    <Input v-model="newSchedule.startTime" type="time" />
                  </div>
                  <div>
                    <Label>종료 시간</Label>
                    <Input v-model="newSchedule.endTime" type="time" />
                  </div>
                </div>
                <div>
                  <Label>장소 (선택사항)</Label>
                  <Input v-model="newSchedule.location" placeholder="장소" />
                </div>
                <div class="flex items-center space-x-2">
                  <input type="checkbox" id="urgent-modal" v-model="newSchedule.isUrgent" class="rounded" />
                  <Label for="urgent-modal">긴급</Label>
                </div>
                <div class="flex gap-2 pt-4">
                  <Button @click="createScheduleFromModal" :disabled="!newSchedule.title" class="flex-1">
                    일정 추가
                  </Button>
                </div>
              </div>
            </div>

            <!-- 오른쪽: 기존 일정들 -->
            <div class="w-80 p-6 bg-muted/20">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-medium text-lg">현재 일정 ({{ getEventsForDate(selectedDate).length }}개)</h4>
              </div>
              <div class="space-y-3 overflow-y-auto max-h-[400px]">
                <div v-if="getEventsForDate(selectedDate).length === 0" class="text-center py-8">
                  <p class="text-sm text-muted-foreground">이 날에는 일정이 없습니다.</p>
                </div>
                <div
                  v-for="event in getEventsForDate(selectedDate)"
                  :key="event.scheduleId || event.id"
                  class="relative p-3 rounded-lg bg-background hover:bg-background/80 transition-colors border group"
                >
                  <!-- 삭제 버튼 -->
                  <button 
                    @click="deleteScheduleFromModal(event.scheduleId || event.id)"
                    class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all duration-200 z-10"
                    title="일정 삭제"
                  >
                    <X class="w-4 h-4" />
                  </button>

                  <!-- ✅ 완료 버튼 (완료되지 않은 일정에만 표시) -->
                  <button 
                    v-if="event.status !== 'completed'"
                    @click="completeScheduleFromModal(event.scheduleId || event.id)"
                    class="absolute top-2 right-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-green-500 transition-all duration-200 z-10"
                    title="일정 완료"
                  >
                    <CheckCircle class="w-4 h-4" />
                  </button>

                  <!-- 완료된 일정 표시 -->
                  <div v-if="event.status === 'completed'" 
                       class="absolute top-2 right-2 text-green-500"
                       title="완료된 일정">
                    <CheckCircle class="w-4 h-4" />
                  </div>

                  <div class="pr-6">
                    <div class="flex items-start gap-2 mb-2">
                      <h5 :class="[
                        'font-medium text-sm leading-tight flex-1',
                        event.status === 'completed' ? 'text-muted-foreground line-through' : ''
                      ]">
                        {{ event.title }}
                      </h5>
                      <AlertCircle v-if="event.isUrgent && event.status !== 'completed'" 
                                   class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    </div>
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-xs text-muted-foreground font-mono">
                        {{ formatTime(event.startDateTime) }} - {{ formatTime(event.endDateTime) }}
                      </span>
                      <Badge variant="secondary" 
                             :class="[
                               getBadgeClass(event.type),
                               event.status === 'completed' ? 'opacity-60' : ''
                             ]" 
                             class="text-xs">
                        {{ getTypeLabel(event.type) }}
                      </Badge>
                      <!-- 완료 상태 배지 -->
                      <Badge v-if="event.status === 'completed'" 
                             variant="secondary"
                             class="text-xs bg-green-100 text-green-700">
                        완료
                      </Badge>
                    </div>
                    <div v-if="event.location" class="text-xs text-muted-foreground mb-1">
                      📍 {{ event.location }}
                    </div>
                    <div v-if="event.description" class="text-xs text-muted-foreground leading-relaxed">
                      {{ event.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </Card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronLeft, ChevronRight, X, AlertCircle, CheckCircle } from 'lucide-vue-next'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Select from '@/components/ui/Select.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Badge from '@/components/ui/Badge.vue'
import { useScheduleStore } from '@/stores/schedule.js'

const scheduleStore = useScheduleStore()

/** 상태 */
const today = new Date()
const viewDate = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const showDateModal = ref(false)
const selectedDate = ref(null)

// 새 일정 생성 폼 데이터
const newSchedule = ref({
  title: '',
  description: '',
  type: 'meeting',
  startTime: '09:00',
  endTime: '10:00',
  location: '',
  isUrgent: false
})

/** 한국시간 문자열로 변환 */
const formatDateTimeForDB = (date, time) => {
  const [hours, minutes] = time.split(':')
  const localDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes)
  const pad = (n) => String(n).padStart(2, '0')
  return `${localDateTime.getFullYear()}-${pad(localDateTime.getMonth() + 1)}-${pad(localDateTime.getDate())} ${pad(localDateTime.getHours())}:${pad(localDateTime.getMinutes())}:00`
}

/** 유틸 */
const isToday = (d) =>
  d.getFullYear() === today.getFullYear() &&
  d.getMonth() === today.getMonth() &&
  d.getDate() === today.getDate()

const formatTime = (dateTimeString) => {
  const date = new Date(dateTimeString)
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

// 시간대 문제 해결을 위한 formatDate 함수 수정
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** 요일 */
const weekdays = ['일', '월', '화', '수', '목', '금', '토']

/** 뷰의 연/월 */
const year = computed(() => viewDate.value.getFullYear())
const month = computed(() => viewDate.value.getMonth())

/** 현재 뷰의 셀 */
const cells = computed(() => {
  const first = new Date(year.value, month.value, 1)
  const firstDay = first.getDay()
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()

  const prevDays = firstDay
  const prevMonthDays = new Date(year.value, month.value, 0).getDate()
  const arr = []

  for (let i = prevDays - 1; i >= 0; i--) {
    arr.push({ date: new Date(year.value, month.value - 1, prevMonthDays - i), isCurrentMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    arr.push({ date: new Date(year.value, month.value, d), isCurrentMonth: true })
  }
  while (arr.length % 7 !== 0) {
    const last = arr[arr.length - 1].date
    const next = new Date(last)
    next.setDate(last.getDate() + 1)
    arr.push({ date: next, isCurrentMonth: false })
  }
  while (arr.length < 42) {
    const last = arr[arr.length - 1].date
    const next = new Date(last)
    next.setDate(last.getDate() + 1)
    arr.push({ date: next, isCurrentMonth: false })
  }
  return arr
})

/** 일정 가져오기 */
const getEventsForDate = (date) => {
  const dateStr = formatDate(date)
  return scheduleStore.schedulesByDate[dateStr] || []
}

/** 타입 배지 */
const getBadgeClass = (type) => {
  switch (type) {
    case 'meeting': return 'bg-blue-100 text-blue-700'
    case 'task': return 'bg-emerald-100 text-emerald-700'
    case 'review': return 'bg-amber-100 text-amber-700'
    case 'training': return 'bg-purple-100 text-purple-700'
    case 'milestone': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

/** 월 이동 */
const prevMonth = () => {
  const d = new Date(viewDate.value)
  d.setMonth(d.getMonth() - 1)
  viewDate.value = d
  scheduleStore.changeMonth(d.getFullYear(), d.getMonth() + 1)
}

const nextMonth = () => {
  const d = new Date(viewDate.value)
  d.setMonth(d.getMonth() + 1)
  viewDate.value = d
  scheduleStore.changeMonth(d.getFullYear(), d.getMonth() + 1)
}

const goToday = () => {
  viewDate.value = new Date(today.getFullYear(), today.getMonth(), 1)
  scheduleStore.changeMonth(today.getFullYear(), today.getMonth() + 1)
}

/** 날짜 선택 */
const selectDate = (date) => {
  selectedDate.value = date
  showDateModal.value = true
}

/** 날짜 포맷 */
const formatSelectedDate = (date) => {
  if (!date) return ''
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
}

/** 타입 라벨 */
const getTypeLabel = (type) => {
  const labels = { meeting: '회의', task: '업무', review: '검토', training: '교육', milestone: '마일스톤' }
  return labels[type] || type
}

/** 모달 제어 */
const closeDateModal = () => {
  showDateModal.value = false
  selectedDate.value = null
  resetNewScheduleForm()
}

const createScheduleFromModal = async () => {
  if (!newSchedule.value.title || !selectedDate.value) return

  try {
    const scheduleData = {
      title: newSchedule.value.title,
      description: newSchedule.value.description,
      type: newSchedule.value.type,
      startDateTime: formatDateTimeForDB(selectedDate.value, newSchedule.value.startTime),
      endDateTime: formatDateTimeForDB(selectedDate.value, newSchedule.value.endTime),
      location: newSchedule.value.location,
      isUrgent: newSchedule.value.isUrgent
    }

    await scheduleStore.createSchedule(scheduleData)
    closeDateModal()
  } catch (error) {
    console.error('일정 생성 실패:', error)
  }
}

// ✅ 새로 추가: 일정 완료 처리 함수
const completeScheduleFromModal = async (scheduleId) => {
  if (!confirm('이 일정을 완료로 표시하시겠습니까?')) return
  
  try {
    await scheduleStore.updateScheduleStatus(scheduleId, 'completed')
  } catch (error) {
    console.error('일정 완료 처리 실패:', error)
    alert('일정 완료 처리 중 오류가 발생했습니다.')
  }
}

const deleteScheduleFromModal = async (scheduleId) => {
  if (!confirm('정말로 이 일정을 삭제하시겠습니까?')) return
  try {
    await scheduleStore.deleteSchedule(scheduleId)
  } catch (error) {
    console.error('일정 삭제 실패:', error)
    alert('일정 삭제 중 오류가 발생했습니다.')
  }
}

const resetNewScheduleForm = () => {
  newSchedule.value = { title: '', description: '', type: 'meeting', startTime: '09:00', endTime: '10:00', location: '', isUrgent: false }
}

/** 초기 데이터 */
onMounted(() => {
  scheduleStore.loadInitialData()
})

defineExpose({ goToday })
</script>