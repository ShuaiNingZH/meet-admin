import type { App, ObjectPlugin } from 'vue';
import { NOOP } from '@vue/shared';

export type SFCWithInstall<T> = T & ObjectPlugin<[]>;

/**
 * 为主组件和其附属组件添加 install 方法，使其支持 app.use() 注册。
 * 并将附属组件挂载到主组件上，便于按需使用。
 *
 * @param main 主组件
 * @param extra 附属组件集合，例如 { Item: ItemComponent }
 * @returns 带 install 方法的组合组件
 */
export function withInstall<T, E extends Record<string, any> = object>(main: T, extra?: E) {
  (main as SFCWithInstall<T>).install = (app: App): void => {
    // 注册主组件和附属组件
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      if (comp && comp.name) {
        app.component(comp.name, comp);
      }
      else {
        console.warn('[withInstall] Component is missing `name` property:', comp);
      }
    }
  };

  // 挂载附属组件到主组件上 --- 可以删除
  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      (main as any)[key] = comp;
    }
  }

  return main as SFCWithInstall<T> & E;
}

/**
 * 给非组件模块（如工具函数、hooks 等）添加空 install 方法，
 * 以便与组件统一使用 app.use() 的语法，不会抛出错误。
 */
export function withNoopInstall<T>(component: T) {
  // 将 install 属性设置为一个空函数 NOOP（什么也不做）
  ;(component as SFCWithInstall<T>).install = NOOP;

  // 返回带有 install 方法的组件/模块，方便统一作为插件注册
  return component as SFCWithInstall<T>;
}
