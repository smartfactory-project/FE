<template>
  <div class="space-y-6">
    <!-- 월별 생산량 추이 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">월별 생산량 추이</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="w-full h-64">
          <Line :chart-data="monthlyChartData" :chart-options="chartOptions" class="w-full h-full"/>
        </div>
      </CardContent>
    </Card>

    <!-- 라인별 월간 생산량 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">라인별 월간 생산량</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="w-full h-64">
          <Bar :chart-data="dailyChartData" :chart-options="chartOptions" class="w-full h-full"/>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue"
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from "chart.js"
import { Line, Bar } from "vue-chartjs"

import Card from "@/components/ui/card/Card.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import CardHeader from "@/components/ui/card/CardHeader.vue"
import CardTitle from "@/components/ui/card/CardTitle.vue"

import apiClient from "@/components/apiClient.js"

ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement)

export default defineComponent({
  name: "ProductionCharts",
  components: { Card, CardContent, CardHeader, CardTitle, Line, Bar },
  setup() {
    const monthlyChartData = ref({ labels: [], datasets: [] })
    const dailyChartData = ref({ labels: [], datasets: [] })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        x: { grid: { color: "#e2e8f0" } },
        y: { grid: { color: "#e2e8f0" } },
      },
    }

    onMounted(async () => {
      try {
        // 월별 생산량 (실제: Bar, 목표: Line)
        const monthlyRes = await apiClient.get("/production/monthly")
        const monthlyData = Array.isArray(monthlyRes.data) ? monthlyRes.data : []

        monthlyChartData.value = {
          labels: monthlyData.map(d => d.month + "월"),
          datasets: [
            {
              type: 'bar',
              label: "실제 생산량",
              data: monthlyData.map(d => Number(d.production)),
              backgroundColor: "#3b82f6",
              borderRadius: 4,
              order: 2,
            },
            {
              type: 'line',
              label: "목표 생산량",
              data: monthlyData.map(d => Number(d.target)),
              borderColor: "#ef4444",
              borderWidth: 2,
              fill: false,
              borderDash: [5, 5],
              pointRadius: 3,
              order: 1,
            },
          ],
        }

        // 라인별 월간 생산량 (Bar 차트)
        const dailyRes = await apiClient.get("/production/line")
        const dailyData = Array.isArray(dailyRes.data) ? dailyRes.data : []

        dailyChartData.value = {
          labels: dailyData.map(d => d.month+ "월"), // 월 단위
          datasets: [
            { label: "라인 A", data: dailyData.map(d => Number(d.lineA)), backgroundColor: "#3b82f6" },
            { label: "라인 B", data: dailyData.map(d => Number(d.lineB)), backgroundColor: "#10b981" },
            { label: "라인 C", data: dailyData.map(d => Number(d.lineC)), backgroundColor: "#f59e0b" },
            { label: "라인 D", data: dailyData.map(d => Number(d.lineD)), backgroundColor: "#8b5cf6" },
            { label: "라인 E", data: dailyData.map(d => Number(d.lineE)), backgroundColor: "#ef4444" },
          ]
        }

      } catch (err) {
        console.error("API 호출 실패:", err)
      }
    })

    return { monthlyChartData, dailyChartData, chartOptions }
  },
})
</script>
