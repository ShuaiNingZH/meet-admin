type AnyObj<T = any> = Record<string, T>;

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 请求接口
 * @template P 请求参数类型
 * @template R 返回数据类型
 * P 和 R 默认为 any，是为了在不指定泛型时保持灵活性，
 * 同时不影响指定泛型后的类型精确推导
 */
type ApiFunc<P = any, R = any> = (params: P) => Promise<R>;

/**
 * 提取 ApiFunc 函数类型的第一个参数类型
 * 使用 NonNullable 防止参数为可选时引入 undefined
 */
type ApiParams<T extends ApiFunc> = NonNullable<Parameters<T>[0]>;

/**
 * 剥掉 Promise 外壳，提取 resolved 类型，如果不是 Promise 则返回原类型
 * @example UnwrapPromise<Promise<User[]>> => User[]
 * @example UnwrapPromise<User[]> => User[]
 */
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * 剥掉 ResponseData 外壳，提取业务数据类型，如果不匹配则返回 never
 * @example UnwrapResponseData<ResponseData<User[]>> => User[]
 */
type UnwrapResponseData<T> = T extends AppAxios.ResponseData<infer U> ? U : never;

/**
 * 提取数组元素类型，如果不是数组则返回原类型
 * @example ElementType<User[]> => User
 * @example ElementType<User> => User
 */
type ElementType<T> = T extends Array<infer U> ? U : T;

/**
 * 提取 ApiFunc 函数返回的列表元素类型，并附加行索引字段
 * 推导链：ReturnType => UnwrapPromise => UnwrapResponseData => ElementType => & { rowIndex? }
 * @example
 * type MyApi = (params: { page: number }) => Promise<ResponseData<User[]>>;
 */
type ApiData<T extends ApiFunc> = ElementType<UnwrapResponseData<UnwrapPromise<ReturnType<T>>>>;
