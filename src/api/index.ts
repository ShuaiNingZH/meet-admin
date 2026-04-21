import request from '@/utils/axios';

const { VITE_COMMON_URL } = import.meta.env;

// 登录
export function login(code: string) {
  return request({
    url: '/employee/exchangeUserIdByCode',
    method: 'post',
    data: {
      code,
    },
  });
}

// 获取用户信息
export function fetchUserInfo() {
  return request({
    url: '/employee/getUserInfo',
    method: 'post',
  });
}

// 获取企业级 JsSdk 签名参数
export function fetchCorpJsSdkParams(url: string) {
  return request({
    url: '/common/generateCorpJssdkParams',
    method: 'post',
    data: {
      url,
    },
  });
}

// 获取应用 JsSdk 签名参数
export function fetchAgentJsSdkParams(url: string) {
  return request({
    url: '/common/generateAgentJssdkParams',
    method: 'post',
    data: {
      url,
    },
  });
}

// 上传文件
export function uploadFile(params: FormData) {
  return request({
    baseURL: VITE_COMMON_URL,
    url: '/common/acceptUpload',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }, {
    cancelDuplicateRequest: false,
    loading: '上传中...',
  });
}
