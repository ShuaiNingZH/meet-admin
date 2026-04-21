import presetRemToPx from '@unocss/preset-rem-to-px';
import { defineConfig, presetAttributify, presetWind3, transformerVariantGroup } from 'unocss';
// https://github.com/unocss/unocss
const defaultColor = 'var(--el-border-color)';
const directionMap: AnyObj = {
  r: 'border-right',
  b: 'border-bottom',
  t: 'border-top',
  l: 'border-left',
};
export default defineConfig({
  presets: [presetWind3({ dark: 'class' }), presetAttributify(), presetRemToPx({
    baseFontSize: 4,
  })],
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-center': 'flex justify-center items-center',
    'flex-x-center': 'flex justify-center',
    'flex-y-center': 'flex items-center',
    // 快捷按键的样式
    'commands': 'h-22 w-22 m-r-5 flex-center b-rd-2 bg-[rgba(125,125,125,0.1)] text-10 color-#909399 shadow-commands',
  },
  rules: [
    ['shadow-commands', {
      'box-shadow': 'inset 0 -2px 0 0 #cdcde6, inset 0 0 1px 1px #fff, 0 1px 2px 1px rgba(30, 35, 90, 0.4)',
    }],
    // 动态规则，匹配 'border-{direction}-{width}-{style}-{color}'
    [/^border(?:-([rbtl]))?(?:-(\d))?(?:-(solid|dashed))?(?:-(color-)?(\w+|\[#[0-9a-fA-F]{3,6}\]))?$/, ([, direction, width = '1', style = 'solid', , color]) => {
      // 如果有颜色部分，则使用提取的颜色值或默认颜色
      color = !color ? defaultColor : color.replace(/\[(.+)\]/, '$1');
      direction = !direction ? 'border' : directionMap[direction];
      return {
        [`${direction}`]: `${width}px ${style} ${color}`,
      };
    }],
    // 动态规则，匹配 'wrapper-{padding}'
    [/^wrapper(?:-(\d+))?$/, ([, padding], { symbols }) => {
      return [
        {
          'display': 'flex',
          'align-items': 'center',
          'cursor': 'pointer',
          'border-radius': '4px',
          'padding': `${padding || 12}px`, // 使用默认值 12
          'color': 'var(--el-text-color-primary)',
        },
        {
          [symbols.selector]: selector => `${selector}:hover`,
          'background-color': 'var(--el-color-primary-light-9)',
          'color': 'var(--el-color-primary)',
        },
      ];
    }],
  ],
  transformers: [
    transformerVariantGroup(),
  ],
});
