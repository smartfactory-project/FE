<template>
  <!-- 상자 + 오른쪽 화살표까지 Select 내부에서 처리 -->
  <div
    :class="[
      'relative inline-flex items-center justify-between gap-2 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none',
      size === 'sm' ? 'h-8' : 'h-9',
      block ? 'w-full' : 'w-fit',
      'px-3 pr-8 text-sm border-input',
      $attrs.class
    ]"
  >
    <!-- 진짜 <select>는 투명 오버레이 -->
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="absolute inset-0 w-full h-full appearance-none bg-transparent outline-none ring-0 border-0 px-3 pr-8 truncate"
      v-bind="$attrs"
    >
      <slot />
    </select>

    <!-- 오른쪽 화살표 아이콘 -->
    <ChevronDown class="pointer-events-none absolute right-2 size-4 opacity-50" />
  </div>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  size: { type: String, default: 'default' }, // 'default' | 'sm'
  block: { type: Boolean, default: false },   // true면 w-full
})
defineEmits(['update:modelValue'])
</script>
