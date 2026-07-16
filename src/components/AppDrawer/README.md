# AppDrawer 抽屉组件

## 组件简介

AppDrawer 是基于 Element Plus Drawer 组件封装的抽屉组件，提供了统一的头部、内容滚动区域和底部按钮布局。该组件适用于系统设置、详情展示、表单编辑等侧边栏场景，风格与 AppPopup 保持一致。

## 功能特点

- 便捷配置：预设了常用的抽屉配置，简化使用复杂度
- 自适应滚动：内容区域内置滚动条，超出高度自动滚动
- 底部按钮：可自定义确认和取消按钮的文本、显示顺序及对齐方式
- 加载状态：支持设置确认按钮的加载状态
- 统一样式：头部、内容、底部的间距与分割线样式开箱即用

## 使用方法

```vue
<script setup lang="ts">
import { ref } from 'vue';

const showDrawer = ref(false);
const showCustomDrawer = ref(false);

function handleConfirm() {
  console.log('确认操作');
  showDrawer.value = false;
}
</script>

<template>
  <!-- 基础用法 -->
  <AppDrawer v-model="showDrawer" title="基础抽屉" @confirm="handleConfirm">
    <div>抽屉内容</div>
  </AppDrawer>

  <!-- 自定义底部 -->
  <AppDrawer v-model="showCustomDrawer" title="自定义底部" footer-position="left">
    <div>抽屉内容</div>

    <template #footer>
      <el-button type="primary">
        自定义操作
      </el-button>
    </template>
  </AppDrawer>
</template>
```

## 参数说明

### Props

| 参数名             | 类型             | 默认值  | 必填 | 说明                                                                  |
| ------------------ | ---------------- | ------- | ---- | --------------------------------------------------------------------- |
| v-model/modelValue | boolean          | -       | 是   | 控制抽屉的显示与隐藏                                                  |
| title              | string           | '抽屉'  | 否   | 抽屉标题                                                              |
| size               | string \| number | '30%'   | 否   | 抽屉尺寸，数字为像素，字符串支持 'x%'                                 |
| direction          | string           | 'rtl'   | 否   | 打开方向，可选值：'ltr'、'rtl'、'ttb'、'btt'                          |
| confirmText        | string           | '确定'  | 否   | 确认按钮文本                                                          |
| cancelText         | string           | '取消'  | 否   | 取消按钮文本                                                          |
| showFooter         | boolean          | true    | 否   | 是否显示底部区域                                                      |
| showConfirmButton  | boolean          | true    | 否   | 是否显示确认按钮                                                      |
| showCancelButton   | boolean          | true    | 否   | 是否显示取消按钮                                                      |
| buttonReverse      | boolean          | false   | 否   | 是否交换确认和取消按钮的位置                                          |
| footerPosition     | string           | 'right' | 否   | 底部内容对齐方式，可选值：'left'、'center'、'right'、'space-between'  |
| loading            | boolean          | false   | 否   | 确认按钮的加载状态                                                    |
| appendToBody       | boolean          | true    | 否   | 是否插入至 body 元素上                                                |
| destroyOnClose     | boolean          | true    | 否   | 关闭时是否销毁组件内容                                                |
| closeOnClickModal  | boolean          | false   | 否   | 是否可以通过点击遮罩层关闭抽屉                                        |
| closeOnPressEscape | boolean          | true    | 否   | 是否可以通过按下 ESC 键关闭抽屉                                       |

此外，组件还继承了 Element Plus Drawer 组件的其他属性。

### Events

| 事件名           | 类型       | 说明                           |
| ---------------- | ---------- | ------------------------------ |
| confirm          | () => void | 点击确认按钮时触发             |
| open             | () => void | 抽屉打开的回调                 |
| opened           | () => void | 抽屉打开动画结束时的回调       |
| open-auto-focus  | () => void | 输入焦点聚焦在抽屉内容时的回调 |
| close            | () => void | 抽屉关闭的回调                 |
| closed           | () => void | 抽屉关闭动画结束时触发         |
| close-auto-focus | () => void | 输入焦点从抽屉内容失焦时的回调 |

### Slots

| 插槽名  | 说明                                                                 |
| ------- | -------------------------------------------------------------------- |
| header  | 自定义头部内容，作用域参数：`{ close, titleId, titleClass }`         |
| default | 抽屉主体内容                                                         |
| footer  | 自定义底部内容，提供后将替换默认的按钮区域                           |

## 注意事项

- 抽屉默认不会通过点击遮罩层关闭，需要手动设置 `closeOnClickModal` 为 true
- 确认按钮点击后不会自动关闭抽屉，需要在 confirm 事件处理函数中手动关闭
- 取消按钮点击后会自动关闭抽屉，并触发 close 事件
- 内容区域已内置滚动条，使用时无需再包裹 el-scrollbar
