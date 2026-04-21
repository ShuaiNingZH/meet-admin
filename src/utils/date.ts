import type { OpUnitType, QUnitType } from 'dayjs';
import dayjs from 'dayjs';

/**
 * 格式化时间
 * @param dateTime 时间
 * @param format 格式化的格式
 */
export function timeFormat(dateTime: dayjs.ConfigType, format: string = 'YYYY-MM-DD') {
  if (!dateTime)
    dateTime = dayjs();
  return dayjs(dateTime).format(format);
}

/**
 * 去除时间中的 T
 * @param date 时间
 */
export function timeRemoveT(date: string | dayjs.Dayjs) {
  return timeFormat(date, 'YYYY-MM-DD HH:mm:ss');
}

/**
 * 未来多少天开始禁用
 * @param days 天数
 */
export function futureHowDaysDisabled(days: number = 0) {
  return (time: Date) => {
    return time.getTime() > dayjs(dayjs().add(days, 'days')).valueOf();
  };
}

type Direction = 'future' | 'past';

/**
 * 计算目标时间与当前时间的差值
 * @param date 目标时间
 * @param unit 差值单位，默认 'day'
 * @param direction 类型，'future' 只返回未来天数，'past' 只返回过去天数，默认 'future'
 * @returns number 差值
 */
export function diffFromNow(
  date: dayjs.ConfigType,
  unit: QUnitType | OpUnitType = 'day',
  direction: Direction = 'future',
) {
  const diff = dayjs(date).diff(dayjs(), unit);

  // 未来差值
  if (direction === 'future')
    return Math.max(diff, 0);

  // 过去差值
  if (direction === 'past')
    return Math.max(-diff, 0);

  return 0;
}
