# AppHelpInfo 帮助提示组件

## 组件简介

AppHelpInfo 是一个轻量级的帮助提示组件，基于 Element Plus 的 Tooltip
组件封装，用于在界面元素旁边显示帮助图标，当用户悬停或点击时展示提示信息。这个组件特别适合用于表单字段说明、功能引导等场景。

## 功能特点

- 简洁易用：提供简单的 API 接口，易于集成到各种场景
- 灵活配置：支持自定义提示内容、触发方式、显示位置等
- 样式定制：可以调整图标颜色、边距等样式
- 多种触发方式：支持悬停、点击、焦点和右键等多种触发方式

## 使用方法

```vue

<script setup lang="ts">
  import {AppHelpInfo} from '@/components/AppHelpInfo';
</script>

<template>
  <!-- 基础用法 -->
  <div class="field-label">
    用户名
    <AppHelpInfo content="请输入2-20个字符的用户名"/>
  </div>

  <!-- 主题 -->
  <div class="field-label">
    主题
    <AppHelpInfo
      content="通过设置 effect 来修改主题，默认值为 dark"
      effect="light"
    />
  </div>

  <!-- 自定义颜色和位置 -->
  <div class="field-label">
    密码
    <AppHelpInfo
      content="密码必须包含字母、数字和特殊字符"
      color="#ff6b00"
      placement="right"
    />
  </div>

  <!-- 自定义触发方式 -->
  <div class="field-label">
    高级设置
    <AppHelpInfo
      content="高级设置包含敏感操作，请谨慎使用"
      trigger="click"
      left="8px"
    />
  </div>
</template>

<style scoped>
  .field-label {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
</style>
```

## 参数说明

### Props

| 参数名       | 类型     | 默认值                       | 必填 | 说明                                                                                                                     |
|-----------|--------|---------------------------|----|------------------------------------------------------------------------------------------------------------------------|
| content   | string | -                         | 否  | 提示信息内容                                                                                                                 |
| placement | string | 'top'                     | 否  | 提示框出现的位置，可选值：top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end |
| color     | string | 'var(--el-color-primary)' | 否  | 帮助图标的颜色                                                                                                                |
| left      | string | -                         | 否  | 图标左侧的外边距，如果未设置left和right，则默认左侧边距为3px                                                                                   |
| right     | string | -                         | 否  | 图标右侧的外边距                                                                                                               |
| trigger   | string | 'hover'                   | 否  | 触发提示的方式，可选值：hover/click/focus/contextmenu                                                                              |
| effect    | string | 'dark'                    | 否  | Tooltip 主题，内置了 dark / light 两种                                                                                         |

### Slots

| 插槽名     | 说明                         |
|---------|----------------------------|
| default | 默认插槽，用于自定义提示内容，支持HTML和组件嵌套 |

## 注意事项

- 组件默认使用帮助图标（help），并设置为主题色
- 当鼠标悬停在图标上时，鼠标指针会变为问号样式
- 组件内部使用Element Plus的Tooltip组件，继承了其所有功能
- 当设置了`left`属性时，会覆盖默认的左侧边距
- 当需要在行内使用时，建议将包含此组件的父元素设置为flex布局

## 内部实现

组件内部基于 Vue 3 的 Composition API 实现，主要包含以下几个部分：

1. 属性定义：提供用于配置帮助提示的各种属性
2. 样式计算：根据props动态计算图标样式
3. 交互实现：通过Element Plus的Tooltip组件实现提示功能
