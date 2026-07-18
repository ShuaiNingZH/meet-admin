<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { useIframeStore } from '@/stores/iframe';
import { useTabStore } from '@/stores/tab';

defineOptions({ name: 'LayIframe' });

const route = useRoute();

const iframeStore = useIframeStore();
const { iframes } = storeToRefs(iframeStore);

// 当前路由是否为 iframe 页面
const isIframePage = computed(() => Boolean(route.meta.iframe && route.meta.link));

// 路由变化：激活当前 iframe，并清理未开启缓存的后台 iframe
watch(() => route.fullPath, () => {
  if (isIframePage.value)
    iframeStore.activateIframe(route);

  iframeStore.pruneInactive(route.fullPath);
}, { immediate: true });

// 标签关闭后销毁对应 iframe
const tabStore = useTabStore();
const { tabs } = storeToRefs(tabStore);

watch(() => tabs.value.map(item => item.path), (paths) => {
  iframeStore.pruneByTabs(paths, route.fullPath);
});

// 「重新加载」当前 iframe 页面：loadFlag 关闭时销毁，恢复时重建
const appStore = useAppStore();
const { loadFlag, transitionAnimation } = storeToRefs(appStore);

watch(loadFlag, (value) => {
  if (!isIframePage.value)
    return;

  if (value)
    iframeStore.activateIframe(route);
  else
    iframeStore.removeIframe(route.fullPath);
});
</script>

<template>
  <transition :name="transitionAnimation" appear>
    <div v-show="isIframePage && loadFlag" class="lay-iframe">
      <div
        v-for="item of iframes" v-show="item.path === route.fullPath" :key="item.path"
        v-loading="item.loading" element-loading-text="加载中..." class="iframe-box"
      >
        <iframe class="iframe" :src="item.link" @load="item.loading = false" />
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.lay-iframe {
  position: absolute;
  inset: 0;
  padding: var(--spacing-base);
  background-color: var(--el-bg-color-page);

  .iframe-box {
    height: 100%;

    .iframe {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: var(--el-border-radius-base);
      background-color: var(--el-bg-color);
    }
  }
}
</style>
