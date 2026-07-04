<script setup lang="ts">
import type { TableInstance } from 'element-plus';
import type { AppBaseTableProps, AppTableProps } from './types.ts';
import { omit } from 'lodash-es';
import BaseTable from './base-table.vue';
import TableHeader from './table-header.vue';
import { useTable } from './table.tsx';

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

const emits = defineEmits(['refresh']);

const { t } = useI18n();

// 刷新
function handleRefresh() {
  emits('refresh', 1);
}

const { columns, initColumns, columnChecks } = useTable(props);

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

// 复用模板
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

defineExpose(new Proxy({}, {
  get(_target, key) {
    return baseTableRef.value?.[key as keyof TableInstance];
  },
  has(_target, key) {
    return key in baseTableRef.value!;
  },
}));
</script>

<template>
  <!-- 复用模板 -->
  <DefineTemplate>
    <!-- 表格头部 -->
    <TableHeader v-model="columnChecks" :title :loading :init-columns="initColumns" @refresh="handleRefresh">
      <template #title>
        <slot name="title" />
      </template>
      <template #button>
        <slot name="button" :data="data" />
      </template>
    </TableHeader>
    <slot name="header" />
    <!-- 表格主体 -->
    <BaseTable ref="baseTableRef" v-bind="tableProps" :columns="columns">
      <template #append>
        <slot name="append" />
      </template>
      <template #empty>
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
  </DefineTemplate>
  <!-- 带有卡片效果的表格 -->
  <app-card v-if="card" v-loading="loading" :element-loading-text="loadingText" class="app-table">
    <ReuseTemplate />
  </app-card>
  <!-- 没有卡片效果的表格 -->
  <div v-else v-loading="loading" :element-loading-text="loadingText" class="app-table">
    <ReuseTemplate />
  </div>
</template>
