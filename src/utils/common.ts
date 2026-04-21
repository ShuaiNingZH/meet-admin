import { div, fmt, mul } from 'a-calc';
import nzhCn from 'nzh/cn';
import { regex } from '@/utils';

/**
 * 设置文档标题
 *
 * @param title - 标题
 */
export function setDocumentTitle(title: string) {
  document.title = `${title} - ${import.meta.env.VITE_APP_NAME}`;
}

/**
 * 判断当前项目是否被嵌套在其他项目中（以iframe形式）
 * @returns 如果当前项目被嵌套则返回true，否则返回false
 */
export function isEmbedded() {
  // 检查 window.self !== window.top 判断是否在 iframe 中
  return window.self !== window.top;
}

/**
 * 数字转小写中文
 * @param num 数字
 */
export function numCN(num: number) {
  return nzhCn.encodeS(num);
}

/**
 * 格式化数字为千分位显示
 * @param num - 需要格式化的数字或字符串
 */
export function numberFormat(num: number | string) {
  const numValue = Number(num);

  if (Number.isNaN(numValue))
    return '0';

  return fmt(numValue, ',');
}

/**
 * 手机号脱敏
 * @param phone - 需要脱敏的手机号
 */
export function maskPhone(phone: string) {
  return phone.replace(regex('PhoneDesensitization'), '$1****$2');
}

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

/**
 * 比率(小数) → 展示值
 * @param rate 比率，如 0.05
 * @param base 基数（默认 100，百分比；10 为折扣）
 * @returns 展示值
 * @example rateToValue(0.05) // 5
 */
export function rateToValue(rate: number, base = 100) {
  return mul(rate, base);
}

/**
 * 展示值 → 比率(小数)
 * @param value 展示值，如 5
 * @param base 基数（默认 100，百分比；10 为折扣）
 * @returns 比率
 * @example valueToRate(5) // 0.05
 */
export function valueToRate(value: number, base = 100) {
  return div(value, base);
}
