import type { BasicColorSchema } from '@vueuse/core';
import type { LocaleType } from '@/constants/locale.ts';
import defaultSettingsJson from './defaultSettings.json';

export interface ThemeColor {
  primary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  [key: string]: string;
}

export type ThemeColorKey = keyof ThemeColor;

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

export type TransitionAnimation = 'none' | 'fade' | 'fade-slide' | 'fade-bottom' | 'fade-scale' | 'zoom-fade' | 'zoom-out';
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
  // 按钮提示
  buttonTip: boolean;
}

// 系统默认配置
export interface DefaultSettings extends Omit<AppConfig, 'collapse' | 'loadFlag'> {
  // 主题模式（明/暗/跟随系统）
  colorMode: BasicColorSchema;
}
export const defaultSettings = defaultSettingsJson as DefaultSettings;

// 默认主题颜色
export const defaultThemeColor: ThemeColor = defaultSettings.themeColor;

// 将主题色写入根元素行内变量，light-1~9 / dark-2 等变体由 CSS color-mix 自动派生（见 styles/theme.scss）
export function applyThemeColor(themeColor: ThemeColor) {
  const el = document.documentElement;
  Object.keys(themeColor).forEach((type) => {
    const color = themeColor[type];
    if (color)
      el.style.setProperty(`--el-color-${type}`, color);
  });
}

// 侧边栏反色：仅切换 class，具体变量在 styles/menu.scss 中定义
export function applyAsideInverted(inverted: boolean) {
  document.documentElement.classList.toggle('aside-inverted', inverted);
}
