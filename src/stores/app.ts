import type { BasicColorSchema } from '@vueuse/core';
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

  // 切换明暗模式时的圆形扩散动画（同 Element Plus 文档效果），扩散原点取最后一次点击位置
  const { x: mouseX, y: mouseY } = useMouse({ type: 'client' });

  function setColorMode(mode: BasicColorSchema) {
    const targetScheme = mode === 'auto' ? system.value : mode;
    // 浏览器不支持 / 用户偏好减少动画 / 实际配色不变时直接切换
    if (
      typeof document.startViewTransition !== 'function'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || targetScheme === colorScheme.value
    ) {
      colorMode.value = mode;
      return;
    }

    const x = mouseX.value;
    const y = mouseY.value;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(async () => {
      colorMode.value = mode;
      await nextTick();
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      const animation = document.documentElement.animate(
        { clipPath: isDark.value ? [...clipPath].reverse() : clipPath },
        {
          duration: 400,
          easing: 'ease-in',
          fill: 'forwards',
          pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)',
        },
      );
      // 过渡结束、伪元素移除后再释放动画，避免 forwards 填充的动画常驻
      transition.finished.finally(() => animation.cancel());
    });
  }

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
    setColorMode,
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
