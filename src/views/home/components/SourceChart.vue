<script setup lang="ts">
import type { EChartsOption } from 'echarts';
import { useI18n } from 'vue-i18n';
import { palette } from '../constants';
import ChartCard from './ChartCard.vue';

defineOptions({ name: 'SourceChart' });

const { t } = useI18n();

// 访问来源饼图
const option = computed<EChartsOption>(() => ({
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
      itemStyle: { borderRadius: 6 },
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
</script>

<template>
  <ChartCard :title="t('chart.source.title')" :option="option" />
</template>

<i18n lang="yaml">
zh-CN:
  chart:
    source:
      title: 访问来源
      items:
        - 直接访问
        - 搜索引擎
        - 社交媒体
        - 邮件营销
        - 其他渠道
en-US:
  chart:
    source:
      title: Traffic Source
      items:
        - Direct
        - Search Engine
        - Social Media
        - Email
        - Others
</i18n>
