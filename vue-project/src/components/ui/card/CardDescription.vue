<template>
  <div data-slot="card-description" :class="['text-muted-foreground text-sm', $attrs.class]" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup />
