<script setup lang="ts">
import { useRouteStore } from '@/stores/route';

defineOptions({ name: 'SearchMenu' });

const { t } = useI18n();

const showModal = defineModel({
  type: Boolean,
  required: true,
});

const { VITE_HOME_PATH } = import.meta.env;

const routeStore = useRouteStore();

// 搜索菜单的名字
const menuName = ref('');

// 获取菜单信息
const getMenus = computed(() => {
  if (!menuName.value)
    return [];

  return routeStore.searchMenus.filter(item => item.meta?.title.includes(menuName.value));
});

// 是否按下了上键或下键（用于解决和 mouseenter 事件的冲突）
const isPressUpOrDown = ref(false);

// 当前选中的菜单
const activeMenuPath = ref('');

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

// 按下回车键或点击
function handleKeyEnter() {
  if (!activeMenuPath.value)
    return;

  router.push(activeMenuPath.value);
  handleClose();
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
  const { length } = getMenus.value;

  if (!length)
    return;

  isPressUpOrDown.value = true;

  // 获取该菜单第一次出现的位置
  const index = getMenus.value.findIndex(item => item.path === activeMenuPath.value);

  if (index === 0) {
    // 获取最后一个菜单
    activeMenuPath.value = getMenus.value[length - 1]?.path ?? VITE_HOME_PATH;
    scrollTo(length - 1);
  }
  else {
    // 获取上一个菜单
    activeMenuPath.value = getMenus.value[index - 1]?.path ?? VITE_HOME_PATH;
    scrollTo(index - 1);
  }
}

// 按下下键
function handleKeyDown() {
  const { length } = getMenus.value;

  if (!length)
    return;

  isPressUpOrDown.value = true;

  // 获取该菜单第一次出现的位置
  const index = getMenus.value.findIndex(item => item.path === activeMenuPath.value);

  if (index === length - 1) {
    // 获取第一个菜单
    activeMenuPath.value = getMenus.value[0]?.path ?? VITE_HOME_PATH;
    scrollTo(0);
  }
  else {
    // 获取下一个菜单
    activeMenuPath.value = getMenus.value[index + 1]?.path ?? VITE_HOME_PATH;
    scrollTo(index + 1);
  }
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
      showModal.value = !showModal.value;
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
      v-model="showModal"
      top="5vh"
      width="500"
      :show-close="false"
      :header-border="false"
      :draggable="false"
      close-on-click-modal
      :before-close="handleClose"
      @opened="inputRef?.focus()"
      @closed="inputRef?.blur()"
    >
      <template #header>
        <el-input ref="inputRef" v-model="menuName" :placeholder="t('components.searchMenu.placeholder')" clearable>
          <template #prefix>
            <app-icon icon="icon-park-outline:search" />
          </template>
        </el-input>
      </template>
      <template v-if="getMenus.length">
        <div class="p-b-8 p-l-[var(--el-dialog-padding-primary)] text-[var(--el-color-primary)]">
          {{ t('components.searchMenu.result') }}
        </div>
        <el-scrollbar ref="scrollbarRef" view-class="p-(t-8 l-16 r-12 b-8)" max-height="400">
          <el-space style="width: 100%" :size="8" fill>
            <template v-for="item of getMenus" :key="item.path">
              <el-card
                class="cursor-pointer"
                :class="{ 'menu-select': item.path === activeMenuPath }"
                @mouseenter="onMouseenter(item.path)"
                @click="handleKeyEnter"
              >
                <app-flex justify="space-between" align="center">
                  <span>{{ item.meta?.title }}</span>
                  <app-icon v-show="item.path === activeMenuPath" icon="fluent:arrow-enter-left-24-regular" />
                </app-flex>
              </el-card>
            </template>
          </el-space>
        </el-scrollbar>
      </template>
      <el-empty v-else :description="t('components.searchMenu.noData')" />
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
