<script setup lang="ts">
import type { DropdownInstance, Measurable, TabsPaneContext } from 'element-plus';
import type { TabStyle } from '@/config/settings.ts';
import type { TabsMenu } from '@/stores';
import { navigationFailure } from '@/constants/router';
import { useNotification } from '@/hooks';
import { useAppStore, useTabStore } from '@/stores';
import { renderIcon } from '@/utils';

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

// 右击菜单当前作用的 tab 路径
const contextTabPath = ref('');

const contextmenuRef = ref<DropdownInstance>();

// 虚拟触发元素：让 el-dropdown 弹层锚定到鼠标右击的坐标处
// cursor 仅在 getBoundingClientRect 中被 Popper 命令式读取，无需响应式
const cursor = shallowRef({ x: 0, y: 0 });
const virtualRef: Measurable = {
  getBoundingClientRect: () => DOMRect.fromRect({ x: cursor.value.x, y: cursor.value.y, width: 0, height: 0 }),
};

// 右击 tab 显示菜单
async function handleRightClickTab(e: MouseEvent, route: TabsMenu) {
  contextTabPath.value = route.path;
  // cursor.value.x = e.clientX;
  // cursor.value.y = e.clientY;
  cursor.value = { x: e.clientX, y: e.clientY };
  // 先关闭再打开，确保菜单重新定位到当前右击位置
  // contextmenuRef.value?.handleClose();
  // await nextTick();
  contextmenuRef.value?.handleOpen();
}

interface ContextMenuItem {
  key: string;
  icon?: string;
  disabled?: boolean;
  show?: boolean;
}

// 右击菜单各项对应的操作
const actions: AnyObj = {
  reload: appStore.reloadPage,
  close: () => tabStore.closeTab(contextTabPath.value),
  closeOther: () => tabStore.closeOtherTabs(contextTabPath.value),
  closeLeft: () => tabStore.closeLeftTabs(contextTabPath.value),
  closeRight: () => tabStore.closeRightTabs(contextTabPath.value),
  closeAll: tabStore.closeAllTabs,
};

// 点击右击菜单
function handleSelect(menuItem: ContextMenuItem) {
  actions[menuItem.key]();
}

const homePage = import.meta.env.VITE_HOME_PATH;

// 右击菜单选项
const options = computed(() => {
  const list: ContextMenuItem[] = [
    {
      key: 'reload',
      disabled: !(contextTabPath.value === tabStore.currentTabPath),
      icon: 'icon-park-outline:redo',
    },
    {
      key: 'close',
      show: contextTabPath.value !== homePage,
      icon: 'icon-park-outline:close',
    },
    {
      key: 'closeOther',
      icon: 'icon-park-outline:delete-four',
    },
    {
      key: 'closeLeft',
      show: contextTabPath.value !== homePage,
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

  return list.filter(item => item.show !== false);
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
          v-for="item of tabs" :key="item.path" :label="item.title" :name="item.path"
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
    <el-dropdown
      ref="contextmenuRef" trigger="contextmenu" placement="bottom-start" virtual-triggering
      :virtual-ref="virtualRef" @command="handleSelect"
    >
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item of options" :key="item.key" :command="item" :disabled="item.disabled"
            :icon="renderIcon(item.icon)"
          >
            {{ t(`tab.${item.key}`) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
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
