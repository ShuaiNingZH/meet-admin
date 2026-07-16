<script setup lang="ts">
import dayjs from 'dayjs';
import LayFooter from '@/layouts/components/LayFooter.vue';
import LayHeader from '@/layouts/components/LayHeader/index.vue';
import LayMenu from '@/layouts/components/LayMenu/index.vue';
import LayTabs from '@/layouts/components/LayTabs/index.vue';
import { initRouter } from '@/router/utils.ts';
import { useAppStore } from '@/stores/app';
import { useRouteStore } from '@/stores/route';
import { useUserStore } from '@/stores/user';

defineOptions({ name: 'Layout' });

const { t } = useI18n();

const appStore = useAppStore();
const routeStore = useRouteStore();
const userStore = useUserStore();

const {
  transitionAnimation,
  loadFlag,
  watermark,
  footer,
  locale,
  isDark,
} = storeToRefs(appStore);

const router = useRouter();
const currentRoute = useRoute();

// 切换语言后重新拉取菜单
watch(locale, async () => {
  await initRouter();
  await router.replace(currentRoute.fullPath);
});

// 水印内容
const watermarkContent = computed(() => {
  const { nickname } = userStore.userInfo;
  return watermark.value ? `${nickname || import.meta.env.VITE_APP_NAME} ${dayjs().format('YYYY-MM-DD')}` : '';
});

// 水印字体样式
const watermarkFont = computed(() => ({
  fontSize: 14,
  color: isDark.value ? 'rgba(255, 255, 255, .15)' : 'rgba(0, 0, 0, .15)',
}));
</script>

<template>
  <el-watermark class="wh-full" :content="watermarkContent" :font="watermarkFont" :z-index="9999">
    <el-container>
      <LayMenu />
      <el-container>
        <el-header>
          <LayHeader />
          <LayTabs />
        </el-header>
        <el-main class="bg-[var(--el-bg-color-page)]" style="--el-main-padding: 0">
          <el-scrollbar class="main-scrollbar" view-class="main-scrollbar-view">
            <router-view v-slot="{ Component, route }">
              <transition :name="transitionAnimation" mode="out-in" appear>
                <keep-alive :include="routeStore.keepAliveName">
                  <component :is="Component" v-if="loadFlag" :key="route.fullPath" />
                </keep-alive>
              </transition>
            </router-view>
          </el-scrollbar>
        </el-main>
        <LayFooter v-if="footer" />
        <el-tooltip :content="t('common.backToTop')" placement="top">
          <el-backtop target=".main-scrollbar .el-scrollbar__wrap" />
        </el-tooltip>
      </el-container>
    </el-container>
  </el-watermark>
</template>

<style scoped lang="scss">
.main-scrollbar {
  :deep(.main-scrollbar-view) {
    padding: var(--spacing-base);
    display: flex;
    flex-direction: column;
    min-height: 100%;

    &:has(.main-container) {
      height: 100%;
    }
  }
}
</style>
