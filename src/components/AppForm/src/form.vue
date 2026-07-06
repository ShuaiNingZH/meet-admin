<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import type { AppFormProps } from './types.ts';
import { omit } from 'lodash-es';
import { renderIcon } from '@/utils/icon';
import AppFormItem from './form-item.vue';

defineOptions({ name: 'AppForm' });

const props = withDefaults(defineProps<AppFormProps>(), {
  rowGap: 16,
  colGap: 16,
  collapsedRows: 1,
  loading: false,
  labelWidth: 'auto',
  showMessage: true,
  validateOnRuleChange: true,
  showAction: false,
});

const emit = defineEmits(['search', 'reset', 'enter']);

const { t } = useI18n();

const formProps = computed(() => omit(props, [
  'cols',
  'rowGap',
  'colGap',
  'collapsedRows',
  'loading',
  'collapsed',
  'inline',
  'showAction',
]));

// 列数
const cols = computed(() => {
  const defaultCols = props.inline ? { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 } : 1;
  return props.cols ?? defaultCols;
});

// 展开
const collapsed = ref(false);

const formRef = useTemplateRef<FormInstance>('formRef');

// 处理回车事件
function handleKeyupEnter() {
  // 如果有存在操作按钮，则触发搜索事件
  if (props.showAction) {
    emit('search', 1);
  }
  else {
    // 否则触发 enter 事件
    emit('enter');
  }
}

defineExpose(new Proxy({}, {
  get(_target, key) {
    return formRef.value?.[key as keyof FormInstance];
  },
  has(_target, key) {
    return key in formRef.value!;
  },
}));
</script>

<template>
  <el-form
    ref="formRef" class="app-form" v-bind="formProps" @submit.prevent=""
    @keyup.enter="handleKeyupEnter"
  >
    <app-grid :cols :collapsed :row-gap="rowGap" :col-gap="colGap" :collapsed-rows="collapsedRows">
      <slot />
      <AppFormItem v-if="showAction" suffix #="{hasCollapsible}">
        <app-flex>
          <el-button
            type="primary" :loading :icon="renderIcon('Search')"
            @click="emit('search', 1)"
          >
            {{ t('common.query') }}
          </el-button>
          <el-button class="!m-0" :icon="renderIcon('RefreshRight')" @click="emit('reset')">
            {{ t('common.reset') }}
          </el-button>
          <el-button
            v-if="hasCollapsible" type="primary" link class="!m-0"
            @click="collapsed = !collapsed"
          >
            {{ collapsed ? t('common.expand') : t('common.packUp') }}
            <app-icon :icon="collapsed ? 'ArrowDown' : 'ArrowUp'" />
          </el-button>
        </app-flex>
      </AppFormItem>
    </app-grid>
  </el-form>
</template>
