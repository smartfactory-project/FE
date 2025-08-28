<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- 효율성 vs 생산량 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">효율성 vs 생산량</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="h-80">
          <ChartLine :chart-data="efficiencyData" :chart-options="efficiencyOptions" />
        </div>
      </CardContent>
    </Card>

    <!-- 부서별 성과 비교 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">부서별 성과 비교</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="h-70">
          <ChartRadar :chart-data="departmentData" :chart-options="departmentOptions" />
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
import { ref, onMounted } from "vue"
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, RadialLinearScale } from "chart.js"
import { Line, Radar } from "vue-chartjs"
import Card from "@/components/ui/card/Card.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import CardHeader from "@/components/ui/card/CardHeader.vue"
import CardTitle from "@/components/ui/card/CardTitle.vue"
import apiClient from "@/components/apiClient.js"

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, RadialLinearScale)

// vue-chartjs 컴포넌트
const ChartLine = Line
const ChartRadar = Radar

// 효율성 vs 생산량 reactive
const efficiencyData = ref({ labels: [], datasets: [] })
const efficiencyOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { type: "linear", position: "left", title: { display: true, text: "생산량" }, grid: { color: "#e2e8f0" } },
    y1: { type: "linear", position: "right", min: 0, title: { display: true, text: "효율성 (%)" }, grid: { drawOnChartArea: false } },
  },
  plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } },
}

// 부서별 성과 비교 하드코딩
const departmentData = ref({
  labels: ["생산성", "품질", "효율성", "안전성", "혁신", "협업"],
  datasets: [
    { label: "현재 분기", data: [92, 96, 89, 98, 78, 85], backgroundColor: "rgba(59,130,246,0.3)", borderColor: "#3b82f6", borderWidth: 2 },
    { label: "이전 분기", data: [88, 94, 85, 95, 82, 88], backgroundColor: "rgba(16,185,129,0.2)", borderColor: "#10b981", borderWidth: 2 },
  ],
})
const departmentOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { r: { angleLines: { color: "#e2e8f0" }, grid: { color: "#e2e8f0" }, suggestedMin: 0, suggestedMax: 100 } },
  plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } },
}

onMounted(async () => {
  try {
    // API에서 효율성 vs 생산량 데이터 가져오기
    const res = await apiClient.get("/production/performanceMonthly")
    const data = Array.isArray(res.data) ? res.data : []

    efficiencyData.value = {
      labels: data.map(d => d.month),
      datasets: [
        {
          type: "bar",
          label: "생산량",
          data: data.map(d => d.output),
          backgroundColor: "#3b82f6",
          yAxisID: "y",
        },
        {
          type: "line",
          label: "효율성 (%)",
          data: data.map(d => d.efficiency),
          borderColor: "#10b981",
          backgroundColor: "rgba(16,185,129,0.2)",
          fill: true,
          tension: 0.3,
          yAxisID: "y1",
        },
      ],
    }
  } catch (err) {
    console.error("API 호출 실패:", err)
  }
})
</script>
