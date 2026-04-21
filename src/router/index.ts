import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { isEmpty } from 'lodash-es';
import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from '@/config/nprogress';
import remainingRouter from '@/router/modules/remainingRouter.ts';
import { initRouter } from '@/router/utils.ts';
import { useUserStore } from '@/stores';
import { authorize, envJudge, setDocumentTitle } from '@/utils';

// 加载所有模块路由，排除 remainingRouter.ts
const modules: AnyObj = import.meta.glob(['./modules/*.ts', '!./modules/remainingRouter.ts'], {
  eager: true,
});

// 路由数组
const routes: RouteRecordRaw[] = [];

// 遍历模块并添加到路由数组
Object.keys(modules).forEach((key) => {
  routes.push(modules[key].default);
});

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routes.concat(remainingRouter),
});

export async function installRouter(app: App) {
  router.beforeEach(async (to) => {
    const userStore = useUserStore();

    NProgress.start();

    // 未登录，处理非登录页面重定向
    if (!userStore.accessToken) {
      // 如果是企业微信 PC 端，直接静默登录
      if (envJudge() === 'com-wx-pc') {
        const code = authorize();

        if (!code)
          return false;

        await userStore.handleLogin(code);
        // 登录成功后重新触发导航，让守卫走 initRouter 流程
        return to.fullPath;
      }
      else {
        if (to.path !== '/login') {
          return '/login';
        }
        return;
      }
    }
    // 已登录，访问登录页重定向到首页
    if (to.path === '/login') {
      return { path: import.meta.env.VITE_HOME_PATH };
    }

    // 已登录，存在用户信息
    if (!isEmpty(userStore.userInfo)) {
      return;
    }

    // 用户信息为空，初始化路由
    try {
      await initRouter();
    }
    catch (error) {
      console.error('初始化路由失败', error);
      userStore.handleLogout();
      return '/login';
    }
  });

  router.afterEach((to) => {
    // 修改网页标题
    setDocumentTitle(to.meta.title);

    // 结束 NProgress
    NProgress.done();
  });

  app.use(router);

  await router.isReady();
}
