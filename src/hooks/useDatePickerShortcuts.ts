import dayjs from 'dayjs';

/**
 * 日期选择器快捷选项 Hook
 * 后续有需要在进行扩展，以便支持灵活配置
 * @returns 日期选择器快捷选项
 */
export function useDatePickerShortcuts() {
  const shortcuts = [{
    text: '近三个月',
    value: () => {
      const end = dayjs();
      const start = dayjs().subtract(3, 'month');
      return [start.toDate(), end.toDate()];
    },
  }, {
    text: '上月',
    value: () => {
      const start = dayjs().subtract(1, 'month').startOf('month');
      const end = dayjs().subtract(1, 'month').endOf('month');
      return [start.toDate(), end.toDate()];
    },
  }, {
    text: '本月',
    value: () => {
      const start = dayjs().startOf('month');
      const end = dayjs();
      return [start.toDate(), end.toDate()];
    },
  }, {
    text: '昨日',
    value: () => {
      const yesterday = dayjs().subtract(1, 'day');
      return [yesterday.toDate(), yesterday.toDate()];
    },
  }, {
    text: '今日',
    value: () => {
      const today = dayjs();
      return [today.toDate(), today.toDate()];
    },
  }];

  return {
    shortcuts,
  };
}
