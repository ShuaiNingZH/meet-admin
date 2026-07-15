/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly MODE: 'dev' | 'test' | 'prod';
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_APP_PREFIX: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_HOME_PATH: string;
  readonly VITE_COMPRESSION: 'none' | 'gzip' | 'brotli';
  readonly VITE_ENTERPRISE_ID: string;
  readonly VITE_AGENT_ID: string;
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** 构建时间，由 vite.config.ts 的 define 注入 */
declare const __BUILD_TIME__: string;
