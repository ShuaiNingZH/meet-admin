<script setup lang="ts">
import type { IDomEditor } from '@wangeditor-next/editor';
import type { AppEditorProps, EditorConfig } from './editor.ts';
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue';
import { formContextKey, formItemContextKey, useZIndex } from 'element-plus';
import { uploadFile, uploadImage } from '@/api';
import '@wangeditor-next/editor/dist/css/style.css';

defineOptions({ name: 'AppEditor' });

const props = withDefaults(defineProps<AppEditorProps>(), {
  toolbarConfig: () => {
    return {
      excludeKeys: [],
    };
  },
  editorConfig: () => {
    return {
      placeholder: '请输入内容...',
      MENU_CONF: {},
    };
  },
  height: '300px',
  mode: 'default',
  hideToolBar: false,
  disabled: false,
});

const { VITE_BASE_URL } = import.meta.env;

const valueHtml = defineModel({ type: String, default: '' });

const { nextZIndex } = useZIndex();
const zIndex = ref(0);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>();

// 实列化编辑器
function handleCreated(editor: IDomEditor) {
  editorRef.value = editor;
  zIndex.value = nextZIndex();
}

// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);

// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);

// 判断是否禁用上传和删除
const isDisabled = computed(() => props.disabled || formContext?.disabled);

watch(isDisabled, (disabled) => {
  if (disabled)
    editorRef.value?.disable();
  else
    editorRef.value?.enable();
}, { immediate: true });

// 编辑框获取焦点时触发
function handleFocus() {
  // 获取焦点时更新层级，防止同时使用 editor 时，被覆盖问题
  zIndex.value = nextZIndex();
}

// 编辑框失去焦点时触发
function handleBlur() {
  // 调用 el-form 内部的校验方法（可自动校验）
  formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
}

type InsertFnTypeImg = (url: string, alt?: string, href?: string) => void;
type InsertFnTypeVideo = (url: string, poster?: string) => void;

// 合并出最终的编辑器配置，避免直接修改 editorConfig prop
const mergedEditorConfig = computed<EditorConfig>(() => {
  return {
    ...props.editorConfig,
    MENU_CONF: {
      ...props.editorConfig.MENU_CONF,
      // 图片自定义上传
      uploadImage: {
        base64LimitSize: 0,
        server: '',
        metaWithUrl: false,
        async customUpload(file: File, insertFn: InsertFnTypeImg) {
          const formData = new FormData();
          formData.append('file', file);

          try {
            const res = await uploadImage(formData);
            const data = res.data[0];
            // 插入图片到编辑器
            insertFn(`${VITE_BASE_URL}${data.savePath}`, data.alt || '', data.href || '');
          }
          catch (error: any) {
            ElMessage.error(error.message);
          }
        },
      },
      // 视频自定义上传
      uploadVideo: {
        server: '',
        metaWithUrl: false,
        async customUpload(file: File, insertFn: InsertFnTypeVideo) {
          const formData = new FormData();
          formData.append('file', file);

          try {
            const res = await uploadFile(formData);
            const data = res.data[0];
            // 插入视频到编辑器
            insertFn(`${VITE_BASE_URL}${data.savePath}`);
          }
          catch (error: any) {
            ElMessage.error(error.message);
          }
        },
      },
    },
  };
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null)
    return;
  editor.destroy();
});
</script>

<template>
  <div class="app-editor editor-box border" :class="[isDisabled ? 'app-editor-disabled' : '']">
    <Toolbar
      v-show="!hideToolBar" class="app-editor-toolbar" :editor="editorRef" :default-config="toolbarConfig"
      :mode="mode"
    />
    <Editor
      v-model="valueHtml" class="app-editor-content" :default-config="mergedEditorConfig" :mode="mode"
      @on-created="handleCreated" @on-blur="handleBlur" @on-focus="handleFocus"
    />
  </div>
</template>

<style scoped lang="scss">
.is-error {
  .app-editor {
    border-color: var(--el-color-danger);
  }
}

.app-editor {
  width: 100%;
  z-index: v-bind(zIndex);
  border-radius: var(--el-border-radius-base);

  &-toolbar {
    border-bottom: 1px solid var(--el-border-color);

    :deep(.w-e-toolbar) {
      border-radius: var(--el-border-radius-base);
    }
  }

  &-content {
    height: v-bind(height) !important;

    :deep(.w-e-text-container) {
      border-radius: var(--el-border-radius-base);
    }
  }
}

// wangEditor 通过 CSS 变量控制配色，默认写死浅色值，这里在暗色模式下覆盖为项目主题变量
:global(html.dark) .app-editor {
  --w-e-textarea-bg-color: var(--el-bg-color);
  --w-e-textarea-color: var(--el-text-color-primary);
  --w-e-textarea-border-color: var(--el-border-color);
  --w-e-textarea-slight-border-color: var(--el-border-color-lighter);
  --w-e-textarea-slight-color: var(--el-text-color-secondary);
  --w-e-textarea-slight-bg-color: var(--el-fill-color-light);
  --w-e-textarea-selected-border-color: var(--el-color-primary-light-5);
  --w-e-textarea-handler-bg-color: var(--el-color-primary);
  --w-e-toolbar-color: var(--el-text-color-regular);
  --w-e-toolbar-bg-color: var(--el-bg-color);
  --w-e-toolbar-active-color: var(--el-color-primary);
  --w-e-toolbar-active-bg-color: var(--el-fill-color-light);
  --w-e-toolbar-disabled-color: var(--el-text-color-disabled);
  --w-e-toolbar-border-color: var(--el-border-color);
  --w-e-modal-button-bg-color: var(--el-fill-color-light);
  --w-e-modal-button-border-color: var(--el-border-color);
}
</style>
