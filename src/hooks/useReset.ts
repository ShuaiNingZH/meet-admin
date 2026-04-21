import type { Ref } from 'vue';
import { cloneDeep } from 'lodash-es';

/**
 * 一个自定义 hook，返回一个响应式引用（`ref`）和一个重置函数，
 * 用于将引用恢复到其初始的深拷贝状态。
 *
 * @template T
 * @param {T} val - 需要深拷贝并存储的初始值。
 * @returns {[Ref<T>, () => void]} - 返回一个包含响应式引用和重置函数的元组。
 * 响应式引用包含当前值，重置函数可以将引用恢复到最初的深拷贝状态。
 *
 * @example
 * const [value, resetValue] = useReset({ foo: 'bar' });
 * value.value.foo = 'baz'; // 修改值
 * resetValue(); // 将值重置为 { foo: 'bar' }
 */
export function useReset<T extends Record<string, any>>(val: T): [Ref<T>, () => void] {
  const _val = cloneDeep(val); // 保持深拷贝的初始状态
  const state = ref<T>(val); // 使用 reactive 来保持响应式状态

  // 重置为深拷贝的初始状态
  function reset() {
    // 如果是对象或数组（即非基本类型）
    if (typeof _val === 'object' && _val !== null) {
      const keys = Object.keys(_val); // 获取对象的键
      keys.forEach((key) => {
        state.value[key] = cloneDeep(_val[key]);
      });

      // 删除 state 中多余的属性, 防止出现多余的属性
      for (const key in state.value) {
        if (!keys.includes(key)) {
          delete state.value[key];
        }
      }
    }
    else {
      // 如果是基本类型，直接重置为初始值
      state.value = _val; // 直接赋值
    }
  }

  return [state as Ref<T>, reset];
}
