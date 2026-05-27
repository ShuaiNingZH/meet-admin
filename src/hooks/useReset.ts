/**
 * 返回响应式状态和重置函数，每次重置都会调用工厂函数生成新的初始值。
 *
 * @example
 * const [form, resetForm] = useReset(() => ({ name: '', age: 0 }));
 * form.value.name = 'wjp';
 * resetForm(); // { name: '', age: 0 }
 */export function useReset<T>(factory: () => T): [Ref<T>, () => void] {
  const state = ref<T>(factory()) as Ref<T>;

  function reset() {
    state.value = factory();
  }

  return [state, reset];
}
