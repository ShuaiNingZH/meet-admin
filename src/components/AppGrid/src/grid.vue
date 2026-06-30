<script setup lang="ts">
import type { GridItemInfo, GridProps, ResponsiveValue } from './types.ts';
import { gridContextKey } from './constants.ts';

defineOptions({ name: 'AppGrid' });

// 定义组件属性
const {
  cols: propCols = 24,
  rowGap: propRowGap = 0,
  colGap: propColGap = 0,
  collapsed = false,
  collapsedRows = 1,
} = defineProps<GridProps>();

// 监听窗口大小变化
const { width } = useWindowSize();

// 响应式断点判断与 Element Plus 保持一致
const breakpoints: AnyObj = {
  xl: 1920,
  lg: 1200,
  md: 992,
  sm: 768,
};

// 当前激活的断点
const activeBreakpoint = computed(() => {
  // 遍历断点配置对象
  for (const key in breakpoints) {
    // 如果当前窗口宽度 >= 当前断点的最小宽度，返回当前断点名称
    if (width.value >= breakpoints[key])
      return key;
  }
  // 如果所有断点都不匹配，则返回默认的 'xs' 断点
  return 'xs';
});

// 响应式值处理
function resolveResponsiveValue(value: number | ResponsiveValue, defaultValue: number): number {
  // 如果 value 是数字，直接返回
  if (typeof value === 'number')
    return value;

  // 如果 value 是对象，按优先级获取值
  if (typeof value === 'object') {
    // 定义断点优先级顺序
    const breakpointPriority = ['xl', 'lg', 'md', 'sm', 'xs'];
    // 获取当前断点的索引
    const currentBreakpointIndex = breakpointPriority.indexOf(activeBreakpoint.value);

    // 从当前断点开始，依次查找有效值（用 != null 判断，避免跳过值为 0 的断点）
    for (let i = currentBreakpointIndex; i >= 0; i--) {
      const breakpoint = breakpointPriority[i];
      const breakpointValue = breakpoint ? value[breakpoint] : undefined;
      if (breakpointValue != null)
        return breakpointValue;
    }
  }

  // 如果未找到有效值，返回默认值
  return defaultValue;
}

// 计算当前响应式值
const cols = computed(() => resolveResponsiveValue(propCols, 24));
const rowGap = computed(() => resolveResponsiveValue(propRowGap, 0));
const colGap = computed(() => resolveResponsiveValue(propColGap, 0));

// 样式计算
const style = computed(() => ({
  gap: `${rowGap.value}px ${colGap.value}px`,
  gridTemplateColumns: `repeat(${cols.value}, minmax(0px, 1fr))`,
}));

// 管理子项数据：记录每个子项的注册信息（Map 保持注册顺序）
const items = ref<Map<HTMLElement, GridItemInfo>>(new Map());

// 注册 / 更新子项（span、offset 变化时重复调用即可更新）
function registerItem(el: HTMLElement, info: GridItemInfo) {
  items.value.set(el, info);
}

// 注销子项
function unregisterItem(el: HTMLElement) {
  items.value.delete(el);
}

// 计算子项实际占据的列数：普通项的 offset 视为占用前置列，后缀项不应用 offset；
// 超出总列数的部分按占满一整行计算，避免撑出隐式列
function itemCols(item: GridItemInfo) {
  const raw = item.isSuffix ? item.span : item.offset + item.span;
  return Math.min(raw, cols.value);
}

// 普通项数量
const normalCount = computed(() => {
  let count = 0;
  for (const item of items.value.values()) {
    if (!item.isSuffix)
      count++;
  }
  return count;
});

// 普通项占据的总列数
const normalSpan = computed(() => {
  let span = 0;
  for (const item of items.value.values()) {
    if (!item.isSuffix)
      span += itemCols(item);
  }
  return span;
});

// 后缀项占据的总列数
const suffixSpan = computed(() => {
  let span = 0;
  for (const item of items.value.values()) {
    if (item.isSuffix)
      span += itemCols(item);
  }
  return span;
});

// 判断是否有可折叠内容
const hasCollapsible = computed(() => {
  // 只有一个普通项时无需折叠
  if (normalCount.value <= 1)
    return false;

  // 折叠区域能容纳的最大列数
  const maxVisibleCols = cols.value * collapsedRows;

  // 普通项 + 后缀项的总列数超过折叠区域时，才需要折叠
  return normalSpan.value + suffixSpan.value > maxVisibleCols;
});

// 是否所有子项（含后缀项）都能容纳在一行内
const isSingleRow = computed(() => normalSpan.value + suffixSpan.value <= cols.value);

// 可查看子项合集
const visibleSet = computed(() => {
  // 未折叠时全部可见
  if (!collapsed)
    return new Set(items.value.keys());

  // 普通项列表（按真实 DOM 顺序排序，避免动态增删/重排导致注册顺序与渲染顺序不一致）
  const normalList = [...items.value]
    .filter(([, item]) => !item.isSuffix)
    .map(([el]) => el)
    .sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );

  // 特殊处理：在 xs 断点且 cols = 1 时，按行展示前 collapsedRows 个普通项
  if (activeBreakpoint.value === 'xs' && cols.value === 1)
    return new Set(normalList.slice(0, collapsedRows));

  // 折叠区域留给普通项的列预算（总列数预留出后缀项的位置）
  const budget = collapsedRows * cols.value - suffixSpan.value;

  // 按 DOM 顺序累加普通项的列数（含 offset），直到放不下为止
  const visible = new Set<HTMLElement>();
  let used = 0;
  for (const el of normalList) {
    const span = itemCols(items.value.get(el)!);
    if (used + span > budget)
      break;
    visible.add(el);
    used += span;
  }
  return visible;
});

// 提供上下文供子组件使用
provide(gridContextKey, {
  cols,
  registerItem,
  unregisterItem,
  hasCollapsible,
  isSingleRow,
  isVisible: (el: HTMLElement) => visibleSet.value.has(el),
});
</script>

<template>
  <div class="app-grid" :style="style">
    <slot />
  </div>
</template>

<style scoped>
.app-grid {
  display: grid;
}
</style>
