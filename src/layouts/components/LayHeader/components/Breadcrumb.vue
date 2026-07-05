<script setup lang="ts">
import { useAppStore, useRouteStore } from '@/stores';
import { renderIcon } from '@/utils';

defineOptions({ name: 'Breadcrumb' });

const routeStore = useRouteStore();
const appStore = useAppStore();
</script>

<template>
  <el-breadcrumb class="flex-center" :separator-icon="renderIcon('ArrowRight')">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="item of routeStore.breadcrumbs" :key="item!.path" :to="item">
        <app-flex class="whitespace-nowrap" :size="8" align="center">
          <app-icon v-if="appStore.breadcrumbIconShow && item!.meta?.icon" :icon="item!.meta!.icon" :size="16" />
          {{ item!.meta!.title }}
        </app-flex>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
