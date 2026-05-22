import { fetchUserInfo } from '@/api';
import { useReset } from '@/hooks';
import { useTabStore } from '@/stores';

export const useUserStore = defineStore('user-store', () => {
  const [state, reset] = useReset({
    userInfo: {} as AnyObj,
  });

  const accessToken = useStorage('access-token', '');

  // 获取用户信息
  const getUserInfo = async () => {
    const res = await fetchUserInfo();
    state.value.userInfo = res.data;
  };

  // 退出登录
  const handleLogout = () => {
    const tabStore = useTabStore();

    reset();
    accessToken.value = '';
    tabStore.handleReset();
  };

  return {
    ...toRefs(state.value),
    accessToken,
    getUserInfo,
    handleLogout,
  };
});
