<script setup lang="ts">
import type { AppIconProps } from './types.ts';
import * as EPIcons from '@element-plus/icons-vue';
import { Icon } from '@iconify/vue';
import { omit } from 'lodash-es';

defineOptions({ name: 'AppIcon' });

const props = defineProps<AppIconProps>();

const iconProps = computed(() => omit(props, 'icon'));

const epIcons = EPIcons as unknown as Record<string, Component>;
</script>

<template>
  <el-icon class="app-icon" v-bind="iconProps">
    <Icon v-if="icon.includes(':')" :icon="icon" />
    <component :is="epIcons[icon]" v-else />
  </el-icon>
</template>
