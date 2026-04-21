# AppText 文本组件

## 组件简介

AppText 是一个增强型文本显示组件，基于 Element Plus 的 Text 和 Link
组件进行封装。它提供了文本溢出自动显示tooltip的能力，支持单行和多行省略，并可以选择以链接形式展示文本。

## 功能特点

- 文本溢出提示：自动检测文本是否溢出，溢出时显示完整内容的tooltip
- 支持链接形式：可选择以链接形式展示文本
- 多行省略：支持设置最大行数，超出行数自动省略
- 样式丰富：支持多种类型和尺寸的文本展示
- 自定义点击事件：支持自定义点击回调函数

## 使用方法

```vue
<script setup lang="ts">
import { AppText } from '@/components/AppText';

function handleClick(e: Event) {
  console.log('文本被点击了', e);
}
</script>

<template>
  <!-- 基础用法 -->
  <AppText>这是一段普通文本</AppText>

  <!-- 使用内容属性 -->
  <AppText content="这是通过content属性设置的文本" />

  <!-- 设置类型 -->
  <AppText type="primary">
    主要文本
  </AppText>
  <AppText type="success">
    成功文本
  </AppText>
  <AppText type="warning">
    警告文本
  </AppText>
  <AppText type="danger">
    危险文本
  </AppText>
  <AppText type="info">
    信息文本
  </AppText>

  <!-- 设置尺寸 -->
  <AppText size="large">
    大号文本
  </AppText>
  <AppText size="default">
    默认大小文本
  </AppText>
  <AppText size="small">
    小号文本
  </AppText>

  <!-- 链接形式 -->
  <AppText link>
    链接文本
  </AppText>
  <AppText link underline="never">
    无下划线链接
  </AppText>
  <AppText link href="https://example.com">
    带跳转链接
  </AppText>

  <!-- 多行省略 -->
  <AppText :line-clamp="2">
    这是一段很长的文本，当内容超过设置的行数时会自动省略，
    并在鼠标悬停时通过tooltip显示完整内容。
  </AppText>

  <!-- 点击事件 -->
  <AppText @click="handleClick">
    可点击文本
  </AppText>
</template>
```

## 参数说明

### Props

| 参数名          | 类型                                                      | 默认值 | 必填 | 说明                                       |
| --------------- | --------------------------------------------------------- | ------ | ---- | ------------------------------------------ |
| type            | 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' | -      | 否   | 文本类型                                   |
| size            | 'large' \| 'default' \| 'small'                           | -      | 否   | 文本尺寸                                   |
| lineClamp       | string \| number                                          | -      | 否   | 最大行数，设置后可实现多行省略             |
| content         | string                                                    | -      | 否   | 文本内容                                   |
| link            | boolean                                                   | false  | 否   | 是否以链接形式显示                         |
| underline       | 'always' \| 'hover' \| 'never'                            | hover  | 否   | 链接是否显示下划线（仅在link为true时有效） |
| href            | string                                                    | -      | 否   | 原生href属性（仅在link为true时有效）       |
| linkDisabled    | boolean                                                   | -      | 否   | 是否禁用链接（仅在link为true时有效）       |
| tooltipDisabled | boolean                                                   | -      | 否   | 是否禁用tooltip                            |
| placement       | Placement                                                 | 'top'  | 否   | tooltip出现的位置                          |
| offset          | number                                                    | 8      | 否   | tooltip出现位置的偏移量                    |
| effect          | 'dark' \| 'light'                                         | -      | 否   | tooltip主题                                |

### Events

| 事件名 | 类型               | 说明           |
| ------ | ------------------ | -------------- |
| click  | (e: Event) => void | 点击文本时触发 |

### Slots

| 插槽名  | 说明     |
| ------- | -------- |
| default | 文本内容 |

## 内部实现

组件内部实现了以下功能：

1. 根据link属性决定使用el-link还是el-text组件
2. 自动检测文本是否溢出，决定是否显示tooltip
3. 支持单行溢出和多行溢出的检测
4. 继承了Element Plus原有的文本和链接组件功能

## 注意事项

- 设置lineClamp属性后会启用多行省略模式，此时不会设置truncated属性
- 不设置lineClamp时为单行省略模式，会自动设置truncated属性
- 当文本未溢出时不会显示tooltip，节省视觉空间
