<script setup lang="ts">
import type { UploadInstance, UploadUserFile } from 'element-plus';
import type { AppUploadProps } from './upload.ts';
import UploadFiles from './components/UploadFiles.vue';
import UploadImage from './components/UploadImage.vue';
import UploadImages from './components/UploadImages.vue';

defineOptions({ name: 'AppUpload' });

const props = withDefaults(defineProps<Partial<AppUploadProps>>(), {
  type: 'files',
  disabled: false,
  multiple: true,
  fileSize: 5,
  baseUrl: import.meta.env.VITE_FINANCE_URL,
});

const emit = defineEmits(['success']);

const model = defineModel<UploadUserFile[] | string>({ required: true });

const uploadRef = useTemplateRef<UploadInstance>('UploadRef');

defineExpose(new Proxy({}, {
  get(_target, key) {
    return uploadRef.value?.[key as keyof UploadInstance];
  },
  has(_target, key) {
    return key in uploadRef.value!;
  },
}));
</script>

<template>
  <div class="app-upload">
    <!-- 选择文件 -->
    <UploadFiles
      v-if="type === 'files'" ref="UploadRef" v-model="model as UploadUserFile[]"
      v-bind="props as AppUploadProps" @success="emit('success', $event)"
    >
      <template #tip>
        <slot name="tip" />
      </template>
      <template #trigger>
        <slot name="trigger" />
      </template>
    </UploadFiles>
    <!-- 选择图片（单选） -->
    <UploadImage
      v-if="type === 'image'" ref="UploadRef" v-model="model as string" v-bind="props as AppUploadProps"
      @success="emit('success', $event)"
    >
      <template #tip>
        <slot name="tip" />
      </template>
      <template #trigger>
        <slot name="trigger" />
      </template>
    </UploadImage>
    <!-- 选择图片（多选） -->
    <UploadImages
      v-if="type === 'images'" ref="UploadRef" v-model="model as UploadUserFile[]"
      v-bind="props as AppUploadProps" @success="emit('success', $event)"
    >
      <template #tip>
        <slot name="tip" />
      </template>
      <template #trigger>
        <slot name="trigger" />
      </template>
    </UploadImages>
  </div>
</template>
