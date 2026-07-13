import type { RouteRecordRaw } from 'vue-router';

export default {
  path: '/error',
  name: 'Error',
  redirect: '/error/404',
  meta: {
    title: '异常页',
    icon: 'icon-park-outline:attention',
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
    {
      path: '403',
      name: '403',
      component: () => import('@/views/error/403.vue'),
      meta: {
        title: '403',
        icon: 'icon-park-outline:lock-one',
      },
    },
    {
      path: '500',
      name: '500',
      component: () => import('@/views/error/500.vue'),
      meta: {
        title: '500',
        icon: 'icon-park-outline:bug',
      },
    },
  ],
} satisfies RouteRecordRaw;
