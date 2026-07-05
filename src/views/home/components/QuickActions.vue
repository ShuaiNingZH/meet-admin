<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'QuickActions' });

// 未完成待办数量，同步给父级（欢迎横幅等使用）
const remaining = defineModel<number>('remaining', { default: 0 });

const { t } = useI18n();
const router = useRouter();

// 快捷入口
const shortcuts = computed(() => [
  { label: t('shortcuts.user'), icon: 'tabler:users', color: '#409eff', path: '/system/user' },
  { label: t('shortcuts.role'), icon: 'carbon:user-role', color: '#67c23a', path: '/system/role' },
  { label: t('shortcuts.menu'), icon: 'tabler:menu-2', color: '#e6a23c', path: '/system/menu' },
  { label: t('shortcuts.grid'), icon: 'tabler:layout-grid', color: '#9b59b6', path: '/demo/grid' },
]);

function goTo(path: string) {
  router.push(path).catch(() => {});
}

// 待办列表
const todos = ref([
  { id: 1, text: t('todo.items.0'), done: false, tag: t('todo.tags.urgent'), tagType: 'danger' },
  { id: 2, text: t('todo.items.1'), done: false, tag: t('todo.tags.normal'), tagType: 'warning' },
  { id: 3, text: t('todo.items.2'), done: true, tag: t('todo.tags.done'), tagType: 'success' },
  { id: 4, text: t('todo.items.3'), done: false, tag: t('todo.tags.normal'), tagType: 'warning' },
]);
watchEffect(() => {
  remaining.value = todos.value.filter(i => !i.done).length;
});
</script>

<template>
  <app-card class="h-full">
    <h3 class="m0">
      {{ t('shortcuts.title') }}
    </h3>
    <app-grid :cols="{ xs: 2, sm: 4 }" :row-gap="12" :col-gap="12">
      <app-grid-item v-for="s in shortcuts" :key="s.path">
        <div class="shortcut" @click="goTo(s.path)">
          <div class="shortcut__icon" :style="{ backgroundColor: `${s.color}1a`, color: s.color }">
            <app-icon :icon="s.icon" :size="22" />
          </div>
          <span class="shortcut__label">{{ s.label }}</span>
        </div>
      </app-grid-item>
    </app-grid>

    <el-divider class="todo-divider" />

    <div class="chart-card__header chart-card__header--sub">
      <span class="chart-card__title">{{ t('todo.title') }}</span>
      <el-badge :value="remaining" :max="99" type="danger" />
    </div>
    <ul class="todo-list">
      <li v-for="todo in todos" :key="todo.id" class="todo">
        <el-checkbox v-model="todo.done" class="todo__check">
          <span :class="{ 'todo__text--done': todo.done }">{{ todo.text }}</span>
        </el-checkbox>
        <el-tag :type="todo.tagType as any" effect="plain" size="small" round>
          {{ todo.tag }}
        </el-tag>
      </li>
    </ul>
  </app-card>
</template>

<i18n lang="yaml">
zh-CN:
  shortcuts:
    title: 快捷入口
    user: 用户管理
    role: 角色管理
    menu: 菜单管理
    grid: 栅格演示
  todo:
    title: 待办清单
    items:
      - 审核新注册的企业用户
      - 完善本月运营数据报表
      - 回复客户反馈工单
      - 更新系统权限配置
    tags:
      urgent: 紧急
      normal: 普通
      done: 完成
en-US:
  shortcuts:
    title: Shortcuts
    user: Users
    role: Roles
    menu: Menus
    grid: Grid Demo
  todo:
    title: To-do List
    items:
      - Review newly registered enterprise users
      - Finalize this month's operation report
      - Reply to customer feedback tickets
      - Update system permission settings
    tags:
      urgent: Urgent
      normal: Normal
      done: Done
</i18n>

<style scoped lang="scss">
/* 快捷入口 */
.shortcut {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: center;
  padding: var(--spacing-md) var(--spacing-sm);
  cursor: pointer;
  border-radius: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--el-fill-color-light);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }

  &__label {
    font-size: 13px;
    color: var(--el-text-color-regular);
  }
}

.todo-divider {
  margin: var(--spacing-base) 0 var(--spacing-md);
}

/* 待办 */
.todo-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.todo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;

  &__text--done {
    color: var(--el-text-color-placeholder);
    text-decoration: line-through;
  }
}
</style>
