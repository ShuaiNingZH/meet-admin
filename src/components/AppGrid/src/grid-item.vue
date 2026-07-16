<script setup lang="ts">
import type { Properties } from 'csstype';
import type { GridItemProps } from './types.ts';
import { gridContextKey } from './constants.ts';

defineOptions({ name: 'AppGridItem' });

const props = withDefaults(defineProps<GridItemProps>(), {
  span: 1,
  offset: 0,
  suffix: false,
});

const itemRef = useTemplateRef<HTMLElement>('itemRef');
const context = inject(gridContextKey);
const hasCollapsible = computed(() => context?.hasCollapsible.value ?? false);

// 根据网格的总列数、当前项的跨度、是否是后缀项以及偏移量，计算网格项的样式
function getGridStyles(cols: number) {
  const styles: Partial<Properties> = {};

  // 跨度不能超过总列数，否则会撑出隐式列，导致后续项错位
  const span = Math.min(props.span, cols);

  if (props.suffix && !context?.isSingleRow.value) {
    // 多行时，后缀项靠右对齐
    styles.gridColumn = `${cols - span + 1} / span ${span}`;
  }
  else if (props.offset > 0) {
    // 对于有偏移的元素，设置其起始位置和跨度
    // 起始位置同样需要约束，避免 offset + span 超出总列数撑出隐式列
    const start = Math.min(props.offset + 1, cols - span + 1); // grid起始位置从1开始
    styles.gridColumn = `${start} / span ${span}`;
  }
  else {
    // 没有偏移的普通元素
    styles.gridColumn = `span ${span}`;
  }

  return styles;
}

// 根据可见性设置显示或隐藏
function getVisibilityStyles() {
  if (!props.suffix && !context?.isVisible(itemRef.value!))
    return { display: 'none' };

  return {};
}

// 计算样式
const style = computed<Partial<Properties>>(() => {
  const cols = context?.cols.value;

  // 上下文不存在或当前项实例不存在或总列数不存在
  if (!context || !itemRef.value || !cols)
    return {};

  const visibilityStyles = getVisibilityStyles();

  if (visibilityStyles.display === 'none')
    return visibilityStyles;

  return {
    ...getGridStyles(cols),
    ...visibilityStyles,
  };
});

// 注册和注销项 --- start
// 将 itemRef 一并纳入监听：挂载后 itemRef 由 null 变为元素时触发首次注册，
// 之后 suffix / span / offset 变化时自动同步
watch(
  () => [itemRef.value, props.suffix, props.span, props.offset],
  () => {
    if (itemRef.value && context) {
      context.registerItem(itemRef.value, {
        isSuffix: props.suffix,
        span: props.span,
        offset: props.offset,
      });
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (context && itemRef.value) {
    context.unregisterItem(itemRef.value);
  }
});
// 注册和注销项 --- end
</script>

<template>
  <div ref="itemRef" class="app-grid-item" :style="style">
    <slot :has-collapsible="hasCollapsible" />
  </div>
</template>
