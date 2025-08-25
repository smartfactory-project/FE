<template>
  <div class="space-y-6">
    <!-- 월별 생산량 추이 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">월별 생산량 추이</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="w-full h-64">
          <LineChart
            :chart-data="monthlyChartData"
            :chart-options="chartOptions"
            class="w-full h-full"
          />
        </div>
      </CardContent>
    </Card>

    <!-- 라인별 주간 생산량 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">라인별 주간 생산량</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="w-full h-64">
          <BarChart
            :chart-data="dailyChartData"
            :chart-options="chartOptions"
            class="w-full h-full"
          />
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script>
import { defineComponent, watch, h, ref } from "vue"
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from "chart.js"
import { Line, Bar } from "vue-chartjs"

import Card from "@/components/ui/card/Card.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import CardHeader from "@/components/ui/card/CardHeader.vue"
import CardTitle from "@/components/ui/card/CardTitle.vue"

ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement)

// LineChart 컴포넌트
const LineChart = defineComponent({
  name: "LineChart",
  props: ["chartData", "chartOptions"],
  setup(props) {
    const chartRef = ref(null)
    watch(
      () => props.chartData,
      () => {
        if (chartRef.value) chartRef.value.renderChart(props.chartData, props.chartOptions)
      },
      { deep: true, immediate: true }
    )
    return () => h(Line, { ref: chartRef, chartData: props.chartData, chartOptions: props.chartOptions })
  }
})

// BarChart 컴포넌트
const BarChart = defineComponent({
  name: "BarChart",
  props: ["chartData", "chartOptions"],
  setup(props) {
    const chartRef = ref(null)
    watch(
      () => props.chartData,
      () => {
        if (chartRef.value) chartRef.value.renderChart(props.chartData, props.chartOptions)
      },
      { deep: true, immediate: true }
    )
    return () => h(Bar, { ref: chartRef, chartData: props.chartData, chartOptions: props.chartOptions })
  }
})

export default {
  components: { Card, CardContent, CardHeader, CardTitle, LineChart, BarChart },
  data() {
    const productionTrendData = [
      { month: "1월", production: 18500, target: 20000 },
      { month: "2월", production: 19200, target: 20000 },
      { month: "3월", production: 21300, target: 20000 },
      { month: "4월", production: 20800, target: 20000 },
      { month: "5월", production: 22100, target: 20000 },
      { month: "6월", production: 23400, target: 20000 },
      { month: "7월", production: 24200, target: 20000 },
      { month: "8월", production: 23800, target: 20000 },
      { month: "9월", production: 25100, target: 20000 },
      { month: "10월", production: 24600, target: 20000 },
      { month: "11월", production: 26200, target: 20000 },
      { month: "12월", production: 24847, target: 20000 },
    ]

    const dailyProductionData = [
      { day: "월", lineA: 420, lineB: 380, lineC: 290, lineD: 340, lineE: 280 },
      { day: "화", lineA: 410, lineB: 360, lineC: 310, lineD: 320, lineE: 290 },
      { day: "수", lineA: 450, lineB: 390, lineC: 300, lineD: 350, lineE: 310 },
      { day: "목", lineA: 430, lineB: 370, lineC: 280, lineD: 330, lineE: 300 },
      { day: "금", lineA: 387, lineB: 342, lineC: 0, lineD: 298, lineE: 220 },
    ]

    const monthlyChartData = {
      labels: productionTrendData.map(d => d.month),
      datasets: [
        {
          label: "실제 생산량",
          data: productionTrendData.map(d => d.production),
          borderColor: "#3b82f6",
          backgroundColor: "#3b82f6",
          fill: false,
          pointRadius: 4,
        },
        {
          label: "목표 생산량",
          data: productionTrendData.map(d => d.target),
          borderColor: "#ef4444",
          backgroundColor: "#ef4444",
          borderDash: [5, 5],
          fill: false,
          pointRadius: 3,
        },
      ],
    }

    const dailyChartData = {
      labels: dailyProductionData.map(d => d.day),
      datasets: [
        { label: "라인 A", data: dailyProductionData.map(d => d.lineA), backgroundColor: "#3b82f6" },
        { label: "라인 B", data: dailyProductionData.map(d => d.lineB), backgroundColor: "#10b981" },
        { label: "라인 C", data: dailyProductionData.map(d => d.lineC), backgroundColor: "#f59e0b" },
        { label: "라인 D", data: dailyProductionData.map(d => d.lineD), backgroundColor: "#8b5cf6" },
        { label: "라인 E", data: dailyProductionData.map(d => d.lineE), backgroundColor: "#ef4444" },
      ],
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false, // 부모 div 높이에 맞춤
      plugins: {
        legend: { position: "top" },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        x: { grid: { color: "#e2e8f0" } },
        y: { grid: { color: "#e2e8f0" } },
      },
    }

    return { monthlyChartData, dailyChartData, chartOptions }
  },
}
</script>
