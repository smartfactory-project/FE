<template>
  <div data-slot="card-content" :class="['px-6', $attrs.class]" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup />
