<script setup lang="ts">
import type { UploadInstance, UploadUserFile } from 'element-plus';
import type { AppUploadProps } from '../upload';
import { imageTypes, useUpload } from '../upload';

defineOptions({ name: 'UploadImages' });

const props = withDefaults(defineProps<AppUploadProps>(), {
  fileType: () => imageTypes,
  width: '',
  height: '',
  circle: false,
  props: () => ({
    key: 'file',
    url: 'url',
  }),
});

const emit = defineEmits(['success']);

const model = defineModel<UploadUserFile[]>({ required: true });

const { t } = useI18n();

const uploadRef = useTemplateRef<UploadInstance>('UploadImages');

// 是否是圆形, 同时不能是拖拽上传
const borderRadius = computed(() => !props.drag && props.circle ? '50%' : '6px');

// 宽高, 如果是拖拽上传并且没有图片则宽度为300px
const width = computed(() => props.width || '150px');
const dragWidth = computed(() => props.width || (props.drag ? '300px' : '150px'));
const height = computed(() => props.height || '150px');

const {
  isDisabled,
  isPreview,
  fileTypeTips,
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
  handleImagePreview,
  handleImageRemove,
} = useUpload(props, model, emit);

// 是否隐藏上传按钮
const isHider = computed(() => isPreview.value ? 'none' : 'inline-flex');

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
  <div class="upload-images">
    <el-upload
      ref="UploadImages" v-model:file-list="model" action="#" list-type="picture-card" class="upload"
      :drag="drag" :disabled="isDisabled" :accept="fileType.join(',')"
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
              Tip：{{ t('components.upload.imageTip.support') }}
              {{ fileTypeTips }} {{ t('components.upload.imageTip.format') }}，
              {{ t('components.upload.imageTip.size') }} {{ fileSize }}MB。
            </app-text>
          </slot>
        </div>
      </template>
      <template #trigger>
        <slot name="trigger">
          <template v-if="drag">
            <app-icon class="el-icon--upload" icon="UploadFilled" />
            <div class="el-upload__text">
              {{ t('components.upload.imageTip.dragAndDropUpload') }}<em>{{ t('components.upload.clickToUpload') }}</em>
            </div>
          </template>
          <template v-else>
            <app-icon class="el-icon--upload" icon="Picture" />
            <div class="el-upload__text">
              {{ t('components.upload.imageTip.clickToUpload') }}
            </div>
          </template>
        </slot>
      </template>
      <template #file="{ file }">
        <img :src="file.url" class="el-upload-list__item-thumbnail" alt="">
        <label class="el-upload-list__item-status-label">
          <app-icon class="el-icon--upload-success el-icon--check" icon="Check" />
        </label>
        <i v-if="!isPreview" class="el-icon--close-tip" :class="circle ? 'close-tip-circle' : ''">{{ t('components.upload.closeTip') }}</i>
        <div class="el-upload-list__item-actions">
          <div class="el-upload-list__item-preview" @click="handleImagePreview(file)">
            <app-icon class="el-icon--upload" icon="ZoomIn" />
            <span>{{ t('common.preview') }}</span>
          </div>
          <div v-if="!isPreview" class="el-upload-list__item-delete" @click="handleImageRemove(file)">
            <app-icon class="el-icon--upload" icon="Delete" />
            <span>{{ t('common.delete') }}</span>
          </div>
        </div>
      </template>
    </el-upload>
    <el-image-viewer
      v-if="previewVisible" :url-list="previewList" :initial-index="previewIndex"
      hide-on-click-modal teleported @close="previewVisible = false"
    />
  </div>
</template>

<style scoped lang="scss">
.is-error {
  .upload-images {
    .upload {
      :deep(.el-upload--picture-card),
      :deep(.el-upload-dragger) {
        border: 1px dashed var(--el-color-danger);
      }
    }
  }
}

.upload-images {
  :deep(.upload) {
    .el-upload-list {
      .el-upload-list__item {
        width: v-bind(width);
        height: v-bind(height);
        border-radius: v-bind(borderRadius);
        transition: border-radius 0s;

        .close-tip-circle {
          top: calc(50% - 18px);
        }

        .el-upload-list__item-actions {
          column-gap: var(--spacing-base);

          &:hover {
            div {
              display: inline-flex;
            }
          }

          div {
            display: none;
            cursor: pointer;
            flex-direction: column;
            align-items: center;
            row-gap: var(--spacing-sm);
            font-size: 12px;

            .app-icon {
              font-size: 20px;
            }
          }
        }
      }

      .el-upload--picture-card {
        flex-direction: column;
        row-gap: var(--spacing-xs);
        width: v-bind(dragWidth);
        height: v-bind(height);
        border-radius: v-bind(borderRadius);
        background-color: #ffffff;
        display: v-bind(isHider);

        &:hover {
          color: unset;
        }

        .el-upload-dragger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: v-bind(dragWidth);
          height: v-bind(height);
          background-color: unset;
          border: none;
          border-radius: unset;
        }

        .el-upload__text {
          color: var(--el-text-color-regular);
          font-size: 14px;
        }
      }
    }

    .is-disabled {
      .el-upload--picture-card,
      .el-upload-dragger {
        cursor: not-allowed;
        background-color: var(--el-disabled-bg-color);
        border-color: var(--el-border-color-darker) !important;
      }
    }
  }
}
</style>
