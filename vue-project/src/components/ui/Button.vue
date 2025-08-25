<template>
  <component
    :is="asChild ? 'button' : 'button'"
    data-slot="button"
    :class="[
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none',
      sizeClass,
      variantClass,
      $attrs.class
    ]"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'default' }, // default | destructive | outline | secondary | ghost | link
  size: { type: String, default: 'default' },    // default | sm | lg | icon
  asChild: { type: Boolean, default: false },
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-8 rounded-md gap-1.5 px-3'
    case 'lg': return 'h-10 rounded-md px-6'
    case 'icon': return 'size-9'
    default: return 'h-9 px-4 py-2'
  }
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'destructive': return 'bg-destructive text-white shadow-xs hover:bg-destructive/90'
    case 'outline': return 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground'
    case 'secondary': return 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80'
    case 'ghost': return 'hover:bg-accent hover:text-accent-foreground'
    case 'link': return 'text-primary underline-offset-4 hover:underline'
    default: return 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'
  }
})
</script>
