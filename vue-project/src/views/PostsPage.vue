<template>
  <div class="min-h-screen bg-gradient-to-br from-background to-muted">
    <Header />

    <main class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-foreground mb-2">게시판</h1>
        <p class="text-lg text-muted-foreground">추천 시스템으로 맞춤형 콘텐츠를 발견하세요</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3 space-y-6">
          <PostFilters
            :modelValue="filters"
            :sort="sort"
            @update:modelValue="filters = $event"
            @update:sort="sort = $event"
          />
          <PostsList :filters="filters" :sort="sort" />
        </div>

        <div class="lg:col-span-1">
          <RecommendationSidebar />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/header.vue'
import PostFilters from '@/components/PostFilters.vue'
import PostsList from '@/components/PostsList.vue'
import RecommendationSidebar from '@/components/RecommendationSidebar.vue' // 아래에 스텁 제공

const filters = ref({ query: '', category: 'all' })
const sort = ref('latest')
</script>
