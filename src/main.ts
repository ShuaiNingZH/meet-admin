import { createApp } from 'vue';
import { initElementPlus } from '@/config/elementPlus.ts';
import { installI18n } from '@/config/i18n';
import initVersionRocket from '@/config/versionRocket';
import * as directives from '@/directives';
import { installRouter } from '@/router';
import { installPinia } from '@/stores';
import { useAppStore } from '@/stores/app';
import App from './App.vue';
import '@/styles/index';

async function setupApp() {
  // 初始化组件默认值
  initElementPlus();
  // 初始化版本检测
  initVersionRocket();
  // 创建vue实例5
  const app = createApp(App);
  // 注册模块 Pinia
  installPinia(app);
  // 提前实例化 app store
  useAppStore();
  // 注册模块 Vue-router
  await installRouter(app);
  // 注册全局自定义指令
  Object.entries(directives).forEach(([name, directive]) => {
    app.directive(name, directive);
  });
  // 注册国际化
  installI18n(app);

  app.mount('#app');
}

setupApp().catch((error) => {
  console.error('应用初始化失败:', error);
});
