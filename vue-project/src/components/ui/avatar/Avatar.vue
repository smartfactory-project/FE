<template>
  <div
    data-slot="avatar"
    :class="['relative flex size-8 shrink-0 overflow-hidden rounded-full', $attrs.class]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup>
// 단순 래퍼: 슬롯으로 이미지/폴백을 넣어 사용
</script>
