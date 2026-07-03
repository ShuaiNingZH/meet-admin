import type { RouteRecordRaw } from 'vue-router';
import { LAYOUT_NAME } from '@/constants/router.ts';
import { useReset } from '@/hooks/useReset.ts';
import { router } from '@/router';
import { filterSearchMenus, getBreadcrumbsByRoute, processMenus } from '@/router/utils.ts';

interface RoutesStatus {
  menus: RouteRecordRaw[];
  searchMenus: RouteRecordRaw[];
  keepAliveName: string[];
  routes: RouteRecordRaw[];
}

export const useRouteStore = defineStore('route-store', () => {
  const [state, reset] = useReset<RoutesStatus>(() => ({
    // 菜单数据
    menus: [],
    // 搜索菜单数据
    searchMenus: [],
    // 需要缓存的路由名称
    keepAliveName: [],
    // 完整路由树（静态 + 动态）
    routes: [],
  }));

  // 动态路由的卸载函数（router.addRoute 的返回值），重置时统一移除
  let removeDynamicRoutes: (() => void)[] = [];

  /**
   * 处理菜单数据
   * @param dynamicRoutes 动态注册的路由
   */
  const handleMenus = (dynamicRoutes: RouteRecordRaw[] = []) => {
    // 取出 Layout 的静态子路由，与动态路由同级处理，保持静态/动态菜单结构一致
    const layoutRoute = router.options.routes.find(item => item.name === LAYOUT_NAME);
    const staticRoutes = layoutRoute?.children ?? [];
    const businessRoutes = [...staticRoutes, ...dynamicRoutes];

    state.value.routes = businessRoutes;
    state.value.menus = processMenus(businessRoutes);
    state.value.searchMenus = filterSearchMenus(state.value.menus);
  };

  /**
   * 注册动态路由并处理菜单数据
   * @param dynamicRoutes 动态注册的路由
   */
  const registerDynamicRoutes = (dynamicRoutes: RouteRecordRaw[] = []) => {
    // 先移除上一次注册的动态路由，避免切换账号后残留
    removeDynamicRoutes.forEach(remove => remove());
    removeDynamicRoutes = dynamicRoutes.map(dynamicRoute => router.addRoute(LAYOUT_NAME, dynamicRoute));

    handleMenus(dynamicRoutes);
  };

  // 重置
  const handleReset = () => {
    removeDynamicRoutes.forEach(remove => remove());
    removeDynamicRoutes = [];
    reset();
  };

  // 全局面包屑
  const breadcrumbs = computed(() => {
    const homePath = import.meta.env.VITE_HOME_PATH;
    const route = router.currentRoute.value;

    let result = getBreadcrumbsByRoute(route, state.value.routes);

    // 如果没有首页，则添加首页
    if (!result.some(item => item.path === homePath)) {
      const home = state.value.menus.find(item => item.path === homePath);
      if (home)
        result = [home, ...result];
    }

    return result;
  });

  // 添加缓存路由
  const handleAddKeepAlive = (name: string) => {
    if (!state.value.keepAliveName.includes(name))
      state.value.keepAliveName.push(name);
  };

  // 删除缓存路由
  const handleRemoveKeepAlive = (name: string) => {
    state.value.keepAliveName = state.value.keepAliveName.filter(item => item !== name);
  };

  // 批量设置缓存路由
  const handleKeepAlive = (keepAliveName: string[]) => {
    state.value.keepAliveName = keepAliveName;
  };

  return {
    ...toRefs(state.value),
    registerDynamicRoutes,
    breadcrumbs,
    handleAddKeepAlive,
    handleRemoveKeepAlive,
    handleKeepAlive,
    handleReset,
  };
});
