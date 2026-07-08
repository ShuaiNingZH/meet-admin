<script setup lang="ts">
import type { TableInstance } from 'element-plus';
import type { AppBaseTableProps, AppTableProps } from './types.ts';
import { omit } from 'lodash-es';
import { AppCard } from '@/components/AppCard';
import BaseTable from './base-table.vue';
import TableHeader from './table-header.vue';
import { useColumns } from './table.tsx';
import { createTableExpose } from './utils.ts';

defineOptions({ name: 'AppTable', inheritAttrs: false });

const props = withDefaults(defineProps<AppTableProps>(), {
  border: true,
  fit: true,
  showHeader: true,
  loading: false,
  loadingText: '',
  selectOnIndeterminate: true,
  card: false,
  columns: () => [],
});

// refresh 携带页码 1，配合 useTable 的 getTableData(pageIndex) 使刷新回到第一页
const emits = defineEmits<{ refresh: [page: number] }>();

const { t } = useI18n();

// 刷新
function handleRefresh() {
  emits('refresh', 1);
}

const { columns, initColumns, columnChecks } = useColumns(props);

// 处理 loadingText 的默认值
const loadingText = computed(() => {
  return props.loadingText || t('common.loading');
});

const attrs = useAttrs() as Record<string, any>;
// attrs 用来接收父组件传递的属性，例如: 事件
const tableProps = computed(() => {
  return {
    ...attrs,
    ...omit(props, ['title', 'card', 'loading', 'loadingText', 'columns', 'pagination']),
  } as AppBaseTableProps;
});

const baseTableRef = useTemplateRef<TableInstance>('baseTableRef');

defineExpose(createTableExpose(baseTableRef));
</script>

<template>
  <component :is="card ? AppCard : 'div'" v-loading="loading" :element-loading-text="loadingText" class="app-table">
    <!-- 表格头部 -->
    <TableHeader v-model="columnChecks" :title :loading :init-columns="initColumns" @refresh="handleRefresh">
      <template v-if="$slots.title" #title>
        <slot name="title" />
      </template>
      <template v-if="$slots.button" #button>
        <slot name="button" :data="data" />
      </template>
    </TableHeader>
    <slot name="header" />
    <!-- 表格主体 -->
    <BaseTable ref="baseTableRef" v-bind="tableProps" :columns="columns">
      <template v-if="$slots.append" #append>
        <slot name="append" />
      </template>
      <template v-if="$slots.empty" #empty>
        <slot name="empty" />
      </template>
    </BaseTable>
    <slot name="foot" />
    <!-- 表格分页 -->
    <el-pagination
      v-if="pagination && typeof pagination === 'object'"
      v-bind="pagination!"
      v-model:page-size="pagination.pageSize"
      v-model:current-page="pagination.currentPage"
      @size-change="pagination.sizeChange!"
      @current-change="pagination.currentChange!"
    />
  </component>
</template>
