<template>
  <div class="min-h-screen bg-gradient-to-br from-background to-muted">
    <Header />
    <main class="container mx-auto px-4 py-8">
      <!-- 페이지 제목 -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-foreground mb-2">데이터 분석</h1>
        <p class="text-lg text-muted-foreground">차트와 그래프로 보는 비즈니스 인사이트</p>
      </div>

      <!-- 필터 및 차트 -->
      <div class="space-y-6">
        <ChartsFilters />
        <ChartsOverview />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductionCharts />
          <QualityCharts />
        </div>

        <PerformanceCharts />
      </div>
    </main>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue"
import ChartsOverview from "@/components/ChartsOverview.vue"
import ProductionCharts from "@/components/ProductionCharts.vue"
import QualityCharts from "@/components/QualityCharts.vue"
import PerformanceCharts from "@/components/PerformanceCharts.vue"
import ChartsFilters from "@/components/ChartsFilters.vue"
</script>
