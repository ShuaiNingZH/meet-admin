import type { ThemeColorKey } from '@/config/settings.ts';
import { defaultThemeColor } from '@/config/settings.ts';
import { useAppStore } from '@/stores';

// 自定义 Hook 用于管理主题颜色
export function useTheme() {
  const appStore = useAppStore();

  const { themeColor, asideInverted } = storeToRefs(appStore);

  const { t } = useI18n();

  // 调用 useColorMode 本身即会接管 html.dark / html.light 类，颜色变体随之由 CSS 自动重算
  const { store: colorStore } = useColorMode();

  // 设置主题颜色
  function setThemeColor(color: string | null, type: ThemeColorKey) {
    // 如果 color 为空，则使用默认颜色
    if (!color) {
      color = defaultThemeColor[type] ?? defaultThemeColor.primary;
      ElMessage({
        type: 'success',
        message: `${t(`theme.color.${type}`)} ${t('hooks.theme.reset')} ${color}`,
      });
    }

    // 只写入基色，light-1~9 / dark-2 等变体由 CSS color-mix 自动派生（见 styles/theme.scss）
    document.documentElement.style.setProperty(`--el-color-${type}`, color);

    themeColor.value[type] = color;
  }

  // 重置主题颜色
  function resetTheme() {
    colorStore.value = 'auto';

    for (const key in defaultThemeColor) {
      defaultThemeColor[key] && setThemeColor(defaultThemeColor[key], key);
    }

    setAsideInverted(asideInverted.value);
  }

  // 设置侧边栏反色：仅切换 class，具体变量在 styles/menu.scss 中定义
  function setAsideInverted(inverted: string | number | boolean) {
    document.documentElement.classList.toggle('aside-inverted', Boolean(inverted));
  }

  return {
    colorStore,
    setThemeColor,
    resetTheme,
    setAsideInverted,
  };
}
