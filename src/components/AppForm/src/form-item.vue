<script setup lang="ts">
import type { FormItemInstance } from 'element-plus';
import type { AppFormItemProps } from './types.ts';
import { omit, pick } from 'lodash-es';

defineOptions({ name: 'AppFormItem' });

const props = withDefaults(defineProps<AppFormItemProps>(), {
  span: 1,
  offset: 0,
  suffix: false,
  showMessage: true,
  required: undefined,
});

const gridItemProps = computed(() => pick(props, ['span', 'offset', 'suffix']));
const formItemProps = computed(() => omit(props, ['span', 'offset', 'suffix']));

const slots = useSlots();

// 当有 label 或 helpInfo 时才显示 label
const showLabel = computed(() => {
  return slots.label || slots.helpInfo || props.helpInfo;
});

const formItemRef = useTemplateRef<FormItemInstance>('formItemRef');

defineExpose(new Proxy({}, {
  get(_target, key) {
    return formItemRef.value?.[key as keyof FormItemInstance];
  },
  has(_target, key) {
    return key in formItemRef.value!;
  },
}));
</script>

<template>
  <app-grid-item class="app-form-item" v-bind="gridItemProps" #="{hasCollapsible}">
    <el-form-item ref="formItemRef" v-bind="formItemProps">
      <slot :has-collapsible="hasCollapsible" />
      <template v-if="showLabel" #label>
        <slot name="label">
          {{ label }}
        </slot>
        <!-- 提示信息 -->
        <app-help-info v-if="helpInfo || $slots['help-info']" :content="helpInfo">
          <slot name="help-info" />
        </app-help-info>
      </template>
      <template v-if="$slots.error" #error>
        <slot name="error" />
      </template>
    </el-form-item>
  </app-grid-item>
</template>

<style scoped lang="scss">
.app-form-item {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
