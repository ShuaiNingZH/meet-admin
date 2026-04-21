/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly MODE: 'dev' | 'test' | 'prod';
  readonly BASE_URL: string;
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_APP_PREFIX: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_HOME_PATH: string;
  readonly VITE_COMPRESSION: 'none' | 'gzip' | 'brotli';
  readonly VITE_ENTERPRISE_ID: string;
  readonly VITE_AGENT_ID: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_EXTERNAL_CONTACT_ID: string;
  readonly VITE_FINANCE_ID: string;
  readonly VITE_COMMON_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
