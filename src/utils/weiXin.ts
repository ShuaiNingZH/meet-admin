const { VITE_ENTERPRISE_ID, VITE_AGENT_ID } = import.meta.env;

export type EnvType = | 'com-wx-mobile' | 'com-wx-pc' | 'wx-mobile' | 'wx-pc' | 'other';

const MOBILE_REG = /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i;

/**
 * 判断当前运行环境（微信 / 企业微信 / 终端类型）
 * @returns {EnvType}
 * - `'com-wx-mobile'`：企业微信（手机端）
 * - `'com-wx-pc'`：企业微信（PC 端）
 * - `'wx-mobile'`：微信（手机端）
 * - `'wx-pc'`：微信（PC 端）
 * - `'other'`：非微信环境（包括其他浏览器或平台）
 */
export function envJudge(): EnvType {
  if (typeof navigator === 'undefined') {
    return 'other';
  }

  const ua = navigator.userAgent.toLowerCase();
  const isMobile = MOBILE_REG.test(ua);
  const isWx = ua.includes('micromessenger');
  const isComWx = ua.includes('wxwork');

  if (isComWx)
    return isMobile ? 'com-wx-mobile' : 'com-wx-pc';
  if (isWx)
    return isMobile ? 'wx-mobile' : 'wx-pc';

  return 'other';
}

// 企业微信静默授权
export function authorize() {
  const url = new URL(location.href);
  const code = url.searchParams.get('code');

  if (code) {
    url.searchParams.delete('code');
    window.history.replaceState({}, '', url.toString());
    return code;
  }

  const params = new URLSearchParams({
    appid: VITE_ENTERPRISE_ID,
    redirect_uri: location.href,
    response_type: 'code',
    scope: 'snsapi_privateinfo',
    agentid: VITE_AGENT_ID,
  });

  location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?${params.toString()}#wechat_redirect`;
}
