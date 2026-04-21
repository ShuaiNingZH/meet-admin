import type { App } from 'vue';
import messages from '@intlify/unplugin-vue-i18n/messages';
import { createI18n } from 'vue-i18n';
import { setDayjsLocale } from '@/config/dayjs.ts';

// 设置默认语言
const appStore = localStorage.getItem('app-store');
const locale = appStore ? JSON.parse(appStore).locale : 'zh-CN';

export const i18n = createI18n({
  locale,
  messages,
  legacy: false,
  fallbackLocale: 'en-US',
});

// 初始化日期
setDayjsLocale(locale);

export function installI18n(app: App) {
  app.use(i18n);
}
