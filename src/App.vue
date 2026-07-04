<script setup lang="ts">
import { elLocale } from '@/constants/locale';
import { useAppStore } from '@/stores';

const appStore = useAppStore();

// 配置 Element Plus 国际化
const locale = computed(() => {
  return elLocale[appStore.locale];
});
</script>

<template>
  <el-config-provider :locale :size="appStore.size">
    <router-view />
    <!-- 函数式弹窗宿主 -->
    <app-popup-host />
  </el-config-provider>
</template>
