import type { UploadFile, UploadRawFile, UploadRequestOptions, UploadUserFile } from 'element-plus';
import type { ModelRef } from 'vue';
import { formContextKey, formItemContextKey } from 'element-plus';
import { isArray } from 'lodash-es';
import { uploadImage } from '@/api';
import { downloadFile, regex } from '@/utils';

export interface AppUploadProps {
  /**
   * 上传文件的基础URL。
   */
  baseUrl?: string;

  /**
   * API 请求方法，用于上传文件。
   * 参数为任意类型，返回一个 Promise。
   */
  api?: (...args: any[]) => Promise<any>;

  /**
   * 上传组件的相关配置。
   * - key: 唯一标识符。
   * - url: 文件上传的目标地址。
   */
  props?: {
    key?: string;
    url?: string;
  };

  /**
   * 上传类型。
   * - 'image': 单张图片上传。
   * - 'images': 多张图片上传。
   * - 'files': 文件上传。
   */
  type: 'image' | 'images' | 'files';

  /**
   * 上传区域的宽度（可选）。
   */
  width?: string;

  /**
   * 上传区域的高度（可选）。
   */
  height?: string;

  /**
   * 是否显示为圆形上传区域（可选）。
   */
  circle?: boolean;

  /**
   * 文件大小限制（单位：字节）。
   */
  fileSize: number;

  /**
   * 支持的文件类型列表。
   * 如：['image/png', 'image/jpeg']。
   */
  fileType: string[];

  /**
   * 文件上传数量限制（可选）。
   */
  limit?: number;

  /**
   * 是否禁用上传功能。
   */
  disabled: boolean;

  /**
   * 是否支持拖拽上传。
   */
  drag: boolean;

  /**
   * 是否支持多文件上传。
   */
  multiple: boolean;
}

export const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

type EmitType = 'success';

export function useUpload(
  props: AppUploadProps,
  model: ModelRef<UploadUserFile[]> | ModelRef<string>,
  emit: (event: (EmitType), ...args: any[]) => void,
) {
  // 是否正在上传
  const isUpLoad = ref(false);

  // 获取 el-form 组件上下文
  const formContext = inject(formContextKey, void 0);

  // 获取 el-form-item 组件上下文
  const formItemContext = inject(formItemContextKey, void 0);

  // 是否禁用上传组件
  const isDisabled = computed(() => props.disabled || formContext?.disabled);

  // 是否为预览模式
  const isPreview = computed(() => {
    // 当 model 是数组时
    if (isArray(model.value)) {
      // 判断禁用状态并且 model 数组有长度
      return isDisabled.value && model.value.length;
    }
    // 当 model 不是数组时
    return isDisabled.value && model.value;
  });

  // 文件类型提示
  const fileTypeTips = computed(() => {
    const { fileType } = props;
    return fileType.length ? fileType.map(item => item.split('/')[1]).join('、') : '';
  });

  /**
   * @description 文件上传之前的校验
   * @param rawFile 选择的文件
   * @returns 是否通过校验
   */
  function beforeUpload(rawFile: UploadRawFile) {
    const { fileType, fileSize } = props;

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
   * @description 上传文件
   * @param options 上传文件的配置信息
   */
  async function handleHttpUpload(options: UploadRequestOptions) {
    isUpLoad.value = true;
    const formData = new FormData();
    formData.append(props.props?.key || 'file', options.file);

    try {
      const api = props.api ?? uploadImage;
      const { data } = await api(formData);
      options.onSuccess(data);

      // 调用 el-form 内部的校验方法（可自动校验）
      formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
    }
    catch (error) {
      options.onError(error as any);
    }
  }

  /**
   * @description 图片上传成功
   * @param response 上传响应结果
   * @param uploadFile 上传的文件
   */
  function uploadSuccess(response: any, uploadFile: UploadFile) {
    // 检查响应结果是否为空
    if (!response)
      return;

    // 根据响应结果的类型处理文件URL
    if (typeof response === 'object') {
      // 响应是对象
      uploadFile.url = response[props.props?.url || 'url'];
    }
    else {
      // 响应是字符串
      uploadFile.url = response;
    }

    // 更新 model 值
    if (typeof model.value === 'string')
      model.value = uploadFile.url || '';

    isUpLoad.value = false;

    // 显示上传成功提示
    ElNotification({
      title: '温馨提示',
      message: `【${uploadFile.name}】文件上传成功！`,
      type: 'success',
    });

    emit('success', uploadFile.url);
  }

  /**
   * @description 删除文件
   * @param file 删除的文件
   */
  function handleRemove(file: UploadFile) {
    if (isArray(model.value)) {
      model.value = model.value.filter(item => item.url !== file.url || item.name !== file.name);
    }
    else {
      model.value = '';
    }
  }

  /**
   * @description 文件上传错误
   * @param _response 上传响应结果
   * @param uploadFile 上传的文件
   */
  function uploadError(_response: any, uploadFile: UploadFile) {
    ElNotification({
      title: '温馨提示',
      message: `【${uploadFile.name}】文件上传失败，请您重新上传！`,
      type: 'error',
    });
  }

  // 文件数超出
  function handleExceed() {
    ElNotification({
      title: '温馨提示',
      message: `当前最多只能上传 ${props.limit} 个文件，请移除后上传！`,
      type: 'warning',
    });
  }

  const previewList = ref<string[]>([]);
  const previewIndex = ref(0);
  const previewVisible = ref(false);

  /**
   * @description 点击文件列表中已上传的文件
   * @param uploadFile 点击的文件
   */
  async function handlePreview(uploadFile: UploadFile) {
    if (!isArray(model.value))
      return;

    if (isUpLoad.value)
      return ElMessage.warning('文件正在上传中，请稍后再试！');

    // 在查看时，只有图片路径信息，没有图片文件信息，所以使用正则判断是否是图片
    if (regex('Images', uploadFile.url || '')) {
      const images = model.value.map(item => item.url || '');
      previewList.value = images;
      previewIndex.value = images.findIndex(item => item === uploadFile.url);
      previewVisible.value = true;
    }
    else {
      downloadFile(uploadFile.url || '', uploadFile.name);
    }
  }

  // 生成唯一ID
  const id = useId();

  // 编辑图片
  function handleImageEdit() {
    const dom = document.querySelector(`#${id} .el-upload__input`);
    dom && dom.dispatchEvent(new MouseEvent('click'));
  }

  /**
   * @description 预览图片
   * @param file 当前预览的图片
   */
  function handleImagePreview(file?: any) {
    // 多选图片时
    if (isArray(model.value)) {
      const images = model.value.map(item => item.url || '');
      previewList.value = images;
      previewIndex.value = images.findIndex(item => item === file.url);
      previewVisible.value = true;
    }
    else {
      previewVisible.value = true;
    }
  }

  /**
   * @description 删除图片
   * @param file 当前删除的图片
   */
  function handleImageRemove(file?: any) {
    // 禁用状态下不允许删除
    if (isDisabled.value)
      return;

    // 多选图片时
    if (isArray(model.value)) {
      model.value = model.value.filter(item => item.url !== file.url || item.name !== file.name);
    }
    else {
      model.value = '';
    }
  }

  return {
    id,
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
    handleImageEdit,
    handleImagePreview,
    handleImageRemove,
  };
}
