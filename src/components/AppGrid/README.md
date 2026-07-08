# AppGrid 栅格布局组件

## 组件简介

AppGrid 是一个基于 CSS Grid
的响应式栅格布局组件，支持根据屏幕尺寸自动调整布局。该组件提供了灵活的网格系统，可以轻松创建复杂的页面布局，还支持展开收起功能，特别适合表单布局和数据展示。

## 功能特点

- 响应式布局：根据不同屏幕尺寸自动调整列数和间距
- 灵活布局：支持自定义列数、行间距和列间距
- 展开收起：支持内容的展开和收起功能，按「列数」精确计算可见项
- 后缀元素：支持设置后缀元素，常用于操作按钮；单行时紧跟最后一项，多行时自动靠右对齐
- 精确控制：支持设置元素的跨度和偏移量，且会自动约束在列数范围内，避免布局错位

## 使用方法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { AppGrid } from '@/components/AppGrid';

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
- 后缀元素（`suffix`）的定位会根据布局自动调整：当所有子项能容纳在一行内时，后缀元素紧跟最后一个普通项；否则固定靠右对齐
- 折叠与单行的判断按「列数」而非「项数」计算：当普通项与后缀项占据的总列数超过 `cols * collapsedRows` 时才会启用折叠功能（`span`、`offset` 都会计入列数）
- 子项的 `span` 以及 `offset + span` 都会被限制在不超过 `cols`，超出部分按占满一整行处理，避免撑出隐式列导致后续项错位
- 在收起状态下会优先显示靠前（按真实 DOM 顺序）的非后缀元素，后缀元素始终可见
- 在特殊情况下（xs 断点且 cols=1），收起状态只会显示指定行数（`collapsedRows`）的元素

## 内部实现

组件内部基于 Vue 3 的 Composition API 实现，主要包含以下几个部分：

1. 响应式断点：根据窗口宽度自动计算当前的响应式断点
2. 布局计算：根据配置计算网格的列数和间距，并约束子项的 `span`、`offset` 不超过列数
3. 项管理：以 `Map` 维护所有子项的注册信息（是否后缀、`span`、`offset`），区分普通项和后缀项
4. 展开收起逻辑：按列数（含 `span`、`offset`）并以真实 DOM 顺序计算哪些项应该可见
5. 上下文提供：通过依赖注入将网格信息（列数、是否单行、是否可折叠、可见性等）提供给子项
