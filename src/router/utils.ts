import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router';
import { cloneDeep } from 'lodash-es';
import path from 'path-browserify';
import { useRouteStore, useTabStore, useUserStore } from '@/stores';

/**
 * 初始化路由
 */
export async function initRouter() {
  const userStore = useUserStore();
  const tabStore = useTabStore();
  const routeStore = useRouteStore();

  // 获取用户信息
  await userStore.getUserInfo();

  // 初始国际化标签
  tabStore.tabLocale();
  // 处理菜单数据
  routeStore.handleMenus();
}

/**
 * 处理菜单数据
 * @param routes 路由数据
 * @param parentPath 父级路由路径
 */
export function processMenus(routes: RouteRecordRaw[], parentPath = '') {
  const result = cloneDeep(routes).reduce<RouteRecordRaw[]>((acc, item, index) => {
    // 将父路由的 path 拼接到子路由的 path 上
    item.path = path.resolve(parentPath, item.path);

    // 确保每个路由的 meta 存在，并给未定义的 meta 设置默认值
    item.meta = item.meta ?? { title: '' };

    // 根路由 sort 为 0, 其他路由 sort 为 index + 1
    item.meta.sort = item.path === '/' ? 0 : item.meta.sort ?? index + 1;

    if (item.children)
      item.children = processMenus(item.children, item.path);

    // 过滤菜单
    if (!item.meta?.hideInMenu) {
      // 如果子菜单只有一个并且 hideParent 为 false 则直接显示子菜单
      if (item.children?.length === 1 && item.children[0] && !item.children[0].meta?.hideParent) {
        acc.push(item.children[0]);
      }
      else {
        acc.push(item);
      }
    }

    return acc;
  }, []);

  // 在递归完成后再统一排序，避免每次都排序
  return result.sort((a, b) => (a.meta?.sort ?? 0) - (b.meta?.sort ?? 0));
}

/**
 * 处理搜索菜单数据
 * @param menus
 */
export function filterSearchMenus(menus: RouteRecordRaw[]): RouteRecordRaw[] {
  return menus.reduce<RouteRecordRaw[]>((acc, cur) => {
    if (cur.children?.length) {
      acc.push(...filterSearchMenus(cur.children)); // 递归合并子菜单
    }
    else {
      acc.push(cur);
    }
    return acc;
  }, []);
}

/**
 * 生成路由面包屑导航数据
 * @param route 当前路由对象
 * @param routes 路由配置数组
 * @param parentPath 父级路径（用于递归）
 */
export function getBreadcrumbsByRoute(
  route: RouteLocationNormalizedLoaded,
  routes: RouteRecordRaw[],
  parentPath = '',
): (RouteRecordRaw | RouteLocationNormalizedLoaded)[] {
  const { path: currentPath, meta } = route;
  const activeMenuPath = meta?.activeMenu;

  for (const routeRecord of routes) {
    // 动态计算完整路径避免修改原始数据
    const fullPath = path.resolve(parentPath, routeRecord.path);

    // 匹配当前路由路径
    if (fullPath === currentPath) {
      return [routeRecord];
    }

    // 匹配 activeMenu 指定的菜单项
    if (activeMenuPath && fullPath === activeMenuPath) {
      return [routeRecord, route];
    }

    // 递归处理子路由
    if (routeRecord.children) {
      const childResult = getBreadcrumbsByRoute(route, routeRecord.children, fullPath);
      if (childResult.length) {
        // 如果子菜单只有一个并且 hideParent 为 false 则直接显示子菜单
        if (routeRecord.children.length === 1 && !routeRecord.children[0]?.meta?.hideParent) {
          return childResult;
        }
        return [routeRecord, ...childResult];
      }
    }
  }

  return [];
}
