<script setup lang="ts">
import type { EChartsOption } from 'echarts';
import { useI18n } from 'vue-i18n';
import { palette } from '../constants';
import ChartCard from './ChartCard.vue';

defineOptions({ name: 'SalesChart' });

const { t } = useI18n();

// 分类销量柱状图
const option = computed<EChartsOption>(() => ({
  color: palette,
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, confine: true },
  grid: { left: 8, right: 12, bottom: 4, top: 20 },
  xAxis: {
    type: 'category',
    data: [t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'), t('months.may'), t('months.jun')],
  },
  yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
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
</script>

<template>
  <ChartCard :title="t('chart.sales.title')" :option="option" />
</template>

<i18n lang="yaml">
zh-CN:
  chart:
    sales:
      title: 月度销量
  months:
    jan: 1 月
    feb: 2 月
    mar: 3 月
    apr: 4 月
    may: 5 月
    jun: 6 月
en-US:
  chart:
    sales:
      title: Monthly Sales
  months:
    jan: Jan
    feb: Feb
    mar: Mar
    apr: Apr
    may: May
    jun: Jun
</i18n>
