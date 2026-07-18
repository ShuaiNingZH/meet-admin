import { useReset } from '@/hooks/useReset';
import { useIframeStore } from './iframe';
import { useRouteStore } from './route';
import { useTabStore } from './tab';

export const useUserStore = defineStore('user-store', () => {
  const [state, reset] = useReset(() => ({
    userInfo: {} as User.CurrentUser,
  }));

  const accessToken = useStorage('access-token', '');

  // 退出登录
  const handleLogout = () => {
    const tabStore = useTabStore();
    const routeStore = useRouteStore();
    const iframeStore = useIframeStore();

    reset();
    accessToken.value = '';
    tabStore.handleReset();
    routeStore.handleReset();
    iframeStore.handleReset();
  };

  return {
    ...toRefs(state.value),
    accessToken,
    handleLogout,
  };
});
