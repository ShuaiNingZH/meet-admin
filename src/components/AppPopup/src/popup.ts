import type { DialogProps } from 'element-plus';
import { dialogEmits } from 'element-plus';

export interface AppPopupProps extends Partial<DialogProps> {
  height?: string | number;
  maxHeight?: string | number;
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
  'height',
  'maxHeight',
  'confirmText',
  'cancelText',
  'showFooter',
  'showConfirmButton',
  'showCancelButton',
  'buttonReverse',
  'footerPosition',
  'loading',
];

export const appPopupEmits = {
  confirm: () => true,
  ...dialogEmits,
};
