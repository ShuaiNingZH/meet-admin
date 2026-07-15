<script setup lang="ts">
import type { AppTextProps } from './types.ts';

defineOptions({ name: 'AppText', inheritAttrs: false });

const props = withDefaults(defineProps<AppTextProps>(), {
  placement: 'top',
  offset: 8,
});

const attrs = useAttrs();

// el-text 溢出时会自动设置原生 title，与 el-tooltip 重复；默认用空白 title 抑制，用户显式传入的 title 优先
const title = computed(() => (attrs.title as string) ?? ' ');

const tooltipContent = ref('');

// 文本未溢出时不显示 tooltip
const tooltipHidden = ref(true);

// hover 时检测文本是否溢出，决定是否显示 tooltip
function handleHover(event: MouseEvent) {
  if (props.tooltipDisabled)
    return;

  const el = event.currentTarget as HTMLElement;

  tooltipContent.value = el.textContent!;

  if (!props.lineClamp) {
    // 单行省略
    tooltipHidden.value = el.scrollWidth <= el.clientWidth;
  }
  else {
    // 多行省略
    tooltipHidden.value = el.scrollHeight <= el.clientHeight;
  }
}
</script>

<template>
  <el-tooltip
    :content="tooltipContent" :disabled="tooltipDisabled || tooltipHidden" :placement :offset :effect
    popper-class="app-text-popper"
  >
    <el-text
      v-bind="attrs" :type :size :truncated="!lineClamp" :line-clamp :tag :title @mouseenter="handleHover"
    >
      <slot>
        {{ content }}
      </slot>
    </el-text>
  </el-tooltip>
</template>

<style lang="scss">
// tooltip 装的是被截断的长文本，不限宽会以单行铺开，left/right 方向放不下时会溢出视口撑出滚动条
.app-text-popper {
  max-width: min(600px, 50vw);
}
</style>
