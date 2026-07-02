<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'ActivityFeed' });

const { t } = useI18n();

// 动态列表
const activities = computed(() => [
  { id: 1, user: 'Admin', action: t('activity.actions.0'), time: t('activity.time.0'), type: 'primary' },
  { id: 2, user: 'Vivian', action: t('activity.actions.1'), time: t('activity.time.1'), type: 'success' },
  { id: 3, user: 'Kevin', action: t('activity.actions.2'), time: t('activity.time.2'), type: 'warning' },
  { id: 4, user: 'System', action: t('activity.actions.3'), time: t('activity.time.3'), type: 'info' },
  { id: 5, user: 'Lucy', action: t('activity.actions.4'), time: t('activity.time.4'), type: 'primary' },
]);
</script>

<template>
  <app-card class="h-full">
    <div class="chart-card__header">
      <span class="chart-card__title">{{ t('activity.title') }}</span>
    </div>
    <el-timeline class="activity">
      <el-timeline-item
        v-for="act in activities"
        :key="act.id"
        :type="act.type as any"
        :timestamp="act.time"
        placement="top"
        hollow
      >
        <span class="activity__user">{{ act.user }}</span>
        <span class="activity__action">{{ act.action }}</span>
      </el-timeline-item>
    </el-timeline>
  </app-card>
</template>

<i18n lang="yaml">
zh-CN:
  activity:
    title: 最新动态
    actions:
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
    actions:
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
    margin-right: 6px;
    font-weight: 600;
    color: var(--el-color-primary);
  }

  &__action {
    font-size: 13px;
    color: var(--el-text-color-regular);
  }
}
</style>
