<script setup lang="ts">
import type { BasicColorSchema } from '@vueuse/core';
import { useTheme } from '@/hooks';
import { useAppStore } from '@/stores';
import { renderIcon } from '@/utils';

defineOptions({ name: 'ThemeSwitch' });

const { t } = useI18n();
const { colorStore } = useTheme();

const appStore = useAppStore();
const { buttonTip } = storeToRefs(appStore);

const themeList = [
  { key: 'light', icon: 'icon-park-outline:sun-one' },
  { key: 'dark', icon: 'icon-park-outline:moon' },
  { key: 'auto', icon: 'icon-park-outline:laptop-computer' },
];

function setThemeMode(mode: BasicColorSchema) {
  colorStore.value = mode;
}
</script>

<template>
  <el-dropdown class="theme-switch" trigger="click" @command="setThemeMode">
    <span>
      <el-tooltip :content="t(`theme.${colorStore}`)" placement="left" :disabled="!buttonTip">
        <div class="wrapper">
          <app-icon v-if="colorStore === 'light'" icon="icon-park-outline:sun-one" />
          <app-icon v-if="colorStore === 'dark'" icon="icon-park-outline:moon" />
          <app-icon v-if="colorStore === 'auto'" icon="icon-park-outline:laptop-computer" />
        </div>
      </el-tooltip>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in themeList"
          :key="item.key"
          :command="item.key"
          :icon="renderIcon(item.icon)"
          :disabled="colorStore === item.key"
        >
          {{ t(`theme.${item.key}`) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
