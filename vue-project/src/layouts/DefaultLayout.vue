<script setup>
import Header from '@/components/header.vue'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
    <!-- 헤더는 항상 유지 -->
    <Header />

    <!-- 페이지별 내용은 여기 교체 -->
    <main class="container mx-auto px-12 py-12">
      <router-view />
    </main>
  </div>
</template>
