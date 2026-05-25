import type { RouteRecordRaw } from 'vue-router';
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
  const [state] = useReset<RoutesStatus>({
    // 菜单数据
    menus: [],
    // 搜索菜单数据
    searchMenus: [],
    // 需要缓存的路由名称
    keepAliveName: [],
    // 完整路由树（静态 + 动态）
    routes: [],
  });

  /**
   * // 处理菜单数据
   * @param dynamicRoutes 动态注册的路由
   */
  const handleMenus = (dynamicRoutes: RouteRecordRaw[] = []) => {
    const allRoutes = [...router.options.routes, ...dynamicRoutes];

    state.value.routes = allRoutes;
    state.value.menus = processMenus(allRoutes);
    state.value.searchMenus = filterSearchMenus(state.value.menus);
  };

  // 全局面包屑
  const breadcrumbs = computed(() => {
    const homePath = import.meta.env.VITE_HOME_PATH;
    const route = router.currentRoute.value;

    let result = getBreadcrumbsByRoute(route, state.value.routes)
      .filter(item => item.path !== '/');

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
    handleMenus,
    breadcrumbs,
    handleAddKeepAlive,
    handleRemoveKeepAlive,
    handleKeepAlive,
  };
});
