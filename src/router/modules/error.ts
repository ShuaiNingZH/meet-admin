import type { RouteRecordRaw } from 'vue-router';

export default {
  path: '/error',
  name: 'Error',
  redirect: '/error/404',
  meta: {
    title: '错误展示',
    icon: 'icon-park-outline:caution',
  },
  children: [
    {
      path: '404',
      name: '404',
      component: () => import('@/views/error/404.vue'),
      meta: {
        title: '404',
        icon: 'icon-park-outline:caution',
      },
    },
  ],
} satisfies RouteRecordRaw;
