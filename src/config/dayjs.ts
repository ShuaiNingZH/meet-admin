import type { LocaleType } from '@/constants/locale.ts';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { localMap } from '@/constants/locale.ts';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';

dayjs.extend(localizedFormat);
dayjs.extend(duration);

export function setDayjsLocale(locale: LocaleType) {
  dayjs.locale(localMap[locale]);
}
