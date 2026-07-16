import type { App } from 'vue';
import messages from '@intlify/unplugin-vue-i18n/messages';
import { createI18n } from 'vue-i18n';
import { defaultSettings } from '@/config/settings.ts';

// 以系统默认语言创建实例
export const i18n = createI18n({
  locale: defaultSettings.locale,
  messages,
  legacy: false,
  fallbackLocale: 'en-US',
});

export function installI18n(app: App) {
  app.use(i18n);
}
