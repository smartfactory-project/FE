<template>
  <section class="mb-8">
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
        <Bell class="h-5 w-5 text-white" />
      </div>

      <RouterLink
        to="/announcements"
        class="group flex items-center gap-2 hover:text-indigo-600 transition-colors"
      >
        <h2 class="text-xl font-bold text-foreground group-hover:text-indigo-600">공지사항</h2>
        <ChevronRight class="h-4 w-4 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
      </RouterLink>

      <span class="ml-auto inline-flex items-center rounded-md border px-2 py-[2px] text-xs"
            :class="['border-border bg-secondary/10 text-secondary-foreground/90']">
        {{ pinnedCount }}개 고정
      </span>
    </div>

    <div class="grid gap-3">
      <div
        v-for="a in announcements.slice(0, 2)"
        :key="a.id"
        class="group hover:shadow-md transition-all duration-300 border-0 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 hover:from-white hover:to-slate-50 backdrop-blur-sm"
      >
        <div class="p-4">
          <div class="flex items-start gap-3">
            <div class="text-lg">{{ getTypeIcon(a.type) }}</div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <Pin v-if="a.isPinned" class="h-3 w-3 text-indigo-600 fill-current" />
                <h3 class="font-semibold text-base text-foreground group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {{ a.title }}
                </h3>

                <span
                  class="ml-auto inline-flex items-center rounded-md border px-2 py-[2px] text-xs"
                  :class="getTypeColor(a.type)"
                >
                  {{ a.type === 'success' ? '축하' : a.type === 'warning' ? '중요' : '안내' }}
                </span>
              </div>

              <p class="text-muted-foreground text-sm mb-3 leading-relaxed line-clamp-2">
                {{ a.content }}
              </p>

              <div class="flex items-center gap-3 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <UsersIcon class="h-3 w-3" />
                  <span>{{ a.author }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <CalendarIcon class="h-3 w-3" />
                  <span>{{ a.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> <!-- /Card -->
    </div>
  </section>
</template>

<script setup>
import { Bell, Pin, Calendar as CalendarIcon, Users as UsersIcon, ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'

const announcements = [
  {
    id: 1,
    title: '2024년 4분기 생산 목표 달성 축하',
    content: '전 직원의 노력으로 분기 생산 목표를 105% 달성했습니다. 보너스 지급 예정입니다.',
    type: 'success',
    date: '2024-01-15',
    author: '경영진',
    isPinned: true,
  },
  {
    id: 2,
    title: '새로운 품질관리 시스템 도입 안내',
    content: '다음 주부터 새로운 QMS 시스템이 도입됩니다. 관련 교육은 1월 20일부터 시작됩니다.',
    type: 'info',
    date: '2024-01-12',
    author: '품질관리팀',
    isPinned: true,
  },
  {
    id: 3,
    title: '정기 안전교육 실시',
    content: '1월 25일 오후 2시, 전 직원 대상 안전교육을 실시합니다. 필수 참석 바랍니다.',
    type: 'warning',
    date: '2024-01-10',
    author: '안전관리팀',
    isPinned: false,
  },
]

const pinnedCount = computed(() => announcements.filter(a => a.isPinned).length)

const getTypeColor = (type) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-500/10 text-emerald-700 border border-emerald-200'
    case 'warning':
      return 'bg-amber-500/10 text-amber-700 border border-amber-200'
    case 'info':
      return 'bg-blue-500/10 text-blue-700 border border-blue-200'
    default:
      return 'bg-gray-500/10 text-gray-700 border border-gray-200'
  }
}

const getTypeIcon = (type) => {
  switch (type) {
    case 'success': return '🎉'
    case 'warning': return '⚠️'
    case 'info':    return 'ℹ️'
    default:        return '📢'
  }
}
</script>
