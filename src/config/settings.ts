import type { LocaleType } from '@/constants/locale.ts';
import { cloneDeep } from 'lodash-es';

export interface ThemeColor {
  primary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  [key: string]: string;
}

export type ThemeColorKey = keyof ThemeColor;

// 默认主题颜色
export const defaultThemeColor: ThemeColor = {
  primary: '#4A90E2',
  success: '#67C231',
  warning: '#E6A23C',
  danger: '#F56C6C',
  info: '#909399',
};

// 主题颜色---预定义颜色
export const predefineColors = [
  '#2C78DA',
  '#337ecc',
  '#67C23A',
  '#529b2e',
  '#E6A23C',
  '#b88230',
  '#F56C6C',
  '#c45656',
  '#909399',
  '#73767a',
];

export type TransitionAnimation = '' | 'fade' | 'fade-slide' | 'fade-bottom' | 'fade-scale' | 'zoom-fade' | 'zoom-out';
export type TabStyle = 'dynamic' | 'card' | 'simple';

export interface AppConfig {
  // 语言
  locale: LocaleType;
  // 侧边栏是否折叠
  collapse: boolean;
  // 过渡动画
  transitionAnimation: TransitionAnimation;
  // 页面重载状态
  loadFlag: boolean;
  // 主题颜色
  themeColor: ThemeColor;
  // 全局组件大小
  size: 'small' | 'default' | 'large';
  // 侧边栏是否反色
  asideInverted: boolean;
  // 面包屑是否显示
  breadcrumbShow: boolean;
  // 面包屑图标是否显示
  breadcrumbIconShow: boolean;
  // 标签页风格
  tabStyle: TabStyle;
  // 水印
  watermark: boolean;
  // 页脚
  footer: boolean;
  // 页脚
  buttonTip: boolean;
}

export function data(): AppConfig {
  return {
    locale: 'zh-CN',
    collapse: false,
    transitionAnimation: 'fade-slide',
    loadFlag: true,
    themeColor: cloneDeep(defaultThemeColor),
    size: 'default',
    asideInverted: false,
    breadcrumbShow: true,
    breadcrumbIconShow: true,
    tabStyle: 'dynamic',
    watermark: false,
    footer: false,
    buttonTip: false,
  };
}

// 初始化应用设置（首屏明/暗模式与 html class 已在 index.html 的内联脚本中处理）
export function initAppSettings() {
  const appStoreData = JSON.parse(localStorage.getItem('app-store') || '{}');

  // 主题色：存在持久化值则用之，否则用默认色
  const themeColor: ThemeColor = appStoreData?.themeColor ?? defaultThemeColor;

  const el = document.documentElement;

  // 只写入基色行内变量，light-1~9 / dark-2 等变体由 CSS color-mix 自动派生（见 styles/theme.scss）
  Object.keys(themeColor).forEach((type) => {
    const color = themeColor[type];
    if (color)
      el.style.setProperty(`--el-color-${type}`, color);
  });

  // 侧边栏反色：仅切换 class，具体变量在 styles/menu.scss 中定义
  el.classList.toggle('aside-inverted', Boolean(appStoreData?.asideInverted));
}
