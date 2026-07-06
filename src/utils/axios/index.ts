import type { AxiosRequestConfig } from 'axios';
import { service } from './instance';

export { RequestError } from './requestError';

/**
 * 发起请求。所有失败情形（网络异常、HTTP 错误状态码、业务错误状态码）
 * 都会 reject 同一种 RequestError，调用方无需区分失败来源。
 */
function request<Data = any, T = AppAxios.ApiPromise<Data>>(axiosConfig: AxiosRequestConfig, options?: AppAxios.Options): T {
  return service({ ...axiosConfig, __options: options }) as T;
}

export default request;
