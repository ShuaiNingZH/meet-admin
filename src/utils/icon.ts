import type { IconProps } from 'element-plus';
import AppIcon from '@/components/AppIcon';

/**
 * 创建一个用于显示图标的 Vue 组件的函数。
 *
 * @param icon 要显示的图标的名称。
 * @param props 自定义图标组件的可选属性。
 */
export function renderIcon(icon: any, props?: IconProps): any {
  if (!icon)
    return '';

  return () => h(AppIcon, { icon, ...props });
}
