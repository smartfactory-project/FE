<template>
  <div data-slot="card-action" :class="['self-start justify-self-end', $attrs.class]" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup />
