<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'StatCards' });

const { t } = useI18n();

// 顶部统计卡片
const stats = computed(() => [
  { key: 'visits', label: t('stats.visits'), value: 12875, delta: 12.5, up: true, icon: 'material-symbols:visibility-outline-rounded', color: '#409eff' },
  { key: 'orders', label: t('stats.orders'), value: 1286, delta: 8.2, up: true, icon: 'material-symbols:shopping-cart-outline', color: '#67c23a' },
  { key: 'users', label: t('stats.users'), value: 3642, delta: -3.1, up: false, icon: 'tabler:users', color: '#e6a23c' },
  { key: 'amount', label: t('stats.amount'), value: 89432, delta: 21.7, up: true, money: true, icon: 'material-symbols:payments-outline', color: '#9b59b6' },
]);

// 数字滚动动画：从 0 缓动到目标值，交由 el-statistic 渲染
const source = ref<number[]>(stats.value.map(() => 0));
const displayValues = useTransition(source, {
  duration: 1600,
});

onMounted(() => {
  source.value = stats.value.map(item => item.value);
});
</script>

<template>
  <app-grid :cols="{ xs: 2, lg: 4 }" :row-gap="16" :col-gap="16">
    <app-grid-item v-for="(item, index) in stats" :key="item.key">
      <app-card shadow="hover" class="stat h-full">
        <div class="stat__body">
          <div>
            <p class="stat__label">
              {{ item.label }}
            </p>
            <el-statistic
              class="stat__value"
              :value="displayValues[index]"
              :precision="item.money ? 2 : 0"
              :prefix="item.money ? '¥' : undefined"
            />
            <p class="stat__delta" :class="item.up ? 'is-up' : 'is-down'">
              <app-icon :icon="item.up ? 'material-symbols:trending-up' : 'material-symbols:trending-down'" />
              {{ Math.abs(item.delta) }}% <span class="stat__delta-tip">{{ t('stats.vsLast') }}</span>
            </p>
          </div>
          <div class="stat__icon" :style="{ backgroundColor: `${item.color}1a`, color: item.color }">
            <app-icon :icon="item.icon" :size="26" />
          </div>
        </div>
      </app-card>
    </app-grid-item>
  </app-grid>
</template>

<i18n lang="yaml">
zh-CN:
  stats:
    visits: 总访问量
    orders: 订单数量
    users: 用户总数
    amount: 销售额
    vsLast: 较上周
en-US:
  stats:
    visits: Total Visits
    orders: Orders
    users: Total Users
    amount: Revenue
    vsLast: vs last week
</i18n>

<style scoped lang="scss">
.stat {
  transition: transform 0.2s;

  .el-statistic {
    --el-statistic-content-font-weight: 700;
    --el-statistic-content-font-size: 28px;
  }

  &:hover {
    transform: translateY(-3px);
  }

  &__body {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  &__label {
    margin: 0;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__value {
    margin: var(--spacing-sm) 0;
  }

  &__delta {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    margin: 0;
    font-size: 12px;
    font-weight: 600;

    &.is-up {
      color: var(--el-color-success);
    }

    &.is-down {
      color: var(--el-color-danger);
    }
  }

  &__delta-tip {
    font-weight: 400;
    color: var(--el-text-color-placeholder);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 12px;
  }
}
</style>
