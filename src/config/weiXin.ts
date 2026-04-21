import * as ww from '@wecom/jssdk';
import { fetchAgentJsSdkParams, fetchCorpJsSdkParams } from '@/api';

// 需要使用的JS接口列表
const jsApiList = [
  'selectExternalContact',
  'selectEnterpriseContact',
  'openEnterpriseChat',
  'openExistedChatWithMsg',
];

// 企业微信注册应用信息
export function initWeiXin() {
  ww.register({
    corpId: import.meta.env.VITE_ENTERPRISE_ID,
    agentId: import.meta.env.VITE_AGENT_ID,
    jsApiList,
    // 注入企业身份权限
    getConfigSignature: async (url: string) => {
      const res = await fetchCorpJsSdkParams(url);

      return {
        timestamp: res.data.timestamp,
        nonceStr: res.data.nonceStr,
        signature: res.data.signature,
      };
    },
    // 注入应用的权限
    getAgentConfigSignature: async (url: string) => {
      const res = await fetchAgentJsSdkParams(url);

      return {
        timestamp: res.data.timestamp,
        nonceStr: res.data.nonceStr,
        signature: res.data.signature,
      };
    },
  });
}
