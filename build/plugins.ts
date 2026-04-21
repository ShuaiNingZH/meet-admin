import type { ComponentResolver } from 'unplugin-vue-components';
import path from 'node:path';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import compressPlugin from 'vite-plugin-compression';
import vueDevTools from 'vite-plugin-vue-devtools';

type Algorithm = 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw';
interface Config {
  threshold: number;
  filter: (path: string) => boolean;
  deleteOriginFile: boolean;
  ext?: string;
  algorithm?: Algorithm;
}

/**
 * 创建压缩插件配置
 * @param compress - 压缩算法类型，支持 'gzip'、'brotli'、'deflate'、'deflateRaw'，传入 'none' 则不启用压缩
 * @returns 返回 vite-plugin-compression 插件实例或 null（不启用压缩）
 */
function configCompressPlugin(compress: string) {
  // 如果传入的是 'none'，表示不启用任何压缩插件
  if (compress === 'none') {
    return null;
  }

  // 通用的压缩配置
  const config: Config = {
    // 文件大小大于该值（单位：字节）才会被压缩，10240 字节 = 10KB
    threshold: 10240,

    // 指定要压缩的文件类型，匹配 js/css/html/json/xml/svg/wasm/woff/woff2
    filter: (file) => {
      return /\.(?:js|css|html|json|xml|svg|wasm|woff|woff2)$/.test(file);
    },

    // 是否删除原始未压缩的文件，false 表示保留源文件
    deleteOriginFile: false,
  };

  // 如果指定的是 'brotli' 压缩算法，则设置相应参数
  if (compress === 'brotli') {
    config.ext = '.br'; // 设置压缩文件后缀名为 .br
    config.algorithm = 'brotliCompress'; // 使用 Node.js 内置的 brotliCompress 算法
  }

  // 使用指定配置创建并返回 vite-plugin-compression 插件实例
  return compressPlugin(config);
};

/**
 * 创建自定义组件解析器，用于 unplugin-vue-components 插件
 * 功能：自动导入所有以 App 开头的组件（如 <AppHeader />、<AppFooter /> 等）
 * 要求：这些组件需要在 @/components/index.ts 中按名称导出
 */
function createCustomTransformer(): ComponentResolver {
  return (name) => {
    // 判断组件名是否以 App 开头
    if (name.startsWith('App')) {
      return {
        // 从哪里导入组件
        from: `@/components/index`,
        // 导入的组件名（与 name 保持一致）
        name,
        // 导入方式为命名导入，对应 export { AppHeader } 这种形式
        type: 'named',
      };
    }

    // 如果组件名不是以 App 开头的，返回 null，让其他解析器处理
    return null;
  };
}

// 创建 Vite 插件
export default function createVitePlugins(env: any) {
  return [
    vue(),
    vueJsx(),
    UnoCSS(),
    AutoImport({
      dts: 'src/typings/auto-imports.d.ts',
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: 'src/typings/components.d.ts',
      resolvers: [ElementPlusResolver(), createCustomTransformer()],
      dirs: ['src/components'],
      deep: false,
    }),
    VueI18nPlugin({
      include: path.resolve(__dirname, '../src/locales/**'),
    }),
    configCompressPlugin(env.VITE_COMPRESSION),
    vueDevTools(),
  ];
}
