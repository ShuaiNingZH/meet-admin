<script setup lang="ts">
import type { EChartsOption } from 'echarts';
import { useI18n } from 'vue-i18n';
import { useECharts } from '@/hooks';
import { useUserStore } from '@/stores';
import { moneyThousand, numberFormat } from '@/utils';

defineOptions({ name: 'Home' });

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

// 图表统一配色（与主题主色协调）
const palette = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#9b59b6', '#36cfc9'];

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

// 顶部统计卡片
const stats = computed(() => [
  { key: 'visits', label: t('stats.visits'), value: 12875, delta: 12.5, up: true, icon: 'material-symbols:visibility-outline-rounded', color: '#409eff' },
  { key: 'orders', label: t('stats.orders'), value: 1286, delta: 8.2, up: true, icon: 'material-symbols:shopping-cart-outline', color: '#67c23a' },
  { key: 'users', label: t('stats.users'), value: 3642, delta: -3.1, up: false, icon: 'tabler:users', color: '#e6a23c' },
  { key: 'amount', label: t('stats.amount'), value: 89432, delta: 21.7, up: true, money: true, icon: 'material-symbols:payments-outline', color: '#9b59b6' },
]);

// 金额补两位小数并带符号，计数只做千分位
function formatStat(item: { value: number; money?: boolean }) {
  return item.money ? `¥${moneyThousand(item.value)}` : numberFormat(item.value);
}

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
const remainingTodos = computed(() => todos.value.filter(i => !i.done).length);

// 动态列表
const activities = computed(() => [
  { id: 1, user: 'Admin', action: t('activity.actions.0'), time: t('activity.time.0'), type: 'primary' },
  { id: 2, user: 'Vivian', action: t('activity.actions.1'), time: t('activity.time.1'), type: 'success' },
  { id: 3, user: 'Kevin', action: t('activity.actions.2'), time: t('activity.time.2'), type: 'warning' },
  { id: 4, user: 'System', action: t('activity.actions.3'), time: t('activity.time.3'), type: 'info' },
  { id: 5, user: 'Lucy', action: t('activity.actions.4'), time: t('activity.time.4'), type: 'primary' },
]);

// 折线趋势图
const trendRef = useTemplateRef<HTMLDivElement>('trendRef');
const trendOption = computed<EChartsOption>(() => ({
  color: palette,
  tooltip: { trigger: 'axis', confine: true },
  legend: { data: [t('chart.trend.series0'), t('chart.trend.series1')], right: 0, top: 0, icon: 'roundRect' },
  grid: { left: 8, right: 12, bottom: 4, top: 40 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [t('weekDays.mon'), t('weekDays.tue'), t('weekDays.wed'), t('weekDays.thu'), t('weekDays.fri'), t('weekDays.sat'), t('weekDays.sun')],
    axisLine: { lineStyle: { color: '#dcdfe6' } },
  },
  yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#ebeef5' } } },
  series: [
    {
      name: t('chart.trend.series0'),
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 3 },
      areaStyle: { opacity: 0.15 },
      data: [820, 932, 901, 1290, 1330, 1620, 1520],
    },
    {
      name: t('chart.trend.series1'),
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 3 },
      areaStyle: { opacity: 0.15 },
      data: [420, 532, 601, 690, 830, 920, 1080],
    },
  ],
}));
const { updateOptions: updateTrend } = useECharts(trendRef, trendOption.value);
watch(trendOption, val => updateTrend(val));

// 访问来源饼图
const sourceRef = useTemplateRef<HTMLDivElement>('sourceRef');
const sourceOption = computed<EChartsOption>(() => ({
  color: palette,
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)', confine: true },
  legend: { bottom: 0, icon: 'circle' },
  series: [
    {
      name: t('chart.source.title'),
      type: 'pie',
      radius: ['45%', '68%'],
      center: ['50%', '44%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { scaleSize: 8 },
      data: [
        { value: 1048, name: t('chart.source.items.0') },
        { value: 735, name: t('chart.source.items.1') },
        { value: 580, name: t('chart.source.items.2') },
        { value: 484, name: t('chart.source.items.3') },
        { value: 300, name: t('chart.source.items.4') },
      ],
    },
  ],
}));
const { updateOptions: updateSource } = useECharts(sourceRef, sourceOption.value);
watch(sourceOption, val => updateSource(val));

// 分类销量柱状图
const salesRef = useTemplateRef<HTMLDivElement>('salesRef');
const salesOption = computed<EChartsOption>(() => ({
  color: palette,
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, confine: true },
  grid: { left: 8, right: 12, bottom: 4, top: 20 },
  xAxis: {
    type: 'category',
    data: [t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'), t('months.may'), t('months.jun')],
    axisLine: { lineStyle: { color: '#dcdfe6' } },
  },
  yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#ebeef5' } } },
  series: [
    {
      name: t('chart.sales.title'),
      type: 'bar',
      barWidth: '46%',
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#a0cfff' },
          ],
        },
      },
      data: [320, 432, 501, 434, 690, 820],
    },
  ],
}));
const { updateOptions: updateSales } = useECharts(salesRef, salesOption.value);
watch(salesOption, val => updateSales(val));
</script>

