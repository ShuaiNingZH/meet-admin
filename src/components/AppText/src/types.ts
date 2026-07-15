import type { Placement } from 'element-plus';

export interface AppTextProps {
  // 类型
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  // 尺寸大小
  size?: 'large' | 'default' | 'small';
  // 最大行数，多行省略
  lineClamp?: string | number;
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
