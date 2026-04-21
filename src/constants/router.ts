import type {
  NotificationParamsTyped,
} from 'element-plus/es/components/notification/src/notification';
import { $t } from '@/utils';

export function navigationFailure(): NotificationParamsTyped {
  return {
    type: 'error',
    title: $t('router.navigationFailure.title'),
    message: $t('router.navigationFailure.message'),
    duration: 2500,
  };
}
