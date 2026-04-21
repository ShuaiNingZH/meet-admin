# AppGrid 栅格布局组件

## 组件简介

AppGrid 是一个基于 CSS Grid
的响应式栅格布局组件，支持根据屏幕尺寸自动调整布局。该组件提供了灵活的网格系统，可以轻松创建复杂的页面布局，还支持展开收起功能，特别适合表单布局和数据展示。

## 功能特点

- 响应式布局：根据不同屏幕尺寸自动调整列数和间距
- 灵活布局：支持自定义列数、行间距和列间距
- 展开收起：支持内容的展开和收起功能
- 后缀元素：支持设置后缀元素，常用于固定位置的操作按钮
- 精确控制：支持设置元素的跨度和偏移量

## 使用方法

```vue

<script setup lang="ts">
  import {AppGrid} from '@/components/AppGrid';
  import {ref} from 'vue';

  const isCollapsed = ref(true);
</script>

<template>
  <!-- 基础栅格布局 -->
  <AppGrid :cols="4" :row-gap="16" :col-gap="16">
    <AppGrid.GridItem v-for="i in 8" :key="i">
      <div class="grid-item">
        项目 {{ i }}
      </div>
    </AppGrid.GridItem>
  </AppGrid>

  <!-- 响应式布局 -->
  <AppGrid :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }">
    <AppGrid.GridItem v-for="i in 12" :key="i">
      <div class="grid-item">
        项目 {{ i }}
      </div>
    </AppGrid.GridItem>
  </AppGrid>

  <!-- 自定义跨度和偏移 -->
  <AppGrid :cols="6">
    <AppGrid.GridItem :span="2">
      <div class="grid-item">
        跨度为2
      </div>
    </AppGrid.GridItem>
    <AppGrid.GridItem :span="2" :offset="2">
      <div class="grid-item">
        跨度为2，偏移2
      </div>
    </AppGrid.GridItem>
  </AppGrid>

  <!-- 带展开收起功能的布局 -->
  <AppGrid :cols="3" :collapsed="isCollapsed" :collapsed-rows="1">
    <AppGrid.GridItem v-for="i in 9" :key="i">
      <div class="grid-item">
        项目 {{ i }}
      </div>
    </AppGrid.GridItem>
    <AppGrid.GridItem suffix>
      <button @click="isCollapsed = !isCollapsed">
        {{ isCollapsed ? '展开' : '收起' }}
      </button>
    </AppGrid.GridItem>
  </AppGrid>
</template>

<style scoped>
  .grid-item {
    padding: 20px;
    background-color: #f5f7fa;
    border-radius: 4px;
  }
</style>
```

## 参数说明

### AppGrid Props

| 参数名           | 类型               | 默认值   | 必填 | 说明                |
|---------------|------------------|-------|----|-------------------|
| cols          | number \| object | 24    | 否  | 列数，可以是固定数值或响应式对象  |
| rowGap        | number \| object | 0     | 否  | 行间距，可以是固定数值或响应式对象 |
| colGap        | number \| object | 0     | 否  | 列间距，可以是固定数值或响应式对象 |
| collapsed     | boolean          | false | 否  | 是否处于收起状态          |
| collapsedRows | number           | 1     | 否  | 收起状态下显示的行数        |

### AppGrid.GridItem Props

| 参数名    | 类型      | 默认值   | 必填 | 说明        |
|--------|---------|-------|----|-----------|
| span   | number  | 1     | 否  | 元素跨越的列数   |
| offset | number  | 0     | 否  | 元素左侧的偏移列数 |
| suffix | boolean | false | 否  | 是否为后缀元素   |

### 响应式值对象

当为`cols`、`rowGap`或`colGap`传入对象时，可以指定不同断点下的值：

```ts
interface ResponsiveValue {
  xl?: number; // >= 1920px
  lg?: number; // >= 1200px
  md?: number; // >= 992px
  sm?: number; // >= 768px
  xs?: number; // < 768px
}
```

### Slots

#### AppGrid Slots

| 插槽名     | 说明                       |
|---------|--------------------------|
| default | 网格容器的内容，通常放置 GridItem 组件 |

#### AppGrid.GridItem Slots

| 插槽名     | 插槽作用域              | 说明                               |
|---------|--------------------|----------------------------------|
| default | { hasCollapsible } | 网格项的内容，hasCollapsible 表示是否有可折叠内容 |

## 注意事项

- 响应式值会按照优先级从当前断点开始查找：`xl -> lg -> md -> sm -> xs`
- 在收起状态下，会优先显示非后缀元素，后缀元素通常用于放置控制按钮
- 当设置了`suffix`为`true`时，该元素会自动定位到最右侧
- 当内容项数量超过`cols * collapsedRows`时，才会启用折叠功能
- 在特殊情况下（xs断点且cols=1），收起状态只会显示指定行数的元素

## 内部实现

组件内部基于 Vue 3 的 Composition API 实现，主要包含以下几个部分：

1. 响应式断点：根据窗口宽度自动计算当前的响应式断点
2. 布局计算：根据配置计算网格的列数和间距
3. 项管理：维护所有子项的注册状态，区分普通项和后缀项
4. 展开收起逻辑：根据当前状态计算哪些项应该可见
5. 上下文提供：通过依赖注入将网格信息提供给子项
