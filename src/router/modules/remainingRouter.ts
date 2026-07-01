import type { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      hideInMenu: true,
      hideInTag: true,
    },
    component: () => import('@/views/login/index.vue'),
  },
  {
    // 全屏 404：无匹配路由时的兜底目标，不套后台布局、不进菜单
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      hideInMenu: true,
      hideInTag: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'PathMatch',
    redirect: '/404',
    meta: {
      title: 'pathMatch',
      hideInMenu: true,
      hideInTag: true,
    },
  },
] satisfies Array<RouteRecordRaw>;
