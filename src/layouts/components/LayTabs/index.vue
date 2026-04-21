<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus';
import type { ContextMenuItem } from '@/components';
import type { TabStyle } from '@/config/settings.ts';
import type { TabsMenu } from '@/stores';
import { navigationFailure } from '@/constants/router';
import { useNotification } from '@/hooks';
import { useAppStore, useTabStore } from '@/stores';

defineOptions({ name: 'LayTabs' });

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const tabStore = useTabStore();
const appStore = useAppStore();

const { tabs, currentTabPath } = storeToRefs(tabStore);
const { initTab, addTab } = tabStore;

onMounted(() => {
  initTab();
});

watchEffect(() => {
  currentTabPath.value = route.fullPath;
  addTab({
    icon: route.meta.icon!,
    title: route.meta.title,
    path: route.fullPath,
    name: route.name as string,
    keepAlive: route.meta.keepAlive!,
    hideInTag: route.meta.hideInTag!,
  });
});

const { notify } = useNotification();

// 点击 tab 切换路由
function tabClick(tabItem: TabsPaneContext) {
  const fullPath = tabItem.props.name as string;
  if (fullPath === route.fullPath)
    return notify(navigationFailure());

  router.push(fullPath);
}

// 关闭 tab
function tabRemove(name: (string | number)) {
  tabStore.closeTab(name as string);
}

// 判断是否可以关闭
function isClosable(route: TabsMenu) {
  return route.path !== import.meta.env.VITE_HOME_PATH;
}

const currentRoute = reactive({
  path: '',
});

const contextmenuRef = ref();

// 右击 tab 显示菜单
function handleRightClickTab(e: MouseEvent, route: TabsMenu) {
  Object.assign(currentRoute, route);
  contextmenuRef.value.onShowContextmenu(route, {
    x: e.clientX,
    y: e.clientY + 10,
  });
}

// 点击右击菜单
function handleSelect(menuItem: ContextMenuItem) {
  const actions: AnyObj = {
    reload: appStore.reloadPage,
    close: () => tabStore.closeTab(currentRoute.path),
    closeOther: () => tabStore.closeOtherTabs(currentRoute.path),
    closeLeft: () => tabStore.closeLeftTabs(currentRoute.path),
    closeRight: () => tabStore.closeRightTabs(currentRoute.path),
    closeAll: tabStore.closeAllTabs,
  };
  actions[menuItem.key]();
}

const homePage = import.meta.env.VITE_HOME_PATH;

// 右击菜单选项
const options = computed(() => {
  const list: ContextMenuItem[] = [
    {
      key: 'reload',
      disabled: !(currentRoute.path === tabStore.currentTabPath),
      icon: 'icon-park-outline:redo',
    },
    {
      key: 'close',
      show: currentRoute.path !== homePage,
      icon: 'icon-park-outline:close',
    },
    {
      key: 'closeOther',
      icon: 'icon-park-outline:delete-four',
    },
    {
      key: 'closeLeft',
      show: currentRoute.path !== homePage,
      icon: 'icon-park-outline:to-left',
    },
    {
      key: 'closeRight',
      icon: 'icon-park-outline:to-right',
    },
    {
      key: 'closeAll',
      icon: 'icon-park-outline:fullwidth',
    },
  ];

  return list;
});

type TabMap = Record<TabStyle, string> & AnyObj;
// 不同 tab 的样式
const tabMap: TabMap = {
  card: 'card-tab',
  dynamic: 'dynamic-tab',
  simple: 'simple-tab',
};
const tabClass = computed(() => tabMap[appStore.tabStyle]);
</script>

<template>
  <div class="tabs-box" :class="tabClass">
    <div class="tabs-menu">
      <el-tabs v-model="currentTabPath" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane
          v-for="item of tabs" :key="item.path"
          :label="item.title" :name="item.path"
          :closable="isClosable(item)"
        >
          <template #label>
            <div class="tabs-item" @contextmenu.prevent="handleRightClickTab($event, item)">
              <app-icon v-if="item.icon" class="tabs-icon" :icon="item.icon" />
              {{ item.title }}
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <app-dropdown ref="contextmenuRef" v-slot="slotProps" :width="120" :items="options" @menu-click="handleSelect">
      <span>{{ t(`tab.${slotProps.item.key}`) }}</span>
    </app-dropdown>
  </div>
</template>

<style scoped lang="scss">
@use 'cardTab';
@use 'dynamicTab';
@use 'simpleTab';

.tabs-box {
  .tabs-menu {
    :deep(.el-tabs) {
      .el-tabs__header {
        margin: 0;

        .el-tabs__nav-wrap {
          .el-tabs__nav {
            border: none;

            .el-tabs__item {
              color: var(--el-text-color-primary);
              padding-left: 0;
              padding-right: 0;

              &:not(.is-closable) {
                .tabs-item {
                  padding-right: 10px;
                }
              }

              .tabs-item {
                display: flex;
                align-items: center;
                height: 100%;
                //padding-left: 10px;

                .tabs-icon {
                  margin-right: 4px;
                  font-size: 14px;
                }
              }

              &.is-active {
                color: var(--el-color-primary);

                .is-icon-close {
                  margin-right: 10px;
                }
              }
            }
          }

          .el-tabs__nav-prev {
            box-shadow: 5px 0 5px -6px #ccc;
          }

          .el-tabs__nav-next {
            box-shadow: -5px 0 5px -6px #ccc;
          }
        }
      }
    }
  }
}
</style>
