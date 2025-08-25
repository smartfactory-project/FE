<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- 효율성 vs 생산량 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">효율성 vs 생산량</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="h-80">
          <canvas ref="efficiencyChart"></canvas>
        </div>
      </CardContent>
    </Card>

    <!-- 부서별 성과 비교 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">부서별 성과 비교</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="h-80">
          <canvas ref="departmentChart"></canvas>
        </div>
      </CardContent>
    </Card>

    <!-- 종합 성과 지표 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border lg:col-span-2">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">종합 성과 지표</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center p-4 rounded-lg bg-background/50">
            <div class="text-3xl font-bold text-blue-600 mb-2">89.2%</div>
            <div class="text-sm text-muted-foreground">전체 효율성</div>
            <div class="text-xs text-green-600 mt-1">+2.1% ↑</div>
          </div>
          <div class="text-center p-4 rounded-lg bg-background/50">
            <div class="text-3xl font-bold text-green-600 mb-2">96.8%</div>
            <div class="text-sm text-muted-foreground">품질 지수</div>
            <div class="text-xs text-green-600 mt-1">+0.5% ↑</div>
          </div>
          <div class="text-center p-4 rounded-lg bg-background/50">
            <div class="text-3xl font-bold text-orange-600 mb-2">87.5%</div>
            <div class="text-sm text-muted-foreground">가동률</div>
            <div class="text-xs text-red-600 mt-1">-1.2% ↓</div>
          </div>
          <div class="text-center p-4 rounded-lg bg-background/50">
            <div class="text-3xl font-bold text-purple-600 mb-2">93.3%</div>
            <div class="text-sm text-muted-foreground">인력 활용률</div>
            <div class="text-xs text-green-600 mt-1">+1.8% ↑</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { Chart, registerables } from "chart.js"
import Card from "@/components/ui/card/Card.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import CardHeader from "@/components/ui/card/CardHeader.vue"
import CardTitle from "@/components/ui/card/CardTitle.vue"

Chart.register(...registerables)

const efficiencyChart = ref(null)
const departmentChart = ref(null)

// 데이터
const performanceData = [
  { month: "1월", efficiency: 85.2, output: 18500 },
  { month: "2월", efficiency: 87.1, output: 19200 },
  { month: "3월", efficiency: 91.3, output: 21300 },
  { month: "4월", efficiency: 89.8, output: 20800 },
  { month: "5월", efficiency: 92.1, output: 22100 },
  { month: "6월", efficiency: 94.4, output: 23400 },
  { month: "7월", efficiency: 93.2, output: 24200 },
  { month: "8월", efficiency: 91.8, output: 23800 },
  { month: "9월", efficiency: 95.1, output: 25100 },
  { month: "10월", efficiency: 92.6, output: 24600 },
  { month: "11월", efficiency: 96.2, output: 26200 },
  { month: "12월", efficiency: 89.2, output: 24847 },
]

const departmentPerformance = [
  { department: "생산성", A: 92, B: 88 },
  { department: "품질", A: 96, B: 94 },
  { department: "효율성", A: 89, B: 85 },
  { department: "안전성", A: 98, B: 95 },
  { department: "혁신", A: 78, B: 82 },
  { department: "협업", A: 85, B: 88 },
]

onMounted(() => {
  // 효율성 vs 생산량 (bar + line, dual y-axis)
  new Chart(efficiencyChart.value, {
    type: "bar",
    data: {
      labels: performanceData.map(d => d.month),
      datasets: [
        {
          type: "bar",
          label: "생산량",
          data: performanceData.map(d => d.output),
          backgroundColor: "#3b82f6",
          yAxisID: "y",
        },
        {
          type: "line",
          label: "효율성 (%)",
          data: performanceData.map(d => d.efficiency),
          borderColor: "#10b981",
          backgroundColor: "rgba(16,185,129,0.2)",
          fill: true,
          tension: 0.3,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: "생산량" },
          grid: { color: "#e2e8f0" },
        },
        y1: {
          type: "linear",
          position: "right",
          title: { display: true, text: "효율성 (%)" },
          grid: { drawOnChartArea: false },
          min: 0,
          max: 100,
        },
      },
      plugins: {
        legend: { position: "top" },
        tooltip: { mode: "index", intersect: false },
      },
    },
  })

  // 부서별 성과 비교 (radar)
  new Chart(departmentChart.value, {
    type: "radar",
    data: {
      labels: departmentPerformance.map(d => d.department),
      datasets: [
        {
          label: "현재 분기",
          data: departmentPerformance.map(d => d.A),
          backgroundColor: "rgba(59,130,246,0.3)",
          borderColor: "#3b82f6",
          borderWidth: 2,
        },
        {
          label: "이전 분기",
          data: departmentPerformance.map(d => d.B),
          backgroundColor: "rgba(16,185,129,0.2)",
          borderColor: "#10b981",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        r: {
          angleLines: { color: "#e2e8f0" },
          grid: { color: "#e2e8f0" },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  })
})
</script>
