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

除了以组件方式使用外，还可以通过 `openPopup` 函数以命令式方式调用弹窗，尤其适合临时性的弹窗和表单提交场景。弹窗由内置于 App.vue 的宿主组件 `<AppPopupHost />` 统一渲染，支持多个弹窗同时打开。

```ts
import { openPopup } from '@/components/AppPopup';
import UserForm from './UserForm.vue';

// 简单文本弹窗:onOk 正常返回后自动关闭
openPopup({
  title: '提示',
  content: '这是一个命令式弹窗',
  onOk: () => {
    console.log('确认操作');
  }
});

// 组件弹窗:需要向内容组件传参时,用 h() 构造 VNode
openPopup({
  title: '查看详情',
  content: h(UserDetail, { userId: 1 }),
  width: 700,
});

// 保持打开:onOk 返回 false 或抛出异常时弹窗不关闭
openPopup({
  title: '危险操作',
  content: '确认执行该操作吗?',
  confirmText: '执行',
  onOk: async () => {
    const ok = await doAction();
    if (!ok)
      return false; // 失败,保持弹窗打开
  },
});

// 表单弹窗:表单的校验和提交由内容组件自治
// 关闭默认底部,组件内部提交成功后通过 props 传入的回调关闭
const { close } = openPopup({
  title: '编辑用户',
  content: h(UserForm, { userId: 1, onDone: () => close() }),
  showFooter: false,
});
```

## 命令式API参数说明

| 参数名       | 类型                                | 默认值 | 必填 | 说明                                                                          |
| ------------ | ----------------------------------- | ------ | ---- | ------------------------------------------------------------------------------ |
| content      | string \| Component \| VNode        | -      | 是   | 弹窗内容；需要向组件传参/插槽时用 `h()` 构造 VNode                             |
| onOk         | (context) => any \| Promise\<any\>  | -      | 否   | 确认回调；抛错或返回 false 时保持弹窗打开，否则自动关闭；执行期间按钮自动 loading |
| onClose      | () => void                          | -      | 否   | 弹窗关闭时的回调                                                               |
| onClosed     | () => void                          | -      | 否   | 弹窗关闭动画结束时的回调                                                       |

其他参数与组件式用法的Props一致。`openPopup` 返回 `{ close }`，可在弹窗外部编程式关闭。`onOk` 的 `context` 包含 `close`（手动关闭函数）。

弹窗渲染在主应用组件树内（App.vue 中的 `<AppPopupHost />` 宿主），路由、Pinia、i18n、全局指令以及任何组件树级 provide 均可正常使用。表单类内容组件建议自治（自己校验、提交，成功后通过 props 传入的回调关闭弹窗）。

## 参数说明

### Props

| 参数名             | 类型             | 默认值     | 必填 | 说明                                                                 |
| ------------------ | ---------------- |---------| ---- | -------------------------------------------------------------------- |
| v-model/modelValue | boolean          | -       | 是   | 控制弹窗的显示与隐藏                                                 |
| title              | string           | '提示'    | 否   | 弹窗标题                                                             |
| width              | string \| number | 700     | 否   | 弹窗宽度，单位像素                                                   |
| height             | string \| number | -       | 否   | 弹窗内容区域高度                                                     |
| maxHeight          | string \| number | 450     | 否   | 弹窗内容区域最大高度，超出显示滚动条                                 |
| confirmText        | string           | '保存'    | 否   | 确认按钮文本                                                         |
| cancelText         | string           | '取消'    | 否   | 取消按钮文本                                                         |
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

| 插槽名  | 说明                                                                 |
| ------- | -------------------------------------------------------------------- |
| header  | 自定义头部内容，作用域参数：`{ close, titleId, titleClass }`         |
| default | 弹窗主体内容                                                         |
| footer  | 自定义底部内容，提供后将替换默认的按钮区域                           |

## 注意事项

- 弹窗默认不会通过点击遮罩层关闭，需要手动设置 `closeOnClickModal` 为 true
- 确认按钮点击后不会自动关闭弹窗，需要在 confirm 事件处理函数中手动关闭
- 取消按钮点击后会自动关闭弹窗，并触发 close 事件
- 当内容高度超过 maxHeight 时，会自动出现滚动条
- 全屏按钮位于右上角，点击可切换全屏显示状态
- 使用命令式调用时，onOk 抛错或返回 false 会保持弹窗打开，其余情况自动关闭

## 内部实现

组件内部基于 Vue 3 的 Composition API 实现，主要包含以下几个部分：

1. 属性配置：扩展了 Element Plus Dialog 组件的属性
2. 事件处理：管理确认、取消和关闭事件
3. 全屏功能：实现弹窗的全屏切换
4. 样式定制：自定义了弹窗的头部、内容和底部区域的样式
5. 命令式API：openPopup 将配置推入实例队列，由 App.vue 中的宿主组件 AppPopupHost 统一渲染
