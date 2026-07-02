<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores';

defineOptions({ name: 'WelcomeBanner' });

defineProps<{ todoCount: number }>();

const { t } = useI18n();
const userStore = useUserStore();

// 当前时间问候语
const now = ref(new Date());
let timer: ReturnType<typeof setInterval>;
onMounted(() => {
  timer = setInterval(() => (now.value = new Date()), 60 * 1000);
});
onBeforeUnmount(() => clearInterval(timer));

const greeting = computed(() => {
  const h = now.value.getHours();
  if (h < 6)
    return t('greeting.dawn');
  if (h < 12)
    return t('greeting.morning');
  if (h < 14)
    return t('greeting.noon');
  if (h < 18)
    return t('greeting.afternoon');
  return t('greeting.evening');
});

const today = computed(() => {
  const d = now.value;
  const weeks = t('weeks').split(',');
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')} ${weeks[d.getDay()]}`;
});

const userName = computed(() => userStore.userInfo.nickname || userStore.userInfo.username || t('user'));
</script>

<template>
  <app-card class="welcome">
    <div class="welcome__info">
      <el-avatar :size="60" round :src="userStore.userInfo.avatar" class="welcome__avatar">
        {{ userName.charAt(0).toUpperCase() }}
      </el-avatar>
      <div>
        <h2 class="welcome__title">
          {{ greeting }}，{{ userName }} 👋
        </h2>
        <p class="welcome__sub">
          {{ today }} · {{ t('welcome.sub') }}
        </p>
      </div>
    </div>
    <div class="welcome__mini">
      <div class="welcome__mini-item">
        <span class="welcome__mini-val">{{ todoCount }}</span>
        <span class="welcome__mini-label">{{ t('welcome.todo') }}</span>
      </div>
      <el-divider direction="vertical" class="welcome__divider" />
      <div class="welcome__mini-item">
        <span class="welcome__mini-val">98%</span>
        <span class="welcome__mini-label">{{ t('welcome.online') }}</span>
      </div>
      <el-divider direction="vertical" class="welcome__divider" />
      <div class="welcome__mini-item">
        <span class="welcome__mini-val">24</span>
        <span class="welcome__mini-label">{{ t('welcome.message') }}</span>
      </div>
    </div>
  </app-card>
</template>

<i18n lang="yaml">
zh-CN:
  user: 管理员
  weeks: 周日,周一,周二,周三,周四,周五,周六
  greeting:
    dawn: 夜深了
    morning: 早上好
    noon: 中午好
    afternoon: 下午好
    evening: 晚上好
  welcome:
    sub: 欢迎回来，祝你今天工作愉快！
    todo: 待办事项
    online: 在线率
    message: 新消息
en-US:
  user: Admin
  weeks: Sun,Mon,Tue,Wed,Thu,Fri,Sat
  greeting:
    dawn: Late night
    morning: Good morning
    noon: Good noon
    afternoon: Good afternoon
    evening: Good evening
  welcome:
    sub: Welcome back, have a nice day!
    todo: To-dos
    online: Online
    message: Messages
</i18n>

<style scoped lang="scss">
.welcome {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, var(--el-color-primary-light-8) 0%, var(--el-bg-color) 60%);
  border: none;

  &__info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__avatar {
    color: #fff;
    background: var(--el-color-primary);
  }

  &__title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  &__sub {
    margin: 6px 0 0;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__mini {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__mini-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 12px;
  }

  &__mini-val {
    font-size: 20px;
    font-weight: 700;
    color: var(--el-color-primary);
  }

  &__mini-label {
    margin-top: 2px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__divider {
    height: 28px;
  }
}
</style>
