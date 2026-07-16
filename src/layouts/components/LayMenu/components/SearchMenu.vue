<script setup lang="ts">
import { pinyin } from 'pinyin-pro';
import { useRouteStore } from '@/stores/route';

defineOptions({ name: 'SearchMenu' });

const { t } = useI18n();

const showModal = defineModel({
  type: Boolean,
  required: true,
});

const routeStore = useRouteStore();

interface MenuHistoryItem {
  path: string;
  title: string;
  icon?: string;
}

// 搜索历史
const HISTORY_MAX = 8;
const searchHistory = useStorage<MenuHistoryItem[]>('search-menu-history', []);

function addHistory(item: MenuHistoryItem) {
  const list = searchHistory.value.filter(history => history.path !== item.path);
  list.unshift(item);
  searchHistory.value = list.slice(0, HISTORY_MAX);
}

function clearHistory() {
  searchHistory.value = [];
}

function removeHistory(path: string) {
  searchHistory.value = searchHistory.value.filter(history => history.path !== path);
}

// 搜索菜单的名字
const menuName = ref('');

// 是否处于搜索状态
const isSearching = computed(() => !!menuName.value);

interface SearchableMenu {
  path: string;
  title: string;
  icon?: string;
  fullPinyin: string;
  initials: string;
}

// 带拼音信息的菜单列表，仅在菜单数据变化时重新计算拼音，避免每次按键都重复转换
const searchableMenus = computed<SearchableMenu[]>(() => {
  return routeStore.searchMenus.map((item) => {
    const title = item.meta!.title;
    return {
      path: item.path,
      title,
      icon: item.meta?.icon,
      fullPinyin: pinyin(title, { toneType: 'none', separator: '', nonZh: 'removed' }).toLowerCase(),
      initials: pinyin(title, { pattern: 'first', toneType: 'none', separator: '', nonZh: 'removed' }).toLowerCase(),
    };
  });
});

// 展示列表：有搜索词时为搜索结果（支持标题 / 全拼 / 首字母），否则为搜索历史（历史中已失效的菜单会被过滤掉）
const menuList = computed<MenuHistoryItem[]>(() => {
  if (!isSearching.value) {
    return searchHistory.value.flatMap((history) => {
      const menu = searchableMenus.value.find(item => item.path === history.path);
      return menu ? [{ path: menu.path, title: menu.title, icon: menu.icon }] : [];
    });
  }

  const keyword = menuName.value.toLowerCase();
  return searchableMenus.value
    .filter(item => item.title.toLowerCase().includes(keyword) || item.fullPinyin.includes(keyword) || item.initials.includes(keyword))
    .map(item => ({ path: item.path, title: item.title, icon: item.icon }));
});

// 是否按下了上键或下键（用于解决和 mouseenter 事件的冲突）
const isPressUpOrDown = ref(false);

// 当前选中的菜单
const activeMenuPath = ref('');

// 列表变化（输入关键字过滤）时，若当前选中项已不在列表中，默认选中第一项
watch(menuList, (list) => {
  if (!list.some(item => item.path === activeMenuPath.value))
    activeMenuPath.value = list[0]?.path ?? '';
}, { immediate: true });

// 每次打开面板时默认高亮第一项
watch(showModal, (visible) => {
  if (visible)
    activeMenuPath.value = menuList.value[0]?.path ?? '';
});

// 鼠标划入
function onMouseenter(path: string) {
  if (isPressUpOrDown.value)
    return;

  activeMenuPath.value = path;
}

const router = useRouter();

// 关闭回调
function handleClose() {
  menuName.value = '';
  activeMenuPath.value = '';
  showModal.value = false;
}

// 跳转到目标菜单，并写入搜索历史
function navigateTo(path: string) {
  const item = menuList.value.find(menu => menu.path === path);
  if (item)
    addHistory(item);

  router.push(path);
  handleClose();
}

// 按下回车键
function handleKeyEnter() {
  if (!activeMenuPath.value)
    return;

  navigateTo(activeMenuPath.value);
}

// 点击菜单项（不依赖 mouseenter 设置的 activeMenuPath，兼容触屏点击）
function handleSelect(path: string) {
  if (!path)
    return;

  navigateTo(path);
}

const scrollbarRef = ref();

// 根据下标位置进行滚动
function scrollTo(index: number) {
  // 保持2个选项在可视区域内,2个后开始滚动
  const keepIndex = 2;
  // 单个元素的高度，包括了元素的gap和容器的padding
  const elHeight = 63;
  const distance = index * elHeight > keepIndex * elHeight ? index * elHeight - keepIndex * elHeight : 0;
  scrollbarRef.value!.scrollTo({ top: distance });
}

// 按下上键
function handleKeyUp() {
  const { length } = menuList.value;

  if (!length)
    return;

  isPressUpOrDown.value = true;

  // 获取该菜单第一次出现的位置
  const index = menuList.value.findIndex(item => item.path === activeMenuPath.value);
  const nextIndex = index <= 0 ? length - 1 : index - 1;

  activeMenuPath.value = menuList.value?.[nextIndex]?.path ?? '';
  scrollTo(nextIndex);
}

