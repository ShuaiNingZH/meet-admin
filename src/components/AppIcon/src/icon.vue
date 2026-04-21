<script setup lang="ts">
import type { AppIconProps } from './types.ts';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { Icon } from '@iconify/vue';
import { omit } from 'lodash-es';

defineOptions({ name: 'AppIcon' });

const props = withDefaults(defineProps<AppIconProps>(), {
  icon: '',
});

const iconProps = computed(() => omit(props, 'icon'));

const icons: AnyObj = ElementPlusIconsVue;
</script>

<template>
  <el-icon class="app-icon" v-bind="iconProps">
    <Icon v-if="icon.includes(':')" :icon="icon" />
    <component :is="icons[icon]" v-else />
  </el-icon>
</template>
