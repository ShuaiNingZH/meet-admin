import localforage from 'localforage';

export interface CreateStorageParams {
  name: string;
  prefixKey: string;
  timeout: null | number;
  description: string;
}

class WebStorage {
  prefixKey: string;
  store: LocalForage;
  timeout: null | number;

  constructor(params: CreateStorageParams) {
    this.prefixKey = params.prefixKey;
    this.timeout = params.timeout;
    this.store = localforage.createInstance({
      name: params.name,
      description: params.description,
    });
  }

  // 获取配置好的key
  getKey(key: string) {
    return `${this.prefixKey}${key}`;
  }

  /**
   * 设置数据
   * @param key 要设置数据的key
   * @param value 要设置的数据
   * @param expire 过期时间, 单位: 秒
   */
  setItem<T = any>(key: string, value: T, expire: null | number = this.timeout) {
    const stringData = JSON.stringify({
      value,
      time: Date.now(),
      expire: expire ? Date.now() + expire * 1000 : null,
    });
    return this.store.setItem(this.getKey(key), stringData);
  }

  /**
   * 获取数据
   * @param key 要获取数据的key
   * @param def 默认值
   */
  async getItem<T = any>(key: string, def?: any): Promise<T> {
    try {
      const item = await this.store.getItem<string>(this.getKey(key));

      // 如果获取不到数据, 返回默认值
      if (!item)
        return def;

      const { value, expire }: { value: T; expire: number } = JSON.parse(item) || {};

      // 如果过期, 删除数据, 返回默认值
      if (expire && expire < Date.now()) {
        await this.removeItem(key);
        return def;
      }

      return value;
    }
    catch (e) {
      console.error(e);
      return def;
    }
  }

  // 删除数据
  async removeItem(key: string) {
    await this.store.removeItem(this.getKey(key));
  }

  // 清空数据
  async clear() {
    await this.store.clear();
  }
}

export function createStorage(params: CreateStorageParams) {
  return new WebStorage(params);
}
