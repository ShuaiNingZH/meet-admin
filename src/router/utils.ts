import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router';
import { cloneDeep } from 'lodash-es';
import path from 'path-browserify';
import { fetchUserInfo, fetchUserMenu } from '@/api';
import { useRouteStore } from '@/stores/route';
import { useTabStore } from '@/stores/tab';
import { useUserStore } from '@/stores/user';

/**
 * 初始化路由
 */
export async function initRouter() {
  const userStore = useUserStore();
  const tabStore = useTabStore();
  const routeStore = useRouteStore();

  // 获取当前用户信息
  const infoRes = await fetchUserInfo();
  userStore.userInfo = infoRes.data;

  // 获取当前用户菜单
  const menuRes = await fetchUserMenu();

  // 注册动态路由并处理菜单数据
  const dynamicRoutes = menuToRoutes(menuRes.data);
  routeStore.registerDynamicRoutes(dynamicRoutes);

  // 初始国际化标签
  tabStore.tabLocale();
}

/**
 * 将后端菜单数据转换为路由并动态注册，返回转换后的路由树供菜单使用
 * @param menus 后端返回的嵌套菜单数据
 */
function menuToRoutes(menus: Menu.Tree[]) {
  return menus.map((menu) => {
    const route = {
      path: menu.path,
      name: menu.routeName,
      meta: {
        title: menu.name,
        icon: menu.icon,
        sort: menu.sort,
        keepAlive: menu.keepAlive,
        activeMenu: menu.activeMenu,
        hideInMenu: menu.hideInMenu,
        hideInTag: menu.hideInTag,
        hideParent: menu.hideParent,
        link: menu.link,
        iframe: menu.iframe,
      },
    } as RouteRecordRaw;

    // 如果是目录，自动重定向到子级第一个菜单
    if (menu.type === 0)
      route.redirect = menu.children[0]?.path;

    /**
     * 如果是菜单，解析页面组件
     * 外链菜单（link 且非 iframe）由路由守卫拦截后新窗口打开，无需组件
     */
    if (menu.type === 1) {
      if (menu.link && menu.iframe)
        route.component = () => import('@/views/iframe/index.vue');
      else if (!menu.link)
        route.component = resolveComponent(menu.componentPath);
    }

    // 如果有子级，转换子级数据
    if (menu.children.length)
      route.children = menuToRoutes(menu.children);

    return route;
  });
}

const viewModules = import.meta.glob('@/views/**/*.vue');

/**
 * 将路径解析成完整的组件路径
 * @param componentPath
 */
function resolveComponent(componentPath: string) {
  const key = `/src/views/${componentPath}.vue`;
  const mod = viewModules[key];

  if (!mod) {
    console.warn(`[addRouters] 未找到组件: ${componentPath}`);
    return () => import('@/views/error/404.vue');
  }

  return mod;
}

/**
 * 处理菜单数据（入口：只在此深克隆一次，避免递归重复克隆）
 * @param routes 路由数据
 */
export function processMenus(routes: RouteRecordRaw[]) {
  return buildMenus(cloneDeep(routes));
}

/**
 * 递归构建菜单树
 * @param routes 已克隆的路由数据
 * @param parentPath 父级路由路径
 */
function buildMenus(routes: RouteRecordRaw[], parentPath = '') {
  const result = routes.reduce<RouteRecordRaw[]>((acc, item) => {
    // 将父路由的 path 拼接到子路由的 path 上
    item.path = path.resolve(parentPath, item.path);

    // 确保每个路由的 meta 存在，并给未定义的 meta 设置默认值
    item.meta = item.meta ?? { title: '' };

    if (item.children)
      item.children = buildMenus(item.children, item.path);

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

  // 对当前层级按 sort 排序
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
