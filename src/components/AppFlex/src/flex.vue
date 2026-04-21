<script setup lang="ts">
import type { AppFlexMargin, AppFlexProps, FlexDirection, FlexWrap } from './types.ts';

defineOptions({ name: 'AppFlex' });

const props = withDefaults(defineProps<AppFlexProps>(), {
  justify: 'start',
  size: () => [8, 12],
  wrap: false,
});

const margin = computed<AppFlexMargin>(() => {
  if (Array.isArray(props.size)) {
    return {
      horizontal: props.size[0],
      vertical: props.size[1],
    };
  }
  return {
    horizontal: props.size,
    vertical: props.size,
  };
});

const flexDirection = computed<FlexDirection>(() => {
  if (props.vertical && !props.reverse)
    return 'column';
  if (props.vertical && props.reverse)
    return 'column-reverse';
  if (!props.vertical && props.reverse)
    return 'row-reverse';
  return 'row';
});

const flexWrap = computed<FlexWrap>(() => (!props.wrap || props.vertical ? 'nowrap' : 'wrap'));

const style = computed(() => ({
  display: props.inline ? 'inline-flex' : 'flex',
  flexDirection: flexDirection.value,
  justifyContent: props.justify,
  flexWrap: flexWrap.value,
  alignItems: props.align,
  gap: `${margin.value.horizontal}px ${margin.value.vertical}px`,
}));
</script>

<template>
  <div class="app-flex" :style="style">
    <slot />
  </div>
</template>
