<script setup lang="ts">
import type { UploadInstance, UploadUserFile } from 'element-plus';

defineOptions({ name: 'DemoUpload' });

/**
 * 演示专用：不依赖真实后端，本地生成 Blob URL 模拟上传接口。
 * 返回结构与 axios 封装的 request() 一致（{ code, data, message }），
 * data.url 追加原始文件名后缀，使 handlePreview 的图片正则判断依旧生效。
 */
function mockUploadApi(formData: FormData) {
  const file = formData.get('file') as File;
  return new Promise<{ code: number; data: { url: string }; message: string }>((resolve) => {
    setTimeout(() => {
      const url = `${URL.createObjectURL(file)}#/${encodeURIComponent(file.name)}`;
      resolve({ code: 200, data: { url }, message: '上传成功' });
    }, 600);
  });
}

function handleUploadSuccess(url: string) {
  ElMessage.success(`上传成功，文件地址：${url}`);
}

// 控制面板：作用于场景一
const type = ref<'image' | 'images' | 'files'>('image');
const drag = ref(false);
const disabled = ref(false);
const circle = ref(false);

// 场景一：基础用法 —— 不同 type 对应不同的 v-model 数据结构
const basicImage = ref('');
const basicImages = ref<UploadUserFile[]>([]);
const basicFiles = ref<UploadUserFile[]>([]);
const basicModel = computed(() => {
  if (type.value === 'image')
    return basicImage.value;
  return type.value === 'images' ? basicImages.value : basicFiles.value;
});

// 场景二：多图上传 —— 拖拽 + 数量限制
const dragImages = ref<UploadUserFile[]>([]);

// 场景三：圆形头像上传
const avatar = ref('');

// 场景四：自定义插槽 —— 多文件上传（自定义触发器 + 提示文案 + 文件类型限制）
const contractFiles = ref<UploadUserFile[]>([]);
const contractFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// 场景五：表单联动校验（参考组件 README 中的证件照 + 附件材料示例）
const form = reactive({
  idCard: '',
  attachments: [] as UploadUserFile[],
});
const formRef = ref();
const rules = {
  idCard: [{ required: true, message: '请上传证件照片', trigger: 'change' }],
  attachments: [{ required: true, message: '请上传附件材料', trigger: 'change' }],
};

function handleSubmit() {
  formRef.value?.validate((valid: boolean) => {
    if (valid)
      ElMessage.success('校验通过，可以提交');
    else
      ElMessage.warning('请先完善证件照片和附件材料');
  });
}

// 场景六：通过 ref 调用组件方法 + 监听 success 事件
const refDemoRef = useTemplateRef<UploadInstance>('refDemoRef');
const refDemoFiles = ref<UploadUserFile[]>([]);

function handleClearFiles() {
  refDemoRef.value?.clearFiles();
}
</script>

<template>
  <app-flex vertical>
    <!-- 控制面板 -->
    <app-card>
      <el-form inline>
        <el-form-item label="type">
          <el-select v-model="type" style="width: 140px">
            <el-option label="image" value="image" />
            <el-option label="images" value="images" />
            <el-option label="files" value="files" />
          </el-select>
        </el-form-item>
        <el-form-item label="drag">
          <el-switch v-model="drag" />
        </el-form-item>
        <el-form-item label="disabled">
          <el-switch v-model="disabled" />
        </el-form-item>
        <el-form-item v-if="type === 'image'" label="circle">
          <el-switch v-model="circle" />
        </el-form-item>
      </el-form>
    </app-card>

    <!-- 场景一：基础用法 -->
    <app-card>
      <h3 class="demo-title">
        场景一：基础用法 —— 切换 type，观察 v-model 数据结构的变化（image → string，images / files → UploadUserFile[]）
      </h3>
      <p class="demo-tip">
        type 是创建时的固定配置，运行时无法动态切换；这里通过 v-if 渲染不同分支来达到「切换即重建」的效果
      </p>
      <app-grid :cols="2" :col-gap="16">
        <app-grid-item>
          <app-upload
            v-if="type === 'image'" v-model="basicImage" type="image" :circle="circle" :drag="drag"
            :disabled="disabled" :api="mockUploadApi"
          />
          <app-upload
            v-else-if="type === 'images'" v-model="basicImages" type="images" :drag="drag" :disabled="disabled"
            :api="mockUploadApi" :limit="5"
          />
          <app-upload
            v-else v-model="basicFiles" type="files" :drag="drag" :disabled="disabled"
            :api="mockUploadApi" :limit="5"
          />
        </app-grid-item>
        <app-grid-item>
          <pre class="model-preview">{{ JSON.stringify(basicModel, null, 2) }}</pre>
        </app-grid-item>
      </app-grid>
    </app-card>

    <!-- 场景二：多图上传 -->
    <app-card>
      <h3 class="demo-title">
        场景二：多图上传 —— 拖拽上传 + 数量限制（limit = 3）
      </h3>
      <app-upload v-model="dragImages" type="images" drag :limit="3" :api="mockUploadApi" @success="handleUploadSuccess" />
    </app-card>

    <!-- 场景三：圆形头像上传 -->
    <app-card>
      <h3 class="demo-title">
        场景三：圆形头像上传 —— circle + 自定义宽高
      </h3>
      <app-upload v-model="avatar" type="image" circle width="120px" height="120px" :api="mockUploadApi" />
    </app-card>

    <!-- 场景四：自定义插槽 -->
    <app-card>
      <h3 class="demo-title">
        场景四：自定义插槽 —— trigger（触发区域）/ tip（提示文案）+ 文件类型限制
      </h3>
      <app-upload
        v-model="contractFiles" type="files" drag :limit="3" :file-type="contractFileTypes" :api="mockUploadApi"
      >
        <template #trigger>
          <el-button type="primary">
            点击选择合同附件
          </el-button>
        </template>
        <template #tip>
          <app-text type="warning">
            仅支持 PDF / Word 格式，单个文件不超过 5MB
          </app-text>
        </template>
      </app-upload>
    </app-card>

    <!-- 场景五：表单联动校验 -->
    <app-card>
      <h3 class="demo-title">
        场景五：表单联动 —— 上传 / 删除文件后自动触发所在 el-form-item 的必填校验
      </h3>
      <p class="demo-tip">
        直接点击「提交校验」可以看到：image / files 两种类型校验失败时都会出现红色虚线边框（附件材料为拖拽模式）
      </p>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="证件照片" prop="idCard">
          <app-upload v-model="form.idCard" type="image" :api="mockUploadApi" />
        </el-form-item>
        <el-form-item label="附件材料" prop="attachments">
          <app-upload v-model="form.attachments" type="files" drag :api="mockUploadApi" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            提交校验
          </el-button>
        </el-form-item>
      </el-form>
    </app-card>

    <!-- 场景六：Ref 方法调用 + success 事件 -->
    <app-card>
      <h3 class="demo-title">
        场景六：通过 ref 调用组件暴露的方法，并监听 success 事件
      </h3>
      <app-upload
        ref="refDemoRef" v-model="refDemoFiles" type="files" :api="mockUploadApi"
        @success="handleUploadSuccess"
      />
      <div class="demo-actions">
        <el-button @click="handleClearFiles">
          清空文件列表（uploadRef.clearFiles()）
        </el-button>
      </div>
    </app-card>
  </app-flex>
</template>

<style scoped lang="scss">
.demo-title {
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.demo-tip {
  margin: -8px 0 16px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.demo-actions {
  margin-top: var(--spacing-md);
}

.model-preview {
  height: 100%;
  margin: 0;
  padding: var(--spacing-md);
  overflow: auto;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
