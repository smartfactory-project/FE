<template>
  <div class="min-h-screen bg-gradient-to-br from-background to-muted">
    <main class="container mx-auto px-4 py-8">
      <!-- 페이지 제목 -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-foreground mb-2">데이터 분석</h1>
        <p class="text-lg text-muted-foreground">차트와 그래프로 보는 비즈니스 인사이트</p>
      </div>
      <!-- 필터 및 차트 -->
      <div class="space-y-6">
        <!-- 상단 카드형 버튼(press, body, paint) -->
        <div class="flex space-x-4 mb-4">
          <button
            v-for="type in ['press', 'body', 'paint']"
            :key="type"
            :class="['px-6 py-3 rounded-lg font-bold shadow', selectedType === type ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700']"
            @click="selectedType = type"
          >
            {{ type.toUpperCase() }}
          </button>
        </div>
        <ChartsOverview />
        <div v-if="selectedType === 'press'">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductionCharts :selected-type="selectedType" />
            <QualityCharts :selected-type="selectedType" />
          </div>
          <PerformanceCharts :selected-type="selectedType" />
        </div>
        <div v-else-if="selectedType === 'body'">
          <BodyDataView />
        </div>
        <div v-else-if="selectedType === 'paint'">
          <PaintDataView />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue"
import Header from "@/components/header.vue"
import ChartsOverview from "@/components/ChartsOverview.vue"
import ProductionCharts from "@/components/ProductionCharts.vue"
import QualityCharts from "@/components/QualityCharts.vue"
import PerformanceCharts from "@/components/PerformanceCharts.vue"
import BodyDataView from "@/components/BodyDataView.vue"
import PaintDataView from "@/components/PaintDataView.vue"
// import ChartsFilters from "@/components/ChartsFilters.vue" // 제거됨

const selectedType = ref('press')
</script>
