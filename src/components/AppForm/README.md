# AppForm 表单组件

## 组件简介

AppForm 是一个基于 Element Plus 的表单组件封装，集成了布局、搜索、重置等功能，特别适用于后台管理系统中的查询表单和数据录入表单。该组件结合了
Grid 布局系统，使表单项能够根据屏幕尺寸自动调整布局。

## 功能特点

- 响应式布局：基于栅格系统，支持不同屏幕尺寸下的自适应布局
- 表单操作：内置搜索和重置功能按钮
- 展开收起：支持表单项的展开收起功能，适用于条件较多的查询表单
- 帮助信息：支持为表单项添加帮助提示信息
- 动态验证：继承 Element Plus 表单的验证功能，支持表单验证

## 使用方法

```vue
<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { AppForm } from '@/components/AppForm';

const formRef = ref<FormInstance>();
const form = reactive({
  username: '',
  status: '',
  createTime: ''
});

function handleSearch(pageIndex = 1) {
  console.log('搜索数据', form, '页码:', pageIndex);
}

function handleReset() {
  formRef.value?.resetFields();
}
</script>

<template>
  <AppForm ref="formRef" :search="handleSearch" :reset="handleReset">
    <AppForm.FormItem label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名" />
    </AppForm.FormItem>

    <AppForm.FormItem label="状态" prop="status">
      <el-select v-model="form.status" placeholder="请选择状态">
        <el-option label="启用" value="1" />
        <el-option label="禁用" value="0" />
      </el-select>
    </AppForm.FormItem>

    <AppForm.FormItem
      label="创建时间"
      prop="createTime"
      help-info="输入精确的创建时间进行查询"
    >
      <el-date-picker v-model="form.createTime" type="date" />
    </AppForm.FormItem>
  </AppForm>
</template>
```

## 参数说明

### AppForm Props

| 参数名                  | 类型               | 默认值                        | 必填 | 说明                      |
|----------------------|------------------|----------------------------|----|-------------------------|
| cols                 | object           | {xs:1,sm:2,md:3,lg:4,xl:5} | 否  | 栅格列配置，响应式布局             |
| rowGap               | number           | 16                         | 否  | 行间距                     |
| colGap               | number           | 16                         | 否  | 列间距                     |
| collapsedRows        | number           | 1                          | 否  | 收起状态下显示的行数              |
| loading              | boolean          | false                      | 否  | 搜索按钮的加载状态               |
| showAction           | boolean          | false                      | 否  | 是否显示查询相关的操作按钮           |
| labelWidth           | string \| number | 'auto'                     | 否  | 表单项标签宽度                 |
| showMessage          | boolean          | true                       | 否  | 是否显示校验错误信息              |
| validateOnRuleChange | boolean          | true                       | 否  | 是否在 rules 属性改变后立即触发一次验证 |

另外，AppForm 继承了 Element Plus 的 Form 组件的所有属性，如 `model`, `rules` 等。

### AppForm.FormItem Props

| 参数名      | 类型      | 默认值   | 必填 | 说明                  |
|----------|---------|-------|----|---------------------|
| span     | number  | 1     | 否  | 表单项所占的列数            |
| offset   | number  | 0     | 否  | 表单项左侧的偏移列数          |
| suffix   | boolean | false | 否  | 是否为后缀表单项，通常用于放置操作按钮 |
| helpInfo | string  | -     | 否  | 帮助提示信息              |
| label    | string  | -     | 否  | 表单项标签               |
| prop     | string  | -     | 否  | 表单域字段名              |

FormItem 也继承了 Element Plus 的 FormItem 组件的所有属性。

### Events

| 事件名    | 类型         | 说明                                    |
|--------|------------|---------------------------------------|
| enter  | () => void | 按下回车后触发，`showAction`为`false`时使用       |
| search | () => void | 按下回车或点击查询按钮后触发，`showAction`为`true`时使用 |
| reset  | () => void | 点击重置按钮后触发                             |

### Slots

#### AppForm Slots

| 插槽名     | 说明                    |
|---------|-----------------------|
| default | 表单内容，通常放置 FormItem 组件 |

#### AppForm.FormItem Slots

| 插槽名       | 插槽作用域              | 说明          |
|-----------|--------------------|-------------|
| default   | { hasCollapsible } | 默认插槽，放置表单控件 |
| label     | -                  | 自定义标签内容     |
| error     | -                  | 自定义错误信息     |
| help-info | -                  | 自定义帮助提示信息   |

## 注意事项

- 表单项的布局是基于栅格系统，可以通过`cols`属性来控制不同屏幕尺寸下的列数
- 搜索按钮默认绑定回车键事件，按下回车键会触发搜索函数
- 使用`help-info`属性可以为表单项添加帮助提示图标
- 开启`showAction`后，操作按钮以后缀项（suffix）渲染：所有表单项能容纳在一行时按钮紧跟最后一项，否则自动靠右对齐
- 表单收起展开功能仅在表单项较多（总列数超过 `cols * collapsedRows`）时生效
- 使用`ref`可以获取表单实例，调用表单的`validate`、`resetFields`等方法

## 内部实现

组件内部基于 Vue 3 的 Composition API 实现，主要包含以下几个部分：

1. 表单主体：封装了Element Plus的Form组件，提供了表单验证和数据收集功能
2. 表单项：结合Grid布局实现响应式表单项布局
3. 操作区域：内置的搜索、重置和展开收起按钮
4. 代理转发：通过Proxy对象转发表单和表单项实例的方法和属性
