<template>
  <div
    data-slot="card"
    :class="['bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', $attrs.class]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup />
