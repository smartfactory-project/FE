<template>
  <div class="space-y-8">
    <!-- 상단 빠른 통계 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(stat, index) in quickStats"
        :key="index"
        class="bg-white/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 group rounded-lg"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">{{ stat.label }}</p>
              <p class="text-3xl font-bold text-foreground mt-1">{{ stat.value }}</p>
              <p class="text-sm text-emerald-600 font-medium mt-1">{{ stat.change }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <component :is="stat.icon" class="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 대시보드 카드 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        v-for="(item, index) in dashboardItems"
        :key="index"
        class="bg-white/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden rounded-lg"
      >
        <div class="p-6 pb-4">
          <div class="flex items-center space-x-4">
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg"
              :class="`bg-gradient-to-br ${item.gradient}`"
            >
              <component :is="item.icon" class="w-7 h-7 text-white" />
            </div>
            <div>
              <div class="text-xl text-foreground font-bold">{{ item.title }}</div>
              <div class="text-muted-foreground font-medium">{{ item.description }}</div>
            </div>
          </div>
        </div>

        <div class="px-6 pb-6 pt-0">
          <div class="flex items-center justify-between">
            <p class="text-sm text-muted-foreground font-medium">{{ item.stats }}</p>
            <RouterLink :to="item.href">
              <button
                class="px-3 py-2 rounded-md border border-border text-foreground font-medium transition-all duration-300 bg-transparent group-hover:bg-gradient-to-r group-hover:from-secondary group-hover:to-accent group-hover:text-white group-hover:border-transparent"
              >
                보기
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- 최근 활동 -->
    <div class="bg-white/80 backdrop-blur-sm border border-border/50 shadow-sm rounded-lg">
      <div class="p-6">
        <div class="text-xl text-foreground font-bold">최근 활동</div>
        <div class="text-muted-foreground font-medium">팀의 최신 업데이트와 알림</div>
      </div>
      <div class="px-6 pb-6">
        <div class="space-y-4">
          <div
            v-for="(activity, index) in activities"
            :key="index"
            class="flex items-center space-x-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 group"
          >
            <div class="w-10 h-10 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <UserIcon class="w-5 h-5 text-secondary" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-foreground font-medium">
                <span class="font-bold text-primary">{{ activity.user }}</span>님이 {{ activity.action }}
              </p>
              <p class="text-xs text-muted-foreground font-medium mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  MessageSquare,
  Calendar as CalendarIcon,
  TrendingUp,
  BarChart3,
  Users as UsersIcon,
  Clock,
  Target,
  Activity,
  User as UserIcon,
} from 'lucide-vue-next'

const dashboardItems = [
  {
    title: '게시글 보기',
    description: '커뮤니티 게시글과 추천 시스템',
    icon: MessageSquare,
    gradient: 'from-blue-500 to-blue-600',
    stats: '124개 게시글',
    href: '/posts',
  },
  {
    title: '일정 보기',
    description: '팀 일정과 프로젝트 관리',
    icon: CalendarIcon,
    gradient: 'from-emerald-500 to-emerald-600',
    stats: '8개 예정된 일정',
    href: '/schedule',
  },
  {
    title: '생산 현황',
    description: '실시간 생산성 모니터링',
    icon: TrendingUp,
    gradient: 'from-orange-500 to-orange-600',
    stats: '85% 달성률',
    href: '/production',
  },
  {
    title: '차트 보기',
    description: '데이터 분석과 인사이트',
    icon: BarChart3,
    gradient: 'from-purple-500 to-purple-600',
    stats: '12개 리포트',
    href: '/charts',
  },
]

const quickStats = [
  { label: '활성 사용자', value: '1,234', icon: UsersIcon, change: '+12%' },
  { label: '오늘 작업', value: '89', icon: Clock, change: '+5%' },
  { label: '목표 달성', value: '76%', icon: Target, change: '+8%' },
  { label: '시스템 상태', value: '정상', icon: Activity, change: '100%' },
]

const activities = [
  { user: '김철수', action: '새 게시글을 작성했습니다', time: '5분 전', type: 'post' },
  { user: '이영희', action: '생산 현황을 업데이트했습니다', time: '15분 전', type: 'update' },
  { user: '박민수', action: '일정을 추가했습니다', time: '1시간 전', type: 'schedule' },
  { user: '정수진', action: '차트 리포트를 생성했습니다', time: '2시간 전', type: 'report' },
]
</script>
