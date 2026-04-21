# AppDropdown 下拉菜单组件

## 组件简介

AppDropdown 是一个基于 Element Plus 的自定义下拉菜单组件，提供了更加灵活的菜单控制和定位功能。该组件主要用于实现右键菜单（Context
Menu）功能，可以在指定位置显示自定义菜单列表。

## 功能特点

- 自定义位置：支持在任意位置显示下拉菜单
- 自动调整：根据窗口边界自动调整菜单位置，避免超出视窗
- 菜单项定制：支持设置图标、禁用状态和显示条件
- 事件处理：提供菜单项点击和菜单隐藏的事件回调
- 键盘支持：支持使用 Esc 键关闭菜单

## 使用方法

```vue

<script setup lang="ts">
  import type {ContextMenuItemClickEmitArg} from '@/components/AppDropdown';
  import {AppDropdown} from '@/components/AppDropdown';
  import {ref} from 'vue';

  const dropdownRef = ref();
  const menuItems = [
    {key: 'edit', label: '编辑', icon: 'Edit'},
    {key: 'delete', label: '删除', icon: 'Delete'},
    {key: 'view', label: '查看', disabled: true}
  ];

  // 显示菜单
  function showMenu(e: MouseEvent) {
    const axis = {x: e.clientX, y: e.clientY};
    // 第一个参数可以传递任意数据，会在菜单点击事件中返回
    dropdownRef.value.onShowContextmenu({id: 1, name: '示例数据'}, axis);
  }

  // 处理菜单点击
  function handleMenuClick(item: ContextMenuItemClickEmitArg) {
    console.log('点击了菜单项:', item.key);
    console.log('源数据:', item.sourceData);
  }
</script>

<template>
  <div @contextmenu.prevent="showMenu($event)">
    右键点击此区域显示菜单
  </div>

  <AppDropdown ref="dropdownRef" :items="menuItems" @menu-click="handleMenuClick"/>
</template>
```

## 参数说明

### Props

| 参数名   | 类型      | 默认值 | 必填 | 说明          |
|-------|---------|-----|----|-------------|
| width | number  | 150 | 否  | 下拉菜单宽度，单位像素 |
| items | array[] | []  | 是  | 菜单项配置数组     |

### 菜单项配置 (ContextMenuItem)

| 属性名      | 类型      | 默认值   | 必填 | 说明                     |
|----------|---------|-------|----|------------------------|
| key      | string  | -     | 是  | 菜单项唯一标识                |
| label    | string  | -     | 否  | 菜单项显示文本                |
| icon     | string  | -     | 否  | 菜单项图标，使用Element Plus图标 |
| disabled | boolean | false | 否  | 是否禁用菜单项                |
| show     | boolean | true  | 否  | 是否显示菜单项                |

### Events

| 事件名              | 类型                                          | 说明                  |
|------------------|---------------------------------------------|---------------------|
| menu-click       | (item: ContextMenuItemClickEmitArg) => void | 菜单项点击事件，返回菜单项信息和源数据 |
| hide-contextmenu | () => void                                  | 菜单隐藏事件              |

### 暴露方法

| 方法名               | 类型                                                      | 说明                              |
|-------------------|---------------------------------------------------------|---------------------------------|
| onShowContextmenu | (sourceData: any, axis: {x: number, y: number}) => void | 显示菜单，sourceData为自定义数据，axis为显示坐标 |
| onHideContextmenu | -                                                       | 手动隐藏菜单                          |

### Slots

| 插槽名     | 插槽作用域                     | 说明       |
|---------|---------------------------|----------|
| default | { item: ContextMenuItem } | 自定义菜单项内容 |

## 注意事项

- 组件会自动添加点击、滚动和 ESC 键的事件监听，用于关闭菜单
- 当菜单靠近屏幕边缘时，会自动调整位置以确保完全显示
- 对于需要动态控制的菜单项，可以使用`show`属性进行控制
- 在使用右键菜单时，需要为目标元素添加`@contextmenu.prevent`以阻止默认右键菜单

## 内部实现

组件内部基于 Vue 3 的 Composition API 实现，主要包含以下几个部分：

1. 状态管理：控制菜单的显示、位置和关联数据
2. 位置调整：检测并调整菜单位置，确保不超出屏幕边界
3. 事件监听：管理点击、滚动和键盘事件
4. 菜单渲染：使用Element Plus样式渲染菜单项
