import type { RouteRecordRaw } from 'vue-router';

export default {
  path: '/ai',
  name: 'Ai',
  redirect: '/ai/chat',
  meta: {
    title: 'AI 助手',
    icon: 'icon-park-outline:robot-one',
  },
  children: [
    {
      path: 'chat',
      name: 'AiChat',
      component: () => import('@/views/ai/chat/index.vue'),
      meta: {
        title: 'AI 对话',
        icon: 'icon-park-outline:robot-one',
        keepAlive: true,
      },
    },
  ],
} satisfies RouteRecordRaw;
