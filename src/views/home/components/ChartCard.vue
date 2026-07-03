<script setup lang="ts">
import type { EChartsOption } from 'echarts';
import { useECharts } from '@/hooks';

defineOptions({ name: 'ChartCard' });

const props = defineProps<{ title: string; option: EChartsOption }>();

const chartRef = useTemplateRef<HTMLDivElement>('chartRef');
const { updateOptions } = useECharts(chartRef, props.option);
watch(() => props.option, val => updateOptions(val));
</script>

<template>
  <app-card class="h-full">
    <h3 class="m0">
      {{ title }}
    </h3>
    <div ref="chartRef" class="chart chart--lg" />
  </app-card>
</template>

<style scoped lang="scss">
.chart {
  flex: 1 1 auto;
  width: 100%;
  min-height: 260px;

  &--lg {
    min-height: 300px;
  }
}
</style>
