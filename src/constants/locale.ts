import en from 'element-plus/es/locale/lang/en';
import zhCN from 'element-plus/es/locale/lang/zh-cn';

export type LocaleType = 'zh-CN' | 'en-US';

interface Locale {
  label: string;
  value: LocaleType;
}

// locale list
export const localeList: Locale[] = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
];

export const localMap = {
  'zh-CN': 'zh-cn',
  'en-US': 'en',
} satisfies Record<LocaleType, string>;

// element-plus locale
export const elLocale: AnyObj = {
  'zh-CN': zhCN,
  'en-US': en,
};
