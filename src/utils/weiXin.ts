const { VITE_ENTERPRISE_ID, VITE_AGENT_ID } = import.meta.env;

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
