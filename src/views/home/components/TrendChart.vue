<script setup lang="ts">
import type { EChartsOption } from 'echarts';
import { useI18n } from 'vue-i18n';
import { palette } from '../constants';
import ChartCard from './ChartCard.vue';

defineOptions({ name: 'TrendChart' });

const { t } = useI18n();

// 折线趋势图
const option = computed<EChartsOption>(() => ({
  color: palette,
  tooltip: { trigger: 'axis', confine: true },
  legend: { data: [t('chart.trend.series0'), t('chart.trend.series1')], right: 0, top: 0, icon: 'roundRect' },
  grid: { left: 8, right: 12, bottom: 4, top: 40 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [t('weekDays.mon'), t('weekDays.tue'), t('weekDays.wed'), t('weekDays.thu'), t('weekDays.fri'), t('weekDays.sat'), t('weekDays.sun')],
  },
  yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
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
</script>

<template>
  <ChartCard :title="t('chart.trend.title')" :option="option">
    <template #extra>
      <el-tag type="primary" effect="light" size="small">
        {{ t('chart.thisWeek') }}
      </el-tag>
    </template>
  </ChartCard>
</template>

<i18n lang="yaml">
zh-CN:
  chart:
    thisWeek: 本周
    trend:
      title: 访问趋势
      series0: 访问量
      series1: 成交量
  weekDays:
    mon: 周一
    tue: 周二
    wed: 周三
    thu: 周四
    fri: 周五
    sat: 周六
    sun: 周日
en-US:
  chart:
    thisWeek: This Week
    trend:
      title: Visit Trend
      series0: Visits
      series1: Deals
  weekDays:
    mon: Mon
    tue: Tue
    wed: Wed
    thu: Thu
    fri: Fri
    sat: Sat
    sun: Sun
</i18n>
