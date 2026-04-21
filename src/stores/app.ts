import type { AppConfig } from '@/config/settings.ts';
import type { LocaleType } from '@/constants/locale';
import { useI18n } from 'vue-i18n';
import { setDayjsLocale } from '@/config/dayjs.ts';
import { data } from '@/config/settings.ts';
import { initRouter } from '@/router/utils.ts';

export const useAppStore = defineStore('app-store', () => {
  const state = reactive<AppConfig>(data());

  const { isFullscreen, toggle } = useFullscreen();

  // 监听窗口大小, 自动折叠侧边栏
  const { width } = useWindowSize();

  const debouncedUpdate = useDebounceFn((width: number) => {
    state.collapse = width < 1200;
  }, 100);

  watchEffect(() => {
    debouncedUpdate(width.value);
  });

  // 刷新当前页面
  const reloadPage = async (duration = 300) => {
    state.loadFlag = false;
    await nextTick();
    if (duration) {
      setTimeout(() => {
        state.loadFlag = true;
      }, duration);
    }
    else {
      state.loadFlag = true;
    }
  };

  // 设置语言
  const { locale } = useI18n();

  const router = useRouter();
  const route = useRoute();

  async function setLocale(lang: LocaleType) {
    locale.value = lang;
    state.locale = lang;
    setDayjsLocale(lang);

    // 切换语言后，重置路由
    await router.replace(route.fullPath);

    // 如果当前路由不是登录页，则重新初始化路由
    if (route.path !== '/login')
      await initRouter();
  }

  // 重置所有设置
  function handleAppReset() {
    Object.assign(state, { ...data(), collapse: state.collapse });
  }

  return {
    ...toRefs(state),
    fullscreen: isFullscreen,
    toggleFullScreen: toggle,
    reloadPage,
    setLocale,
    handleAppReset,
  };
}, {
  persist: true,
});
