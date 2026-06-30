<script setup lang="ts">
import initVersionRocket from '@/config/versionRocket';
import { elLocale } from '@/constants/locale';
import { useAppStore } from '@/stores';

const appStore = useAppStore();

// 配置 Element Plus 国际化
const locale = computed(() => {
  return elLocale[appStore.locale];
});

// 初始化版本检测
initVersionRocket();
</script>

<template>
  <el-config-provider :locale :size="appStore.size">
    <router-view />
  </el-config-provider>
</template>
