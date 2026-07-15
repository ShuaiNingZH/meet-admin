<script setup lang="ts">
defineOptions({ name: 'DemoEditor' });

// 控制面板：作用于场景一的编辑器
const mode = ref<'default' | 'simple'>('default');
const height = ref('300px');
const hideToolBar = ref(false);
const disabled = ref(false);

// 场景一：基础用法 + 实时 HTML 预览
const basicHtml = ref('<p>开始编辑吧，右侧会实时展示编辑器输出的 HTML。</p>');

// 场景二：自定义工具栏 —— 通过 toolbarConfig.excludeKeys 排除指定菜单
const customToolbarHtml = ref('<p>该编辑器隐藏了「全屏」「视频」相关菜单。</p>');
const customToolbarConfig = {
  excludeKeys: ['fullScreen', 'group-video', 'insertVideo', 'uploadVideo'],
};

// 场景三：多实例 zIndex —— 两个编辑器并排，验证获得焦点的一方浮层不被遮挡
const instanceAHtml = ref('<p>编辑器 A</p>');
const instanceBHtml = ref('<p>编辑器 B</p>');

// 场景四：表单联动 —— 失焦时自动触发 el-form 校验
// 编辑器为空时，v-model 拿到的并非空字符串，而是 wangEditor 的默认空段落 `<p><br></p>`，
// 所以 required 规则需要自定义 validator，去除标签后判断纯文本是否为空
const form = reactive({ content: '' });
const formRef = ref();
function validateContent(_rule: unknown, value: string, callback: (error?: Error) => void) {
  const text = value.replace(/<[^>]*>/g, '').trim();
  if (!text)
    callback(new Error('请输入正文内容'));
  else
    callback();
}
const rules = {
  content: [{ required: true, validator: validateContent, trigger: 'change' }],
};

function handleSubmit() {
  formRef.value?.validate((valid: boolean) => {
    if (valid)
      ElMessage.success('校验通过，可以提交');
    else
      ElMessage.warning('请先完善正文内容');
  });
}
</script>

<template>
  <app-flex vertical>
    <!-- 控制面板 -->
    <app-card>
      <el-form inline>
        <el-form-item label="mode">
          <el-select v-model="mode" style="width: 140px">
            <el-option label="default" value="default" />
            <el-option label="simple" value="simple" />
          </el-select>
        </el-form-item>
        <el-form-item label="height">
          <el-select v-model="height" style="width: 140px">
            <el-option label="200px" value="200px" />
            <el-option label="300px" value="300px" />
            <el-option label="400px" value="400px" />
          </el-select>
        </el-form-item>
        <el-form-item label="hideToolBar">
          <el-switch v-model="hideToolBar" />
        </el-form-item>
        <el-form-item label="disabled">
          <el-switch v-model="disabled" />
        </el-form-item>
      </el-form>
    </app-card>

    <!-- 场景一：基础用法（受顶部控制面板联动） -->
    <app-card>
      <h3 class="demo-title">
        场景一：基础用法 —— v-model 双向绑定，配合顶部控制面板调整 mode / height / hideToolBar / disabled
      </h3>
      <p class="demo-tip">
        mode 是 wangEditor 创建实例时的固定配置，运行时无法动态切换，此处通过 :key="mode" 强制重建编辑器实例
      </p>
      <app-grid :cols="2" :col-gap="16">
        <app-grid-item>
          <app-editor
            :key="mode"
            v-model="basicHtml"
            :mode="mode"
            :height="height"
            :hide-tool-bar="hideToolBar"
            :disabled="disabled"
          />
        </app-grid-item>
        <app-grid-item>
          <div class="html-preview" v-html="basicHtml" />
        </app-grid-item>
      </app-grid>
    </app-card>

    <!-- 场景二：自定义工具栏 -->
    <app-card>
      <h3 class="demo-title">
        场景二：自定义工具栏 —— toolbarConfig.excludeKeys 排除「全屏」「视频」相关菜单
      </h3>
      <app-editor v-model="customToolbarHtml" :toolbar-config="customToolbarConfig" height="220px" />
    </app-card>

    <!-- 场景三：多实例 zIndex -->
    <app-card>
      <h3 class="demo-title">
        场景三：多实例共存 —— 分别聚焦左右编辑器，获得焦点的一方工具栏浮层始终在最上层
      </h3>
      <app-grid :cols="2" :col-gap="16">
        <app-grid-item>
          <app-editor v-model="instanceAHtml" height="220px" />
        </app-grid-item>
        <app-grid-item>
          <app-editor v-model="instanceBHtml" height="220px" />
        </app-grid-item>
      </app-grid>
    </app-card>

    <!-- 场景四：表单联动校验 -->
    <app-card>
      <h3 class="demo-title">
        场景四：表单联动 —— 编辑器失焦时自动触发所在 el-form-item 的校验
      </h3>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="正文" prop="content">
          <app-editor v-model="form.content" height="220px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            提交校验
          </el-button>
        </el-form-item>
      </el-form>
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

.html-preview {
  height: 100%;
  padding: var(--spacing-md);
  overflow-y: auto;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-fill-color-light);
}
</style>
