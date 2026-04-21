import type { RouteRecordRaw } from 'vue-router';

export default {
  path: '/error',
  redirect: '/error/404',
  meta: {
    title: '错误',
    hideInMenu: true,
    hideInTag: true,
  },
  children: [
    {
      path: '404',
      name: '404',
      component: () => import('@/views/error/404.vue'),
      meta: {
        title: '404',
        hideInMenu: true,
        hideInTag: true,
      },
    },
  ],
} satisfies RouteRecordRaw;
