<script setup lang="ts">
import type { BasicColorSchema } from '@vueuse/core';
import { useAppStore } from '@/stores';
import { renderIcon } from '@/utils';

defineOptions({ name: 'ThemeSwitch' });

const { t } = useI18n();

const appStore = useAppStore();
const { colorMode } = storeToRefs(appStore);

const themeList = [
  { key: 'light', icon: 'icon-park-outline:sun-one' },
  { key: 'dark', icon: 'icon-park-outline:moon' },
  { key: 'auto', icon: 'icon-park-outline:laptop-computer' },
];

function setThemeMode(mode: BasicColorSchema) {
  colorMode.value = mode;
}
</script>

<template>
  <el-dropdown class="theme-switch" trigger="click" @command="setThemeMode">
    <span>
      <div class="wrapper">
        <app-icon v-if="colorMode === 'light'" icon="icon-park-outline:sun-one" />
        <app-icon v-if="colorMode === 'dark'" icon="icon-park-outline:moon" />
        <app-icon v-if="colorMode === 'auto'" icon="icon-park-outline:laptop-computer" />
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in themeList"
          :key="item.key"
          :command="item.key"
          :icon="renderIcon(item.icon)"
          :disabled="colorMode === item.key"
        >
          {{ t(`theme.${item.key}`) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
