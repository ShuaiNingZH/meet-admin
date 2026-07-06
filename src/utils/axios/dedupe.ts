import type { InternalAxiosRequestConfig } from 'axios';
import qs from 'qs';

const pendingMap = new Map<string, AbortController>();

// 储存每个请求唯一值，用于取消重复请求
export function addPending(config: InternalAxiosRequestConfig) {
  const pendingKey = getPendingKey(config);
  if (!pendingMap.has(pendingKey)) {
    const controller = new AbortController();
    config.signal = controller.signal;
    pendingMap.set(pendingKey, controller);
  }
}

// 删除请求记录，abort 为 true 时同时取消请求
export function removePending(config: InternalAxiosRequestConfig, abort = false) {
  const pendingKey = getPendingKey(config);
  const controller = pendingMap.get(pendingKey);
  if (controller) {
    if (abort)
      controller.abort();
    pendingMap.delete(pendingKey);
  }
}

// 获取每个请求唯一的 key
function getPendingKey(config: InternalAxiosRequestConfig) {
  let { data } = config;
  const { url, method, params } = config;
  if (typeof data === 'string')
    data = qs.parse(data);

  const dataKey = data instanceof FormData ? stringifyFormData(data) : qs.stringify(data);
  return [url, method, qs.stringify(params), dataKey].join('&');
}

// 将 FormData 序列化为可比较的字符串（File 用 名称:大小:修改时间 表示）
function stringifyFormData(formData: FormData): string {
  const parts: string[] = [];
  formData.forEach((value, key) => {
    const entry = value instanceof File ? `${value.name}:${value.size}:${value.lastModified}` : String(value);
    parts.push(`${key}=${entry}`);
  });
  return parts.sort().join('&');
}
