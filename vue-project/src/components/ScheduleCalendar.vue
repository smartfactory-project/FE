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
          class="aspect-square rounded-lg p-2 text-sm relative"
          :class="[
            cell.isCurrentMonth ? 'bg-background hover:bg-muted/50' : 'bg-muted/30 text-muted-foreground',
            isToday(cell.date) ? 'ring-2 ring-offset-2 ring-[var(--ring)] ring-opacity-50' : '',
            'transition-colors'
          ]"
        >
          <div class="flex items-start justify-between">
            <span class="font-medium">{{ cell.date.getDate() }}</span>
            <span
              v-if="eventsByDate[iso(cell.date)]?.length"
              class="inline-block w-2 h-2 rounded-full bg-primary mt-1"
              title="이 날에 일정이 있습니다"
            />
          </div>

          <!-- 일정 미리보기 (최대 2개) -->
          <div class="mt-2 space-y-1">
            <div
              v-for="(ev, idx) in (eventsByDate[iso(cell.date)] || []).slice(0, 2)"
              :key="idx"
              class="px-2 py-1 rounded text-xs truncate"
              :class="badgeClass(ev.type)"
              :title="ev.title"
            >
              {{ ev.title }}
            </div>
            <div
              v-if="(eventsByDate[iso(cell.date)] || []).length > 2"
              class="text-[11px] text-muted-foreground"
            >
              +{{ (eventsByDate[iso(cell.date)] || []).length - 2 }} 더보기
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Button from '@/components/ui/Button.vue'

/** 상태 */
const today = new Date()
const viewDate = ref(new Date(today.getFullYear(), today.getMonth(), 1))

/** 유틸 */
const iso = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const da = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${da}`
}
const isToday = (d) =>
  d.getFullYear() === today.getFullYear() &&
  d.getMonth() === today.getMonth() &&
  d.getDate() === today.getDate()

/** 요일(한국식: 일~토) */
const weekdays = ['일', '월', '화', '수', '목', '금', '토']

/** 뷰의 연/월 */
const year = computed(() => viewDate.value.getFullYear())
const month = computed(() => viewDate.value.getMonth())

/** 현재 뷰의 셀(6주 = 42칸) */
const cells = computed(() => {
  const first = new Date(year.value, month.value, 1)
  const firstDay = first.getDay() // 0(일)~6(토)
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()

  // 시작 이전(이전 달) 채우기
  const prevDays = firstDay
  const prevMonthDays = new Date(year.value, month.value, 0).getDate()

  const arr = []
  // 이전달
  for (let i = prevDays - 1; i >= 0; i--) {
    const d = new Date(year.value, month.value - 1, prevMonthDays - i)
    arr.push({ date: d, isCurrentMonth: false })
  }
  // 이번달
  for (let d = 1; d <= daysInMonth; d++) {
    arr.push({ date: new Date(year.value, month.value, d), isCurrentMonth: true })
  }
  // 다음달
  while (arr.length % 7 !== 0) {
    const last = arr[arr.length - 1].date
    const next = new Date(last)
    next.setDate(last.getDate() + 1)
    arr.push({ date: next, isCurrentMonth: false })
  }
  // 6주(42칸) 맞추기
  while (arr.length < 42) {
    const last = arr[arr.length - 1].date
    const next = new Date(last)
    next.setDate(last.getDate() + 1)
    arr.push({ date: next, isCurrentMonth: false })
  }
  return arr
})

/** 샘플 일정 데이터 (원하면 API로 교체) */
const eventsByDate = {
  [iso(new Date(today.getFullYear(), today.getMonth(), today.getDate()))]: [
    { title: '팀 스탠드업', type: 'meeting' },
    { title: '보고서 작성', type: 'task' },
    { title: '클라이언트 콜', type: 'meeting' },
  ],
  [iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1))]: [
    { title: '프로젝트 리뷰', type: 'review' },
  ],
}

/** 타입별 배지 색상 */
const badgeClass = (type) => {
  switch (type) {
    case 'meeting':
      return 'bg-blue-100 text-blue-700'
    case 'task':
      return 'bg-emerald-100 text-emerald-700'
    case 'review':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

/** 월 이동 */
const prevMonth = () => {
  const d = new Date(viewDate.value)
  d.setMonth(d.getMonth() - 1)
  viewDate.value = d
}
const nextMonth = () => {
  const d = new Date(viewDate.value)
  d.setMonth(d.getMonth() + 1)
  viewDate.value = d
}
const goToday = () => {
  viewDate.value = new Date(today.getFullYear(), today.getMonth(), 1)
}
defineExpose({ goToday })
</script>
