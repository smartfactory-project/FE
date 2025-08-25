<template>
  <label
    data-slot="label"
    :class="[
      'flex items-center gap-2 text-sm leading-none font-medium select-none',
      $attrs.class
    ]"
    v-bind="$attrs"
  >
    <slot />
  </label>
</template>

<script setup />
