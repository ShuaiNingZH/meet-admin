import type {
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import { isString } from 'lodash-es';
import qs from 'qs';
import { i18n } from '@/config/i18n.ts';
import { useUserStore } from '@/stores/user';
import { $t } from '../i18n';
import { handleUnauthorized } from './auth';
import { addPending, removePending } from './dedupe';
import { resolveErrorMessage } from './errorMessage';
import { filterEmptyValues } from './filterEmptyValues';
import { closeLoading, createLoading } from './loading';
import { RequestError } from './requestError';

declare module 'axios' {
  interface AxiosRequestConfig {
    // 单次请求的自定义选项
    __options?: AppAxios.Options;
  }
}

const DEFAULT_OPTIONS: Required<AppAxios.Options> = {
  cancelDuplicateRequest: true,
  loading: false,
  successMessage: false,
  errorMessage: true,
};

function resolveOptions(options?: AppAxios.Options): Required<AppAxios.Options> {
  return Object.assign({}, DEFAULT_OPTIONS, options);
}

const { VITE_BASE_URL: baseURL } = import.meta.env;

const serviceConfig: CreateAxiosDefaults = {
  baseURL,
  timeout: 0,
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
};

// 单例 axios 实例，拦截器只在模块加载时注册一次
export const service = axios.create(serviceConfig);

// 接口请求之前拦截
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const options = resolveOptions(config.__options);
    const userStore = useUserStore();

    // 取消重复请求
    if (options.cancelDuplicateRequest) {
      removePending(config, true);
      addPending(config);
    }

    // 显示 Loading
    if (options.loading) {
      const loadingText = isString(options.loading) ? options.loading : $t('axios.loadingText');
      createLoading(loadingText);
    }

    // 自动携带 token
    if (userStore.accessToken)
      config.headers.Authorization = `Bearer ${userStore.accessToken}`;

    // 过滤空值参数
    if (config.method === 'get' || config.method === 'delete')
      config.params = filterEmptyValues(config.params);
    else
      config.data = filterEmptyValues(config.data);

    // 自动携带当前语言
    config.headers['Accept-Language'] = i18n.global.locale.value;

    return config;
  },
  error => Promise.reject(error),
);

// 接口请求响应后拦截
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    const { data, config } = response;
    const options = resolveOptions(config.__options);

    removePending(config);
    if (options.loading)
      closeLoading();

    // 业务状态码非 200：统一构造 RequestError，401 额外触发登出跳转
    if (data.code && data.code !== 200) {
      const requestError = new RequestError(data.message, data.code, data);

      if (data.code === 401)
        await handleUnauthorized();

      if (options.errorMessage)
        ElMessage.error(isString(options.errorMessage) ? options.errorMessage : requestError.message);

      return Promise.reject(requestError);
    }

    // 是否需要成功提示
    if (options.successMessage) {
      const messageText = isString(options.successMessage) ? options.successMessage : data.message;
      ElMessage.success(messageText);
    }

    return data;
  },
  async (error) => {
    // 取消的请求静默忽略：新请求已取代旧请求，旧请求的 Promise 永远挂起，不进入错误处理
    if (error.name === 'CanceledError')
      return new Promise(() => {});

    const options = resolveOptions(error.config?.__options);

    if (error.config)
      removePending(error.config);

    if (options.loading)
      closeLoading();

    // HTTP 401：与业务状态码 401 保持一致，统一登出并跳转登录页
    const status = error.response?.status;
    if (status === 401)
      await handleUnauthorized();

    const requestError = new RequestError(
      resolveErrorMessage(error, isString(options.errorMessage) ? options.errorMessage : undefined),
      status ?? 'NETWORK_ERROR',
      error,
    );

    if (options.errorMessage)
      ElMessage.error(requestError.message);

    return Promise.reject(requestError);
  },
);
