<script setup lang="ts">
import dayjs from 'dayjs';
import { timeFormat } from '@/utils/date';

defineOptions({ name: 'Notification' });

const { t } = useI18n();

type NoticeType = 'notice' | 'message' | 'todo';

interface NoticeItem {
  id: number;
  title: string;
  content: string;
  time: string;
  read: boolean;
}

const activeTab = ref<NoticeType>('notice');

const noticeMap = reactive<Record<NoticeType, NoticeItem[]>>({
  notice: [
    { id: 1, title: '系统升级通知', content: '系统将于今晚 22:00 - 24:00 进行例行维护升级，请提前保存工作内容。', time: timeFormat(dayjs().subtract(1, 'hour')), read: false },
    { id: 2, title: '安全公告', content: '检测到您的账号在新设备上登录，如非本人操作请及时修改密码。', time: timeFormat(dayjs().subtract(1, 'day')), read: false },
    { id: 3, title: '版本发布', content: 'v2.4.0 版本已发布，新增多项功能优化，详情请查看更新日志。', time: timeFormat(dayjs().subtract(3, 'day')), read: true },
  ],
  message: [
    { id: 1, title: '张三', content: '项目进度报告已经整理好了，请查收。', time: timeFormat(dayjs().subtract(10, 'minute')), read: false },
    { id: 2, title: '李四', content: '下午 3 点的会议改到 4 点，请知悉。', time: timeFormat(dayjs().subtract(2, 'hour')), read: false },
  ],
  todo: [
    { id: 1, title: '审批申请', content: '王五提交的请假申请待您审批。', time: timeFormat(dayjs().subtract(30, 'minute')), read: false },
    { id: 2, title: '合同签署', content: '采购合同待签署，请尽快处理。', time: timeFormat(dayjs().subtract(5, 'hour')), read: false },
    { id: 3, title: '任务提醒', content: '本周工作总结待提交。', time: timeFormat(dayjs().subtract(1, 'day')), read: true },
  ],
});

const tabs = computed(() => ([
  { key: 'notice' as const, label: t('notification.tabs.notice'), icon: 'icon-park-outline:tips-one' },
  { key: 'message' as const, label: t('notification.tabs.message'), icon: 'icon-park-outline:message' },
  { key: 'todo' as const, label: t('notification.tabs.todo'), icon: 'icon-park-outline:list-checkbox' },
]));

function unreadCount(type: NoticeType) {
  return noticeMap[type].filter(item => !item.read).length;
}

const totalUnread = computed(() => {
  return (Object.keys(noticeMap) as NoticeType[]).reduce((sum, key) => sum + unreadCount(key), 0);
});

function handleRead(item: NoticeItem) {
  item.read = true;
}

function handleReadAll(type: NoticeType) {
  noticeMap[type].forEach(item => (item.read = true));
}
</script>

<template>
  <el-popover trigger="click" placement="bottom" width="360" popper-class="notification-popover" transition="none">
    <template #reference>
      <div class="wrapper">
        <el-badge :value="totalUnread" :max="99" :hidden="totalUnread === 0">
          <app-icon icon="icon-park-outline:remind" />
        </el-badge>
      </div>
    </template>
    <el-tabs v-model="activeTab" class="notification-tabs">
      <el-tab-pane v-for="tab in tabs" :key="tab.key" :name="tab.key">
        <template #label>
          <el-badge :value="unreadCount(tab.key)" :hidden="unreadCount(tab.key) === 0" :max="99">
            <app-flex :size="4" align="center">
              <app-icon :icon="tab.icon" />
              {{ tab.label }}
            </app-flex>
          </el-badge>
        </template>
        <el-scrollbar max-height="320px">
          <template v-if="noticeMap[tab.key].length">
            <div
              v-for="item in noticeMap[tab.key]" :key="item.id" class="notification-item"
              :class="{ 'is-read': item.read }" @click="handleRead(item)"
            >
              <span class="notification-item__dot" />
              <div class="notification-item__body">
                <div class="notification-item__title">
                  {{ item.title }}
                </div>
                <div class="notification-item__content">
                  {{ item.content }}
                </div>
                <div class="notification-item__time">
                  {{ item.time }}
                </div>
              </div>
            </div>
          </template>
          <el-empty v-else :description="t('notification.empty')" :image-size="60" />
        </el-scrollbar>
        <div v-if="noticeMap[tab.key].length" class="notification-footer">
          <el-button link type="primary" :disabled="!unreadCount(tab.key)" @click="handleReadAll(tab.key)">
            {{ t('notification.readAll') }}
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-popover>
</template>

<style scoped lang="scss">
.notification-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-xs);
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: var(--el-fill-color-light);
  }

  &__dot {
    flex: none;
    width: 6px;
    height: 6px;
    margin-top: 6px;
    background-color: var(--el-color-danger);
    border-radius: 50%;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 14px;
    color: var(--el-text-color-primary);
  }

  &__content {
    margin-top: 2px;
    overflow: hidden;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__time {
    margin-top: 4px;
    font-size: 12px;
    color: var(--el-text-color-placeholder);
  }

  &.is-read &__dot {
    background-color: transparent;
  }
}

.notification-footer {
  display: flex;
  justify-content: center;
  padding-top: var(--spacing-xs);
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>

<i18n lang="yaml">
zh-CN:
  notification:
    tabs:
      notice: 通知
      message: 消息
      todo: 代办
    empty: 暂无数据
    readAll: 全部已读
en-US:
  notification:
    tabs:
      notice: Notice
      message: Message
      todo: Todo
    empty: No Data
    readAll: Mark all as read
</i18n>
