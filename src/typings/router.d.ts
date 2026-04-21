import 'vue-router';

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export {};

declare module 'vue-router' {
  interface RouteMeta {
    // 页面标题
    title: string;
    // 页面图标
    icon?: string;
    // 是否缓存当前页面
    keepAlive?: boolean;
    // 当前路由不在左侧菜单显示，但需要高亮某个菜单
    activeMenu?: string;
    // 是否在菜单中隐藏路由（默认为 false）
    hideInMenu?: boolean;
    // 是否在 Tab 中隐藏路由（默认为 false）
    hideInTag?: boolean;
    // 是否隐藏父级路由（默认为 false）
    hideParent?: boolean;
    // 菜单排序，值越高排的越后
    sort?: number;
  }
}
