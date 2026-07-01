import type { RouteRecordRaw } from 'vue-router';
import { LAYOUT_NAME } from '@/constants/router.ts';

const homePage = import.meta.env.VITE_HOME_PATH;

export default {
  path: '/',
  name: LAYOUT_NAME,
  redirect: homePage,
  component: () => import('@/layouts/index.vue'),
  children: [
    {
      path: homePage,
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',
        icon: 'icon-park-outline:home',
      },
    },
  ],
} satisfies RouteRecordRaw;
