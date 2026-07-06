import type { EChartsOption } from 'echarts';
import type { EChartsType } from 'echarts/core';
import type { TemplateRef } from 'vue';
import type { EChartOptions } from '@/config/echarts';
import { cloneDeep, merge } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import echarts from '@/config/echarts';
import { useAppStore } from '@/stores/app';

type ElementEventName = 'click' | 'dblclick' | 'mousewheel' | 'mouseout' | 'mouseover' | 'mouseup' | 'mousedown' | 'mousemove' | 'contextmenu' | 'drag' | 'dragstart' | 'dragend' | 'dragenter' | 'dragleave' | 'dragover' | 'drop' | 'globalout';

interface EChartsEventCacheItem {
  event: ElementEventName;
  query?: string | object;
  handler: (params: echarts.ECElementEvent) => void;
}

interface ZRenderEventCacheItem {
  event: ElementEventName;
  handler: (params: echarts.ElementEvent) => void;
}

/**
 * useECharts
 * @param chartRef - 图表 DOM 引用
 * @param option - 图表实例的配置
 * @param initOpts - 图表配置
 */
export function useECharts(chartRef: TemplateRef<HTMLDivElement>, option: EChartsOption, initOpts: EChartOptions = {}) {
  // ECharts 实例
  let chartInstance: EChartsType | null = null;
  // 当前图表配置项
  const chartOptions = cloneDeep(option);
  // echarts 事件缓存
  const echartsEventCache: EChartsEventCacheItem[] = [];
  // ZRender 事件缓存
  const zRenderEventCache: ZRenderEventCacheItem[] = [];
  // 当前图表配置
  const { autoResize = true } = initOpts;

  // 图表切换主题：跟随 app store 解析后的配色（auto 模式下系统主题变化也会触发重绘）
  const { colorScheme } = storeToRefs(useAppStore());
  watch(colorScheme, initChart);

  // 图表切换语言
  const { locale } = useI18n();
  watch(locale, initChart);
  const currentLocale = computed(() => (locale.value === 'zh-CN' ? 'zh' : 'en'));

  // 初始化图表，创建一个 ECharts 实例
  function initChart() {
    if (!chartRef.value)
      return;

    // 销毁现有实例
    chartInstance?.dispose();

    // 初始化图表
    chartInstance = echarts.init(chartRef.value, colorScheme.value, {
      ...initOpts,
      renderer: initOpts.renderer ?? 'canvas',
      useDirtyRect: initOpts.useDirtyRect ?? false,
      locale: currentLocale.value,
    });

    // 配置图表
    if (chartOptions) {
      // 因图表在深色主题下背景色是深蓝色，所以需要重置为透明
      chartInstance?.setOption({
        ...chartOptions,
        backgroundColor: 'transparent',
      }, true);
    }

    // 重新绑定 echarts 事件缓存
    echartsEventCache.forEach(({ event, query, handler }) => {
      if (query)
        chartInstance?.on(event, query, handler);
      else chartInstance?.on(event, handler);
    });

    // 重新绑定 ZRender 事件缓存
    zRenderEventCache.forEach(({ event, handler }) => {
      chartInstance?.getZr()?.on(event, handler);
    });
  }

  // 更新图表配置
  async function updateOptions(option: EChartsOption) {
    await nextTick();

    merge(chartOptions, option);

    chartInstance?.setOption(option);
  }

  // 监听容器尺寸变化，自动调整图表大小
  const debouncedResize = useDebounceFn(() => {
    chartInstance?.resize();
  }, 300);

  // 清空图表
  function clear() {
    chartInstance?.clear();
  }

  // 显示加载状态
  function showLoading(text = '加载中...') {
    // 主题色
    const color = getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary').trim();
    chartInstance?.showLoading('default', {
      text,
      color,
      lineWidth: 2,
    });
  }

  // 隐藏加载状态
  function hideLoading() {
    chartInstance?.hideLoading();
  }

  // 绑定 ECharts 事件
  async function bindEChartsEvent(event: ElementEventName, handler: (params: echarts.ECElementEvent) => void): Promise<void>;
  // 绑定 ECharts 事件
  async function bindEChartsEvent(event: ElementEventName, query: string | object, handler: (params: echarts.ECElementEvent) => void): Promise<void>;
  // 绑定 ECharts 事件
  async function bindEChartsEvent(
    event: ElementEventName,
    queryOrHandler: string | object | ((params: echarts.ECElementEvent) => void),
    maybeHandler?: (params: echarts.ECElementEvent) => void,
  ) {
    await nextTick();

    if (maybeHandler) {
      chartInstance?.on(event, queryOrHandler as string | object, maybeHandler);

      // 添加 echarts 事件缓存
      echartsEventCache.push({
        event,
        query: queryOrHandler as string | object,
        handler: maybeHandler,
      });
    }
    else {
      const handler = queryOrHandler as (params: echarts.ECElementEvent) => void;
      chartInstance?.on(event, handler);

      // 添加 echarts 事件缓存
      echartsEventCache.push({ event, handler });
    }
  }

  // 绑定 ZRender 事件
  async function bindZRenderEvent(event: ElementEventName, handler: (params: echarts.ElementEvent) => void) {
    await nextTick();
    chartInstance?.getZr()?.on(event, handler);
    // 添加 ZRender 事件缓存
    zRenderEventCache.push({ event, handler });
  }

  // 获取 DataURL
  function getDataURL(opts?: {
    type?: 'png' | 'jpeg' | 'svg';
    pixelRatio?: number;
    backgroundColor?: string;
    excludeComponents?: string[];
  }) {
    return chartInstance?.getDataURL(opts) || '';
  }

  // 自动调整大小：监听图表自身容器的尺寸变化（useResizeObserver 会自动 observe，并在组件卸载时解绑）
  if (autoResize)
    useResizeObserver(chartRef, debouncedResize);

  // 挂载时初始化
  onMounted(() => {
    initChart();
  });

  // 组件卸载时销毁图表实例
  onBeforeUnmount(() => {
    chartInstance?.dispose();
    chartInstance = null;
  });

  return {
    getChartInstance: () => chartInstance,
    updateOptions,
    resize: debouncedResize,
    showLoading,
    hideLoading,
    clear,
    bindEChartsEvent,
    bindZRenderEvent,
    getDataURL,
  };
}
