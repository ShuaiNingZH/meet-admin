<script setup lang="ts">
import type { UploadRawFile, UploadRequestOptions } from 'element-plus';
import type { AppBatchImportProps } from './type.ts';
import { downloadFile } from '@/utils/download';

defineOptions({ name: 'AppBatchImport' });

const batchImportProps = withDefaults(defineProps<AppBatchImportProps>(), {
  title: '批量绑定',
  params: () => ({}),
  fileType: () => [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  fileSize: 5,
  fileName: '表格',
  props: () => ({
    name: 'file',
  }),
});

const emits = defineEmits(['success']);

const show = defineModel({ type: Boolean, default: false });

// 点击下载模版
async function handleTemplateDownload() {
  const res = await batchImportProps.templateApi(batchImportProps.params);
  downloadFile(res, batchImportProps.fileName);
}

/**
 * 文件上传之前的校验
 * @param rawFile 选择的文件
 * @returns 是否通过校验
 */
function beforeUpload(rawFile: UploadRawFile) {
  const { fileType, fileSize } = batchImportProps;

  // 检查文件类型
  if (fileType.length && !fileType.includes(rawFile.type)) {
    ElNotification({
      title: '温馨提示',
      message: `【${rawFile.name}】文件格式不符合要求！`,
      type: 'warning',
    });
    return false;
  }

  // 检查文件大小
  const isFileSizeValid = rawFile.size / 1024 / 1024 < fileSize;
  if (!isFileSizeValid) {
    ElNotification({
      title: '温馨提示',
      message: `【${rawFile.name}】文件大小不能超过 ${fileSize}M！`,
      type: 'warning',
    });
    return false;
  }

  return true;
}

/**
 * 上传文件
 * @param options 上传文件的配置信息
 */
async function handleHttpUpload(options: UploadRequestOptions) {
  const formData = new FormData();
  formData.append(batchImportProps.props.name, options.file);

  try {
    const { data } = await batchImportProps.importApi(formData);
    options.onSuccess(data || 'success');
  }
  catch (error) {
    options.onError(error as any);
  }
}

/**
 * 图片上传成功
 * @param response 上传响应结果
 */
function uploadSuccess(response: any) {
  if (!response)
    return;

  // 显示上传成功提示
  ElNotification({
    title: '温馨提示',
    message: `${batchImportProps.title}成功！`,
    type: 'success',
  });
  emits('success');
  show.value = false;
}

/**
 * @description 文件上传错误
 * @param _response 上传响应结果
 */
function uploadError(_response: any) {
  ElNotification({
    title: '温馨提示',
    message: `${batchImportProps.title}失败，请您重新上传！`,
    type: 'error',
  });
}
</script>

<template>
  <app-popup v-model="show" :title :show-footer="false" width="580">
    <el-form>
      <el-form-item label="模板下载 :">
        <el-button type="primary" @click="handleTemplateDownload">
          点击下载
        </el-button>
      </el-form-item>
      <el-form-item label="文件上传 :">
        <el-upload
          action="#" drag :accept="fileType?.join(',')" :before-upload="beforeUpload"
          :http-request="handleHttpUpload" :on-success="uploadSuccess" :on-error="uploadError"
        >
          <slot>
            <app-icon class="el-icon--upload" icon="UploadFilled" />
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </slot>
          <template #tip>
            <div class="el-upload__tip !text-red">
              <slot name="tip">
                <app-text>
                  Tip : 请上传 .xls , .xlsx 标准格式文件，文件最大为 {{ fileSize }}M
                </app-text>
              </slot>
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
  </app-popup>
</template>
