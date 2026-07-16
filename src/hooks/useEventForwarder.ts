/**
 * 简洁的事件转发 Hook
 *
 * @param emit - 通过 defineEmits 创建的 emit 函数
 * @param emits - 第三方库提供的事件定义，可以是字符串数组或对象
 * @returns 用于 v-on 绑定的事件处理器对象
 */
export function useEventForwarder(
  emit: any,
  emits: string[] | Record<string, any>,
) {
  // 创建事件处理器对象
  const eventHandlers = computed(() => {
    const handlers: Record<string, (...args: any[]) => void> = {};

    // 获取事件名列表
    const eventNames = Array.isArray(emits)
      ? emits
      : Object.keys(emits);

    eventNames.forEach((eventName) => {
      handlers[eventName] = (...args: any[]) => {
        emit(eventName, ...args);
      };
    });

    return handlers;
  });

  return {
    eventHandlers,
  };
}
