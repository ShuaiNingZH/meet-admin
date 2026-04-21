declare type AnyObj<T = any> = Record<string, T>;

declare type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
