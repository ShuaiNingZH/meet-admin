<script setup lang="ts">
import type { AppTextProps } from './types.ts';

defineOptions({ name: 'AppText' });

const props = withDefaults(defineProps<AppTextProps>(), {
  link: false,
  placement: 'top',
  offset: 8,
  underline: 'hover',
});

const textRef = useTemplateRef<AnyObj>('textRef');

const tooltipContent = ref('');

// 是否需要显示 tooltip
const disabled = ref(true);

// 判断是否需要显示 tooltip
function handleHover(event: MouseEvent) {
  if (props.tooltipDisabled)
    return;

  const el = event.target as HTMLElement;

  tooltipContent.value = el.textContent!;

  if (!props.lineClamp) {
    // 单行省略
    disabled.value = el.scrollWidth <= el.clientWidth;
  }
  else {
    // 多行省略
    disabled.value = el.scrollHeight <= el.clientHeight;
  }
}
</script>

<template>
  <el-tooltip :content="tooltipContent" :disabled :placement :offset :effect>
    <el-link v-if="link" class="app-text" :type :underline :href :disabled="linkDisabled" @click="onClick">
      <el-text
        ref="textRef" v-bind="$attrs" :size :truncated="!lineClamp" :line-clamp
        title=" " @mouseover.self="handleHover"
      >
        <slot>
          {{ content }}
        </slot>
      </el-text>
    </el-link>
    <el-text
      v-else ref="textRef" v-bind="$attrs" :type :size :truncated="!lineClamp" :line-clamp
      title=" " @mouseover.self="handleHover" @click="onClick"
    >
      <slot>
        {{ content }}
      </slot>
    </el-text>
  </el-tooltip>
</template>

<style scoped lang="scss">
.app-text {
  :deep(.el-link__inner) {
    display: inline-grid;
  }
}
</style>
