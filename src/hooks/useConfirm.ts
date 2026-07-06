import type { VNode } from 'vue';
import { $t } from '@/utils/i18n';

type MessageType = '' | 'success' | 'warning' | 'info' | 'error';

/**
 * 二次确认对话框，确认后调用接口。成功 resolve，失败 reject，取消静默 resolve。
 *
 * message 为字符串时自动添加"是否"前缀；也可传入 VNode 或返回 VNode 的函数。
 *
 * @example
 * useConfirm(deleteApi, { id: 123 }, '删除该条记录').then(() => refresh())
 *
 * @example
 * useConfirm(deleteApi, { id: 456 }, h('p', {}, '确认删除？'))
 */
export async function useConfirm<T extends ApiFunc>(
  api: T,
  params: ApiParams<T>,
  message: string | VNode | (() => VNode),
  confirmType: MessageType = 'warning',
): Promise<void> {
  let boxContent: string | VNode | (() => VNode);
  let tipsForSuccess = $t('common.operating');

  if (typeof message === 'string') {
    boxContent = `${$t('hooks.confirm.whether')}${message}？`;
    tipsForSuccess = message;
  }
  else {
    boxContent = message;
  }

  try {
    await ElMessageBox.confirm(boxContent, $t('common.kindTips'), {
      confirmButtonText: $t('common.sure'),
      cancelButtonText: $t('common.cancel'),
      type: confirmType,
      draggable: true,
    });
  }
  catch {
    // 用户主动取消，静默 resolve，不产生控制台错误
    ElMessage({ type: 'info', message: $t('hooks.confirm.cancelled') });
    return;
  }

  const res = await api(params);
  if (res?.code !== 200)
    throw new Error(res?.message ?? $t('common.operationFailed'));

  ElMessage({
    type: 'success',
    message: `${tipsForSuccess} ${$t('status.success')}!`,
  });
}
