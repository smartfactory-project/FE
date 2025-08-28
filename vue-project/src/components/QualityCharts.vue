<template>
  <div class="space-y-6">
    <!-- 품질 분포 Doughnut Chart -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">품질 분포</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="w-full h-64">
          <ChartPie :chart-data="pieChartData" :chart-options="pieChartOptions" class="w-full h-full" />
        </div>
      </CardContent>
    </Card>

    <!-- 품질률 추이 Area Chart -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">품질률 추이</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="w-full h-64">
          <ChartLine :chart-data="areaChartData" :chart-options="areaChartOptions" class="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import Card from "@/components/ui/card/Card.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import CardHeader from "@/components/ui/card/CardHeader.vue"
import CardTitle from "@/components/ui/card/CardTitle.vue"

import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Filler } from "chart.js"
import { Doughnut, Line } from "vue-chartjs"
import { ref, onMounted } from "vue"
import apiClient from "@/components/apiClient.js"

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Filler)

// 컴포넌트
const ChartPie = Doughnut
const ChartLine = Line

// Pie Chart reactive
const pieChartData = ref({ labels: [], datasets: [] })
const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } },
}

// Area Chart reactive
const areaChartData = ref({ labels: [], datasets: [] })
const areaChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } },
  scales: {
    x: { type: "category", grid: { color: "#e2e8f0" } }, // category로 지정
    y: { min: 80, max: 100, grid: { color: "#e2e8f0" } },
  },
}

onMounted(async () => {
  try {
    // 품질 분포 API 호출
    const pieRes = await apiClient.get("/quality/distribution")
    const pieData = Array.isArray(pieRes.data) ? pieRes.data : []
    pieChartData.value = {
      labels: pieData.map(d => d.name),
      datasets: [
        {
          data: pieData.map(d => Number(d.value)),
          backgroundColor: pieData.map(d => d.color),
          borderWidth: 1,
        },
      ],
    }

    // 품질률 추이 API 호출
    const areaRes = await apiClient.get("/quality/qualityPer")
    const areaData = Array.isArray(areaRes.data) ? areaRes.data : []
    areaChartData.value = {
      labels: areaData.map(d => Number(d.month)), // 숫자로 변환
      datasets: [
        {
          label: "품질률 (%)",
          data: areaData.map(d => Number(d.rate)),
          fill: true,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.3)",
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: "#10b981",
          borderWidth: 2,
        },
      ],
    }
  } catch (err) {
    console.error("API 호출 실패:", err)
  }
})
</script>
