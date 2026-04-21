import type { CreateStorageParams } from './storage';
import { createStorage } from './storage';

type OptionType = Optional<CreateStorageParams, 'name' | 'description'>;

const createOptions: OptionType = {
  prefixKey: `${import.meta.env.VITE_APP_PREFIX}__`,
  timeout: null,
};

export const storage = createStorage({
  name: 'appStorage',
  description: '全局本地存储',
  ...createOptions,
});

export const tableStorage = createStorage({
  name: 'tableStorage',
  description: '表格本地存储',
  ...createOptions,
});
