# AppIcon 图标组件

## 组件简介

AppIcon 是一个通用的图标组件，整合了 Element Plus 图标库和 Iconify
图标库，提供了统一的使用方式。通过这个组件，可以方便地使用来自不同图标库的图标，而无需关心底层实现细节。

## 功能特点

- 统一接口：提供统一的组件接口，简化图标使用
- 多库支持：支持 Element Plus 内置图标和 Iconify 海量图标集
- 样式定制：支持自定义图标颜色和大小
- 智能识别：自动识别图标类型并使用对应的渲染方式

## 使用方法

```vue

<script setup lang="ts">
  import {AppIcon} from '@/components/AppIcon';
</script>

<template>
  <!-- 使用 Element Plus 内置图标 -->
  <AppIcon icon="Edit"/>
  <AppIcon icon="Delete"/>
  <AppIcon icon="Search"/>

  <!-- 使用 Iconify 图标库中的图标 -->
  <AppIcon icon="mdi:home"/>
  <AppIcon icon="fa:user"/>
  <AppIcon icon="icon-park-outline:help"/>

  <!-- 自定义颜色和大小 -->
  <AppIcon icon="Warning" color="#E6A23C" size="24"/>
  <AppIcon icon="mdi:alert" color="red" size="32px"/>

  <!-- 在按钮中使用 -->
  <el-button type="primary">
    <AppIcon icon="Plus"/>
    添加
  </el-button>
</template>
```

## 参数说明

### Props

| 参数名   | 类型               | 默认值 | 必填 | 说明                                                                           |
|-------|------------------|-----|----|------------------------------------------------------------------------------|
| icon  | string           | ''  | 是  | 图标名称。使用Element Plus图标时直接使用图标名称（如"Edit"），使用Iconify图标时使用带有前缀的图标名称（如"mdi:home"） |
| color | string           | -   | 否  | 图标颜色，支持各种CSS颜色值                                                              |
| size  | string \| number | -   | 否  | 图标大小，可以是数字或带单位的字符串                                                           |

## 注意事项

- 使用 Element Plus 图标时，名称必须与图标组件名称保持一致（如"Edit"对应`<Edit/>`组件）
- 使用 Iconify 图标库时，名称必须包含冒号（如"mdi:home"），格式为"前缀:图标名"
- 组件内部使用的是 Element Plus 的 `<el-icon>` 组件作为容器，继承了其样式特性
- 可以通过 CSS 变量自定义图标默认颜色和大小

## 内部实现

组件内部基于 Vue 3 的 Composition API 实现，主要包含以下几个部分：

1. 图标库集成：整合了Element Plus和Iconify两个图标库
2. 图标类型判断：通过检测图标名称中是否包含冒号来区分图标类型
3. 条件渲染：根据图标类型使用不同的渲染方式
4. 样式传递：将颜色和大小属性传递给内部的图标组件
