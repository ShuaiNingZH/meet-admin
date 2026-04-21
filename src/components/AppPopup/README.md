# AppPopup 弹窗组件

## 组件简介

AppPopup 是基于 Element Plus Dialog
组件封装的弹窗组件，提供了更加丰富的配置选项和预设样式。该组件适用于各种弹窗场景，如表单提交、信息展示、操作确认等，支持自定义头部、内容和底部按钮。除了组件式用法外，还提供了命令式调用的方法。

## 功能特点

- 便捷配置：预设了常用的弹窗配置，简化使用复杂度
- 全屏切换：内置全屏按钮，支持弹窗全屏显示
- 自适应高度：支持设置最大高度，内容过多时自动显示滚动条
- 底部按钮：可自定义确认和取消按钮的文本、显示顺序及对齐方式
- 加载状态：支持设置确认按钮的加载状态
- 可拖拽：默认支持弹窗拖拽功能
- 命令式调用：支持以函数方式调用弹窗，无需预先在模板中定义

## 使用方法

### 组件式用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { AppPopup } from '@/components/AppPopup';

const showDialog = ref(false);
const showCustomDialog = ref(false);
const showNoFooterDialog = ref(false);
const showCustomHeaderFooter = ref(false);

function handleConfirm() {
  console.log('确认操作');
  showDialog.value = false;
}

function handleSubmit() {
  console.log('提交操作');
  showCustomDialog.value = false;
}

function handleClose() {
  console.log('关闭操作');
}

function handleCustomAction() {
  console.log('自定义操作');
  showCustomHeaderFooter.value = false;
}
</script>

<template>
  <!-- 基础用法 -->
  <AppPopup v-model="showDialog" title="基础弹窗" @confirm="handleConfirm">
    <div>弹窗内容</div>
  </AppPopup>

  <!-- 自定义底部按钮 -->
  <AppPopup
    v-model="showCustomDialog"
    title="自定义按钮"
    confirm-text="提交"
    cancel-text="关闭"
    :button-reverse="true"
    footer-position="space-between"
    @confirm="handleSubmit"
    @close="handleClose"
  >
    <div>自定义按钮的弹窗内容</div>
  </AppPopup>

  <!-- 无底部弹窗 -->
  <AppPopup v-model="showNoFooterDialog" :show-footer="false">
    <div>没有底部按钮的弹窗</div>
  </AppPopup>

  <!-- 自定义头部和底部 -->
  <AppPopup v-model="showCustomHeaderFooter">
    <template #header>
      <div class="custom-header">
        <h3>自定义头部</h3>
        <AppIcon icon="Close" @click="showCustomHeaderFooter = false" />
      </div>
    </template>

    <div>弹窗内容</div>

    <template #footer>
      <div class="custom-footer">
        <el-button type="success" @click="handleCustomAction">
          自定义操作
        </el-button>
        <el-button @click="showCustomHeaderFooter = false">
          关闭
        </el-button>
      </div>
    </template>
  </AppPopup>
</template>
```

### 命令式用法

除了以组件方式使用外，还可以通过 `addPopup` 函数以命令式方式调用弹窗，尤其适合临时性的弹窗和表单提交场景。

```ts
import { addPopup } from '@/utils/popup';
import UserForm from './UserForm.vue';

// 简单文本弹窗
addPopup({
  title: '提示',
  content: '这是一个命令式弹窗',
  onOk: () => {
    console.log('确认操作');
  }
});

// 表单弹窗
addPopup({
  title: '编辑用户',
  content: UserForm,
  width: 700,
  onOk: async ({ instance, close, formData }) => {
    if (formData) {
      // 处理表单数据
      await saveUserData(formData);
      // 关闭弹窗
      close?.();
    }
  }
});

