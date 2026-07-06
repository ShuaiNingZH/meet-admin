<script setup lang="ts">
import Avatar from '@/layouts/components/LayHeader/components/Avatar.vue';
import Breadcrumb from '@/layouts/components/LayHeader/components/Breadcrumb.vue';
import Locale from '@/layouts/components/LayHeader/components/Locale.vue';
import ThemeSwitch from '@/layouts/components/LayHeader/components/ThemeSwitch.vue';
import SearchMenu from '@/layouts/components/LayMenu/components/SearchMenu.vue';
import LaySettings from '@/layouts/components/LaySettings/index.vue';
import { useAppStore } from '@/stores/app';

defineOptions({ name: 'LayHeader' });

const appStore = useAppStore();
const { loadFlag, breadcrumbShow, fullscreen } = storeToRefs(appStore);

// 搜索菜单
const showSearchMenu = ref(false);
function handleSearchMenu() {
  showSearchMenu.value = true;
}

const headerRef = useTemplateRef<HTMLElement>('headerRef');
const { width } = useElementSize(headerRef, { width: window.innerWidth, height: 0 });
// 自动隐藏面包屑
const isShowBreadcrumb = ref(true);
// 自动隐藏右侧按钮
const isShowRight = ref(true);

const debouncedUpdate = useDebounceFn((width: number) => {
  isShowBreadcrumb.value = width > 768;
  isShowRight.value = width > 405;
}, 100);

watchEffect(() => {
  debouncedUpdate(width.value);
});
</script>

<template>
  <app-flex ref="headerRef" class="p-[8px_12px] border-b" justify="space-between" align="center">
    <!-- 左侧 -->
    <app-flex class="overflow-hidden" :size="8" align="center">
      <div class="wrapper" @click="appStore.reloadPage()">
        <app-icon :class="loadFlag ? '' : 'is-loading'" icon="icon-park-outline:refresh" />
      </div>
      <Breadcrumb v-if="isShowBreadcrumb && breadcrumbShow" />
    </app-flex>
    <!-- 右侧 -->
    <app-flex :size="8" align="center">
      <template v-if="isShowRight">
        <div class="wrapper" @click="handleSearchMenu">
          <app-icon icon="icon-park-outline:search" />
        </div>
        <Locale />
        <div class="wrapper" @click="appStore.toggleFullScreen">
          <app-icon v-if="fullscreen" icon="icon-park-outline:off-screen-one" />
          <app-icon v-else icon="icon-park-outline:full-screen-one" />
        </div>
        <ThemeSwitch />
        <LaySettings />
      </template>
      <Avatar />
    </app-flex>
  </app-flex>
  <!-- 搜索菜单弹窗 -->
  <SearchMenu v-model="showSearchMenu" />
</template>
