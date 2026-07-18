import type { RouteRecordRaw } from 'vue-router';

export default {
  path: '/link',
  name: 'Link',
  redirect: '/link/element-plus',
  meta: {
    title: '外部页面',
    icon: 'icon-park-outline:link-two',
    sort: 80,
  },
  children: [
    {
      path: 'element-plus',
      name: 'LinkElementPlus',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: 'Element Plus 文档',
        icon: 'icon-park-outline:browser',
        link: 'https://element-plus.org/zh-CN/',
        iframe: true,
        keepAlive: true,
      },
    },
    {
      path: 'github',
      name: 'LinkGithub',
      // 外链由路由守卫拦截后新窗口打开，组件不会真正渲染，仅作兜底
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: 'GitHub 仓库',
        icon: 'icon-park-outline:github',
        link: 'https://github.com/wjp980108/meet-admin',
      },
    },
  ],
} satisfies RouteRecordRaw;
