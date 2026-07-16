import { Regex } from '@/enums/regex.ts';

const regexCache = new Map<keyof typeof Regex, RegExp>();

export function regex(key: keyof typeof Regex): RegExp;
export function regex(key: keyof typeof Regex, test: string): boolean;

/**
 * 正则表达式工具函数
 * @param key - Regex 枚举中的键名
 * @param test - 可选，需要测试的字符串
 * @returns 如果提供 test 参数，则返回匹配结果（boolean）；否则返回 RegExp 对象
 */
export function regex(key: keyof typeof Regex, test?: string): RegExp | boolean {
  let reg = regexCache.get(key);

  if (!reg) {
    reg = new RegExp(Regex[key]);
    regexCache.set(key, reg);
  }

  return test ? reg.test(test) : reg;
}
