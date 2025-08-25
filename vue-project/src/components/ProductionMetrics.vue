<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- 주간 생산 현황 -->
    <Card>
      <CardHeader>
        <CardTitle>주간 생산 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-for="(metric, index) in weeklyMetrics" :key="index" class="flex items-center space-x-4">
            <div class="w-8 text-center">
              <span class="text-sm font-medium text-foreground">{{ metric.day }}</span>
            </div>
            <div class="flex-1">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">{{ metric.actual }}/{{ metric.target }}개</span>
                <span
                  :class="[
                    'font-medium',
                    metric.efficiency >= 95 ? 'text-green-600' :
                    metric.efficiency >= 85 ? 'text-yellow-600' :
                    'text-red-600'
                  ]"
                >
                  {{ metric.efficiency }}%
                </span>
              </div>
              <Progress :value="metric.efficiency" class="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 성과 지표 -->
    <Card>
      <CardHeader>
        <CardTitle>성과 지표</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(metric, index) in performanceMetrics" :key="index" class="p-4 rounded-lg bg-gray-50 text-center">
            <component :is="metric.icon" class="w-6 h-6 mx-auto mb-2" :class="metric.color" />
            <h3 class="text-sm font-medium text-gray-600 mb-1">{{ metric.title }}</h3>
            <div class="flex items-center justify-center space-x-1 mb-1">
              <span class="text-2xl font-bold text-foreground">{{ metric.value }}</span>
              <span class="text-sm text-gray-600">{{ metric.unit }}</span>
            </div>
            <div class="flex items-center justify-center space-x-2">
              <span class="text-xs text-gray-600">목표: {{ metric.target }}{{ metric.unit }}</span>
              <Badge :class="metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'">
                {{ metric.trend }}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 부서별 현황 -->
    <Card class="lg:col-span-2">
      <CardHeader>
        <CardTitle>부서별 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="(dept, index) in departmentStats" :key="index" class="p-4 rounded-lg bg-gray-50">
            <h3 class="font-semibold text-foreground mb-3">{{ dept.name }}</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">출근 인원</span>
                <span class="text-foreground">{{ dept.present }}/{{ dept.workers }}명</span>
              </div>
              <Progress :value="(dept.present / dept.workers) * 100" class="h-2" />
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">효율성</span>
                <span
                  :class="[
                    'font-medium',
                    dept.efficiency >= 95 ? 'text-green-600' :
                    dept.efficiency >= 85 ? 'text-yellow-600' :
                    'text-red-600'
                  ]"
                >
                  {{ dept.efficiency }}%
                </span>
              </div>
            </div>
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
import Progress from "@/components/ui/Progress.vue"
import Badge from "@/components/ui/Badge.vue"
import { Users, Clock, Zap, Shield } from "lucide-vue-next"

const weeklyMetrics = [
  { day: "월", target: 1500, actual: 1420, efficiency: 94.7 },
  { day: "화", target: 1500, actual: 1380, efficiency: 92.0 },
  { day: "수", target: 1500, actual: 1510, efficiency: 100.7 },
  { day: "목", target: 1500, actual: 1465, efficiency: 97.7 },
  { day: "금", target: 1500, actual: 1247, efficiency: 83.1 },
  { day: "토", target: 800, actual: 0, efficiency: 0 },
  { day: "일", target: 800, actual: 0, efficiency: 0 },
]

const performanceMetrics = [
  { title: "전체 효율성", value: 89.2, unit: "%", target: 90, icon: Zap, color: "text-yellow-500", trend: "+2.1%" },
  { title: "평균 가동률", value: 87.5, unit: "%", target: 85, icon: Clock, color: "text-blue-500", trend: "+1.8%" },
  { title: "품질 지수", value: 96.8, unit: "%", target: 95, icon: Shield, color: "text-green-500", trend: "+0.5%" },
  { title: "인력 활용률", value: 93.3, unit: "%", target: 90, icon: Users, color: "text-purple-500", trend: "-1.2%" },
]

const departmentStats = [
  { name: "생산팀", workers: 42, present: 39, efficiency: 92.8 },
  { name: "품질관리팀", workers: 8, present: 8, efficiency: 98.1 },
  { name: "유지보수팀", workers: 6, present: 5, efficiency: 83.3 },
  { name: "물류팀", workers: 12, present: 11, efficiency: 91.7 },
]
</script>
