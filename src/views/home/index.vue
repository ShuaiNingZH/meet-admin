<script setup lang="ts">
import ActivityFeed from './components/ActivityFeed.vue';
import QuickActions from './components/QuickActions.vue';
import SalesChart from './components/SalesChart.vue';
import SourceChart from './components/SourceChart.vue';
import StatCards from './components/StatCards.vue';
import TrendChart from './components/TrendChart.vue';
import WelcomeBanner from './components/WelcomeBanner.vue';

defineOptions({ name: 'Home' });

// 未完成待办数量，由待办组件维护，欢迎横幅展示
const remainingTodos = ref(0);
</script>

<template>
  <app-flex vertical :size="16" class="home">
    <!-- 欢迎横幅 -->
    <WelcomeBanner :todo-count="remainingTodos" />

    <!-- 统计卡片 -->
    <StatCards />

    <!-- 图表区：趋势 + 来源 -->
    <app-grid :cols="{ xs: 1, lg: 3 }" :row-gap="16" :col-gap="16">
      <app-grid-item :span="2">
        <TrendChart />
      </app-grid-item>
      <app-grid-item>
        <SourceChart />
      </app-grid-item>
    </app-grid>

    <!-- 底部：柱状图 + 快捷入口/待办 + 动态 -->
    <app-grid :cols="{ xs: 1, lg: 17 }" :row-gap="16" :col-gap="16">
      <app-grid-item :span="7">
        <SalesChart />
      </app-grid-item>
      <app-grid-item :span="5">
        <QuickActions v-model:remaining="remainingTodos" />
      </app-grid-item>
      <app-grid-item :span="5">
        <ActivityFeed />
      </app-grid-item>
    </app-grid>
  </app-flex>
</template>
