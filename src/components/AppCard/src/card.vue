<script setup lang="ts">
import type { AppCardProps } from './type.ts';

defineOptions({ name: 'AppCard' });

const props = withDefaults(defineProps<AppCardProps>(), {
  shadow: 'always',
});

const classes = computed(() => {
  return {
    'is-always-shadow': props.shadow === 'always',
    'is-hover-shadow': props.shadow === 'hover',
    'is-never-shadow': props.shadow === 'never',
  };
});
</script>

<template>
  <div class="app-card el-card p-16" :class="classes">
    <slot />
  </div>
</template>
