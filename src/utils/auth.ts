import { isArray } from 'lodash-es';
import { useUserStore } from '@/stores/user';

/**
 * 判断当前用户是否拥有指定的按钮权限
 *
 * 传入数组时，只要拥有其中任意一个权限即视为通过（满足其一）
 *
 * @example
 * hasAuth('system:menu:add')
 * @example
 * hasAuth(['system:menu:edit', 'system:menu:delete'])
 */
export function hasAuth(auth?: string | string[]) {
  if (!auth || (isArray(auth) && !auth.length))
    return true;

  const userStore = useUserStore();
  const buttons = userStore.userInfo?.buttons ?? [];

  return isArray(auth) ? auth.some(item => buttons.includes(item)) : buttons.includes(auth);
}
