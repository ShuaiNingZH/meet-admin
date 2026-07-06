import type {
  NotificationParamsTyped,
} from 'element-plus/es/components/notification/src/notification';
import { $t } from '@/utils/i18n';

/** Layout 容器路由名称（动态路由挂载、菜单查找均依赖它） */
export const LAYOUT_NAME = 'Layout';

export function navigationFailure(): NotificationParamsTyped {
  return {
    type: 'error',
    title: $t('router.navigationFailure.title'),
    message: $t('router.navigationFailure.message'),
    duration: 2500,
  };
}
