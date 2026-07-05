import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import createVitePlugins from './build/plugins';

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line node/prefer-global/process
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: createVitePlugins(env),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    base: './',
    server: {
      host: true,
    },
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  };
});
