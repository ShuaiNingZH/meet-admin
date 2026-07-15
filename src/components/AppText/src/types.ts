import type { Placement, TextProps } from 'element-plus';

export interface AppTextProps extends Omit<TextProps, 'truncated'> {
  // 显示的内容
  content?: string;
  // 禁用 Tooltip
  tooltipDisabled?: boolean;
  // Tooltip 出现的位置
  placement?: Placement;
  // Tooltip 出现位置的偏移量
  offset?: number;
  // Tooltip 主题，内置了 dark / light 两种
  effect?: 'dark' | 'light';
}
