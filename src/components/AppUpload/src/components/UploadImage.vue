<script setup lang="ts">
import type { UploadInstance } from 'element-plus';
import type { AppUploadProps } from '../upload';
import { imageTypes, useUpload } from '../upload';

defineOptions({ name: 'UploadImage' });

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

const { t } = useI18n();

const model = defineModel<string>({ required: true });

const uploadRef = useTemplateRef<UploadInstance>('UploadImage');
const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef');

// 是否是圆形, 同时不能是拖拽上传
const borderRadius = computed(() => !props.drag && props.circle ? '50%' : '6px');

// 宽高, 如果是拖拽上传并且没有图片则宽度为300px
const width = computed(() => props.width || (props.drag && !model.value ? '300px' : '150px'));
const height = computed(() => props.height || '150px');

const {
  isDisabled,
  isPreview,
  fileTypeTips,
  previewVisible,
  beforeUpload,
  handleHttpUpload,
  uploadSuccess,
  uploadError,
  handleRemove,
  handleExceed,
  handlePreview,
  handleImagePreview,
} = useUpload(props, model, emit);

// 是否隐藏上传按钮
const isHider = computed(() => model.value ? 'none' : 'inline-flex');

// 编辑图片（重新触发隐藏的文件选择框）
function handleImageEdit() {
  const input = wrapperRef.value?.querySelector<HTMLInputElement>('.el-upload__input');
  input?.click();
}

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
  <div ref="wrapperRef" class="upload-image">
    <el-upload
      ref="UploadImage" :show-file-list="false" action="#" class="upload"
      :drag :disabled="isDisabled" :accept="fileType.join(',')"
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
      <div v-if="model" class="el-upload-list--picture-card">
        <div
          class="el-upload-list__item" :class="model ? 'is-success' : ''" tabindex="0"
          @keydown.delete="handleRemove()"
        >
          <img :src="model" class="el-upload-list__item-thumbnail" alt="">
          <label class="el-upload-list__item-status-label">
            <app-icon class="el-icon--upload-success el-icon--check" icon="Check" />
          </label>
          <i v-if="!isPreview" class="el-icon--close-tip" :class="circle ? 'close-tip-circle' : ''">{{ t('components.upload.closeTip') }}</i>
          <div class="el-upload-list__item-actions">
            <div class="el-upload-list__item-preview" @click="handleImagePreview()">
              <app-icon icon="ZoomIn" />
              <span>{{ t('common.preview') }}</span>
            </div>
            <div v-if="!isPreview" class="el-upload-list__item-delete" @click="handleImageEdit">
              <app-icon icon="Edit" />
              <span>{{ t('common.edit') }}</span>
            </div>
            <div v-if="!isPreview" class="el-upload-list__item-delete" @click="handleRemove()">
              <app-icon icon="Delete" />
              <span>{{ t('common.delete') }}</span>
            </div>
          </div>
        </div>
      </div>
      <template #trigger>
        <slot v-if="!model" name="trigger">
          <template v-if="drag">
            <app-icon class="el-icon--upload" icon="UploadFilled" />
            <div class="el-upload__text">
              {{ t('components.upload.imageTip.dragAndDropUpload') }}<em>{{ t('components.upload.clickToUpload') }}</em>
            </div>
          </template>
          <div v-else class="el-upload--picture-card">
            <app-icon class="el-icon--upload" icon="Picture" />
            <div class="el-upload__text">
              {{ t('components.upload.imageTip.clickToUpload') }}
            </div>
          </div>
        </slot>
      </template>
    </el-upload>
    <el-image-viewer
      v-if="previewVisible" :url-list="[model]" hide-on-click-modal teleported
      @close="previewVisible = false"
    />
  </div>
</template>

<style scoped lang="scss">
.is-error {
  .upload-image {
    .upload {
      :deep(.el-upload--picture-card),
      :deep(.el-upload-dragger) {
        border: 1px dashed var(--el-color-danger);
      }
    }
  }
}

.upload-image {
  :deep(.upload) {
    .el-upload {
      display: v-bind(isHider);
      width: v-bind(width);

      &:focus {
        .el-upload--picture-card {
          border-color: var(--el-color-primary);
        }
      }

      .el-upload--picture-card {
        flex-direction: column;
        row-gap: var(--spacing-xs);
        width: v-bind(width);
        height: v-bind(height);
        border-radius: v-bind(borderRadius);
        background-color: var(--el-fill-color-lighter);

        &:hover {
          color: unset;
        }

        .el-upload__text {
          color: var(--el-text-color-regular);
          font-size: 14px;
        }
      }

      .el-upload-dragger {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: v-bind(width);
        height: v-bind(height);
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

    .el-upload-list--picture-card {
      .el-upload-list__item {
        margin: 0;
        width: v-bind(width);
        height: v-bind(height);
        border-radius: v-bind(borderRadius);
        transition: border-radius 0s;

        &:focus-visible {
          outline: 2px solid var(--el-text-color-primary);
          outline-offset: -1px;
          transition: outline 0s;

          &.is-success {
            &:not(:hover) {
              .el-upload-list__item-status-label {
                display: none;
                opacity: 0;
              }

              .el-icon--close-tip {
                display: inline-block;
              }
            }
          }
        }

        .close-tip-circle {
          top: calc(50% - 18px);
        }

        .el-upload-list__item-actions {
          justify-content: space-around;

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
    }
  }
}
</style>
