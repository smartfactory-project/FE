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
              <span class="text-3xl font-bold">
                {{ stat.title === '오늘 생산량' ? Number(stat.value).toFixed(2) : stat.value }}
              </span>
              <span class="text-sm text-gray-600">{{ stat.unit }}</span>
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
                <p class="text-sm font-medium">{{ line.output }}/350</p>
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
import { ref, onMounted, watch } from 'vue'
import { useFactoryStore } from '@/stores/factoryStore.js'
import statisticsAPI from '@/services/statistics.js'

const overviewStats = ref([])
const productionLines = ref([])
const loading = ref(true)
const error = ref(null)

function makeOverviewStats(data) {
  // API 결과를 카드 구조로 변환 (작업 인원 제외)
  const targetOutput = 350;
  return [
    { title: "오늘 생산량", value: data.todayOutput, unit: "개", target: targetOutput, progress: Math.round((data.todayOutput/targetOutput)*100), trend: "", trendUp: true, icon: Target, color: "text-blue-500" },
    { title: "품질 합격률", value: data.qualityRate?.toFixed(1), unit: "%", target: "95%", progress: Math.round(data.qualityRate), trend: "", trendUp: true, icon: CheckCircle, color: "text-green-500" },
    { title: "가동률", value: data.runningRate?.toFixed(1), unit: "%", target: "90%", progress: Math.round(data.runningRate), trend: "", trendUp: true, icon: Activity, color: "text-orange-500" }
  ]
}

function makeLineStatus(line) {
  // 효율성 기준: 10% 미만이면 점검, 10% 이상이면 정상/경고
  if (typeof line.efficiency === 'number') {
    if (line.efficiency < 10) return '점검'
    // 기존 status 활용 (running/warning)
    if (line.status === 'running') return '정상'
    if (line.status === 'warning') return '경고'
    return '정상'
  }
  // fallback: 기존 status
  if (line.status === 'running') return '정상'
  if (line.status === 'warning') return '경고'
  return '점검'
}

const { factory } = useFactoryStore()

async function fetchOverviewAndLines() {
  try {
    loading.value = true
    const [overview, lines] = await Promise.all([
      statisticsAPI.getOverview(factory.value),
      statisticsAPI.getLines()
    ])
    overviewStats.value = makeOverviewStats(overview)
    productionLines.value = lines.map(l => ({
      name: l.name,
      status: makeLineStatus(l),
      efficiency: l.efficiency,
      output: l.currentOutput,
      target: 350
    }))
  } catch (e) {
    error.value = '데이터를 불러올 수 없습니다.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchOverviewAndLines)
watch(factory, fetchOverviewAndLines)
</script>
