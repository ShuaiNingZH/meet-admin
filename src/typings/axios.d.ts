declare namespace AppAxios {
  interface ResponseData<T = any> {
    code: number;
    data: T;
    message: string;
  }

  type ApiPromise<T = any | PageData> = Promise<ResponseData<T>>;

  interface Options {
    // 开启取消重复请求
    cancelDuplicateRequest?: boolean;
    // 开启 loading，且可以修改文字
    loading?: boolean | string;
    // 开启 message，且可以修改文字
    message?: boolean | string;
    // 是否开启接口错误信息展示
    showErrorMessage?: boolean;
  }

  interface PageData<T> {
    list: T[];
    total: number;
    summary?: Partial<PickByValue<T, number>>;
  }

  type ListOrPage<T> = T[] | AppAxios.PageData<T>;
}
