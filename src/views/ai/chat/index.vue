<script setup lang="ts">
import type { BubbleListItemProps } from 'vue-element-plus-x/types/BubbleList';
import type { FilesCardProps } from 'vue-element-plus-x/types/FilesCard';
import { Attachments, BubbleList, FilesCard, Welcome, XSender } from 'vue-element-plus-x';
import { MarkdownRenderer } from 'x-markdown-vue';
import { renderIcon } from '@/components';
import { useAppStore } from '@/stores/app';
import ChatList from '@/views/ai/chat/components/ChatList.vue';
import 'x-markdown-vue/style';

defineOptions({ name: 'AiChat' });

const { t } = useI18n();
const { isDark } = storeToRefs(useAppStore());

// 演示数据：接入模型列表接口后替换
const models = [
  { label: 'DeepSeek-V3', value: 'deepseek-v3' },
  { label: 'DeepSeek-R1', value: 'deepseek-r1' },
  { label: '通义千问-Max', value: 'qwen-max' },
  { label: 'GPT-4o mini', value: 'gpt-4o-mini' },
];
const currentModel = ref('deepseek-v3');

// 附件仅保存在本地列表，发送消息时随消息一并提交
const attachments = ref<FilesCardProps[]>([]);
const fileInputRef = ref<HTMLInputElement>();

let fileUid = 0;
function addFiles(files: File[] | FileList) {
  for (const file of Array.from(files)) {
    fileUid += 1;
    attachments.value.push({
      uid: fileUid,
      name: file.name,
      fileSize: file.size,
      imgFile: file.type.startsWith('image/') ? file : undefined,
      showDelIcon: true,
      imgPreview: true,
      imgVariant: 'square',
    });
  }
}

function handleFileInputChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length)
    addFiles(input.files);
  input.value = '';
}

function handleDeleteFile(_item: FilesCardProps, index: number) {
  attachments.value.splice(index, 1);
}

interface ChatMessage extends BubbleListItemProps {
  id: number;
  files?: FilesCardProps[];
}

interface XSenderInstance {
  getModelValue: () => { html: string; text: string };
  clear: () => void;
}

const senderRef = ref<XSenderInstance>();
const messages = ref<ChatMessage[]>([]);
const aiReplying = ref(false);

let messageId = 0;
let replyTimer: ReturnType<typeof setTimeout> | undefined;

function handleSubmit() {
  const text = senderRef.value?.getModelValue().text.trim();
  if (!text || aiReplying.value)
    return;

  messageId += 1;
  messages.value.push({
    id: messageId,
    placement: 'end',
    content: text,
    maxWidth: '100%',
    files: attachments.value.length ? attachments.value.splice(0) : undefined,
  });
  senderRef.value?.clear();
  mockAiReply();
}

// 演示逻辑：接入对话接口后替换为真实的流式响应
function mockAiReply() {
  aiReplying.value = true;
  messageId += 1;
  messages.value.push({ id: messageId, placement: 'start', loading: true, content: '', maxWidth: '100%' });
  const message = messages.value.at(-1)!;

  const modelLabel = models.find(item => item.value === currentModel.value)?.label ?? currentModel.value;
  const fullText = t('page.aiChat.mockReply', { model: modelLabel });
  let index = 0;
  replyTimer = setTimeout(() => {
    message.loading = false;
    replyTimer = setInterval(() => {
      index += 2;
      message.content = fullText.slice(0, index);
      if (index >= fullText.length)
        stopAiReply();
    }, 30);
  }, 500);
}

function stopAiReply() {
  clearInterval(replyTimer);
  replyTimer = undefined;
  aiReplying.value = false;
  const last = messages.value.at(-1);
  if (last?.loading)
    last.loading = false;
}

onUnmounted(stopAiReply);
</script>

