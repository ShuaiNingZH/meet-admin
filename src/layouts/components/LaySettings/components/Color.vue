<script setup lang="ts">
import { defaultThemeColor, predefineColors } from '@/config/settings.ts';
import { useTheme } from '@/hooks';
import { useAppStore } from '@/stores';

defineOptions({ name: 'ColorSettings' });

const { t } = useI18n();

const appStore = useAppStore();
const { themeColor } = storeToRefs(appStore);

const { setThemeColor } = useTheme();
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
