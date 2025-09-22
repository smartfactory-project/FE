<template>
  <div class="min-h-screen bg-gradient-to-br from-background to-muted">
    <main class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-foreground mb-2">일정 관리</h1>
        <p class="text-lg text-muted-foreground">팀 일정과 프로젝트를 효율적으로 관리하세요</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3 space-y-6">
          <!-- <ScheduleFilters /> -->
          <!-- <ScheduleCalendar /> -->
          <ScheduleFilters @go-today="calRef?.goToday && calRef.goToday()" />
          <ScheduleCalendar ref="calRef" />
        </div>
        <div class="lg:col-span-1">
          <ScheduleSidebar />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/header.vue'
import ScheduleCalendar from '@/components/ScheduleCalendar.vue'
import ScheduleSidebar from '@/components/ScheduleSidebar.vue'
import ScheduleFilters from '@/components/ScheduleFilters.vue'
const calRef = ref(null)
</script>
