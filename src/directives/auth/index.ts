import type { Directive } from 'vue';
import { hasAuth } from '@/utils/auth';

/**
 * 按钮权限指令，无权限时移除元素
 * @description v-auth="'system:menu:add'" 或 v-auth="['system:menu:add', 'system:menu:edit']"（满足其一）
 */
export const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    if (!hasAuth(binding.value))
      el.parentNode?.removeChild(el);
  },
};
