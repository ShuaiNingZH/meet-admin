<script setup lang="ts">
import type { TableInstance } from 'element-plus';
import type { AppBaseTableProps } from './types.ts';
import { omit } from 'lodash-es';
import { flattenColumns, renderColumns } from './table.tsx';
import { createTableExpose } from './utils.ts';

defineOptions({ name: 'AppBaseTable', inheritAttrs: false });

const props = withDefaults(defineProps<AppBaseTableProps>(), {
  rowKey: 'id',
  indent: 16,
  showHeader: true,
  border: true,
  fit: true,
  selectOnIndeterminate: true,
});

const attrs = useAttrs() as Record<string, any>;
// attrs 用来接收父组件传递的属性，例如: 事件
const tableProps = computed(() => {
  return {
    ...attrs,
    ...omit(props, ['columns', 'summaryMethod']),
  };
});

const baseTableRef = useTemplateRef<TableInstance>('baseTableRef');

const itemKey = ref(0);

watch(() => props.columns, () => {
  itemKey.value++;
});

// 处理懒加载时，重新获取父级数据时，子级数据不会被清空问题
watch(() => props.data, () => {
  if (props.lazy && baseTableRef.value) {
    baseTableRef.value.store.states.treeData.value = {};
    baseTableRef.value.store.states.lazyTreeNodeMap.value = {};
  }
});

// 特殊处理合计行，将嵌套的列配置展平后传给合计方法
function setSummaryMethod(data: any) {
  return props.summaryMethod!({
    ...data,
    columns: flattenColumns(props.columns),
  }) as any[];
}

defineExpose(createTableExpose(baseTableRef));
</script>

<template>
  <el-table
    ref="baseTableRef" :key="itemKey" v-bind="tableProps"
    :summary-method="summaryMethod ? setSummaryMethod : undefined"
  >
    <component :is="renderColumns(props.columns)" />
    <!-- 插入至表格最后一行之后的内容 -->
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
    <!-- 当数据为空时自定义的内容 -->
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
  </el-table>
</template>
