import { fmt } from 'a-calc';

/**
 * 设置文档标题
 *
 * @param title - 标题
 */
export function setDocumentTitle(title: string) {
  document.title = `${title} - ${import.meta.env.VITE_APP_NAME}`;
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
