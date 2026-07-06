import { router } from '@/router';
import { useUserStore } from '@/stores/user';

// 登录过期统一处理：登出并跳转登录页
export async function handleUnauthorized() {
  const userStore = useUserStore();
  userStore.handleLogout();
  await router.push('/login');
}
