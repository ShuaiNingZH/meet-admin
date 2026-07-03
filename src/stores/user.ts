import { useReset } from '@/hooks';
import { useRouteStore, useTabStore } from '@/stores';

export const useUserStore = defineStore('user-store', () => {
  const [state, reset] = useReset(() => ({
    userInfo: {} as AnyObj,
  }));

  const accessToken = useStorage('access-token', '');

  // 退出登录
  const handleLogout = () => {
    const tabStore = useTabStore();
    const routeStore = useRouteStore();

    reset();
    accessToken.value = '';
    tabStore.handleReset();
    routeStore.handleReset();
  };

  return {
    ...toRefs(state.value),
    accessToken,
    handleLogout,
  };
});
