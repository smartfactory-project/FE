<template>
  <div class="min-h-screen bg-gray-50">
    <main class="container mx-auto px-4 py-8">
      <!-- 상단 DB툴 스타일 영역 -->
      <div class="mb-8">
  <div class="border border-gray-300 bg-white p-3 flex flex-col gap-2 shadow-sm" style="max-width:480px; font-family:'Spoqa Han Sans Neo', 'sans-serif';">
          <div class="flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm0 0V2a2 2 0 012-2h12a2 2 0 012 2v2" /></svg>
            <span class="text-2xl font-bold text-gray-800">생산 현황</span>
          </div>
          <div class="flex items-center text-base text-gray-700 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2l4-4" /></svg>
            실시간 생산성 모니터링 및 품질 관리
          </div>
          <!-- 업로드 툴바 영역 -->
          <div class="border border-gray-200 bg-gray-100 p-2 flex items-center gap-2" style="max-width:400px;">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
            <ReportUpload />
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <ProductionOverview />
        <div class="grid">
          <div class="lg:col-span-2">
            <ProductionLines />
          </div>
          <div class="lg:col-span-1">
            <ProductionAlerts />
          </div>
        </div>
        <ProductionMetrics />
      </div>
    </main>
  </div>
</template>

<script setup>
import ReportUpload from '@/components/ReportUpload.vue'
import ProductionOverview from "@/components/ProductionOverview.vue"
import ProductionMetrics from "@/components/ProductionMetrics.vue"
import ProductionLines from "@/components/ProductionLines.vue"
</script>
