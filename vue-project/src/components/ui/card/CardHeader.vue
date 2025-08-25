<template>
  <div
    data-slot="card-header"
    :class="['grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6', $attrs.class]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup />
