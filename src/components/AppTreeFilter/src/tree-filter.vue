<script setup lang="ts">
import type { FilterNodeMethodFunction, TreeInstance } from 'element-plus';
import type { TreeOptionProps } from 'element-plus/es/components/tree/src/tree.type';
import type { AppTreeFilterProps } from './types.ts';

defineOptions({ name: 'AppTreeFilter' });

const treeFilterProps = withDefaults(defineProps<AppTreeFilterProps>(), {
  props: (): TreeOptionProps => ({
    children: 'children',
    label: 'label',
    disabled: 'disabled',
  }),
  nodeKey: 'id',
  valueObject: false,
  multiple: false,
  defaultExpandAll: true,
  checkStrictly: false,
  card: false,
  width: 240,
});

const emits = defineEmits(['change']);

const model = defineModel({
  type: [Array, String, Number, Object],
  default: undefined,
});

const { t } = useI18n();

const placeholder = computed(() => treeFilterProps.placeholder || t('components.treeFilter.placeholder'));

// 默认值选中节点
const selected = computed(() => {
  // 如果是多选
  if (treeFilterProps.multiple) {
    // 如果是数组，返回该数组
    if (Array.isArray(model.value)) {
      // 如果 valueObject 为 true，则返回每一项的 nodeKey 值
      if (treeFilterProps.valueObject) {
        return model.value.map(item => item[treeFilterProps.nodeKey]);
      }
      else {
        // 否则返回数组
        return model.value;
      }
    }
    else {
      // 否则返回空数组
      return [];
    }
  }
  // 如果是单选
  else {
    // 如果 valueObject 为 true，则返回该对象的 nodeKey 值
    if (treeFilterProps.valueObject) {
      return model.value[treeFilterProps.nodeKey];
    }
    // 否则返回该对象
    return model.value;
  }
});

// 树节点实例
const treeRef = ref<TreeInstance>();

// 搜索树节点
const filterText = ref('');
watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

// 搜索树节点的方法
const filterNode: FilterNodeMethodFunction = (value, data, node) => {
  if (!value)
    return true;

  let labelValue = '';

  if (typeof treeFilterProps.props.label === 'string') {
    labelValue = data[treeFilterProps.props.label];
  }
  else if (typeof treeFilterProps.props.label === 'function') {
    labelValue = treeFilterProps.props.label(data, node);
  }
  return labelValue.includes(value);
};

// 切换树节点的展开或折叠状态
function toggleTreeNodes(isExpand: boolean) {
  const nodes = treeRef.value?.store.nodesMap;
  if (!nodes)
    return;

  for (const node in nodes) {
    if (Object.hasOwn(nodes, node)) {
      nodes[node] && (nodes[node].expanded = isExpand);
    }
  }
}

// 单选
function handleTreeClick(data: { [key: string]: any }) {
  // 多选不触发
  if (treeFilterProps.multiple)
    return;

  // 如果 valueObject 为 true，则返回每一项
  if (treeFilterProps.valueObject) {
    model.value = data;
    emits('change', data);
  }
  else {
    // 否则返回该对象的 nodeKey 值
    model.value = data[treeFilterProps.nodeKey];
    emits('change', data[treeFilterProps.nodeKey]);
  }
}

// 多选
function handleTreeCheck() {
  // 如果 model 的值不是数组，则返回
  if (!Array.isArray(model.value))
    return;

  // 如果 valueObject 为 true，则返回每一项
  if (treeFilterProps.valueObject) {
    model.value = treeRef.value?.getCheckedNodes();
    emits('change', treeRef.value?.getCheckedNodes());
  }
  else {
    // 否则返回选中的 key
    model.value = treeRef.value?.getCheckedKeys();
    emits('change', treeRef.value?.getCheckedKeys());
  }
}

// 复用模板
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const style = computed(() => ({
  width: `${treeFilterProps.width}px`,
  minWidth: '220px',
}));
</script>

<template>
  <DefineTemplate>
    <app-flex class="app-tree-filter h-full" vertical>
      <app-flex :size="0" align="center">
        <el-input v-model="filterText" :placeholder clearable />
        <el-dropdown trigger="click">
          <app-icon icon="More" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toggleTreeNodes(true)">
                {{ t('components.treeFilter.expand') }}
              </el-dropdown-item>
              <el-dropdown-item @click="toggleTreeNodes(false)">
                {{ t('components.treeFilter.packUp') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </app-flex>
      <el-scrollbar>
        <el-tree
          ref="treeRef"
          :data="data"
          :props="props"
          :node-key="nodeKey"
          :empty-text="emptyText"
          :current-node-key="!multiple ? selected : ''"
          :default-checked-keys="multiple ? selected : []"
          :filter-node-method="filterNode"
          :show-checkbox="multiple"
          :check-on-click-node="multiple"
          :highlight-current="!multiple"
          :expand-on-click-node="false"
          :default-expand-all :check-strictly
          @node-click="handleTreeClick"
          @check="handleTreeCheck"
        >
          <template #default="scope">
            <app-text class="el-tree-node__label">
              <slot :row="scope">
                {{ scope.node.label }}
              </slot>
            </app-text>
          </template>
        </el-tree>
      </el-scrollbar>
    </app-flex>
  </DefineTemplate>
  <el-card v-if="card" class="wh-full" :style body-class="wh-full">
    <ReuseTemplate />
  </el-card>
  <ReuseTemplate v-else :style />
</template>

<style scoped lang="scss">
@use '../style/index';
</style>
