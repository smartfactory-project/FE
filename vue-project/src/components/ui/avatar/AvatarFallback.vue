<template>
  <div
    data-slot="avatar-fallback"
    :class="['bg-muted flex size-full items-center justify-center rounded-full bg-white text-foreground', $attrs.class]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup />
