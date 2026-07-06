<script setup lang="ts">
import type { SortableEvent } from 'vue-draggable-plus';
import type { TableColumnCheck, TableColumnChecks, TableColumns } from './types.ts';
import { cloneDeep } from 'lodash-es';
import { VueDraggable } from 'vue-draggable-plus';
import { renderIcon } from '@/utils/icon';
import { getColumnChecks } from './utils.ts';

defineOptions({ name: 'TableHeader', inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  title: '',
  loading: false,
  initColumns: () => [],
});

const emits = defineEmits(['refresh']);

const columnChecks = defineModel<TableColumnChecks>({
  required: true,
});

interface Props {
  title?: string;
  loading?: boolean;
  initColumns?: TableColumns;
}

const { t } = useI18n();

// 刷新
function handleRefresh() {
  emits('refresh');
}

// 全选
const checkAll = computed<boolean>({
  get: () => columnChecks.value.every(item => item.checked),
  set: (val) => {
    columnChecks.value.forEach((item) => {
      item.checked = val;
    });
  },
});

// 是否半选
const isIndeterminate = computed<boolean>(() => {
  const checkedCount = columnChecks.value.filter(item => item.checked).length;
  return checkedCount > 0 && checkedCount < columnChecks.value.length;
});

// 重置列设置
function handleRepossess() {
  columnChecks.value = getColumnChecks(cloneDeep(props.initColumns));
}

/**
 * @description 固定列
 * @param val 当前列
 * @param type 固定类型
 */
function handleFixed(val: TableColumnCheck, type: 'left' | 'right') {
  columnChecks.value.forEach((item) => {
    if (item.prop === val.prop) {
      if (item.fixed === type || item.fixed === true) {
        item.fixed = false;
      }
      else {
        item.fixed = type;
      }
    }
  });
}

/**
 * @description 自定义拖拽排序
 * @param event 拖拽事件
 */
function handleCustomUpdate(event: SortableEvent) {
  const { oldIndex, newIndex } = event;

  // 确保 oldIndex 和 newIndex 存在并有效
  if (oldIndex == null || newIndex == null) {
    console.error('Invalid indices in SortableEvent:', event);
    return;
  }

  // 确保索引在合法范围内
  if (
    oldIndex < 0
    || newIndex < 0
    || oldIndex >= columnChecks.value.length
    || newIndex >= columnChecks.value.length
  ) {
    console.error('Indices out of bounds:', { oldIndex, newIndex });
    return;
  }

  // 拷贝数组并重新排序，避免直接操作原始数据
  const updatedColumns = [...columnChecks.value];
  const [item] = updatedColumns.splice(oldIndex, 1);
  item && updatedColumns.splice(newIndex, 0, item);

  // 更新数据
  columnChecks.value = updatedColumns;
}
</script>

<template>
  <app-flex class="table-header" align="center" justify="space-between" :size="8" wrap>
    <app-flex :size="8" wrap>
      <slot name="title">
        <div class="text-16 font-600">
          {{ title }}
        </div>
      </slot>
    </app-flex>
    <app-flex :size="8" wrap align="center">
      <slot name="button" />
      <!-- 刷新 -->
      <el-button @click="handleRefresh">
        <template #icon>
          <app-icon :class="loading ? 'is-loading' : ''" icon="Refresh" />
        </template>
        {{ t('common.refresh') }}
      </el-button>
      <!-- 列设置 -->
      <el-popover trigger="click" width="200" popper-style="padding: 0;" popper-class="columnPopover">
        <template #reference>
          <el-button :icon="renderIcon('Setting')">
            {{ t('components.table.columnSettings') }}
          </el-button>
        </template>
        <div class="flex-y-center justify-between p-[2px_12px_0] border-b">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate">
            {{ t('common.selectAll') }}
          </el-checkbox>
          <el-link type="primary" underline="never" @click="handleRepossess">
            {{ t('common.reset') }}
          </el-link>
        </div>
        <el-scrollbar max-height="36vh">
          <VueDraggable v-model="columnChecks" handle=".handle" :animation="300" draggable=".noFixed" :custom-update="handleCustomUpdate">
            <div v-for="item in columnChecks" :key="item.prop" :class="item.fixed ? '' : 'noFixed'" class="p-[8px_12px]">
              <app-flex align="center" justify="space-between">
                <app-flex class="overflow-hidden" align="center" :size="8">
                  <app-icon class="handle" :class="item.fixed ? 'cursor-not-allowed' : 'cursor-move'" icon="Rank" size="16" />
                  <el-checkbox v-model="item.checked" class="column-popover-checkbox overflow-hidden">
                    <app-text>
                      {{ item.label }}
                    </app-text>
                  </el-checkbox>
                </app-flex>
                <app-flex :size="4">
                  <el-tooltip :content="t('components.table.pinToLeft')">
                    <app-icon
                      class="cursor-pointer" icon="icon-park-outline:to-left"
                      :color="item.fixed === true || item.fixed === 'left' ? 'var(--el-color-primary)' : ''" size="16"
                      @click="handleFixed(item, 'left')"
                    />
                  </el-tooltip>
                  <el-tooltip :content="t('components.table.pinToRight')">
                    <app-icon
                      class="cursor-pointer" icon="icon-park-outline:to-right"
                      :color="item.fixed === 'right' ? 'var(--el-color-primary)' : ''"
                      size="16" @click="handleFixed(item, 'right')"
                    />
                  </el-tooltip>
                </app-flex>
              </app-flex>
            </div>
          </VueDraggable>
        </el-scrollbar>
      </el-popover>
    </app-flex>
  </app-flex>
</template>

<style scoped lang="scss">
.table-header {
  :deep(.el-button) {
    & + .el-button {
      margin-left: 0;
    }
  }
}
</style>

<style lang="scss">
.columnPopover {
  .el-checkbox {
    .el-checkbox__label {
      overflow: hidden;
    }
  }
}
</style>
