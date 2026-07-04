import type { DialogProps } from 'element-plus';
import type { Component, VNode } from 'vue';
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
  'fullscreen',
] satisfies (keyof AppPopupProps)[];

export const appPopupEmits = {
  confirm: () => true,
  ...dialogEmits,
};

export interface PopupConfirmContext {
  close: () => void;
}

export interface OpenPopupOptions extends AppPopupProps {
  content: string | Component | VNode;
  onOk?: (context: PopupConfirmContext) => any | Promise<any>;
  onClose?: () => void;
  onClosed?: () => void;
}

export interface PopupItem {
  id: number;
  content: OpenPopupOptions['content'];
  props: Omit<OpenPopupOptions, 'content' | 'onOk' | 'onClosed'>;
  onOk?: OpenPopupOptions['onOk'];
  onClosed?: OpenPopupOptions['onClosed'];
  visible: boolean;
  loading: boolean;
}

let uid = 0;

// 当前存活的弹窗实例队列,由 AppPopupHost 渲染
export const popupItems = reactive<PopupItem[]>([]);

export function openPopup(options: OpenPopupOptions) {
  const { content, onOk, onClosed, ...props } = options;

  const item = shallowReactive<PopupItem>({
    id: ++uid,
    content,
    props,
    onOk,
    onClosed,
    visible: true,
    loading: false,
  });

  popupItems.push(item);

  return {
    close: () => {
      item.visible = false;
    },
  };
}
