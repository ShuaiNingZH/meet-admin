<script setup lang="ts">
/**
 * iframe 页面的路由占位组件
 *
 * 注意：本组件不渲染 iframe。iframe 节点一旦从文档中移除再插回就会重新加载，
 * 无法用 keep-alive 缓存，因此实际的 iframe 由布局层的 LayIframe 常驻渲染
 * （见 src/layouts/components/LayIframe.vue，数据源为 src/stores/iframe.ts），
 * 通过 v-show 切换显示，本组件渲染的内容会被其覆盖。
 *
 * 它看似为空但不可删除，作用有三：
 * 1. 满足 RouteRecordRaw 的类型约束（路由至少要有 component / children / redirect 之一）；
 * 2. 避免 vue-router 对无组件路由的开发环境警告（missing "component(s)" or "children"）；
 * 3. 让 router-view 在 iframe 路由下仍有内容可进出场，保证过渡流程与滚动容器结构正常
 *    （用户实际看到的切换动画来自 LayIframe 覆盖层自身的 transition，本组件的动画被其遮挡）。
 *
 * 使用方式：iframe 菜单的路由配置 component 指向本组件，并在 meta 中设置
 * link（外部地址）+ iframe: true，可选 keepAlive: true 开启缓存，示例见
 * src/router/modules/link.ts；动态菜单由 src/router/utils.ts 的 menuToRoutes 自动处理。
 */
defineOptions({ name: 'IframeView' });
</script>

<template>
  <div class="main-container" />
</template>
