<script setup lang="ts">
import LayFooter from '@/layouts/components/LayFooter.vue';
import LayHeader from '@/layouts/components/LayHeader/index.vue';
import LayMenu from '@/layouts/components/LayMenu/index.vue';
import LayTabs from '@/layouts/components/LayTabs/index.vue';
import { useAppStore, useRouteStore } from '@/stores';
import { isEmbedded } from '@/utils';

defineOptions({ name: 'Layout' });

const { t } = useI18n();

const appStore = useAppStore();
const routeStore = useRouteStore();

const {
  transitionAnimation,
  loadFlag,
  watermark,
  footer,
} = storeToRefs(appStore);

const watermarkConfig = reactive({
  content: 'Meet you',
  font: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, .15)',
  },
});

const isDark = useDark();
watchEffect(() => {
  watermarkConfig.font.color = isDark.value ? 'rgba(255, 255, 255, .15)' : 'rgba(0, 0, 0, .15)';
});
</script>

<template>
  <el-watermark class="watermark wh-full" :content="watermark ? watermarkConfig.content : ''" :font="watermarkConfig.font">
    <el-container>
      <LayMenu v-if="!isEmbedded()" />
      <el-container>
        <el-header v-if="!isEmbedded()">
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
    padding: 5px;
    display: flex;
    flex-direction: column;
    min-height: 100%;

    &:has(.main-container) {
      height: 100%;
    }
  }
}
</style>
