<script setup lang="ts">
import type { TableInstance } from 'element-plus';
import type { AppBaseTableProps } from './types.ts';
import { flattenColumns, renderColumns } from './table.tsx';

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
    ...props,
  };
});

const baseTableRef = useTemplateRef<TableInstance>('baseTableRef');

const itemKey = ref(0);

watchEffect(() => {
  if (props.columns || props.data) {
    itemKey.value = Math.random();
  }
});

// 处理懒加载时，重新获取父级数据时，子级数据不会被清空问题
watch(() => props.data, () => {
  if (props.lazy) {
    baseTableRef.value!.store.states.treeData.value = {};
    baseTableRef.value!.store.states.lazyTreeNodeMap.value = {};
  }
});

// 特殊处理合计行
function setSummaryMethod(data: any) {
  return props?.summaryMethod!({
    ...data,
    columns: flattenColumns(props.columns),
  }) as any[];
}

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
  <el-table ref="baseTableRef" :key="itemKey" v-bind="tableProps" :summary-method="setSummaryMethod">
    <component :is="renderColumns(props.columns)" />
    <!-- 插入至表格最后一行之后的内容 -->
    <template #append>
      <slot name="append" />
    </template>
    <!-- 当数据为空时自定义的内容 -->
    <template #empty>
      <slot name="empty" />
    </template>
  </el-table>
</template>
