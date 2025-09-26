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

    <!-- 가동률(막대그래프) -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">가동률</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="w-full h-64">
          <Bar :chart-data="operationRateChartData" :chart-options="operationRateChartOptions" class="w-full h-full"/>
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

import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, BarElement } from "chart.js"
import { Doughnut, Line, Bar } from "vue-chartjs"
import { ref, watch } from "vue"
import apiClient from "@/components/apiClient.js"

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, BarElement)

// 컴포넌트
const ChartPie = Doughnut
const ChartLine = Line
const ChartBar = Bar

// selectedType prop
const props = defineProps({
  selectedType: {
    type: String,
    required: true
  }
})

// PRESS 하드코딩 데이터만 사용
const PRESS_QUALITY = {
  working: [85.04, 70.01, 78.82, 75.17, 85.04],
  failed: [1.76, 10.59, 3.96, 1.75, 1.74],
}

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

// Operation Rate Chart reactive
const operationRateChartData = ref({ labels: [], datasets: [] })
const operationRateChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } },
  scales: {
    x: { type: "category", grid: { color: "#e2e8f0" } },
    y: { min: 80, max: 100, grid: { color: "#e2e8f0" } },
  },
}

// selectedType이 변경될 때마다 차트 데이터 갱신
function setQualityCharts(type) {
  if (type === 'press') {
    const { working, failed } = PRESS_QUALITY;
    const qualityRate = working.map((w, i) => ((w/(w+failed[i]))*100).toFixed(2));
    pieChartData.value = {
      labels: ['양품', '불량'],
      datasets: [
        {
          data: [
            (working.reduce((a,b)=>a+b,0)/5).toFixed(2),
            (failed.reduce((a,b)=>a+b,0)/5).toFixed(2)
          ],
          backgroundColor: ['#3b82f6', '#ef4444'],
          borderWidth: 1,
        },
      ],
    };
    areaChartData.value = {
      labels: ['월', '화', '수', '목', '금'],
      datasets: [
        {
          label: '품질률 (%)',
          data: qualityRate,
          fill: true,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.3)',
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#10b981',
          borderWidth: 2,
        },
      ],
    };
    const operationRate = working.map((w, i) => ((w/(w+failed[i]))*100).toFixed(1));
    operationRateChartData.value = {
      labels: ['월', '화', '수', '목', '금'],
      datasets: [
        {
          label: '가동률(%)',
          data: operationRate,
          backgroundColor: '#fbbf24',
          borderWidth: 1,
        },
      ],
    };
  } else {
    // body, paint일 때 빈 차트
    pieChartData.value = { labels: ['양품', '불량'], datasets: [{ data: [0, 0], backgroundColor: ['#3b82f6', '#ef4444'], borderWidth: 1 }] };
    areaChartData.value = { labels: ['월', '화', '수', '목', '금'], datasets: [{ label: '품질률 (%)', data: [0,0,0,0,0], fill: true, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.3)', tension: 0.3, pointRadius: 4, pointBackgroundColor: '#10b981', borderWidth: 2 }] };
    operationRateChartData.value = { labels: ['월', '화', '수', '목', '금'], datasets: [{ label: '가동률(%)', data: [0,0,0,0,0], backgroundColor: '#fbbf24', borderWidth: 1 }] };
  }
}

// selectedType 변경 감지
watch(() => props.selectedType, (type) => {
  setQualityCharts(type);
}, { immediate: true });
</script>
