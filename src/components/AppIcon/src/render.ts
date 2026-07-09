import type { AppIconProps } from './types.ts';
import Icon from './icon.vue';

/**
 * 创建一个用于显示图标的 Vue 组件的函数。
 *
 * @param icon 要显示的图标的名称。
 * @param props 自定义图标组件的可选属性。
 */
export function renderIcon(icon?: string, props?: Omit<AppIconProps, 'icon'>) {
  if (!icon)
    return '';

  return () => h(Icon, { icon, ...props });
}
