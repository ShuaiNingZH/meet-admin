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

// 定义上下文接口
export interface GridContext {
  cols: ComputedRef<number>;
  registerItem: (el: HTMLElement, isSuffix: boolean) => void;
  unregisterItem: (el: HTMLElement) => void;
  hasCollapsible: ComputedRef<boolean>;
  isVisible: (el: HTMLElement) => boolean;
}
