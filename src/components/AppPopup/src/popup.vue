<script setup lang="ts">
import type { AppPopupProps } from './popup.ts';
import { omit } from 'lodash-es';
import { useEventForwarder } from '@/hooks';
import { appPopupEmits, omitKeys } from './popup.ts';

defineOptions({ name: 'AppPopup' });

const props = withDefaults(defineProps<AppPopupProps>(), {
  top: '10vh',
  width: 700,
  maxHeight: 450,
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
  draggable: true,
  destroyOnClose: true,
  loading: false,
});

const emit = defineEmits(appPopupEmits);

const { t } = useI18n();

const { eventHandlers } = useEventForwarder(emit, appPopupEmits);

// 精简 props
const popupProps = computed(() => omit(props, omitKeys));

const title = computed(() => props.title || t('components.popup.title'));
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

// 全屏 --- start
const fullscreen = ref(props.fullscreen);
const ariaLabel = computed(() => fullscreen.value ? t('components.popup.exitFullscreen') : t('components.popup.fullscreen'));

function handleFullScreen() {
  fullscreen.value = !fullscreen.value;
}

// 关闭动画结束后还原全屏状态，避免下次打开时残留
function onClosed() {
  fullscreen.value = props.fullscreen;
}
// 全屏 --- end

const maxHeight = computed(() => {
  const headerHeight = 45;
  const footerHeight = props.showFooter ? 52 : 0;

  if (fullscreen.value) {
    return `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;
  }

  // 非全屏态下，以 maxHeight 为上限，同时用视口高度兜底，避免小屏下弹窗溢出视口
  const top = typeof props.top === 'number' ? `${props.top}px` : props.top;
  const max = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight;

  return `min(${max}, calc(100vh - ${top} - ${headerHeight}px - ${footerHeight}px))`;
});
</script>

<template>
  <el-dialog v-bind="popupProps" class="app-popup" :fullscreen v-on="eventHandlers" @closed="onClosed">
    <template #header="scope">
      <div class="w-[calc(100%-55px)]">
        <slot name="header" v-bind="scope">
          <app-text :id="scope.titleId" class="text-16">
            {{ title }}
          </app-text>
        </slot>
      </div>
      <button :aria-label="ariaLabel" type="button" class="el-dialog__headerbtn" @click="handleFullScreen">
        <app-icon v-if="fullscreen" class="el-dialog__close" icon="ri:fullscreen-exit-fill" />
        <app-icon v-else class="el-dialog__close" icon="ri:fullscreen-fill" />
      </button>
    </template>
    <template #default>
      <el-scrollbar view-class="dialog-scrollbar-view" :height :max-height="maxHeight">
        <slot />
      </el-scrollbar>
    </template>
    <template v-if="showFooter" #footer>
      <div class="app-popup__footer" :style="{ justifyContent: footerPosition }">
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
  </el-dialog>
</template>

<style lang="scss">
@use '../style/index';
</style>
