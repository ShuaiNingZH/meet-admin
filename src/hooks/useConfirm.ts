import type { VNode } from 'vue';
import { $t } from '@/utils';

type MessageType = '' | 'success' | 'warning' | 'info' | 'error';

/**
 * @description 用于操作单条数据信息时的二次确认对话框（支持删除、禁用、启用、重置密码等操作）
 *
 * @param {Function} api - 操作数据的接口方法，需返回 Promise (必传)
 * @param {object} params - 操作接口的参数，例如 { id, otherParams } (可选，默认为空对象)
 * @param {string | VNode | (() => VNode)} message - 提示信息 (必传)
 *   - 字符串：会自动添加“是否”字样并显示。
 *   - VNode：支持静态内容。
 *   - Function：动态生成的 VNode，需返回 VNode。
 * @param {MessageType} [confirmType] - 对话框的 icon 类型，默认是 'warning' (可选)
 * @returns {Promise<void>} - 返回一个 Promise，在操作成功时 resolve，在操作失败或取消时 reject
 *
 * @example
 * // 示例 1：删除操作
 * useConfirm(deleteApi, { id: 123 }, '删除该条记录')
 *   .then(() => {
 *     console.log('操作成功');
 *   })
 *   .catch((err) => {
 *     console.error('操作失败或取消', err);
 *   });
 *
 * @example
 * // 示例 2：自定义内容
 * const customMessage = h('div', {}, [
 *   h('p', {}, '确认删除该用户吗？'),
 *   h('p', { style: 'color: red;' }, '此操作不可撤销！'),
 * ]);
 * useConfirm(deleteApi, { id: 456 }, customMessage);
 */
export function useConfirm(
  api: (params: any) => Promise<any>,
  params: Record<string, any> = {},
  message: string | VNode | (() => VNode),
  confirmType: MessageType = 'warning',
): Promise<void> {
  let boxContent = '';
  let tipsForSuccess = $t('common.operating');
  // 自动添加“是否”提示文字
  if (typeof message === 'string') {
    boxContent = `${$t('hooks.confirm.whether')}${message}？`;
    tipsForSuccess = message;
  }

  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(boxContent, $t('common.kindTips'), {
      confirmButtonText: $t('common.sure'),
      cancelButtonText: $t('common.cancel'),
      type: confirmType,
      draggable: true,
    })
      .then(async () => {
        try {
          const res = await api(params);
          if (!res)
            throw new Error($t('common.operationFailed'));

          ElMessage({
            type: 'success',
            message: `${tipsForSuccess} ${$t('status.success')}!`,
          });
          resolve();
        }
        catch (err) {
          reject(err);
        }
      })
      .catch(() => {
      // 用户取消操作的情况
        ElMessage({
          type: 'info',
          message: $t('hooks.confirm.cancelled'),
        });
      });
  });
}
