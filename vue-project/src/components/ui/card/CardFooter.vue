<template>
  <div data-slot="card-footer" :class="['flex items-center px-6', $attrs.class]" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup />
