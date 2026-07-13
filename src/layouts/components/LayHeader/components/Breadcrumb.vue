<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { useRouteStore } from '@/stores/route';

defineOptions({ name: 'Breadcrumb' });

const routeStore = useRouteStore();
const appStore = useAppStore();
const router = useRouter();

// 面包屑下拉可选的同级菜单（过滤掉隐藏菜单）
function getSiblings(item: RouteRecordRaw) {
  return (item.children ?? []).filter(child => !child.meta?.hideInMenu);
}

// 选择下拉菜单中的某一级，直接跳转
function handleSelect(target: RouteRecordRaw) {
  router.push({ name: target.name });
}
</script>

<template>
  <el-breadcrumb class="flex-center">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) of routeStore.breadcrumbs"
        :key="item.path"
        :to="getSiblings(item as RouteRecordRaw).length ? undefined : item"
      >
        <el-dropdown
          v-if="getSiblings(item as RouteRecordRaw).length"
          trigger="hover"
          @command="handleSelect"
        >
          <app-flex class="whitespace-nowrap wrapper" :size="4" align="center">
            <app-icon v-if="appStore.breadcrumbIconShow && item.meta?.icon" :icon="item.meta.icon" :size="16" />
            {{ item.meta?.title }}
            <app-icon icon="ArrowDown" :size="12" />
          </app-flex>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="child in getSiblings(item as RouteRecordRaw)"
                :key="child.path"
                :command="child"
                :disabled="child.name === routeStore.breadcrumbs[index + 1]?.name"
              >
                <app-flex :size="8" align="center">
                  <app-icon v-if="appStore.breadcrumbIconShow && child.meta?.icon" :icon="child.meta.icon" :size="16" />
                  {{ child.meta?.title }}
                </app-flex>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <app-flex v-else class="whitespace-nowrap" :size="8" align="center">
          <app-icon v-if="appStore.breadcrumbIconShow && item.meta?.icon" :icon="item.meta.icon" :size="16" />
          {{ item.meta?.title }}
        </app-flex>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
