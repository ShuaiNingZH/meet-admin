import type { DrawerProps } from 'element-plus';
import { drawerEmits } from 'element-plus';

export interface AppDrawerProps extends Partial<DrawerProps> {
  confirmText?: string;
  cancelText?: string;
  showFooter?: boolean;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  buttonReverse?: boolean;
  footerPosition?: 'left' | 'center' | 'right' | 'space-between';
  loading?: boolean;
}

export const omitKeys = [
  'confirmText',
  'cancelText',
  'showFooter',
  'showConfirmButton',
  'showCancelButton',
  'buttonReverse',
  'footerPosition',
  'loading',
] satisfies (keyof AppDrawerProps)[];

export const appDrawerEmits = {
  confirm: () => true,
  ...drawerEmits,
};
