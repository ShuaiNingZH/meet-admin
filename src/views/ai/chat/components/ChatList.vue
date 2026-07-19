<script setup lang="ts">
import { Conversations } from 'vue-element-plus-x';
import { renderIcon } from '@/components';

defineOptions({ name: 'AiChatList' });

const { t } = useI18n();

interface ChatSession {
  id: string;
  label: string;
}

// 演示数据：接入会话接口后替换
const sessions = ref<ChatSession[]>([
  { id: '1', label: t('page.aiChat.defaultSessionName') },
]);
const activeId = ref<string | number>('1');

let seed = sessions.value.length;
function handleCreate() {
  seed += 1;
  const session: ChatSession = { id: String(seed), label: `${t('page.aiChat.defaultSessionName')} ${seed}` };
  sessions.value.unshift(session);
  activeId.value = session.id;
}
</script>

<template>
  <aside class="chat-list">
    <Conversations
      v-model:active="activeId" class="chat-list__conversations" :items="sessions" row-key="id"
      :label-max-width="250"
    >
      <template #header>
        <div class="chat-list__header">
          <el-button
            class="w-full" type="primary" plain :icon="renderIcon('CirclePlus')"
            @click="handleCreate"
          >
            {{ t('page.aiChat.newChat') }}
          </el-button>
        </div>
      </template>
    </Conversations>
  </aside>
</template>

<style scoped lang="scss">
.chat-list {
  &__header {
    padding: var(--spacing-base) var(--spacing-base) var(--spacing-sm);
  }

  :deep(.elx-conversations) {
    border-right: 1px solid var(--el-border-color);
    box-shadow: unset;

    .elx-conversations__list {
      padding: 0 !important;
      background-color: transparent !important;

      .el-scrollbar__view {
        padding: var(--spacing-md);

        .elx-conversations-item {
          margin: 0;

          &:hover,
          &.elx-conversations-item--hovered,
          &.elx-conversations-item--active,
          &.elx-conversations-item--menu-opened {
            background-color: var(--el-fill-color);
          }
        }

        .elx-conversations-item__label {
          color: var(--el-text-color-primary);
        }
      }
    }
  }
}
</style>
