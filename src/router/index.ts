import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { isEmpty } from 'lodash-es';
import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from '@/config/nprogress';
import Layout from '@/router/modules/index.ts';
import remainingRouter from '@/router/modules/remainingRouter.ts';
import { initRouter } from '@/router/utils.ts';
import { useUserStore } from '@/stores';
import { setDocumentTitle } from '@/utils';

// 业务路由模块：自动挂载到 Layout 下（排除容器与 remaining）
const businessModules = import.meta.glob<{ default: RouteRecordRaw }>(
  ['./modules/*.ts', '!./modules/index.ts', '!./modules/remainingRouter.ts'],
  { eager: true },
);
const businessRoutes = Object.values(businessModules).map(mod => mod.default);

// Layout 作为容器，业务路由与动态路由保持同一层级挂到其 children 下
const routes: RouteRecordRaw[] = [
  { ...Layout, children: [...Layout.children, ...businessRoutes] },
];

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
      if (to.path !== '/login') {
        return '/login';
      }
      return;
    }

    // 已登录，访问登录页重定向到首页
    if (to.path === '/login') {
      return { path: import.meta.env.VITE_HOME_PATH };
    }

    if (isEmpty(userStore.userInfo)) {
      // 用户信息为空，初始化路由
      try {
        await initRouter();
        return { path: to.redirectedFrom?.fullPath ?? to.fullPath, replace: true };
      }
      catch (error) {
        console.error('初始化路由失败', error);
        userStore.handleLogout();
        return '/login';
      }
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
