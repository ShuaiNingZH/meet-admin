# AppSelectIcon 图标选择器组件

## 组件简介

AppSelectIcon 是一个图标选择器组件，基于 Iconify API
提供了上万个图标供用户选择。该组件集成了多个流行的图标库，提供了分类浏览、搜索过滤、分页显示等功能，可以方便地在表单中选择需要的图标。

## 功能特点

- 海量图标：集成 Iconify 图标库，提供上万个图标可供选择
- 分类浏览：按照图标库进行分类，支持全部图标和指定库图标的浏览
- 搜索过滤：支持按图标名称进行搜索和过滤
- 分页显示：大量图标时采用分页显示，提高性能和用户体验
- 清晰预览：提供图标的即时预览功能
- 表单集成：可轻松集成到表单中作为选择控件

## 使用方法

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { AppIcon, AppSelectIcon } from '@/components';

// 单独使用
const selectedIcon = ref('');
const customIcon = ref('mdi:home');

// 在表单中使用
const form = reactive({
  icon: ''
});

function submitForm() {
  console.log('提交的图标:', form.icon);
}
</script>

<template>
  <!-- 基础用法 -->
  <AppSelectIcon v-model="selectedIcon" />

  <!-- 自定义占位符和标题 -->
  <AppSelectIcon
    v-model="customIcon"
    placeholder="请选择一个菜单图标"
    title="图标选择"
  />

  <!-- 在表单中使用 -->
  <el-form :model="form" label-width="100px">
    <el-form-item label="菜单图标">
      <AppSelectIcon v-model="form.icon" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">
        提交
      </el-button>
    </el-form-item>
  </el-form>

  <!-- 显示选中的图标 -->
  <div v-if="selectedIcon">
    <p>已选图标：{{ selectedIcon }}</p>
    <AppIcon :icon="selectedIcon" size="24" />
  </div>
</template>
```

## 参数说明

### Props

| 参数名                 | 类型     | 默认值     | 必填 | 说明                       |
|---------------------|--------|---------|----|--------------------------|
| modelValue(v-model) | string | ''      | 是  | 选中的图标值，格式为 'prefix:name' |
| placeholder         | string | '请选择图标' | 否  | 输入框的占位文本                 |
| title               | string | '选择图标'  | 否  | 弹窗的标题                    |

## 注意事项

- 组件需要联网才能加载图标库，因为图标数据是通过 Iconify API 在线获取的
- 首次加载时可能需要一些时间来获取所有图标库信息
- 选中的图标值格式为 'prefix:name'，例如 'mdi:home'，其中 prefix 是图标库前缀，name 是图标名称
- 组件使用分页和滚动条机制来优化大量图标的显示性能
- 使用时需要配合 AppIcon 组件来显示选中的图标

## 内部实现

组件内部基于 Vue 3 的 Composition API 实现，主要包含以下几个部分：

1. 图标库加载：通过 Iconify API 获取所有可用的图标库和图标列表
2. 图标分类管理：按照图标库进行分类，方便用户浏览
3. 搜索过滤：实现图标名称搜索功能
4. 分页与滚动：结合使用分页和滚动条，高效展示大量图标
5. 弹窗交互：使用 AppPopup 组件实现图标选择弹窗
