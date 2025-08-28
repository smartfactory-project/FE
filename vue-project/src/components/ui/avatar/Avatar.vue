<template>
  <div
    data-slot="avatar"
    :class="['relative flex size-8 shrink-0 overflow-hidden rounded-full bg-sky-100 ring-1 ring-sky-200/60',
    'dark:bg-sky-200/70 dark:ring-sky-300/50',
     $attrs.class]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup>
// 단순 래퍼: 슬롯으로 이미지/폴백을 넣어 사용
</script>
