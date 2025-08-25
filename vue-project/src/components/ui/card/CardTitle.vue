<template>
  <div data-slot="card-title" :class="['leading-none font-semibold', $attrs.class]" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup />
