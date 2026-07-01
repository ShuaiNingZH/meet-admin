import type { RouteRecordRaw } from 'vue-router';

export default {
  path: '/demo',
  name: 'Demo',
  redirect: '/demo/grid',
  children: [
    {
      path: 'grid',
      name: 'DemoGrid',
      component: () => import('@/views/demo/grid/index.vue'),
      meta: {
        title: 'Grid 组件演示',
        icon: 'icon-park-outline:all-application',
      },
    },
  ],
} satisfies RouteRecordRaw;
