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
    {
      path: 'text',
      name: 'DemoText',
      component: () => import('@/views/demo/text/index.vue'),
      meta: {
        title: 'Text 组件演示',
        icon: 'icon-park-outline:text',
      },
    },
    {
      path: 'editor',
      name: 'DemoEditor',
      component: () => import('@/views/demo/editor/index.vue'),
      meta: {
        title: 'Editor 组件演示',
        icon: 'icon-park-outline:editor',
      },
    },
  ],
} satisfies RouteRecordRaw;
