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
        icon: 'logos:element',
        link: 'https://element-plus.org/zh-CN',
        iframe: true,
        keepAlive: true,
      },
    },
    {
      path: 'github',
      name: 'LinkGithub',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: 'GitHub 仓库',
        icon: 'icon-park-outline:github',
        link: 'https://github.com/wjp980108/meet-admin',
      },
    },
    {
      path: 'vue',
      name: 'LinkVue',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: 'Vue 文档',
        icon: 'logos:vue',
        link: 'https://cn.vuejs.org',
        iframe: true,
        keepAlive: true,
      },
    },
    {
      path: 'vite',
      name: 'LinkVite',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: 'Vite 文档',
        icon: 'material-icon-theme:vite',
        link: 'https://cn.vite.dev',
        iframe: true,
      },
    },
    {
      path: 'vueuse',
      name: 'LinkVueuse',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: 'Vueuse 文档',
        icon: 'logos:vueuse',
        link: 'https://vueuse.org',
        iframe: true,
      },
    },
    {
      path: 'unoCSS',
      name: 'LinkUnoCSS',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: 'UnoCSS 文档',
        icon: 'logos:unocss',
        link: 'https://unocss.dev',
        iframe: true,
      },
    },
    {
      path: 'blog',
      name: 'LinkBlog',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: '个人博客',
        icon: 'logos:blogger',
        link: 'https://blog.wjp.plus',
        iframe: true,
      },
    },
  ],
} satisfies RouteRecordRaw;
