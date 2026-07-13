import request from '@/utils/axios';

const { VITE_COMMON_URL } = import.meta.env;

// 登录
export function login(data: AnyObj) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data,
  });
}

// 获取用户信息
export function fetchUserInfo() {
  return request<User.CurrentUser>({
    url: '/api/user',
  });
}

// 获取用户菜单
export function fetchUserMenu() {
  return request<Menu.Tree[]>({
    url: '/api/user/menus',
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

// 上传图片
export function uploadImage(params: FormData) {
  return request({
    baseURL: VITE_COMMON_URL,
    url: '/api/upload/image',
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
