<template>
  <component
    :is="asChild ? 'span' : 'span'"
    data-slot="badge"
    :class="['inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow] overflow-hidden',
             variantClass, $attrs.class]"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'default' },
  asChild: { type: Boolean, default: false },
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90'
    case 'destructive':
      return 'border-transparent bg-destructive text-white hover:bg-destructive/90'
    case 'outline':
      return 'text-foreground hover:bg-accent hover:text-accent-foreground'
    default:
      return 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90'
  }
})
</script>
