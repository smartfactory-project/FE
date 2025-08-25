<template>
  <img
    data-slot="avatar-image"
    :class="['aspect-square size-full', $attrs.class]"
    v-bind="$attrs"
  />
</template>

<script setup>
// props로 src/alt 전달 가능: <AvatarImage src="..." alt="..." />
</script>
