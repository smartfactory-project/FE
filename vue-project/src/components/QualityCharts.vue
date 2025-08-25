<template>
  <div class="space-y-6">
    <!-- 품질 분포 Doughnut Chart -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">품질 분포</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="w-full h-64">
          <ChartPie
            :chart-data="pieChartData"
            :chart-options="pieChartOptions"
            class="w-full h-full"
          />
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
          <ChartLine
            :chart-data="areaChartData"
            :chart-options="areaChartOptions"
            class="w-full h-full"
          />
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

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Filler)

// Pie Chart Wrapper → Doughnut 사용
const ChartPie = Doughnut

// Line/Area Chart Wrapper
const ChartLine = Line

// Pie Data
const qualityDistributionData = [
  { name: "합격", value: 96.8, color: "#10b981" },
  { name: "재작업", value: 2.1, color: "#f59e0b" },
  { name: "불량", value: 1.1, color: "#ef4444" },
]

const pieChartData = {
  labels: qualityDistributionData.map(d => d.name),
  datasets: [
    {
      data: qualityDistributionData.map(d => d.value),
      backgroundColor: qualityDistributionData.map(d => d.color),
      borderWidth: 1,
    },
  ],
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    tooltip: { mode: "index", intersect: false },
  },
}

// Area Data
const qualityTrendData = [
  { week: "1주", quality: 94.2 },
  { week: "2주", quality: 95.1 },
  { week: "3주", quality: 96.3 },
  { week: "4주", quality: 97.1 },
  { week: "5주", quality: 96.8 },
  { week: "6주", quality: 98.2 },
  { week: "7주", quality: 97.5 },
  { week: "8주", quality: 96.8 },
]

const areaChartData = {
  labels: qualityTrendData.map(d => d.week),
  datasets: [
    {
      label: "품질률 (%)",
      data: qualityTrendData.map(d => d.quality),
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

const areaChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    tooltip: { mode: "index", intersect: false },
  },
  scales: {
    x: { grid: { color: "#e2e8f0" } },
    y: { min: 90, max: 100, grid: { color: "#e2e8f0" } },
  },
}
</script>
