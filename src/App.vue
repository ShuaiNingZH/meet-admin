<script setup lang="ts">
import initVersionRocket from '@/config/versionRocket';
import { elLocale } from '@/constants/locale';
import { useTheme } from '@/hooks';
import { useAppStore } from '@/stores';
import { isEmbedded } from '@/utils';

const appStore = useAppStore();

// 配置 Element Plus 国际化
const locale = computed(() => {
  return elLocale[appStore.locale];
});

// 初始化版本检测
initVersionRocket();

const { colorStore, colorMode, watchTheme } = useTheme();

// 监听主题切换时更新主题色
watch(colorMode, watchTheme);

// 如果是嵌入式环境，强制使用浅色主题
if (isEmbedded())
  colorStore.value = 'light';
</script>

<template>
  <el-config-provider :locale :size="appStore.size">
    <router-view />
  </el-config-provider>
</template>
