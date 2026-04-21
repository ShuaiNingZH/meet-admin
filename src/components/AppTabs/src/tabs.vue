<script setup lang="ts">
import type { AppTabsProps } from './types.ts';
import { tabsEmits } from 'element-plus/es/components/tabs/src/tabs';
import { useEventForwarder } from '@/hooks';

defineOptions({ name: 'AppTabs' });

const props = defineProps<AppTabsProps>();

const emit = defineEmits(tabsEmits);

const activeName = defineModel({ type: String, default: '' });

const activeComponent = computed(() => {
  return props.tabList.find(item => item.value === activeName.value)?.component;
});

const { eventHandlers } = useEventForwarder(emit, tabsEmits);
</script>

<template>
  <app-card class="app-tabs main-container">
    <el-tabs v-model="activeName" v-on="eventHandlers">
      <el-tab-pane
        v-for="item of tabList" :key="item.value" :label="item.label" :name="item.value" :disabled="item.disabled"
      />
    </el-tabs>
    <el-scrollbar view-class="app-tabs__scrollbar">
      <keep-alive>
        <component :is="activeComponent" v-bind="$attrs" />
      </keep-alive>
    </el-scrollbar>
  </app-card>
</template>

<style scoped lang="scss">
.app-tabs {
  padding: 0;

  :deep(.el-tabs) {
    padding: 20px 20px 0;

    .el-tabs__header {
      margin-bottom: 0;
    }
  }

  :deep(.app-tabs__scrollbar) {
    height: 100%;
    padding: 0 20px 20px;
  }
}
</style>
