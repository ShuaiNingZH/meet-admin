# AppBatchImport 批量导入组件

## 组件简介

AppBatchImport 是一个通用的批量数据导入组件，提供了模板下载和文件上传的功能。组件封装了 Element Plus 的
Upload 组件，支持拖拽上传，并对文件类型和大小进行了校验。

## 功能特点

- 模板下载：提供下载导入模板的功能
- 文件上传：支持拖拽上传和点击上传
- 文件校验：自动校验文件类型和大小
- 可自定义：支持自定义标题、文件类型、文件大小等参数
- 响应式：提供成功和失败的回调事件

## 使用方法

```vue

<script setup lang="ts">
  import {AppBatchImport} from '@/components/AppBatchImport';
  import {ref} from 'vue';

  const showImport = ref(false);

  // 下载模板的API
  function downloadTemplateApi(params) {
    // 实现下载模板的API调用
    return yourTemplateApi(params);
  }

  // 导入数据的API
  function importDataApi(formData) {
    // 实现导入数据的API调用
    return yourImportApi(formData);
  }

  // 导入成功的回调
  function handleSuccess() {
    // 处理导入成功后的逻辑
    console.log('导入成功');
  }
</script>

<template>
  <AppBatchImport
    v-model="showImport"
    title="批量导入用户"
    :template-api="downloadTemplateApi"
    :import-api="importDataApi"
    @success="handleSuccess"
  />
</template>
```

## 参数说明

### Props

| 参数名         | 类型       | 默认值               | 必填 | 说明              |
|-------------|----------|-------------------|----|-----------------|
| v-model     | boolean  | false             | 否  | 控制弹窗显示状态        |
| title       | string   | '批量绑定'            | 否  | 弹窗标题            |
| fileType    | string[] | ['.xls', '.xlsx'] | 否  | 允许上传的文件类型       |
| fileSize    | number   | 5                 | 否  | 允许上传的最大文件大小(MB) |
| fileName    | string   | '表格'              | 否  | 下载模板的默认文件名      |
| params      | object   | {}                | 否  | 下载模板时传递的参数      |
| templateApi | function | -                 | 是  | 下载模板的API方法      |
| importApi   | function | -                 | 是  | 上传文件的API方法      |
| props       | object   | {name: 'file'}    | 否  | 上传文件的配置参数       |

### Events

| 事件名     | 类型         | 说明        |
|---------|------------|-----------|
| success | () => void | 文件上传成功后触发 |

### Slots

| 插槽名     | 说明         |
|---------|------------|
| default | 上传区域的内容    |
| tip     | 上传区域下方提示文本 |

## 注意事项

- templateApi 需要返回一个可下载的文件流
- importApi 需要接收 FormData 类型的参数，并返回上传结果
- 默认支持的文件类型为 .xls 和 .xlsx 格式

## 内部实现

组件内部集成了以下功能：

1. 文件类型和大小的校验
2. 文件上传请求的处理
3. 成功和失败状态的通知提示
4. 模板下载功能
