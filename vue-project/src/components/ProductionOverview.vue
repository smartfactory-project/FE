<template>
  <div class="space-y-6">
    <!-- 개별 생산 통계 카드 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card v-for="(stat, index) in overviewStats" :key="index">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>{{ stat.title }}</CardTitle>
            <component :is="stat.icon" class="w-5 h-5" :class="stat.color" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div class="flex items-baseline space-x-2">
              <span class="text-3xl font-bold">{{ stat.value }}</span>
              <span class="text-sm text-gray-600">{{ stat.unit }}</span>
              <div :class="['flex items-center text-xs', stat.trendUp ? 'text-green-600' : 'text-red-600']">
                <component :is="stat.trendUp ? TrendingUp : TrendingDown" class="w-3 h-3 mr-1" />
                {{ stat.trend }}
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-xs text-gray-600">
                <span>목표: {{ stat.target }}</span>
                <span>{{ stat.progress }}%</span>
              </div>
              <Progress :value="stat.progress" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 생산 라인 현황 카드 -->
    <Card>
      <CardHeader>
        <CardTitle>생산 라인 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div v-for="(line, index) in productionLines" :key="index" class="p-4 rounded-lg bg-gray-50 text-center">
            <h3 class="font-semibold mb-2">{{ line.name }}</h3>
            <Badge :class="line.status === '정상' ? 'bg-green-100 text-green-700' :
                           line.status === '경고' ? 'bg-yellow-100 text-yellow-700' :
                           'bg-red-100 text-red-700'">
              {{ line.status }}
            </Badge>
            <div class="space-y-2 mt-2">
              <div>
                <p class="text-xs text-gray-600">효율성</p>
                <p class="text-lg font-bold">{{ line.efficiency }}%</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">생산량</p>
                <p class="text-sm font-medium">{{ line.output }}개</p>
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
import { TrendingUp, TrendingDown, Target, Users, CheckCircle, Activity } from "lucide-vue-next"

const overviewStats = [
  { title: "오늘 생산량", value: "1,247", unit: "개", target: "1,500", progress: 83, trend: "+12%", trendUp: true, icon: Target, color: "text-blue-500" },
  { title: "품질 합격률", value: "96.8", unit: "%", target: "95%", progress: 97, trend: "+2.1%", trendUp: true, icon: CheckCircle, color: "text-green-500" },
  { title: "가동률", value: "87.5", unit: "%", target: "90%", progress: 87, trend: "-1.2%", trendUp: false, icon: Activity, color: "text-orange-500" },
  { title: "작업 인원", value: "42", unit: "명", target: "45", progress: 93, trend: "-3명", trendUp: false, icon: Users, color: "text-purple-500" }
]

const productionLines = [
  { name: "라인 A", status: "정상", efficiency: 94, output: 387 },
  { name: "라인 B", status: "정상", efficiency: 91, output: 342 },
  { name: "라인 C", status: "점검", efficiency: 0, output: 0 },
  { name: "라인 D", status: "정상", efficiency: 88, output: 298 },
  { name: "라인 E", status: "경고", efficiency: 76, output: 220 }
]
</script>