// 按下下键
function handleKeyDown() {
  const { length } = menuList.value;

  if (!length)
    return;

  isPressUpOrDown.value = true;

  // 获取该菜单第一次出现的位置
  const index = menuList.value.findIndex(item => item.path === activeMenuPath.value);
  const nextIndex = index === length - 1 ? 0 : index + 1;

  activeMenuPath.value = menuList.value?.[nextIndex]?.path ?? '';
  scrollTo(nextIndex);
}

// 松开上键或下键
function handleKeyUpDown() {
  isPressUpOrDown.value = false;
}

// 注册快捷键
function registerShortcut() {
  onKeyStroke('Enter', handleKeyEnter);
  onKeyStroke('ArrowUp', handleKeyUp);
  onKeyStroke('ArrowDown', handleKeyDown);
  onKeyStroke(['ArrowUp', 'ArrowDown'], handleKeyUpDown, { eventName: 'keyup' });
  onKeyStroke('k', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      if (showModal.value) {
        handleClose();
      }
      else {
        showModal.value = true;
      }
    }
  });
}

// 输入框实例
const inputRef = ref();
registerShortcut();
</script>

<template>
  <div class="search-menu">
    <el-dialog
      v-model="showModal" top="5vh" width="500" :show-close="false" :header-border="false" :draggable="false"
      close-on-click-modal :before-close="handleClose" @opened="inputRef?.focus()" @closed="inputRef?.blur()"
    >
      <template #header>
        <el-input
          ref="inputRef" v-model="menuName" :placeholder="t('components.searchMenu.placeholder')"
          clearable size="large"
        >
          <template #prefix>
            <app-icon icon="icon-park-outline:search" />
          </template>
        </el-input>
      </template>
      <template v-if="menuList.length">
        <app-flex
          class="p-b-8 p-l-[var(--el-dialog-padding-primary)] p-r-[var(--el-dialog-padding-primary)]"
          justify="space-between" align="center"
        >
          <span class="text-[var(--el-color-primary)]">
            {{ isSearching ? t('components.searchMenu.result') : t('components.searchMenu.history') }}
          </span>
          <span v-if="!isSearching" class="cursor-pointer text-[var(--el-text-color-secondary)]" @click="clearHistory">
            {{ t('components.searchMenu.clearHistory') }}
          </span>
        </app-flex>
        <el-scrollbar ref="scrollbarRef" view-class="p-(t-8 l-16 r-12 b-8)" max-height="400">
          <el-space style="width: 100%" :size="8" fill>
            <template v-for="item of menuList" :key="item.path">
              <el-card
                class="cursor-pointer" :class="{ 'menu-select': item.path === activeMenuPath }"
                @mouseenter="onMouseenter(item.path)"
                @click="handleSelect(item.path)"
              >
                <app-flex justify="space-between" align="center">
                  <app-flex :size="8" align="center">
                    <app-icon v-if="item.icon" :icon="item.icon" :size="20" />
                    <span>{{ item.title }}</span>
                  </app-flex>
                  <app-flex :size="8" align="center">
                    <app-icon
                      v-if="!isSearching" class="remove-icon" icon="icon-park-outline:close"
                      @click.stop="removeHistory(item.path)"
                    />
                    <app-icon v-show="isSearching && item.path === activeMenuPath" icon="fluent:arrow-enter-left-24-regular" />
                  </app-flex>
                </app-flex>
              </el-card>
            </template>
          </el-space>
        </el-scrollbar>
      </template>
      <el-empty v-else :description="isSearching ? t('components.searchMenu.noResult') : t('components.searchMenu.noHistory')" />
      <template #footer>
        <el-space class="w-full" :size="16">
          <div class="flex-y-center">
            <div class="commands">
              ctrl
            </div>
            <div class="commands">
              k
            </div>
            <span class="text-14">{{ t('components.searchMenu.ctrl-k') }}</span>
          </div>
          <div class="flex-y-center">
            <div class="commands">
              <app-icon icon="fluent:arrow-enter-left-24-regular" />
            </div>
            <span class="text-14">{{ t('common.confirm') }}</span>
          </div>
          <div class="flex-y-center">
            <div class="commands">
              <app-icon icon="icon-park-outline:arrow-down" />
            </div>
            <div class="commands">
              <app-icon icon="icon-park-outline:arrow-up" />
            </div>
            <span class="text-14">{{ t('common.switch') }}</span>
          </div>
          <div class="flex-y-center">
            <div class="commands">
              esc
            </div>
            <span class="text-14">{{ t('common.close') }}</span>
          </div>
        </el-space>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.search-menu {
  :deep(.el-dialog) {
    padding: 0;

    .el-dialog__header,
    .el-dialog__footer {
      padding: var(--el-dialog-padding-primary);
    }

    .el-dialog__body {
      padding-right: 1.6px;

      .menu-select {
        color: var(--el-color-white);
        background-color: var(--el-color-primary);
      }

      .remove-icon {
        width: 20px;
        height: 20px;
        padding: 4px;
        border-radius: 50%;
        transition: all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);

        &:hover {
          background-color: rgb(0 0 0 / 10%);
        }
      }
    }

    .el-dialog__footer {
      box-shadow: var(--el-box-shadow);
    }

    .search-result {
      padding: 0 20px;
      color: var(--el-color-primary);
    }
  }
}
</style>
