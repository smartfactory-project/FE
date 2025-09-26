<template>
  <div class=" grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- 주간 생산 현황 카드 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground font-bold">주간 생산 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <template v-if="weeklyMetrics.length > 0">
            <div v-for="(metric, index) in weeklyMetrics.slice(0, 5)" :key="index" class="flex items-center space-x-4">
              <div class="w-8 text-center">
                <span class="text-sm font-semibold text-foreground">{{ metric.day }}</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-700 font-medium">{{ metric.actual }}/{{ metric.target }}개</span>
                  <span
                    :class="[
                      'font-bold',
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
          </template>
          <template v-else>
            <div class="text-center text-gray-400 py-8">주간 생산현황 데이터가 없습니다.</div>
          </template>
        </div>
      </CardContent>
    </Card>

    <!-- 성과 지표 카드 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground font-bold">성과 지표</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(metric, index) in performanceMetrics" :key="index" class="p-4 rounded-lg bg-gray-50 text-center">
            <component :is="metric.icon" class="w-6 h-6 mx-auto mb-2" :class="metric.color" />
            <h3 class="text-sm font-semibold text-gray-700 mb-1">{{ metric.title }}</h3>
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
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getOverview, getLines } from '../services/statistics'
import { Zap, Clock, Shield } from 'lucide-vue-next'
import { useFactoryStore } from '@/stores/factoryStore.js'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Progress from '@/components/ui/Progress.vue'
import Badge from '@/components/ui/Badge.vue'

const factoryStore = useFactoryStore()
const weeklyMetrics = ref([])
const performanceMetrics = ref([])
const lineMetrics = ref([])

async function fetchMetrics(simulationName) {
  try {
    // 1. 개요 API 호출 (simulation_name 기준)
    const overview = await getOverview(simulationName)
    // 2. 라인별 상세 현황 API 호출 (object_name 기준)
    const lines = await getLines()
    // simulation_name과 일치하는 object_name만 추출
    let filteredLines = lines.filter(l => {
      return l.name && l.name.includes(simulationName)
    })
    // 만약 매칭되는 라인이 없으면 전체 라인 중 상위 5개를 fallback으로 사용
    if (filteredLines.length === 0 && lines.length > 0) {
      filteredLines = lines.slice(0, 5)
    }
    // 주간 생산현황: 해당 simulation_name의 object_name별 생산량/효율성 매칭
    const days = ['월', '화', '수', '목', '금']
    const target = 350
    weeklyMetrics.value = filteredLines.map((line, idx) => {
      return {
        day: days[idx] || `라인${idx+1}`,
        actual: line.currentOutput ?? 0,
        target,
        efficiency: line.efficiency ?? 0
      }
    })
    // 성과 지표: overview 값 그대로 사용
    performanceMetrics.value = [
      {
        title: '전체 효율성',
        value: overview?.runningRate ? overview.runningRate.toFixed(1) : '91.3',
        unit: '%',
        target: overview?.targetRunningRate ? overview.targetRunningRate.toFixed(1) : '90',
        trend: '+1.3%',
        icon: Zap,
        color: 'text-yellow-500',
      },
      {
        title: '품질 지수',
        value: overview?.qualityRate ? overview.qualityRate.toFixed(1) : '97.2',
        unit: '%',
        target: '95',
        trend: '+2.2%',
        icon: Shield,
        color: 'text-green-500',
      },
      {
        title: '생산량',
        value: overview?.todayOutput ? overview.todayOutput.toFixed(2) : '80.00',
        unit: '개',
        target: '350',
        trend: '',
        icon: Clock,
        color: 'text-blue-500',
      },
    ]
  } catch (e) {
    // 에러 시 기본값
    const days = ['월', '화', '수', '목', '금']
    weeklyMetrics.value = days.map((day, idx) => {
      const percent = 1 + (idx - 2) * 0.025
      const actual = Math.round(80 * percent)
      const target = 350
      const efficiency = Math.round((actual / target) * 1000) / 10
      return { day, actual, target, efficiency }
    })
    performanceMetrics.value = [
      {
        title: '전체 효율성',
        value: '91.3',
        unit: '%',
        target: '90',
        trend: '+1.3%',
        icon: Zap,
        color: 'text-yellow-500',
      },
      {
        title: '품질 지수',
        value: '97.2',
        unit: '%',
        target: '95',
        trend: '+2.2%',
        icon: Shield,
        color: 'text-green-500',
      },
      {
        title: '생산량',
        value: '80',
        unit: '개',
        target: '350',
        trend: '',
        icon: Clock,
        color: 'text-blue-500',
      },
    ]
  }
}

onMounted(() => {
  fetchMetrics(factoryStore.factory.value)
})


watch(() => factoryStore.factory, (newVal) => {
  fetchMetrics(newVal)
})

watch(() => factoryStore.factory.value, (newVal) => {
  fetchMetrics(newVal)
})
</script>
