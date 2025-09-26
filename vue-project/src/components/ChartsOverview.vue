<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card
      v-for="(stat, index) in overviewStats"
      :key="index"
      class="bg-card/50 backdrop-blur-sm border-border"
    >
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <CardTitle class="text-sm font-medium text-muted-foreground">{{ stat.title }}</CardTitle>
          <component :is="stat.icon" class="w-5 h-5" :class="stat.color" />
        </div>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="flex items-baseline space-x-2">
          <span class="text-3xl font-bold text-foreground">{{ stat.value }}</span>
          <span class="text-sm text-muted-foreground">{{ stat.unit }}</span>
        </div>
        <!-- 변화 영역 제거 -->
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import Card from "@/components/ui/card/Card.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import CardHeader from "@/components/ui/card/CardHeader.vue"
import CardTitle from "@/components/ui/card/CardTitle.vue"

import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Target } from "lucide-vue-next"

const overviewStats = [
  {
    title: "총 생산량",
    value: "2456개",
    unit: "개",
    change: "+12.5%",
    trend: "up",
    icon: BarChart3,
    color: "text-blue-500",
  },
  {
    title: "평균 품질률",
    value: "96.8",
    unit: "%",
    change: "+2.1%",
    trend: "up",
    icon: Target,
    color: "text-green-500",
  },
  {
    title: "전체 효율성",
    value: "89.2",
    unit: "%",
    change: "-1.3%",
    trend: "down",
    icon: Activity,
    color: "text-orange-500",
  },
  {
    title: "분석 리포트",
    value: "15개",
    unit: "개",
    change: "+1.7%",
    trend: "up",
    icon: PieChart,
    color: "text-purple-500",
  },
]
</script>
