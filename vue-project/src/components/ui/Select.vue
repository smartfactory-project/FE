<template>
  <div class="relative inline-block">
    <select
      data-slot="select"
      :class="[
        'border-input text-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex items-center rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9',
        $attrs.class
      ]"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
    >
      <slot />
    </select>
  </div>
</template>

<script setup>
defineProps({ modelValue: { type: [String, Number], default: '' } })
defineEmits(['update:modelValue'])
</script>