<template>
  <app-card class="main-container">
    <ChatList />
    <div class="chat-main">
      <div class="chat-body" :class="{ 'is-empty': !messages.length }">
        <Welcome
          v-if="!messages.length" variant="borderless" :title="t('page.aiChat.welcomeTitle')"
          :description="t('page.aiChat.welcomeDescription')"
        />
        <BubbleList v-else class="chat-messages" :list="messages" max-height="100%" item-key="id">
          <template #header="{ item }">
            <div v-if="item.files?.length" class="chat-message-files">
              <FilesCard v-for="file in item.files" :key="file.uid" v-bind="file" :show-del-icon="false" />
            </div>
          </template>
          <template #content="{ item }">
            <MarkdownRenderer
              v-if="item.placement === 'start'" class="chat-message-markdown" :markdown="item.content ?? ''"
              :is-dark="isDark"
            />
            <div v-else class="chat-message-text">
              {{ item.content }}
            </div>
          </template>
        </BubbleList>
      </div>
      <div class="chat-sender">
        <XSender
          ref="senderRef" :placeholder="t('page.aiChat.senderPlaceholder')" clearable variant="updown"
          :custom-style="{ maxHeight: '100px' }" :loading="aiReplying"
          @submit="handleSubmit" @cancel="stopAiReply" @paste-file="(_first, fileList) => addFiles(fileList)"
        >
          <template v-if="attachments.length" #header>
            <Attachments
              class="chat-sender-attachments" :items="attachments" overflow="scrollX" hide-upload
              @delete-card="handleDeleteFile" @upload-drop="files => addFiles(files)"
            />
          </template>
          <template #prefix>
            <div class="chat-sender-prefix">
              <el-tooltip :content="t('page.aiChat.uploadAttachment')" placement="top">
                <el-button
                  class="chat-sender-attach-btn" :icon="renderIcon('Paperclip')"
                  @click="fileInputRef?.click()"
                />
              </el-tooltip>
              <el-select v-model="currentModel" class="chat-sender-model">
                <el-option v-for="model in models" :key="model.value" :label="model.label" :value="model.value" />
              </el-select>
            </div>
          </template>
        </XSender>
        <input ref="fileInputRef" type="file" multiple hidden @change="handleFileInputChange">
        <div class="chat-sender-hint">
          {{ t('page.aiChat.aiGeneratedHint') }}
        </div>
      </div>
    </div>
  </app-card>
</template>

<style scoped lang="scss">
.main-container {
  flex-direction: row;
  padding: 0;

  .chat-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;

    .chat-body {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      display: flex;
      padding: var(--spacing-lg);

      &.is-empty {
        align-items: center;
        justify-content: center;
      }

      :deep(.elx-welcome) {
        --elx-welcome-filled-bg: transparent;
        --elx-welcome-title-color: var(--el-text-color-primary);
        --elx-welcome-description-color: var(--el-text-color-secondary);
      }

      .chat-messages {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
      }

      :deep(.elx-bubble) {
        --elx-bubble-bg: var(--el-fill-color);
        --elx-bubble-text-color: var(--el-text-color-primary);

        &.elx-bubble--end {
          --elx-bubble-bg: var(--el-color-primary-light-9);
        }
      }

      :deep(.chat-message-text) {
        white-space: pre-wrap;
        word-break: break-word;
      }

      :deep(.chat-message-markdown) {
        background: transparent !important;
        padding: 0 !important;
        color: inherit;
      }

      :deep(.chat-message-files) {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-xs);

        .elx-files-card {
          --elx-files-card-bg: var(--el-fill-color-light);
          --elx-files-card-border-color: var(--el-border-color);
          --elx-text-color-primary: var(--el-text-color-primary);
          --elx-text-color-secondary: var(--el-text-color-secondary);
        }
      }
    }

    .chat-sender {
      width: 100%;
      max-width: 800px;
      align-self: center;
      padding: 0 var(--spacing-lg) var(--spacing-lg);

      :deep(.elx-x-sender__header-container) {
        border-bottom-color: transparent !important;
      }

      :deep(.elx-x-sender__send-button .el-button) {
        --el-button-bg-color: var(--el-color-primary);
        --el-button-border-color: var(--el-color-primary);
        --el-button-text-color: var(--el-color-white);
        --el-button-hover-bg-color: var(--el-color-primary-light-3);
        --el-button-hover-border-color: var(--el-color-primary-light-3);
        --el-button-hover-text-color: var(--el-color-white);
        --el-button-active-bg-color: var(--el-color-primary-dark-2);
        --el-button-active-border-color: var(--el-color-primary-dark-2);
      }

      .chat-sender-prefix {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .chat-sender-model {
        width: 140px;
      }

      &-hint {
        margin: 0;
        padding: var(--spacing-sm) var(--spacing-base);
        font-size: 12px;
        color: var(--el-text-color-secondary);
        text-align: center;
      }
    }
  }
}
</style>
