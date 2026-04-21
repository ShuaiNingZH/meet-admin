import type { LocaleType } from '@/constants/locale.ts';
import { cloneDeep, isEmpty } from 'lodash-es';
import { getDarkColor, getLightColor } from '@/utils';

// 侧边栏菜单翻转
export const menuInvertedTheme: AnyObj = {
  '--el-menu-bg-color': '#2b3743',
  '--el-menu-hover-bg-color': '#242d35',
  '--el-menu-text-color': '#a3a7ac',
  '--el-menu-hover-text-color': 'var(--el-color-white)',
  '--el-menu-active-color': 'var(--el-color-primary)',
  '--el-menu-active-bg-color': 'var(--el-color-primary-light-7)',
};

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
  // 是否暗黑模式
  isDark: boolean;
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
    isDark: false,
    tabStyle: 'dynamic',
    watermark: false,
    footer: false,
    buttonTip: false,
  };
}

// 初始化应用设置
export function initAppSettings() {
  const appStoreData = JSON.parse(localStorage.getItem('app-store') || '{}');

  let themeColor = defaultThemeColor;

  // 如果存在 appStoreData，则使用其中的主题颜色
  if (appStoreData?.themeColor)
    themeColor = appStoreData.themeColor;

  // 是否暗黑模式
  let isDark = appStoreData.isDark;

  // 没有应用设置时，添加默认设置
  if (isEmpty(appStoreData)) {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem('app-store', JSON.stringify({ ...data(), isDark }));
  }

  const el = document.documentElement;

  // 设置主题颜色
  Object.keys(themeColor).forEach((type) => {
    const color = themeColor[type];
    if (color) {
      const typeText = `--el-color-${type}`;

      // 设置主颜色
      el.style.setProperty(typeText, color);

      // 设置深色变体
      const darkColor = isDark ? getLightColor(color, 0.2) : getDarkColor(color, 0.3);
      el.style.setProperty(`${typeText}-dark-2`, darkColor as string);

      // 设置浅色变体
      for (let i = 1; i <= 9; i++) {
        const variantColor = isDark ? getDarkColor(color, i / 10) : getLightColor(color, i / 10);
        el.style.setProperty(`${typeText}-light-${i}`, variantColor as string);
      }
    }
  });

  // 设置侧边栏反转颜色
  if (appStoreData?.asideInverted) {
    for (const elKey in menuInvertedTheme) {
      el.style.setProperty(elKey, menuInvertedTheme[elKey]);
    }
  }
  else {
    for (const elKey in menuInvertedTheme) {
      el.style.removeProperty(elKey);
    }
  }
}
