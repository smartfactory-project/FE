<template>
  <div class="space-y-6">
    <!-- 실시간 알림 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="flex items-center text-lg text-foreground">
          <Bell class="w-5 h-5 mr-2 text-primary" />
          실시간 알림
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          :class="[
            'p-3 rounded-lg border transition-colors',
            alert.acknowledged ? 'bg-background/30 opacity-60' : 'bg-background/50'
          ]"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center space-x-2">
              <component :is="getAlertIcon(alert.type)" class="w-4 h-4" />
              <h4 class="font-medium text-foreground text-sm">{{ alert.title }}</h4>
            </div>
            <div class="flex items-center space-x-2">
              <Badge variant="secondary" :class="['text-xs', getPriorityColor(alert.priority)]">
                {{ alert.priority === 'high' ? '높음' : alert.priority === 'medium' ? '보통' : '낮음' }}
              </Badge>
              <Button
                v-if="!alert.acknowledged"
                variant="ghost"
                size="sm"
                class="h-6 w-6 p-0"
              >
                <X class="w-3 h-3" />
              </Button>
            </div>
          </div>
          <p class="text-xs text-muted-foreground mb-2">{{ alert.message }}</p>
          <div class="flex justify-between items-center">
            <span class="text-xs text-muted-foreground">{{ alert.time }}</span>
            <Button
              v-if="!alert.acknowledged"
              variant="outline"
              size="sm"
              class="text-xs h-6 bg-transparent"
            >
              확인
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 예정된 점검 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="flex items-center text-lg text-foreground">
          <Clock class="w-5 h-5 mr-2 text-primary" />
          예정된 점검
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div
            v-for="(maintenance, index) in upcomingMaintenance"
            :key="index"
            class="flex items-center justify-between p-3 rounded-lg bg-background/50"
          >
            <div>
              <p class="text-sm font-medium text-foreground">{{ maintenance.line }}</p>
              <p class="text-xs text-muted-foreground">{{ maintenance.type }}</p>
            </div>
            <Badge variant="outline" class="bg-background/50">{{ maintenance.date }}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 오늘의 성과 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="flex items-center text-lg text-foreground">
          <CheckCircle class="w-5 h-5 mr-2 text-primary" />
          오늘의 성과
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-foreground">목표 달성률</span>
            <span class="text-lg font-bold text-green-600">83%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-foreground">품질 합격률</span>
            <span class="text-lg font-bold text-green-600">96.8%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-foreground">가동 시간</span>
            <span class="text-lg font-bold text-blue-600">7.2시간</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-foreground">불량률</span>
            <span class="text-lg font-bold text-orange-600">3.2%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import Card from "@/components/ui/card/Card.vue"
import CardHeader from "@/components/ui/card/CardHeader.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import CardTitle from "@/components/ui/card/CardTitle.vue"
import Badge from "@/components/ui/Badge.vue"
import Button from "@/components/ui/Button.vue"
import { AlertTriangle, CheckCircle, Clock, Bell, X } from "lucide-vue-next"

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "라인 E 온도 상승",
    message: "라인 E에서 온도가 정상 범위를 초과했습니다.",
    time: "5분 전",
    priority: "high",
    acknowledged: false,
  },
  {
    id: 2,
    type: "info",
    title: "라인 C 점검 완료",
    message: "정기 점검이 완료되어 곧 가동을 재개합니다.",
    time: "15분 전",
    priority: "medium",
    acknowledged: true,
  },
  {
    id: 3,
    type: "warning",
    title: "원자재 재고 부족",
    message: "A타입 부품의 재고가 임계치 이하입니다.",
    time: "1시간 전",
    priority: "high",
    acknowledged: false,
  },
  {
    id: 4,
    type: "success",
    title: "일일 목표 달성",
    message: "라인 A가 일일 생산 목표를 달성했습니다.",
    time: "2시간 전",
    priority: "low",
    acknowledged: true,
  },
]

const upcomingMaintenance = [
  { line: "라인 E", date: "내일", type: "정기 점검" },
  { line: "라인 B", date: "3일 후", type: "부품 교체" },
  { line: "라인 D", date: "1주 후", type: "정기 점검" },
]

const getAlertIcon = (type) => {
  switch (type) {
    case "warning":
      return AlertTriangle
    case "success":
      return CheckCircle
    case "info":
      return Bell
    default:
      return Clock
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700"
    case "medium":
      return "bg-yellow-100 text-yellow-700"
    case "low":
      return "bg-green-100 text-green-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}
</script>
