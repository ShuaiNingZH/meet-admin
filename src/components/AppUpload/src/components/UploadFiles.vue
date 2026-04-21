<script setup lang="ts">
import type { UploadInstance, UploadUserFile } from 'element-plus';
import type { AppUploadProps } from '../upload';
import { useUpload } from '../upload';

defineOptions({ name: 'UploadFiles' });

const props = withDefaults(defineProps<AppUploadProps>(), {
  limit: 5,
  fileType: () => [],
  props: () => ({
    key: 'file',
    url: 'url',
  }),
  baseUrl: import.meta.env.VITE_COMMON_URL,
});

const emit = defineEmits(['success']);

const model = defineModel<UploadUserFile[]>({ required: true });

const { t } = useI18n();

const uploadRef = useTemplateRef<UploadInstance>('UploadFiles');

const {
  isDisabled,
  isPreview,
  previewList,
  previewIndex,
  previewVisible,
  beforeUpload,
  handleHttpUpload,
  uploadSuccess,
  uploadError,
  handleRemove,
  handleExceed,
  handlePreview,
} = useUpload(props, model, emit);

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
  <div class="upload-files">
    <el-upload
      ref="UploadFiles" v-model:file-list="model" action="#"
      :drag="!isDisabled && drag" :disabled="isDisabled" :accept="fileType.join(',')"
      :class="isDisabled ? 'disabled' : ''"
      :multiple :limit
      :before-upload="beforeUpload"
      :http-request="handleHttpUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :on-preview="handlePreview"
    >
      <template v-if="!isPreview" #tip>
        <div class="el-upload__tip !text-red">
          <slot name="tip">
            <app-text>
              Tip：{{ t('components.upload.filesTip.size') }} {{ fileSize }}MB，
              {{ t('components.upload.filesTip.type') }}
              {{ fileType.join('、') || t('components.upload.filesTip.format') }}。
            </app-text>
          </slot>
        </div>
      </template>
      <template v-if="!isPreview" #trigger>
        <slot name="trigger">
          <template v-if="drag">
            <app-icon class="el-icon--upload" icon="UploadFilled" />
            <div class="el-upload__text">
              {{ t('components.upload.filesTip.dragAndDropUpload') }}<em>{{ t('components.upload.clickToUpload') }}</em>
            </div>
          </template>
          <el-button v-else type="primary" :disabled="isDisabled">
            {{ t('components.upload.filesTip.clickToUpload') }}
          </el-button>
        </slot>
      </template>
    </el-upload>
    <el-image-viewer
      v-if="previewVisible" :url-list="previewList" :initial-index="previewIndex"
      hide-on-click-modal teleported @close="previewVisible = false"
    />
  </div>
</template>

<style scoped lang="scss">
.upload-files {
  :deep(.disabled) {
    .el-upload {
      display: none;
    }

    .el-upload-list {
      margin: 0;
    }
  }
}
</style>
