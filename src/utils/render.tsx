import { AppText } from '@/components';
import { moneyThousand } from '@/utils/money';

interface RenderMoney {
  value: number;
  highlightNegativeAmounts?: boolean;
  link?: boolean;
  callBack?: () => void;
}

/**
 * @description 渲染金额(负数为红色)
 * @param options 参数对象
 * @param options.value 金额
 * @param options.highlightNegativeAmounts 突出显示负金额
 * @param options.link 是否显示为链接
 * @param options.callBack 点击回调
 */
export function renderMoney({ value, highlightNegativeAmounts = false, link = false, callBack }: RenderMoney) {
  const isLink = value !== 0 && link;
  const type = (highlightNegativeAmounts && value < 0) ? 'danger' : isLink ? 'primary' : undefined;

  return (
    <AppText type={type} link={isLink} onClick={isLink ? callBack : undefined}>
      {moneyThousand(value)}
    </AppText>
  );
}

/**
 * @description 渲染占位符
 * @param length 占位符数量
 */
export function renderPlaceholders(length: number) {
  return [...Array.from({ length })].map((_, index) => (
    <span key={index} class="el-table__placeholder" />
  ));
}
