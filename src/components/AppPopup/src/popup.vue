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
const fullscreen = ref(false);
const ariaLabel = computed(() => fullscreen.value ? '退出全屏模式' : '切换到全屏模式');

function handleFullScreen() {
  fullscreen.value = !fullscreen.value;
}
// 全屏 --- end

const maxHeight = computed(() => {
  let calc = 'calc(100vh - 45px)';

  // 如果存在
  if (props.showFooter) {
    calc = 'calc(100vh - 45px - 52px)';
  }

  return fullscreen.value ? calc : props.maxHeight;
});

onMounted(() => {
  // 底部按钮位置
  document.documentElement.style.setProperty('--app-popup-footer-position', props.footerPosition);
});
</script>

<template>
  <el-dialog v-bind="popupProps" class="app-popup" :fullscreen v-on="eventHandlers">
    <template #header>
      <div class="w-[calc(100%-55px)]">
        <slot name="header">
          <app-text class="text-16">
            {{ title }}
          </app-text>
        </slot>
      </div>
      <button :aria-label="ariaLabel" type="button" class="el-dialog__headerbtn" @click="handleFullScreen">
        <app-icon v-if="fullscreen" aria-label="" class="el-dialog__close" icon="ri:fullscreen-exit-fill" />
        <app-icon v-else class="el-dialog__close" icon="FullScreen" />
      </button>
    </template>
    <template #default>
      <el-scrollbar view-class="dialog-scrollbar-view" :height :max-height="maxHeight">
        <slot />
      </el-scrollbar>
    </template>
    <template v-if="showFooter" #footer>
      <slot name="footer" />
      <app-flex :size="7">
        <el-button v-if="showCancelButton" :class="{ 'button-reverse': isReverse }" @click="onCancel">
          {{ cancelText }}
        </el-button>
        <el-button v-if="showConfirmButton" type="primary" :loading @click="onConfirm">
          {{ confirmText }}
        </el-button>
      </app-flex>
    </template>
  </el-dialog>
</template>

<style lang="scss">
@use '../style/index';
</style>