// 完整配置示例
addPopup({
  title: '高级配置',
  content: ComplexForm,
  width: 800,
  confirmText: '提交',
  cancelText: '关闭',
  buttonReverse: true,
  footerPosition: 'space-between',
  onOk: ({ instance, close }) => {
    // 手动处理表单验证
    instance?.validate((valid) => {
      if (valid) {
        const data = instance.getData();
        console.log('表单数据:', data);
        close?.();
      }
    });
  },
  onClose: () => {
    console.log('取消操作');
  }
});
```

## 命令式API参数说明

| 参数名       | 类型                                                                      | 默认值 | 必填 | 说明                                                    |
| ------------ | ------------------------------------------------------------------------- | ------ | ---- | ------------------------------------------------------- |
| content      | string \| Component                                                       | -      | 是   | 弹窗内容，可以是文本或Vue组件                           |
| onOk         | (instance:PopupFormInstance, close: () => void, formData: AnyObj) => void | -      | 否   | 确认按钮点击回调                                        |
| onClose      | () => void                                                                | -      | 否   | 取消按钮点击回调                                        |

其他参数与组件式用法的Props一致。

当content为组件时，该组件需要实现getData方法以返回表单数据。instance参数包含表单的实例，可以调用validate等方法进行表单验证。

## 参数说明

### Props

| 参数名             | 类型             | 默认值  | 必填 | 说明                                                                 |
| ------------------ | ---------------- | ------- | ---- | -------------------------------------------------------------------- |
| v-model/modelValue | boolean          | -       | 是   | 控制弹窗的显示与隐藏                                                 |
| title              | string           | '提示'  | 否   | 弹窗标题                                                             |
| width              | string \| number | 600     | 否   | 弹窗宽度，单位像素                                                   |
| height             | string \| number | -       | 否   | 弹窗内容区域高度                                                     |
| maxHeight          | string \| number | 500     | 否   | 弹窗内容区域最大高度，超出显示滚动条                                 |
| confirmText        | string           | '保存'  | 否   | 确认按钮文本                                                         |
| cancelText         | string           | '取消'  | 否   | 取消按钮文本                                                         |
| showFooter         | boolean          | true    | 否   | 是否显示底部区域                                                     |
| showConfirmButton  | boolean          | true    | 否   | 是否显示确认按钮                                                     |
| showCancelButton   | boolean          | true    | 否   | 是否显示取消按钮                                                     |
| buttonReverse      | boolean          | false   | 否   | 是否交换确认和取消按钮的位置                                         |
| footerPosition     | string           | 'right' | 否   | 底部按钮对齐方式，可选值：'left'、'center'、'right'、'space-between' |
| loading            | boolean          | false   | 否   | 确认按钮的加载状态                                                   |
| draggable          | boolean          | true    | 否   | 是否可拖拽                                                           |
| appendToBody       | boolean          | true    | 否   | 是否插入至 body 元素上                                               |
| destroyOnClose     | boolean          | true    | 否   | 关闭时是否销毁组件内容                                               |
| closeOnClickModal  | boolean          | false   | 否   | 是否可以通过点击遮罩层关闭弹窗                                       |
| closeOnPressEscape | boolean          | true    | 否   | 是否可以通过按下 ESC 键关闭弹窗                                      |

此外，组件还继承了 Element Plus Dialog 组件的其他属性。

### Events

| 事件名           | 类型       | 说明                           |
| ---------------- | ---------- | ------------------------------ |
| confirm          | () => void | 点击确认按钮时触发             |
| open             | () => void | 弹窗打开的回调                 |
| opened           | () => void | 弹窗打开动画结束时的回调       |
| open-auto-focus  | () => void | 输入焦点聚焦在弹窗内容时的回调 |
| close            | () => void | 弹窗关闭的回调                 |
| closed           | () => void | 弹窗关闭动画结束时触发         |
| close-auto-focus | () => void | 输入焦点从弹窗内容失焦时的回调 |

### Slots

| 插槽名  | 说明           |
| ------- | -------------- |
| header  | 自定义头部内容 |
| default | 弹窗主体内容   |
| footer  | 自定义底部内容 |

## 注意事项

- 弹窗默认不会通过点击遮罩层关闭，需要手动设置 `closeOnClickModal` 为 true
- 确认按钮点击后不会自动关闭弹窗，需要在 confirm 事件处理函数中手动关闭
- 取消按钮点击后会自动关闭弹窗，并触发 close 事件
- 当内容高度超过 maxHeight 时，会自动出现滚动条
- 全屏按钮位于右上角，点击可切换全屏显示状态
- 使用命令式调用时，onOk回调需要手动调用close方法关闭弹窗
- 表单组件需要实现getData方法以便命令式调用时获取表单数据

## 内部实现

组件内部基于 Vue 3 的 Composition API 实现，主要包含以下几个部分：

1. 属性配置：扩展了 Element Plus Dialog 组件的属性
2. 事件处理：管理确认、取消和关闭事件
3. 全屏功能：实现弹窗的全屏切换
4. 样式定制：自定义了弹窗的头部、内容和底部区域的样式
5. 命令式API：通过utils/popup.tsx提供函数式调用方法
