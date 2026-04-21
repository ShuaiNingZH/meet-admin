// 引入图表，图表后缀都为 Chart
import {
  BarChart,
  GaugeChart,
  LineChart,
  LinesChart,
  PieChart,
  RadarChart,
  ScatterChart,
} from 'echarts/charts';
// 引入组件，组件后缀都为 Component
import {
  DatasetComponent,
  DataZoomComponent,
  GeoComponent,
  GridComponent,
  LegendComponent,
  PolarComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

export interface EChartOptions extends echarts.EChartsInitOpts {
  // 是否自动调整大小
  autoResize?: boolean;
}

// 注册必须的组件
echarts.use([
  DatasetComponent,
  DataZoomComponent,
  GeoComponent,
  GridComponent,
  LegendComponent,
  PolarComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
  BarChart,
  GaugeChart,
  LineChart,
  LinesChart,
  PieChart,
  RadarChart,
  ScatterChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

export default echarts;