<template>
  <app-flex vertical :size="16" class="home">
    <!-- 欢迎横幅 -->
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
          <span class="welcome__mini-val">{{ remainingTodos }}</span>
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

    <!-- 统计卡片 -->
    <div class="stat-grid">
      <app-card v-for="item in stats" :key="item.key" shadow="hover" class="stat">
        <div class="stat__body">
          <div>
            <p class="stat__label">
              {{ item.label }}
            </p>
            <p class="stat__value">
              {{ formatStat(item) }}
            </p>
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
    </div>

    <!-- 图表区：趋势 + 来源 -->
    <div class="chart-grid chart-grid--2">
      <app-card>
        <div class="chart-card__header">
          <span class="chart-card__title">{{ t('chart.trend.title') }}</span>
          <el-tag type="primary" effect="light" size="small">
            {{ t('chart.thisWeek') }}
          </el-tag>
        </div>
        <div ref="trendRef" class="chart chart--lg" />
      </app-card>

      <app-card>
        <div class="chart-card__header">
          <span class="chart-card__title">{{ t('chart.source.title') }}</span>
        </div>
        <div ref="sourceRef" class="chart chart--lg" />
      </app-card>
    </div>

    <!-- 底部：柱状图 + 快捷入口/待办 + 动态 -->
    <div class="chart-grid chart-grid--3">
      <app-card>
        <div class="chart-card__header">
          <span class="chart-card__title">{{ t('chart.sales.title') }}</span>
        </div>
        <div ref="salesRef" class="chart chart--lg" />
      </app-card>

      <app-card>
        <div class="chart-card__header">
          <span class="chart-card__title">{{ t('shortcuts.title') }}</span>
        </div>
        <div class="shortcut-grid">
          <div
            v-for="s in shortcuts"
            :key="s.path"
            class="shortcut"
            @click="goTo(s.path)"
          >
            <div class="shortcut__icon" :style="{ backgroundColor: `${s.color}1a`, color: s.color }">
              <app-icon :icon="s.icon" :size="22" />
            </div>
            <span class="shortcut__label">{{ s.label }}</span>
          </div>
        </div>

        <el-divider class="todo-divider" />

        <div class="chart-card__header chart-card__header--sub">
          <span class="chart-card__title">{{ t('todo.title') }}</span>
          <el-badge :value="remainingTodos" :max="99" type="danger" />
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

      <app-card>
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
    </div>
  </app-flex>
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
  stats:
    visits: 总访问量
    orders: 订单数量
    users: 用户总数
    amount: 销售额
    vsLast: 较上周
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
  chart:
    thisWeek: 本周
    trend:
      title: 访问趋势
      series0: 访问量
      series1: 成交量
    source:
      title: 访问来源
      items:
        - 直接访问
        - 搜索引擎
        - 社交媒体
        - 邮件营销
        - 其他渠道
    sales:
      title: 月度销量
  weekDays:
    mon: 周一
    tue: 周二
    wed: 周三
    thu: 周四
    fri: 周五
    sat: 周六
    sun: 周日
  months:
    jan: 1 月
    feb: 2 月
    mar: 3 月
    apr: 4 月
    may: 5 月
    jun: 6 月
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
  stats:
    visits: Total Visits
    orders: Orders
    users: Total Users
    amount: Revenue
    vsLast: vs last week
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
  chart:
    thisWeek: This Week
    trend:
      title: Visit Trend
      series0: Visits
      series1: Deals
    source:
      title: Traffic Source
      items:
        - Direct
        - Search Engine
        - Social Media
        - Email
        - Others
    sales:
      title: Monthly Sales
  weekDays:
    mon: Mon
    tue: Tue
    wed: Wed
    thu: Thu
    fri: Fri
    sat: Sat
    sun: Sun
  months:
    jan: Jan
    feb: Feb
    mar: Mar
    apr: Apr
    may: May
    jun: Jun
</i18n>

<style scoped lang="scss">
.home {
  width: 100%;
}

/* 欢迎横幅 */
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

/* 统计卡片 */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat {
  transition: transform 0.2s;

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
    margin: 8px 0;
    font-size: 26px;
    font-weight: 700;
    line-height: 1.1;
    color: var(--el-text-color-primary);
  }

  &__delta {
    display: flex;
    align-items: center;
    gap: 4px;
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

/* 图表网格 */
.chart-grid {
  display: grid;
  gap: 16px;

  &--2 {
    grid-template-columns: 2fr 1fr;
  }

  &--3 {
    grid-template-columns: 1.4fr 1fr 1fr;
  }
}

.chart {
  flex: 1 1 auto;
  width: 100%;
  min-height: 260px;

  &--lg {
    min-height: 300px;
  }
}

/* 快捷入口 */
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.shortcut {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding: 14px 8px;
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
  margin: 18px 0 12px;
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
  padding: 8px 0;

  &__text--done {
    color: var(--el-text-color-placeholder);
    text-decoration: line-through;
  }
}

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

/* 响应式 */
@media (width <= 1200px) {
  .chart-grid--2,
  .chart-grid--3 {
    grid-template-columns: 1fr;
  }

  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width <= 640px) {
  .stat-grid,
  .shortcut-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
