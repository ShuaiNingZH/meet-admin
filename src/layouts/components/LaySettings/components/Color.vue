<script setup lang="ts">
import type { ThemeColorKey } from '@/config/settings.ts';
import { defaultThemeColor, predefineColors } from '@/config/settings.ts';
import { useAppStore } from '@/stores';

defineOptions({ name: 'ColorSettings' });

const { t } = useI18n();

const appStore = useAppStore();
const { themeColor } = storeToRefs(appStore);

// 设置主题颜色
function setThemeColor(color: string | null, type: ThemeColorKey) {
  // 如果 color 为空，则使用默认颜色
  if (!color) {
    color = defaultThemeColor[type] ?? defaultThemeColor.primary;
    ElMessage({
      type: 'success',
      message: `${t(`theme.color.${type}`)} ${t('theme.reset')} ${color}`,
    });
  }

  themeColor.value[type] = color;
}
</script>

<template>
  <app-flex vertical>
    <template v-for="key of Object.keys(defaultThemeColor)" :key="key">
      <app-flex justify="space-between" align="center">
        {{ t(`theme.color.${key}`) }}
        <el-color-picker :model-value="themeColor[key]" :predefine="predefineColors" @change="setThemeColor($event, key)" />
      </app-flex>
    </template>
  </app-flex>
</template>
