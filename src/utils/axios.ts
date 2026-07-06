import type {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import { isString } from 'lodash-es';
import qs from 'qs';
import { i18n } from '@/config/i18n.ts';
import { router } from '@/router';
import { useUserStore } from '@/stores/user';
import { $t } from './i18n';

const pendingMap = new Map();
let loading: any;
let requestCount: number = 0;

function createAxios<Data = any, T = AppAxios.ApiPromise<Data>>(axiosConfig: AxiosRequestConfig, options?: AppAxios.Options): T {
  // 获取用户信息
  const userStore = useUserStore();

  const { VITE_BASE_URL: baseURL } = import.meta.env;

  const serviceConfig: CreateAxiosDefaults = {
    baseURL,
    timeout: 0,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  };

  // 创建 axios
  const service = axios.create(serviceConfig);

  // 默认配置
  options = Object.assign({
    cancelDuplicateRequest: true,
    loading: false,
    message: false,
    showErrorMessage: true,
  }, options);

  // 接口请求之前拦截
  service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // console.log(config, '请求拦截器');
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

      // 自动携带参数
      if (userStore.accessToken) {
        config.headers.Authorization = `Bearer ${userStore.accessToken}`;

        // 过滤空值参数
        if (config.method === 'get' || config.method === 'delete') {
          config.params = filterEmptyValues(config.params);
        }
        else {
          config.data = filterEmptyValues(config.data);
        }
      }

      // 自动携带当前语言
      config.headers['Accept-Language'] = i18n.global.locale.value;

      return config;
    },
    (error) => {
      // console.log(error, '请求拦截器: error');
      return Promise.reject(error);
    },
  );

  // 接口请求响应后拦截
  service.interceptors.response.use(
    async (response: AxiosResponse) => {
      // console.log(response, '响应拦截器');
      const { data, config } = response;
      removePending(config);
      // 关闭loading
      if (options.loading)
        closeLoading();

      // 登录过期
      if (data.status === 401) {
        userStore.handleLogout();
        await router.push('/login');
        ElMessage.error({
          message: data.message,
        });
        return Promise.reject(data);
      }

      // 处理新会员接口返回状态码
      if (data.status && data.status !== 200) {
        // 错误提示
        ElMessage.error(data.message);
        return Promise.reject(data);
      }

      // 是否需要提示
      if (options.message) {
        // 自定义消息提示权重大于接口返回消息提示
        const messageText = isString(options.message) ? options.message : data.message;
        ElMessage.success(messageText);
      }

      return data;
    },
    async (error) => {
      // console.log(error, '响应错误拦截器');
      // 取消的请求静默忽略，不走错误处理
      if (error.name === 'CanceledError')
        return new Promise(() => {});

      if (error.config)
        removePending(error.config);

      // 关闭loading
      if (options.loading)
        closeLoading();

      // 处理错误状态码
      if (options.showErrorMessage)
        httpErrorStatusHandle(error);

      return Promise.reject(error);
    },
  );

  return service(axiosConfig) as T;
}

export default createAxios;

/**
 * 过滤对象中的空值
 * @param obj 需要过滤的对象
 * @returns 过滤后的对象
 */
function filterEmptyValues(obj: any): any {
  // FormData 特殊处理
  if (obj instanceof FormData) {
    const newFormData = new FormData();
    obj.forEach((value, key) => {
      // 过滤 null、undefined、空字符串
      if (value !== null && value !== undefined) {
        newFormData.append(key, value);
      }
    });
    return newFormData;
  }

  // 其他特殊对象类型直接返回（File、Blob 等）
  if (obj instanceof File || obj instanceof Blob || obj instanceof Date) {
    return obj;
  }

  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];

    // 过滤条件：null、undefined、空字符串
    // 保留：0、false、空数组、空对象
    if (value !== null && value !== undefined) {
      // 如果是对象或数组，递归处理
      if (typeof value === 'object') {
        result[key] = filterEmptyValues(value);
      }
      else {
        result[key] = value;
      }
    }
  }

  return result;
}

/**
 * 获取每个请求唯一的key
 */
function getPendingKey(config: InternalAxiosRequestConfig) {
  let { data } = config;
  const { url, method, params } = config;
  if (typeof data === 'string')
    data = qs.parse(data); // response里面返回的config.data是个字符串对象
  return [url, method, qs.stringify(params), qs.stringify(data)].join('&');
}

/**
 * 储存每个请求唯一值, 用于取消重复请求
 */
function addPending(config: InternalAxiosRequestConfig) {
  const pendingKey = getPendingKey(config);
  if (!pendingMap.has(pendingKey)) {
    const controller = new AbortController();
    config.signal = controller.signal;
    pendingMap.set(pendingKey, controller);
  }
}

/**
 * 删除请求记录，abort 为 true 时同时取消请求
 */
function removePending(config: InternalAxiosRequestConfig, abort = false) {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    if (abort) {
      pendingMap.get(pendingKey).abort();
    }
    pendingMap.delete(pendingKey);
  }
}

/**
 * 创建 Loading
 */
function createLoading(text?: string) {
  if (requestCount === 0) {
    loading = ElLoading.service({
      text,
      background: 'rgba(0, 0, 0, 0.7)',
    });
  }
  requestCount++;
}

/**
 * 关闭 Loading
 */
function closeLoading() {
  requestCount--;
  if (requestCount === 0)
    loading.close();
}

/**
 * 处理异常
 */
function httpErrorStatusHandle(error: any) {
  let message = '';
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = $t('axios.errorStatus.302');
        break;
      case 400:
        message = $t('axios.errorStatus.400');
        break;
      case 401:
        message = $t('axios.errorStatus.401');
        break;
      case 403:
        message = $t('axios.errorStatus.403');
        break;
      case 404:
        message = `${$t('axios.errorStatus.404')}: ${error.response.config.url}`;
        break;
      case 408:
        message = $t('axios.errorStatus.408');
        break;
      case 409:
        message = $t('axios.errorStatus.409');
        break;
      case 500:
        message = $t('axios.errorStatus.500');
        break;
      case 501:
        message = $t('axios.errorStatus.501');
        break;
      case 502:
        message = $t('axios.errorStatus.502');
        break;
      case 503:
        message = $t('axios.errorStatus.503');
        break;
      case 504:
        message = $t('axios.errorStatus.504');
        break;
      case 505:
        message = $t('axios.errorStatus.505');
        break;
      default:
        message = $t('axios.errorStatus.default');
        break;
    }
  }
  if (error.message.includes('timeout'))
    message = $t('axios.errorStatus.timeout');
  if (error.message.includes('Network'))
    message = window.navigator.onLine ? $t('axios.errorStatus.abnormal') : $t('axios.errorStatus.disconnect');
  ElMessage.error(message);
}
