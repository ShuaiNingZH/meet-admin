# AppFlex 弹性布局组件

## 组件简介

AppFlex 是一个基于 Flexbox 布局的容器组件，提供了简单易用的 API 来实现各种灵活的布局方式。该组件封装了常用的
Flex 布局属性，使得在项目中可以更加便捷地实现水平布局、垂直布局、间距控制等功能。

## 功能特点

- 灵活布局：支持水平和垂直方向的弹性布局
- 简化配置：封装了常用的 Flex 属性，简化布局代码
- 间距控制：支持设置子元素之间的水平和垂直间距
- 排列方式：支持自定义对齐和排列方式
- 布局反转：支持布局方向的反转

## 使用方法

```vue
<script setup lang="ts">
import { AppFlex } from '@/components/AppFlex';
</script>

<template>
  <!-- 基础水平布局 -->
  <AppFlex>
    <div>元素 1</div>
    <div>元素 2</div>
    <div>元素 3</div>
  </AppFlex>

  <!-- 垂直布局 -->
  <AppFlex vertical>
    <div>元素 1</div>
    <div>元素 2</div>
    <div>元素 3</div>
  </AppFlex>

  <!-- 间距控制 -->
  <AppFlex :size="[16, 8]">
    <div>水平间距为 16px</div>
    <div>垂直间距为 8px</div>
  </AppFlex>

  <!-- 对齐方式 -->
  <AppFlex justify="space-between" align="center">
    <div>左对齐</div>
    <div>居中对齐</div>
    <div>右对齐</div>
  </AppFlex>

  <!-- 自动换行 -->
  <AppFlex wrap :size="[16, 16]">
    <div v-for="i in 10" :key="i">
      项目 {{ i }}
    </div>
  </AppFlex>
</template>
```

## 参数说明

### Props

| 参数名      | 类型                 | 默认值     | 必填 | 说明                                    |
|----------|--------------------|---------|----|---------------------------------------|
| align    | string             | -       | 否  | 垂直排列方式，对应 CSS 的 `align-items` 属性      |
| justify  | string             | 'start' | 否  | 水平排列方式，对应 CSS 的 `justify-content` 属性  |
| inline   | boolean            | false   | 否  | 是否为行内元素，设置为 true 时使用 `inline-flex` 布局 |
| vertical | boolean            | false   | 否  | 是否垂直布局，设置为 true 时子元素垂直排列              |
| reverse  | boolean            | false   | 否  | 是否反向布局，设置为 true 时子元素排列顺序反转            |
| size     | number \| number[] | [8, 12] | 否  | 子元素间距，可以是单个数值或 [水平间距, 垂直间距] 的数组       |
| wrap     | boolean            | false   | 否  | 是否允许换行，仅在水平布局时有效                      |

### Slots

| 插槽名     | 说明     |
|---------|--------|
| default | 容器内的内容 |

## 注意事项

- `vertical` 和 `reverse` 属性会影响 `flex-direction` 的计算
- 当设置 `vertical` 为 true 时，`wrap` 属性不会生效
- `size` 参数可以是单个数值或数组，数组格式为 `[水平间距, 垂直间距]`
- 组件内部使用 CSS 的 `gap` 属性实现间距，确保目标浏览器支持此属性

## 内部实现

组件内部基于 Vue 3 的 Composition API 实现，主要包含以下几个部分：

1. Props 定义：提供布局相关的配置选项
2. 计算属性：根据传入的属性计算最终的 CSS 样式
3. 样式绑定：将计算后的样式应用到容器元素上
