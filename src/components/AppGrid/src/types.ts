import type { ComputedRef } from 'vue';

// 定义响应式值类型
export interface ResponsiveValue {
  xl?: number;
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
  [key: string]: number | undefined;
}

// GridProps
export interface GridProps {
  cols?: number | ResponsiveValue;
  rowGap?: number | ResponsiveValue;
  colGap?: number | ResponsiveValue;
  collapsed?: boolean;
  collapsedRows?: number;
}

// GridItemProps
export interface GridItemProps {
  span?: number;
  offset?: number;
  suffix?: boolean;
}

// 网格子项注册信息
export interface GridItemInfo {
  isSuffix: boolean;
  span: number;
  offset: number;
}

// 定义上下文接口
export interface GridContext {
  cols: ComputedRef<number>;
  registerItem: (el: HTMLElement, info: GridItemInfo) => void;
  unregisterItem: (el: HTMLElement) => void;
  hasCollapsible: ComputedRef<boolean>;
  isSingleRow: ComputedRef<boolean>;
  isVisible: (el: HTMLElement) => boolean;
}
