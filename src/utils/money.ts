import { fmt } from 'a-calc';
import nzhCn from 'nzh/cn';

// 处理金额，千分位
export function moneyThousand(money: number | string) {
  if (money === '' || Number.isNaN(Number(money)))
    return '0';
  return Number(money) !== 0 ? fmt(money, ',=2') : String(money);
}

/**
 * 金额转中文
 * @param money 金额
 * @param outSymbol 是否输出货币符号
 */
export function moneyCN(money: number | string, outSymbol = false) {
  const numMoney = typeof money === 'string' ? Number(money) : money;

  if (Number.isNaN(numMoney))
    return '';

  return nzhCn.toMoney(numMoney, { outSymbol });
}
