import type { Directive } from 'vue';
import { hasAuth } from '@/utils/auth';

export type AuthDirective = Directive<HTMLElement, string | string[]>;

/**
 * 按钮权限指令，无权限时移除元素
 * @description v-auth="'system:menu:add'" 或 v-auth="['system:menu:add', 'system:menu:edit']"（满足其一）
 */
export const auth: AuthDirective = {
  mounted(el, binding) {
    if (!hasAuth(binding.value))
      el.parentNode?.removeChild(el);
  },
};
