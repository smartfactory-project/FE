<template>
  <div :class="bodyClass">
    <router-view />
  </div>
</template>

<script setup>
  const bodyClass = `${'antialiased'} ${'font-vars'}`
</script>