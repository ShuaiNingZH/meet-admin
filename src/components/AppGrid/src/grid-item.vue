<script setup lang="ts">
import type { Properties } from 'csstype';
import type { GridItemProps } from './types.ts';
import { gridCollapsibleKey, gridContextKey } from './constants.ts';

defineOptions({ name: 'AppGridItem' });

const props = withDefaults(defineProps<GridItemProps>(), {
  span: 1,
  offset: 0,
  suffix: false,
});

const itemRef = useTemplateRef<HTMLElement>('itemRef');
const context = inject(gridContextKey);
const hasCollapsible = inject(gridCollapsibleKey);

// 根据网格的总列数、当前项的跨度、是否是后缀项以及偏移量，计算网格项的样式
function getGridStyles(cols: number) {
  const styles: Partial<Properties> = {};

  if (props.suffix) {
    // 对于后缀项，始终靠右对齐
    styles.gridColumn = `${cols - props.span + 1} / span ${props.span}`;
  }
  else if (props.offset > 0) {
    // 对于有偏移的元素，设置其起始位置和跨度
    const start = props.offset + 1; // grid起始位置从1开始
    styles.gridColumn = `${start} / span ${props.span}`;
  }
  else {
    // 没有偏移的普通元素
    styles.gridColumn = `span ${props.span}`;
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
onMounted(() => {
  if (itemRef.value && context) {
    context.registerItem(itemRef.value, props.suffix);
  }
});

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
