import { isString } from 'lodash-es';
import { $t } from '../i18n';

const STATUS_MESSAGE_KEYS: Record<number, string> = {
  302: 'axios.errorStatus.302',
  400: 'axios.errorStatus.400',
  401: 'axios.errorStatus.401',
  403: 'axios.errorStatus.403',
  404: 'axios.errorStatus.404',
  408: 'axios.errorStatus.408',
  409: 'axios.errorStatus.409',
  500: 'axios.errorStatus.500',
  501: 'axios.errorStatus.501',
  502: 'axios.errorStatus.502',
  503: 'axios.errorStatus.503',
  504: 'axios.errorStatus.504',
  505: 'axios.errorStatus.505',
};

// 由 HTTP 状态码 / 网络异常推导出的通用提示，作为后端未返回具体 message 时的兜底文案
function resolveGenericMessage(error: any): string {
  const status = error?.response?.status;
  if (status) {
    const key = STATUS_MESSAGE_KEYS[status] ?? 'axios.errorStatus.default';
    return status === 404 ? `${$t(key)}: ${error.response.config?.url}` : $t(key);
  }
  if (error?.message?.includes('timeout'))
    return $t('axios.errorStatus.timeout');
  if (error?.message?.includes('Network'))
    return window.navigator.onLine ? $t('axios.errorStatus.abnormal') : $t('axios.errorStatus.disconnect');
  return $t('axios.errorStatus.default');
}

/**
 * 解析最终展示给用户的错误文案，优先级：
 * 1. 调用方显式传入的覆盖文案（options.errorMessage 为字符串时）
 * 2. 后端返回的具体错误信息（error.response.data.message）
 * 3. 按 HTTP 状态码 / 网络异常归类的通用文案
 */
export function resolveErrorMessage(error: any, override?: string): string {
  if (override)
    return override;

  const backendMessage = error?.response?.data?.message;
  if (isString(backendMessage) && backendMessage)
    return backendMessage;

  return resolveGenericMessage(error);
}
