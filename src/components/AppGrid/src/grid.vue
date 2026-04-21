<script setup lang="ts">
import type { GridProps, ResponsiveValue } from './types.ts';
import { gridCollapsibleKey, gridContextKey } from './constants.ts';

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

    // 从当前断点开始，依次查找有效值
    for (let i = currentBreakpointIndex; i >= 0; i--) {
      const breakpoint = breakpointPriority[i];
      if (breakpoint && value[breakpoint])
        return value[breakpoint];
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

// 管理子项数据
const itemsRef = ref<Set<HTMLElement>>(new Set());
// 非后缀子项
const normalItems = ref<Set<HTMLElement>>(new Set());
// 后缀子项
const suffixItems = ref<Set<HTMLElement>>(new Set());

// 注册项方法
function registerItem(el: HTMLElement, isSuffix: boolean) {
  // 如果元素已经注册，直接返回
  if (itemsRef.value.has(el))
    return;

  // 注册元素到总列表
  itemsRef.value.add(el);

  // 后缀子项
  if (isSuffix) {
    suffixItems.value.add(el);
  }
  else {
    normalItems.value.add(el);
  }
}

// 注销项方法
function unregisterItem(el: HTMLElement) {
  // 如果元素未注册，直接返回
  if (!itemsRef.value.has(el))
    return;

  // 从总列表中移除元素
  itemsRef.value.delete(el);

  // 从 suffixItems 中移除元素
  if (suffixItems.value.has(el)) {
    suffixItems.value.delete(el);
  }
  // 从 normalItems 中移除元素
  if (normalItems.value.has(el)) {
    normalItems.value.delete(el);
  }
}

// 判断是否有可折叠内容
const hasCollapsible = computed(() => {
  // 计算折叠时能显示的最大项数
  const maxVisibleItems = cols.value * collapsedRows;

  // 如果非后缀子项数量太少（只有一个），则不启用折叠功能
  if (normalItems.value.size <= 1)
    return false;

  // 如果非后缀子项超过了最大可见项数，直接返回true
  if (normalItems.value.size > maxVisibleItems)
    return true;

  // 如果非后缀子项刚好等于最大可见项数，且有后缀子项存在，也应该启用折叠功能
  if (normalItems.value.size === maxVisibleItems && suffixItems.value.size > 0)
    return true;

  // 其他情况不需要折叠功能
  return false;
});

// 可查看子项合集
const visibleSet = computed(() => {
  if (!collapsed)
    return itemsRef.value;

  // 特殊处理：在 xs 断点且 cols = 1 时
  if (activeBreakpoint.value === 'xs' && cols.value === 1) {
    const visibleItems = new Set<HTMLElement>();

    const normalList = Array.from(normalItems.value);
    // 添加第一个子项（如果存在）
    if (normalList.length > 0 && normalList[0]) {
      visibleItems.add(normalList[0]);
    }

    // 如果折叠行数大于1，则显示更多子项
    if (collapsedRows > 1) {
      const remainingItems = normalList.slice(1, collapsedRows);
      remainingItems.forEach(item => visibleItems.add(item));
    }

    return visibleItems;
  }

  // 计算折叠时能显示的最大项数（最大显示行 * 总列数 - 后缀项）
  const maxItems = collapsedRows * cols.value - suffixItems.value.size;
  return maxItems > 0 ? new Set(Array.from(itemsRef.value).slice(0, maxItems)) : new Set();
});

// 提供上下文供子组件使用
provide(gridContextKey, {
  cols,
  registerItem,
  unregisterItem,
  hasCollapsible,
  isVisible: (el: HTMLElement) => visibleSet.value.has(el),
});

provide(gridCollapsibleKey, hasCollapsible);
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
