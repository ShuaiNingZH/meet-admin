import type { AppConfig } from '@/config/settings.ts';
import type { LocaleType } from '@/constants/locale';
import { cloneDeep } from 'lodash-es';
import { setDayjsLocale } from '@/config/dayjs.ts';
import { i18n } from '@/config/i18n.ts';
import { applyAsideInverted, applyThemeColor, defaultSettings } from '@/config/settings.ts';
import { useReset } from '@/hooks/useReset.ts';

export const useAppStore = defineStore('app-store', () => {
  // 默认配置来自 defaultSettings.json：去掉 colorMode（由 useColorMode 单独管理），补上瞬态字段
  const [state, reset] = useReset<AppConfig>(() => {
    const { colorMode: _, ...appDefaults } = cloneDeep(defaultSettings);
    return {
      ...appDefaults,
      collapse: false,
      loadFlag: true,
    };
  });

  // 明暗模式
  const { store: colorMode, system } = useColorMode({ initialValue: defaultSettings.colorMode });

  // 解析后的实际配色（auto 跟随系统）
  const colorScheme = computed(() => {
    return colorMode.value === 'auto' ? system.value : colorMode.value;
  });
  const isDark = computed(() => colorScheme.value === 'dark');

  const { isFullscreen, toggle } = useFullscreen();

  // 监听窗口大小, 自动折叠侧边栏
  const { width } = useWindowSize();

  const debouncedUpdate = useDebounceFn((width: number) => {
    state.value.collapse = width < 1200;
  }, 100);

  watchEffect(() => {
    debouncedUpdate(width.value);
  });

  // 刷新当前页面
  const reloadPage = async (duration = 300) => {
    state.value.loadFlag = false;
    await nextTick();
    if (duration) {
      setTimeout(() => {
        state.value.loadFlag = true;
      }, duration);
    }
    else {
      state.value.loadFlag = true;
    }
  };

  // 切换语言
  watch(() => state.value.locale, (lang) => {
    i18n.global.locale.value = lang;
    setDayjsLocale(lang);
  }, { immediate: true });

  // 主题色
  watch(() => state.value.themeColor, applyThemeColor, { deep: true, immediate: true });

  // 侧边栏反色
  watch(() => state.value.asideInverted, applyAsideInverted, { immediate: true });

  // 设置语言
  function setLocale(lang: LocaleType) {
    state.value.locale = lang;
  }

  // 重置所有设置
  function handleAppReset() {
    const { collapse } = state.value;
    reset();
    state.value.collapse = collapse;
    colorMode.value = defaultSettings.colorMode;
  }

  return {
    ...toRefs(state.value),
    colorMode,
    colorScheme,
    isDark,
    fullscreen: isFullscreen,
    toggleFullScreen: toggle,
    reloadPage,
    setLocale,
    handleAppReset,
  };
}, {
  persist: {
    // 只持久化真正的用户设置；collapse / loadFlag 是瞬态状态，持久化会导致刷新后布局错乱甚至白屏
    pick: [
      'locale',
      'transitionAnimation',
      'themeColor',
      'size',
      'asideInverted',
      'breadcrumbShow',
      'breadcrumbIconShow',
      'tabStyle',
      'watermark',
      'footer',
    ],
  },
});
