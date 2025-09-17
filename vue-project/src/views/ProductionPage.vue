<template>
  <div class="min-h-screen bg-gradient-to-br from-background to-muted">

    <main class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-foreground mb-2">생산 현황</h1>
        <p class="text-lg text-muted-foreground">실시간 생산성 모니터링 및 품질 관리</p>
      </div>

      <div class="space-y-6">
        <ProductionOverview />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
import ProductionOverview from "@/components/ProductionOverview.vue"
import ProductionMetrics from "@/components/ProductionMetrics.vue"
import ProductionLines from "@/components/ProductionLines.vue"
import ProductionAlerts from "@/components/ProductionAlerts.vue"
</script>
