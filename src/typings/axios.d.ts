declare namespace AppAxios {
  interface ResponseData<T = any> {
    code: number;
    data: T;
    message: string;
  }

  type ApiPromise<T = any | PageData> = Promise<ResponseData<T>>;

  interface Options {
    // 是否取消重复请求（相同 url+method+params+data 的请求，后发起的会取消前一个），默认 true
    cancelDuplicateRequest?: boolean;
    // 是否显示 loading 遮罩，传字符串可自定义文案，默认 false
    loading?: boolean | string;
    // 请求成功后是否弹出提示，传字符串可覆盖后端返回的 message，默认 false
    successMessage?: boolean | string;
    // 请求失败后是否弹出提示，传字符串可覆盖错误文案，默认 true
    errorMessage?: boolean | string;
  }

  interface PageData<T> {
    list: T[];
    total: number;
    summary?: Partial<PickByValue<T, number>>;
  }

  type ListOrPage<T> = T[] | AppAxios.PageData<T>;
}
