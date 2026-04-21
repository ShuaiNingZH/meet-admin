<script setup lang="ts">
import type { Properties } from 'csstype';
import type { AppHelpInfoProps } from './types.ts';
import { omit } from 'lodash-es';

defineOptions({ name: 'AppHelpInfo' });

const props = withDefaults(defineProps<AppHelpInfoProps>(), {
  placement: 'top',
  color: 'var(--el-color-primary)',
  trigger: 'hover',
  effect: 'dark',
});

const style = computed<Partial<Properties>>(() => {
  const styleObj: Partial<Properties> = {};

  // 如果设置了 left 或 right 则添加 margin-left
  if (props.left) {
    styleObj.marginLeft = props.left;
  }
  else if (!props.right) {
    styleObj.marginLeft = '3px';
  }

  // 如果设置了 right 则添加 margin-right
  if (props.right) {
    styleObj.marginRight = props.right;
  }

  return styleObj;
});

const tooltipProps = computed(() => {
  return omit(props, ['color', 'left', 'right']);
});
</script>

<template>
  <el-tooltip v-bind="tooltipProps">
    <template #content>
      <slot />
    </template>
    <app-icon class="cursor-help vertical-mid" :style icon="icon-park-outline:help" :color />
  </el-tooltip>
</template>

<style scoped>
.cursor-help {
  cursor: help;
}
</style>
