import { fileURLToPath } from 'node:url';
import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    // 结尾使用分号
    semi: true,
  },
  // 使用外部格式化程序来格式化 ESLint 尚无法处理的文件，默认使用 prettier
  formatters: {
    css: true,
    html: true,
  },
  unocss: true,
}, {
  // @unocss/eslint-plugin 的 getSearchCwd 不识别 Windows 反斜杠路径
  name: 'project/unocss-settings',
  settings: {
    unocss: {
      configPath: fileURLToPath(new URL('./uno.config.ts', import.meta.url)),
    },
  },
});
