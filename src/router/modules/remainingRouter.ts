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
    path: '/:pathMatch(.*)*',
    name: 'PathMatch',
    redirect: '/error/404',
    meta: {
      title: 'pathMatch',
      hideInMenu: true,
      hideInTag: true,
    },
  },
] satisfies Array<RouteRecordRaw>;
