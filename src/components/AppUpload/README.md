# AppUpload 文件上传组件

## 组件简介

AppUpload 是一个功能强大的文件上传组件，基于 Element Plus 的 Upload
组件进行封装。组件支持多种上传模式：单张图片上传、多张图片上传和多文件上传。针对图片上传，还提供了预览、编辑和删除功能。

## 功能特点

- 支持多种上传模式（单图、多图、多文件）
- 自动文件类型和大小检验
- 支持拖拽上传
- 图片预览功能
- 自定义上传区域样式
- 支持限制上传数量
- 支持自定义上传接口
- 与表单校验集成
- 多语言支持

## 使用方法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { AppUpload } from '@/components/AppUpload';

// 文件上传模式
const fileList = ref([]);

// 单图上传模式
const imageUrl = ref('');

// 多图上传模式
const imageList = ref([]);

// 头像
const avatar = ref('');

// 表单数据
const form = ref({
  idCard: '',
  attachments: []
});

// 表单验证规则
const rules = {
  idCard: [{ required: true, message: '请上传证件照片', trigger: 'change' }],
  attachments: [{ required: true, message: '请上传附件材料', trigger: 'change' }]
};

// 自定义上传接口
function customUploadApi(formData: FormData) {
  // 实现自定义的上传逻辑
  return yourUploadFunction(formData);
}
</script>

<template>
  <!-- 文件上传模式 -->
  <AppUpload
    v-model="fileList"
    type="files"
    :file-size="5"
    :limit="10"
    drag
  />

  <!-- 单图上传模式 -->
  <AppUpload
    v-model="imageUrl"
    type="image"
    :file-size="2"
    width="200px"
    height="200px"
  />

  <!-- 多图上传模式 -->
  <AppUpload
    v-model="imageList"
    type="images"
    :file-size="2"
    :limit="5"
  />

  <!-- 自定义上传接口 -->
  <AppUpload
    v-model="fileList"
    :api="customUploadApi"
    :props="{ key: 'upload_file', url: 'file_path' }"
  />

  <!-- 圆形图片上传 -->
  <AppUpload
    v-model="avatar"
    type="image"
    circle
  />

  <!-- 表单中使用 -->
  <el-form :model="form" :rules="rules">
    <el-form-item label="证件照片" prop="idCard">
      <AppUpload v-model="form.idCard" type="image" />
    </el-form-item>
    <el-form-item label="附件材料" prop="attachments">
      <AppUpload v-model="form.attachments" type="files" />
    </el-form-item>
  </el-form>
</template>
```

## 参数说明

### Props

| 参数名      | 类型                                   | 默认值                         | 必填 | 说明                                   |
|----------|--------------------------------------|-----------------------------|----|--------------------------------------|
| v-model  | array[] \| string                    | -                           | 是  | 绑定值，根据type不同类型不同                     |
| type     | 'image' \| 'images' \| 'files'       | 'files'                     | 否  | 上传类型，单图/多图/文件                        |
| api      | (formData: FormData) => Promise<any> | -                           | 否  | 自定义上传API                             |
| props    | object                               | { key: 'file', url: 'url' } | 否  | 上传配置，key为表单字段名，url为返回值中的URL字段        |
| width    | string                               | '150px'/'300px'             | 否  | 上传区域宽度                               |
| height   | string                               | '150px'                     | 否  | 上传区域高度                               |
| circle   | boolean                              | false                       | 否  | 是否显示为圆形上传区域                          |
| fileSize | number                               | 5                           | 否  | 文件大小限制(MB)                           |
| fileType | string[]                             | []                          | 否  | 允许的文件类型，如['image/jpeg', 'image/png'] |
| limit    | number                               | 5                           | 否  | 文件上传数量限制                             |
| disabled | boolean                              | false                       | 否  | 是否禁用上传功能                             |
| drag     | boolean                              | false                       | 否  | 是否启用拖拽上传                             |
| multiple | boolean                              | true                        | 否  | 是否支持多文件上传                            |

### 插槽

| 插槽名     | 说明        |
|---------|-----------|
| tip     | 自定义提示内容   |
| trigger | 自定义触发上传区域 |

### 方法

组件暴露了 Element Plus Upload 组件的所有方法，可以通过 ref 引用来调用：

```vue
<script setup>
import { ref } from 'vue';

const uploadRef = ref(null);
const fileList = ref([]);

function clearFiles() {
  uploadRef.value.clearFiles();
}
</script>

<template>
  <AppUpload ref="uploadRef" v-model="fileList" />
  <el-button @click="clearFiles">
    清空文件
  </el-button>
</template>
```

## 内部实现

组件内部实现了以下功能：

1. 根据 type 类型使用不同的子组件：UploadImage、UploadImages 或 UploadFiles
2. 自动处理文件类型和大小的验证
3. 集成表单验证功能，支持与 el-form 组件联动
4. 实现文件上传、预览、编辑和删除等功能
5. 提供灵活的API接口配置，适应不同的后端接口格式

## 注意事项

- 使用图片上传模式时，fileType 默认为常见图片类型，无需手动设置
- 使用自定义 API 时，确保返回格式与组件预期一致
- 在表单中使用时，组件会自动与 el-form 联动，支持表单校验
- 启用拖拽上传时，单图模式的宽度默认为300px，否则为150px
