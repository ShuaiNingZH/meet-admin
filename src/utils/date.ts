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
