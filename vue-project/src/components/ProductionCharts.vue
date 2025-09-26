<template>
  <div class="space-y-6">
    <!-- 상단 카드형 버튼은 ChartsOverview 카드 위로 이동됨 -->
    <!-- 주간별 생산량 추이 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">주간별 생산량 추이</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="w-full h-64">
          <Line :chart-data="weeklyChartData" :chart-options="chartOptions" class="w-full h-full"/>
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
          <Bar :chart-data="lineWeeklyChartData" :chart-options="chartOptions" class="w-full h-full"/>
        </div>
      </CardContent>
    </Card>

    
      <!-- 목표 달성율(선그래프) -->
      <Card class="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle class="text-xl text-foreground">목표 달성율 (350대 기준)</CardTitle>
        </CardHeader>
        <CardContent class="p-4">
          <div class="w-full h-64">
            <Line :chart-data="goalAchievementChartData" :chart-options="chartOptions" class="w-full h-full"/>
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
  props: {
    selectedType: {
      type: String,
      required: true
    }
  },
  setup(props) {
    // 가동률 차트 데이터
    const operationRateChartData = ref({
      labels: ['월', '화', '수', '목', '금'],
      datasets: [
        {
          label: '가동률(%)',
          data: [],
          backgroundColor: '#fbbf24',
        }
      ]
    });
    // Chart.js 옵션 선언
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
    };

    // PRESS 하드코딩 데이터 (한 번만 선언)
    const PRESS_WEEKLY_PRODUCTION = [298.13, 197.00, 273.92, 298.93, 301.60];
    const PRESS_WORKING = [85.04, 70.01, 78.82, 75.17, 85.04];
    const PRESS_FAILED = [1.76, 10.59, 3.96, 1.75, 1.74];
    const PRESS_QUALITY_DISTRIBUTION = {
      labels: ['양품', '불량'],
      data: [
        (PRESS_WORKING.reduce((a,b)=>a+b,0)/5).toFixed(2),
        (PRESS_FAILED.reduce((a,b)=>a+b,0)/5).toFixed(2)
      ]
    };
    const PRESS_QUALITY_RATE = PRESS_WORKING.map((w, i) => ((w/(w+PRESS_FAILED[i]))*100).toFixed(2));
    const PRESS_EFFICIENCY_VS_PRODUCTION = {
      production: PRESS_WEEKLY_PRODUCTION,
      efficiency: PRESS_WORKING
    };
    const PRESS_LINE_WEEKLY = [298.13, 197.00, 273.92, 298.93, 301.60];
    const PRESS_SUMMARY = {
      efficiency: (PRESS_WORKING.reduce((a,b)=>a+b,0)/5).toFixed(1),
      quality: (PRESS_QUALITY_RATE.reduce((a,b)=>parseFloat(a)+parseFloat(b),0)/5).toFixed(1),
      operation: '87.5',
      activity: '93.3'
    };

    const weeklyChartData = ref({ labels: ['월', '화', '수', '목', '금'], datasets: [
      {
        label: '주간별 생산량',
        data: [],
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        fill: false,
        tension: 0.2,
      }
    ] });

    // 라인별 주간 생산량 차트 데이터
    const lineWeeklyChartData = ref({
      labels: ['press1', 'press2', 'press3', 'press4', 'press5'],
      datasets: [
        {
          label: '라인별 생산량',
          data: [],
          backgroundColor: '#38bdf8',
        }
      ]
    });

    // 품질 분포 차트 데이터
    const qualityPieChartData = ref({
      labels: PRESS_QUALITY_DISTRIBUTION.labels,
      datasets: [{
        data: [],
        backgroundColor: ['#3b82f6', '#ef4444']
      }]
    });

    // 품질률 추이 차트 데이터
    const qualityRateChartData = ref({
      labels: ['월', '화', '수', '목', '금'],
      datasets: [{
        label: '품질률(%)',
        data: [],
        backgroundColor: '#10b981',
        borderColor: '#10b981',
        fill: false,
        tension: 0.2,
      }]
    });


    // 목표 달성율 차트 데이터
    const goalAchievementChartData = ref({
      labels: ['월', '화', '수', '목', '금'],
      datasets: [
        {
          label: '목표 달성율(%)',
          data: [],
          borderColor: '#34d399',
          backgroundColor: '#34d39922',
          fill: false,
          tension: 0.2,
        }
      ]
    });

    // 카드형 버튼 클릭 이벤트 (하드코딩)
    function selectType(type) {
      selectedType.value = type;
      if (type === 'press') {
        weeklyChartData.value.datasets[0].label = 'PRESS 주간 생산량';
        weeklyChartData.value.datasets[0].data = PRESS_WEEKLY_PRODUCTION;
        lineWeeklyChartData.value.datasets[0].data = PRESS_LINE_WEEKLY;
        qualityPieChartData.value.datasets[0].data = PRESS_QUALITY_DISTRIBUTION.data;
        qualityRateChartData.value.datasets[0].data = PRESS_QUALITY_RATE;
        goalAchievementChartData.value.datasets[0].data = PRESS_WEEKLY_PRODUCTION.map(v => ((v/350)*100).toFixed(1));
        operationRateChartData.value.datasets[0].data = PRESS_WORKING.map((w, i) => ((w/(w+PRESS_FAILED[i]))*100).toFixed(1));
      } else {
        weeklyChartData.value.datasets[0].label = `${type.toUpperCase()} 주간 생산량`;
        weeklyChartData.value.datasets[0].data = [];
        lineWeeklyChartData.value.datasets[0].data = [];
        qualityPieChartData.value.datasets[0].data = [];
        qualityRateChartData.value.datasets[0].data = [];
        goalAchievementChartData.value.datasets[0].data = [];
        operationRateChartData.value.datasets[0].data = [];
      }
    }


    // 최초 mount 시 body1 데이터 로딩
    // 최초 마운트 시 PRESS 하드코딩 데이터로 차트 초기화
    onMounted(() => {
      // PRESS 하드코딩 데이터로 모든 차트 초기화
      weeklyChartData.value.datasets[0].label = 'PRESS 주간 생산량';
      weeklyChartData.value.datasets[0].data = PRESS_WEEKLY_PRODUCTION;
      lineWeeklyChartData.value.datasets[0].label = 'PRESS 라인별 생산량';
      lineWeeklyChartData.value.datasets[0].data = PRESS_LINE_WEEKLY;
      goalAchievementChartData.value.datasets[0].label = 'PRESS 목표 달성율(%)';
      goalAchievementChartData.value.datasets[0].data = PRESS_WEEKLY_PRODUCTION.map(v => ((v/350)*100).toFixed(1));
    });

    return {
      weeklyChartData,
      chartOptions,
      lineWeeklyChartData,
      qualityPieChartData,
      qualityRateChartData,
      goalAchievementChartData,
      operationRateChartData,
    };
  }
});
</script>
