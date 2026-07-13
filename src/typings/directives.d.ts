import type { Directive } from 'vue';

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export {};

declare module 'vue' {
  interface GlobalDirectives {
    vAuth: Directive<HTMLElement, string | string[]>;
  }
}
