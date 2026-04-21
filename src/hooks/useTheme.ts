import type { ThemeColorKey } from '@/config/settings.ts';
import { defaultThemeColor, menuInvertedTheme } from '@/config/settings.ts';
import { useAppStore } from '@/stores';
import { getDarkColor, getLightColor } from '@/utils';

// 自定义 Hook 用于管理主题颜色
export function useTheme() {
  const appStore = useAppStore();

  const {
    themeColor,
    asideInverted,
    isDark,
  } = storeToRefs(appStore);

  const { t } = useI18n();

  const { system, store: colorStore } = useColorMode();

  // 颜色模式，自动根据系统设置或手动选择
  const colorMode = computed(() => {
    return colorStore.value === 'auto' ? system.value : colorStore.value;
  });

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

    const typeText = `--el-color-${type}`;
    const el = document.documentElement;

    // 设置主题颜色
    el.style.setProperty(typeText, color);

    // 设置深色变体
    const darkColor = colorMode.value === 'dark' ? getLightColor(color, 0.2) : getDarkColor(color, 0.3);
    el.style.setProperty(`${typeText}-dark-2`, darkColor as string);

    // 设置浅色变体
    for (let i = 1; i <= 9; i++) {
      const variantColor = colorMode.value === 'dark' ? getDarkColor(color, i / 10) : getLightColor(color, i / 10);
      el.style.setProperty(`${typeText}-light-${i}`, variantColor as string);
    }

    themeColor.value[type] = color;
  }

  // 切换主题时，更新主题颜色
  function watchTheme() {
    // 是否是深色模式
    isDark.value = colorMode.value === 'dark';

    for (const key in defaultThemeColor) {
      themeColor.value[key] && setThemeColor(themeColor.value[key], key);
    }

    setAsideInverted(asideInverted.value);
  }

  // 重置主题颜色
  function resetTheme() {
    colorStore.value = 'auto';

    for (const key in defaultThemeColor) {
      defaultThemeColor[key] && setThemeColor(defaultThemeColor[key], key);
    }

    setAsideInverted(asideInverted.value);
  }

  // 设置侧边栏反正色
  function setAsideInverted(inverted: string | number | boolean) {
    const el = document.documentElement;
    if (inverted) {
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

  return {
    colorMode,
    colorStore,
    watchTheme,
    setThemeColor,
    resetTheme,
    setAsideInverted,
  };
}
