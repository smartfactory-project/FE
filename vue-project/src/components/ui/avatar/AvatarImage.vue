<template>
  <img
    data-slot="avatar-image"
    :class="['aspect-square size-full object-cover object-center rounded-full', $attrs.class]"
    error="e => (e.target.style.display = 'none')"
    v-bind="$attrs"
  />
</template>

<script setup>
// props로 src/alt 전달 가능: <AvatarImage src="..." alt="..." />
</script>
