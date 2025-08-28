<template>
  <div class="min-h-screen bg-gradient-to-br from-background to-muted">
    <Header />

    <main class="container mx-auto px-4 py-8">
      <PostDetail :post-id="id" :key="id" />

      <!-- <section id="comments" class="mt-8">
        <CommentsSection :post-id="id" :key="`c-${id}`" />
      </section> -->
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Header from '@/components/header.vue'
import PostDetail from '@/components/PostDetail.vue'
import CommentsSection from '@/components/CommentsSection.vue'

const route = useRoute()
const id = computed(() => String(route.params.id ?? '1'))
</script>
