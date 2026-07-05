import type { RouteRecordRaw } from 'vue-router';

export default {
  path: '/demo',
  name: 'Demo',
  redirect: '/demo/grid',
  meta: {
    title: '组件演示',
    icon: 'icon-park-outline:all-application',
  },
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
    {
      path: 'popup',
      name: 'DemoPopup',
      component: () => import('@/views/demo/popup/index.vue'),
      meta: {
        title: 'Popup 组件演示',
        icon: 'icon-park-outline:browser',
      },
    },
  ],
} satisfies RouteRecordRaw;
