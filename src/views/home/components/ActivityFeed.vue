<script setup lang="ts">
import type { TimelineItemProps } from 'element-plus';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'ActivityFeed' });

const { t } = useI18n();

interface ActivityType extends Partial<TimelineItemProps> {
  user: string;
  content: string;
}

// 动态列表
const activities = computed<ActivityType[]>(() => [
  { user: 'Admin', content: t('activity.content.0'), timestamp: t('activity.time.0'), type: 'primary' },
  { user: 'Vivian', content: t('activity.content.1'), timestamp: t('activity.time.1'), type: 'success' },
  { user: 'Kevin', content: t('activity.content.2'), timestamp: t('activity.time.2'), type: 'warning' },
  { user: 'System', content: t('activity.content.3'), timestamp: t('activity.time.3'), type: 'info' },
  { user: 'Lucy', content: t('activity.content.4'), timestamp: t('activity.time.4'), type: 'primary' },
]);
</script>

<template>
  <app-card class="h-full">
    <h3 class="m0">
      {{ t('activity.title') }}
    </h3>
    <el-timeline class="activity">
      <el-timeline-item
        v-for="(item, index) in activities" :key="index" :type="item.type" :timestamp="item.timestamp"
        placement="top" hollow
      >
        <span class="activity__user">{{ item.user }}</span>
        <span class="activity__content">{{ item.content }}</span>
      </el-timeline-item>
    </el-timeline>
  </app-card>
</template>

<i18n lang="yaml">
zh-CN:
  activity:
    title: 最新动态
    content:
      - 更新了系统菜单配置
      - 新增了一个角色「运营专员」
      - 导出了本月用户数据
      - 完成了一次自动数据备份
      - 修改了个人资料信息
    time:
      - 10 分钟前
      - 1 小时前
      - 3 小时前
      - 今天 08:00
      - 昨天 21:30
en-US:
  activity:
    title: Recent Activity
    content:
      - Updated system menu configuration
      - Added a new role "Operator"
      - Exported this month's user data
      - Completed an automatic data backup
      - Modified personal profile
    time:
      - 10 min ago
      - 1 hour ago
      - 3 hours ago
      - Today 08:00
      - Yesterday 21:30
</i18n>

<style scoped lang="scss">
/* 动态 */
.activity {
  padding-top: 4px;

  &__user {
    margin-right: var(--spacing-sm);
    font-weight: 600;
    color: var(--el-color-primary);
  }

  &__content {
    font-size: 13px;
    color: var(--el-text-color-regular);
  }
}
</style>
