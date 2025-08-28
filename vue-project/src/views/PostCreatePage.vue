<template>
  <div class="min-h-screen bg-gradient-to-br from-background to-muted">
    <Header />
    <main class="container mx-auto px-4 py-8">
      <PostCreateForm />
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/header.vue'
import PostCreateForm from '@/components/PostCreateForm.vue'
</script>
