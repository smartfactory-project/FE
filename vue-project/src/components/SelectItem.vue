<template>
  <li
    class="relative cursor-pointer select-none px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
    @click="selectItem"
  >
    <span><slot /></span>
    <svg v-if="isSelected" class="w-4 h-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
  </li>
</template>

<script setup>
import { inject, computed } from "vue"

const props = defineProps({
  value: [String, Number]
})

const emit = defineEmits(["select"])
const modelValue = inject("vModelValue", null)

const isSelected = computed(() => modelValue && modelValue.value === props.value)

function selectItem() {
  emit("select", props.value)
}
</script>
