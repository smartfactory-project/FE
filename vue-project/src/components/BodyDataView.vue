<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 좌측: 생산량/라인별/목표 -->
      <div class="space-y-6">
        <Card class="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle class="text-xl text-foreground">주간별 생산량 추이</CardTitle>
          </CardHeader>
          <CardContent class="p-4">
            <div class="chart-area">
              <Line :chart-data="weeklyChartData" :chart-options="chartOptions" class="chart-canvas"/>
            </div>
          </CardContent>
        </Card>
        <Card class="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle class="text-xl text-foreground">라인별 주간 생산량</CardTitle>
          </CardHeader>
          <CardContent class="p-4">
            <div class="chart-area">
              <Bar :chart-data="lineWeeklyChartData" :chart-options="chartOptions" class="chart-canvas"/>
            </div>
          </CardContent>
        </Card>
        <Card class="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle class="text-xl text-foreground">목표 달성율 (350대 기준)</CardTitle>
          </CardHeader>
          <CardContent class="p-4">
            <div class="chart-area">
              <Line :chart-data="goalAchievementChartData" :chart-options="chartOptions" class="chart-canvas"/>
            </div>
          </CardContent>
        </Card>
      </div>
      <!-- 우측: 품질 분포/품질률/가동률 -->
      <div class="space-y-6">
        <Card class="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle class="text-xl text-foreground">품질 분포</CardTitle>
          </CardHeader>
          <CardContent class="p-4">
            <div class="chart-area">
              <Doughnut :chart-data="qualityPieChartData" :chart-options="pieChartOptions" class="chart-canvas"/>
            </div>
          </CardContent>
        </Card>
        <Card class="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle class="text-xl text-foreground">품질률 추이</CardTitle>
          </CardHeader>
          <CardContent class="p-4">
            <div class="chart-area">
              <Line :chart-data="qualityRateChartData" :chart-options="chartOptions" class="chart-canvas"/>
            </div>
          </CardContent>
        </Card>
        <Card class="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle class="text-xl text-foreground">가동률</CardTitle>
          </CardHeader>
          <CardContent class="p-4">
            <div class="chart-area">
              <Bar :chart-data="operationRateChartData" :chart-options="chartOptions" class="chart-canvas"/>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  <!-- 종합 성과 지표 섹션 -->
  <div class="performance-summary">
    <h3 class="summary-title">종합 성과 지표</h3>
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-value text-blue-600">{{ avgEfficiency }}%</div>
        <div class="summary-label">전체 효율성</div>
      </div>
      <div class="summary-card">
        <div class="summary-value text-orange-600">{{ avgOperationRate }}%</div>
        <div class="summary-label">평균 가동률</div>
      </div>
      <div class="summary-card">
        <div class="summary-value text-green-600">{{ avgQualityRate }}%</div>
        <div class="summary-label">품질 지수</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement, ArcElement } from 'chart.js'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import { ref, computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement, ArcElement)

// body 하드코딩 데이터
const bodies = [
  { name: 'body1', production: 207, working: 92, failed: 1 },
  { name: 'body2', production: 306, working: 85, failed: 2 },
  { name: 'body3', production: 210, working: 70, failed: 12 },
  { name: 'body4', production: 302, working: 75, failed: 2 },
  { name: 'body5', production: 198, working: 85, failed: 2 },
]

const totalProduction = computed(() => bodies.reduce((sum, b) => sum + b.production, 0))
const avgQualityRate = computed(() => {
  const rates = bodies.map(b => (b.working/(b.working+b.failed))*100)
  return (rates.reduce((a,b)=>a+b,0)/rates.length).toFixed(1)
})
// 전체 효율성은 84%로 하드코딩
const avgEfficiency = 84;
// 평균 가동률 계산
const avgOperationRate = computed(() => {
  const rates = bodies.map(b => (b.working/(b.working+b.failed))*100);
  return (rates.reduce((a,b)=>a+b,0)/rates.length).toFixed(1);
});

// 주간별 생산량
const weeklyChartData = ref({
  labels: ['월', '화', '수', '목', '금'],
  datasets: [
    {
      label: 'BODY 주간 생산량',
      data: bodies.map(b => b.production),
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
      fill: false,
      tension: 0.2,
    }
  ]
})
// 라인별 주간 생산량 (Bar 차트)
const lineWeeklyChartData = ref({
  labels: bodies.map(b => b.name),
  datasets: [
    {
      label: '라인별 주간 생산량',
      data: bodies.map(b => b.production),
      backgroundColor: [
        '#3b82f6',
        '#6366f1',
        '#10b981',
        '#fbbf24',
        '#ef4444',
      ],
      borderWidth: 1,
    }
  ]
});

// 품질 분포(원형)
const totalWorking = bodies.reduce((sum, b) => sum + b.working, 0)
const totalFailed = bodies.reduce((sum, b) => sum + b.failed, 0)
const qualityPieChartData = ref({
  labels: ['양품', '불량'],
  datasets: [
    {
      data: [totalWorking, totalFailed],
      backgroundColor: ['#3b82f6', '#ef4444'],
      borderWidth: 1,
    }
  ]
})
const pieChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } } }

// 품질률 추이
const qualityRateChartData = ref({
  labels: ['월', '화', '수', '목', '금'],
  datasets: [
    {
      label: '품질률(%)',
      data: bodies.map(b => ((b.working/(b.working+b.failed))*100).toFixed(2)),
      backgroundColor: '#10b981',
      borderColor: '#10b981',
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointBackgroundColor: '#10b981',
      borderWidth: 2,
    }
  ]
})

// 목표 달성율
const goalAchievementChartData = ref({
  labels: ['월', '화', '수', '목', '금'],
  datasets: [
    {
      label: 'BODY 목표 달성율(%)',
      data: bodies.map(b => ((b.production/350)*100).toFixed(1)),
      borderColor: '#34d399',
      backgroundColor: '#34d39922',
      fill: false,
      tension: 0.2,
    }
  ]
})

// 가동률
const operationRateChartData = ref({
  labels: ['월', '화', '수', '목', '금'],
  datasets: [
    {
      label: '가동률(%)',
      data: bodies.map(b => ((b.working/(b.working+b.failed))*100).toFixed(1)),
      backgroundColor: '#fbbf24',
    }
  ]
})

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } }, scales: { x: { grid: { color: '#e2e8f0' } }, y: { grid: { color: '#e2e8f0' } } } }
</script>

<style scoped>
/* 차트 영역을 부모에 맞게 확장, 마진/패딩 조정 */
.chart-area {
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;
}
.chart-canvas {
  width: 100% !important;
  height: 100% !important;
}

.performance-summary {
  width: 100%;
  margin: 2rem auto 0 auto;
  padding: 1.5rem 1.5rem 1.5rem 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  border: 1px solid #e5e7eb;
}
.summary-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
}
.summary-cards {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}
.summary-card {
  flex: 1;
  background: none;
  text-align: center;
  padding: 0.5rem 0;
}
.summary-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}
.summary-label {
  font-size: 1rem;
  color: #444;
  margin-bottom: 0.2rem;
}
.summary-diff {
  font-size: 0.95rem;
  font-weight: 500;
}
</style>
