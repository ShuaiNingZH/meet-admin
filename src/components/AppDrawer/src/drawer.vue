<script setup lang="ts">
import type { AppDrawerProps } from './drawer.ts';
import { omit } from 'lodash-es';
import { useEventForwarder } from '@/hooks/useEventForwarder';
import { appDrawerEmits, omitKeys } from './drawer.ts';

defineOptions({ name: 'AppDrawer' });

const props = withDefaults(defineProps<AppDrawerProps>(), {
  size: '30%',
  withHeader: true,
  modalFade: true,
  showFooter: true,
  showConfirmButton: true,
  showCancelButton: true,
  buttonReverse: false,
  footerPosition: 'right',
  appendToBody: true,
  modal: true,
  lockScroll: true,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  showClose: true,
  destroyOnClose: true,
  loading: false,
});

const emit = defineEmits(appDrawerEmits);

const { t } = useI18n();

const { eventHandlers } = useEventForwarder(emit, appDrawerEmits);

// 精简 props
const drawerProps = computed(() => omit(props, omitKeys));

const title = computed(() => props.title || t('components.drawer.title'));
const confirmText = computed(() => props.confirmText || t('common.sure'));
const cancelText = computed(() => props.cancelText || t('common.cancel'));

// 是否是翻转
const isReverse = computed(() => {
  return props.showCancelButton && props.buttonReverse;
});

// 点击确认
function onConfirm() {
  emit('confirm');
}

// 点击取消
function onCancel() {
  emit('update:modelValue', false);
}
</script>

<template>
  <el-drawer v-bind="drawerProps" class="app-drawer" v-on="eventHandlers">
    <template #header="scope">
      <slot name="header" v-bind="scope">
        <app-text :id="scope.titleId" class="text-16">
          {{ title }}
        </app-text>
      </slot>
    </template>
    <template #default>
      <el-scrollbar view-class="drawer-scrollbar-view">
        <slot />
      </el-scrollbar>
    </template>
    <template v-if="showFooter" #footer>
      <div class="app-drawer__footer" :style="{ justifyContent: footerPosition }">
        <slot name="footer">
          <app-flex :size="8">
            <el-button v-if="showCancelButton" :class="{ 'button-reverse': isReverse }" @click="onCancel">
              {{ cancelText }}
            </el-button>
            <el-button v-if="showConfirmButton" type="primary" :loading @click="onConfirm">
              {{ confirmText }}
            </el-button>
          </app-flex>
        </slot>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss">
@use '../style/index';
</style>
