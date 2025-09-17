<script setup>
import DashboardGrid from '@/components/dashboard-grid.vue'
import Announcements from '@/components/announcements.vue'
</script>

<template>
  <div>
    <div class="mb-12 text-center">
      <h1 class="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
        SAMJO 대시보드
      </h1>
      <p class="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
        생산성과 협업을 위한 통합 관리 시스템
      </p>
    </div>

    <Announcements />
    <DashboardGrid />
  </div>
</template>
