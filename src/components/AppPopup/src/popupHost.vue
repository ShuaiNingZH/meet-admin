<script setup lang="ts">
import type { PopupItem } from './popup.ts';
import { isVNode } from 'vue';
import { popupItems } from './popup.ts';
import Popup from './popup.vue';

defineOptions({ name: 'AppPopupHost' });

// 确认:onOk 抛错或返回 false 时保持打开,否则自动关闭
async function handleConfirm(item: PopupItem) {
  item.loading = true;

  try {
    const close = () => {
      item.visible = false;
    };
    const result = await item.onOk?.({ close });

    if (result !== false)
      item.visible = false;
  }
  catch (error) {
    console.error('确认操作失败:', error);
  }
  finally {
    item.loading = false;
  }
}

// 关闭动画结束后从队列移除,由 Vue 卸载对应实例
function handleClosed(item: PopupItem) {
  item.onClosed?.();

  const index = popupItems.indexOf(item);
  if (index > -1)
    popupItems.splice(index, 1);
}

function resolveContent(item: PopupItem) {
  return () => typeof item.content === 'string' || isVNode(item.content) ? item.content : h(item.content);
}
</script>

<template>
  <Popup
    v-for="item in popupItems"
    :key="item.id"
    v-model="item.visible"
    v-bind="item.props"
    :loading="item.loading"
    @confirm="handleConfirm(item)"
    @closed="handleClosed(item)"
  >
    <component :is="resolveContent(item)" />
  </Popup>
</template>
