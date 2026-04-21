# AppTreeFilter 树形筛选组件

## 组件简介

AppTreeFilter 是一个基于 Element Plus
的树形筛选组件，提供了强大的树形数据筛选功能。组件支持单选和多选模式，内置了搜索过滤、展开/折叠全部节点等功能，可用于各种需要从树形结构中选择数据的场景。

## 功能特点

- 支持单选和多选模式
- 内置搜索过滤功能
- 一键展开/折叠全部节点
- 灵活的值返回方式（nodeKey或完整对象）
- 支持严格选择模式（父子节点是否联动）
- 可选卡片式展示风格
- 自定义宽度设置
- 自定义节点内容渲染
- 国际化支持

## 使用方法

```vue

<script setup lang="ts">
  import {AppTreeFilter} from '@/components/AppTreeFilter';
  import {ref} from 'vue';

  // 单选模式
  const selectedNode = ref('');

  // 多选模式
  const selectedNodes = ref([]);

  // 返回完整对象
  const selectedNodeObject = ref({});

  // 树形数据
  const treeData = ref([
    {
      id: '1',
      label: '一级节点',
      children: [
        {
          id: '1-1',
          label: '二级节点 1',
          code: 'A001'
        },
        {
          id: '1-2',
          label: '二级节点 2',
          code: 'A002'
        }
      ]
    },
    {
      id: '2',
      label: '一级节点 2',
      code: 'B001'
    }
  ]);

  // 节点变化事件处理
  function handleNodeChange(val) {
    console.log('选中的节点变化了', val);
  }
</script>

<template>
  <!-- 基础单选用法 -->
  <AppTreeFilter
    v-model="selectedNode"
    :data="treeData"
    node-key="id"
  />

  <!-- 多选模式 -->
  <AppTreeFilter
    v-model="selectedNodes"
    :data="treeData"
    node-key="id"
    multiple
  />

  <!-- 返回完整对象 -->
  <AppTreeFilter
    v-model="selectedNodeObject"
    :data="treeData"
    node-key="id"
    value-object
    @change="handleNodeChange"
  />

  <!-- 卡片式布局 -->
  <AppTreeFilter
    v-model="selectedNode"
    :data="treeData"
    card
    :width="300"
  />

  <!-- 自定义节点内容 -->
  <AppTreeFilter
    v-model="selectedNode"
    :data="treeData"
  >
    <template #default="{ row }">
      <span>{{ row.node.label }} ({{ row.data.code }})</span>
    </template>
  </AppTreeFilter>
</template>
```

## 参数说明

### Props

| 参数名              | 类型                                    | 默认值                                                            | 必填 | 说明                               |
|------------------|---------------------------------------|----------------------------------------------------------------|----|----------------------------------|
| v-model          | array[] \| string \| number \| object | -                                                              | 是  | 绑定值，单选时为字符串/数字/对象，多选时为数组         |
| data             | any[]                                 | []                                                             | 是  | 树形数据数组                           |
| props            | object                                | { children: 'children', label: 'label', disabled: 'disabled' } | 否  | 配置选项，参考Element Plus Tree组件的props |
| nodeKey          | string                                | 'id'                                                           | 否  | 每个树节点用来作为唯一标识的属性                 |
| placeholder      | string                                | '请选择'                                                          | 否  | 搜索框占位文本                          |
| emptyText        | string                                | -                                                              | 否  | 内容为空时展示的文本                       |
| valueObject      | boolean                               | false                                                          | 否  | 是否返回节点对象，默认返回节点的nodeKey          |
| multiple         | boolean                               | false                                                          | 否  | 是否多选                             |
| defaultExpandAll | boolean                               | true                                                           | 否  | 是否默认展开所有节点                       |
| checkStrictly    | boolean                               | false                                                          | 否  | 是否严格遵循父子不互相关联的做法                 |
| card             | boolean                               | false                                                          | 否  | 是否使用卡片样式展示                       |
| width            | number                                | 240                                                            | 否  | 组件宽度（像素）                         |

### Events

| 事件名    | 类型                   | 说明         |
|--------|----------------------|------------|
| change | (value: any) => void | 选中值发生变化时触发 |

### Slots

| 插槽名     | 说明                                     |
|---------|----------------------------------------|
| default | 自定义树节点内容，参数为 { row } 包含 node 和 data 属性 |

## 内部实现

组件内部实现了以下功能：

1. 基于Element Plus的Tree组件封装，增强了其功能
2. 支持单选和多选两种模式，通过multiple属性控制
3. 集成了搜索过滤功能，可按节点标签搜索
4. 提供了展开/折叠全部节点的便捷操作
5. 灵活的数据绑定模式，支持返回节点对象或节点的唯一标识
6. 使用createReusableTemplate实现模板复用，支持卡片和非卡片两种展示方式
7. 自动处理节点选中状态，支持单选和多选模式下的不同处理逻辑

## 注意事项

- 使用valueObject属性时，v-model绑定值会包含完整的节点对象
- 使用多选模式时，请确保v-model绑定的是一个数组
- 组件默认会展开所有节点，不需要可设置defaultExpandAll为false
- 使用checkStrictly属性可控制父子节点选择是否关联
- 组件内部使用了app-text组件展示节点内容，支持文本溢出提示
- 搜索功能会自动过滤不匹配的节点，仅显示匹配的内容
