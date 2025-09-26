<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- 종합 성과 지표 -->
    <!-- 종합 성과 지표 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border lg:col-span-2">
      <CardHeader>
        <CardTitle class="text-xl text-foreground">종합 성과 지표</CardTitle>
      </CardHeader>
      <CardContent class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 rounded-lg bg-background/50">
            <div class="text-3xl font-bold text-blue-600 mb-2">87.5%</div>
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
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, RadialLinearScale } from "chart.js"
import { Line, Radar } from "vue-chartjs"
import Card from "@/components/ui/card/Card.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import CardHeader from "@/components/ui/card/CardHeader.vue"
import CardTitle from "@/components/ui/card/CardTitle.vue"
import apiClient from "@/components/apiClient.js"

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, RadialLinearScale)

// selectedType prop
defineProps({
  selectedType: {
    type: String,
    required: true
  }
})

// 타입별 종합 성과 지표 하드코딩 데이터
const PERFORMANCE_DATA = {
  press: { efficiency: 87.5, quality: 96.8, operation: 87.5, efficiencyChange: '+2.1% ↑', qualityChange: '+0.5% ↑', operationChange: '-1.2% ↓' },
  body: { efficiency: 82.3, quality: 94.2, operation: 85.1, efficiencyChange: '+1.5% ↑', qualityChange: '+0.3% ↑', operationChange: '-0.8% ↓' },
  paint: { efficiency: 78.9, quality: 92.7, operation: 83.4, efficiencyChange: '+1.0% ↑', qualityChange: '+0.2% ↑', operationChange: '-0.5% ↓' },
}

const summary = computed(() => PERFORMANCE_DATA[selectedType] || PERFORMANCE_DATA.press)
</script>
