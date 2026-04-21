<script setup lang="ts">
import type { AppEditorProps } from './editor.ts';
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue';
import { formContextKey, formItemContextKey, useZIndex } from 'element-plus';
import { uploadFile } from '@/api';
import '@wangeditor-next/editor/dist/css/style.css';
import '@/config/wangEditor.ts';

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

const valueHtml = defineModel({ type: String, default: '' });

const { nextZIndex } = useZIndex();
const zIndex = ref(0);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 实列化编辑器
function handleCreated(editor: any) {
  editorRef.value = editor;
  zIndex.value = nextZIndex();
}

// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);

// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);

// 判断是否禁用上传和删除
const self_disabled = computed(() => {
  const disabled = props.disabled || formContext?.disabled;
  if (disabled)
    editorRef.value?.disable();
  else
    editorRef.value?.enable();

  return disabled;
});

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

/**
 * @description 图片自定义上传
 * @param file 上传的文件
 * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
 */
type InsertFnTypeImg = (url: string, alt?: string, href?: string) => void;
props.editorConfig.MENU_CONF!.uploadImage = {
  base64LimitSize: 0,
  server: '',
  metaWithUrl: false,
  onSuccess() {},
  onFailed() {},
  onError() {},
  // 自定义上传实现
  async customUpload(file: File, insertFn: InsertFnTypeImg) {
    const formData = new FormData();
    formData.append('file', file);

    const { VITE_FINANCE_URL } = import.meta.env;
    try {
      const res = await uploadFile(formData);
      const data = res.data[0];
      // 插入图片到编辑器
      insertFn(`${VITE_FINANCE_URL}${data.savePath}`, data.alt || '', data.href || '');
    }
    catch (error: any) {
      ElMessage.error(error);
    }
  },
};

/**
 * @description 视频自定义上传
 * @param file 上传的文件
 * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
 */
type InsertFnTypeVideo = (url: string, poster?: string) => void;
props.editorConfig.MENU_CONF!.uploadVideo = {
  server: '',
  metaWithUrl: false,
  onSuccess() {},
  onFailed() {},
  onError() {},
  // 自定义上传实现
  async customUpload(file: File, insertFn: InsertFnTypeVideo) {
    const formData = new FormData();
    formData.append('file', file);

    const { VITE_FINANCE_URL } = import.meta.env;
    try {
      const res = await uploadFile(formData);
      const data = res.data[0];
      // 插入视频到编辑器
      insertFn(`${VITE_FINANCE_URL}${data.savePath}`);
    }
    catch (error: any) {
      ElMessage.error(error);
    }
  },
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null)
    return;
  editor.destroy();
});
</script>

<template>
  <div class="app-editor editor-box border" :class="[self_disabled ? 'app-editor-disabled' : '']">
    <Toolbar
      v-if="!hideToolBar" class="app-editor-toolbar" :editor="editorRef"
      :default-config="toolbarConfig" :mode="mode"
    />
    <Editor
      v-model="valueHtml" class="app-editor-content" :default-config="editorConfig" :mode="mode"
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
    overflow-y: hidden;
    border-radius: var(--el-border-radius-base);
  }
}
</style>
