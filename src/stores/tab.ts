import { useReset } from '@/hooks';
import { router } from '@/router';
import { useRouteStore } from '@/stores';

export interface TabsMenu {
  icon: string;
  title: string;
  path: string;
  name: string;
  keepAlive: boolean;
  hideInTag: boolean;
}

interface TabState {
  // tab列表
  tabs: TabsMenu[];
  // 当前选中的 tag 路径
  currentTabPath: string;
}

export const useTabStore = defineStore('tab-store', () => {
  const route = useRoute();
  const routeStore = useRouteStore();

  const [state, reset] = useReset<TabState>(() => ({
    tabs: [],
    currentTabPath: route.fullPath,
  }));

  const homePage = import.meta.env.VITE_HOME_PATH;

  // const userStore = useUserStore();

  // 判断标签是否已经存在
  const hasExistTab = (path: string) => state.value.tabs.some(item => item.path === path);
  // 获取当前标签索引
  const getTabIndex = (path: string) => state.value.tabs.findIndex(item => item.path === path);

  // 判断标签数量小于两个，并且当前要操作的标签不是首页
  const isTabReturn = (path: string) => {
    return state.value.tabs.length <= 2
      && (state.value.tabs.length === 1 || (state.value.tabs.length === 2 && path !== homePage));
  };

  // 标签国际化
  const tabLocale = () => {
    // const { userInfo } = storeToRefs(userStore);
    // const menuMap = new Map(userInfo.value.menus.map(menu => [menu.path, menu.title]));
    // state.value.tabs.forEach((item) => {
    //   if (menuMap.has(item.path)) {
    //     item.meta.title = menuMap.get(item.path)!;
    //   }
    // });
  };

  // 添加标签
  const addTab = (value: TabsMenu) => {
    const action = value.path === homePage ? 'unshift' : 'push';
    if (!value.hideInTag && !hasExistTab(value.path) && value.title?.length) {
      state.value.tabs[action](value);
    }

    // 添加缓存路由
    if (value.keepAlive)
      routeStore.handleAddKeepAlive(value.name);
  };

  // 关闭当前标签
  const closeTab = async (path: string) => {
    const index = getTabIndex(path);

    // 如果是当前选中的标签
    if (path === state.value.currentTabPath) {
      // 如果后边有标签，就跳转到后一个标签
      // 如果前边有标签，就跳转到前一个标签
      const nextTab = state.value.tabs[index + 1] || state.value.tabs[index - 1];
      if (nextTab)
        await router.push(nextTab.path);
    }

    const tabItem = state.value.tabs.find(item => item.path === path);
    state.value.tabs = state.value.tabs.filter((item) => {
      return item.path !== path;
    });

    // 删除缓存路由
    if (tabItem?.keepAlive)
      routeStore.handleRemoveKeepAlive(tabItem!.name);
  };

  // 关闭其他标签
  const closeOtherTabs = async (path: string) => {
    if (isTabReturn(path))
      return;

    // 如果不是当前选中的标签
    if (path !== state.value.currentTabPath)
      await router.push(path);

    state.value.tabs = state.value.tabs.filter((item) => {
      return item.path === path || item.path === homePage;
    });

    const KeepAliveList = state.value.tabs.filter(item => item.keepAlive);
    routeStore.handleKeepAlive(KeepAliveList.map(item => item.name));
  };

  // 关闭当前标签的左侧全部标签
  const closeLeftTabs = async (path: string) => {
    if (isTabReturn(path))
      return;

    const index = getTabIndex(path);
    const leftTabs = state.value.tabs.slice(0, index);

    // 左侧是否有不是首页的标签
    if (leftTabs.some(item => item.path !== homePage)) {
      // 判断左侧是否包含激活标签
      const hasActiveTab = leftTabs.some(item => item.path === state.value.currentTabPath);
      if (hasActiveTab)
        await router.push(path);
      if (state.value.tabs[0])
        state.value.tabs = [state.value.tabs[0], ...state.value.tabs.slice(index)];

      const KeepAliveList = state.value.tabs.filter(item => item.keepAlive);
      routeStore.handleKeepAlive(KeepAliveList.map(item => item.name));
    }
  };

  // 关闭当前标签的右侧全部标签
  const closeRightTabs = async (path: string) => {
    if (isTabReturn(path))
      return;

    const index = getTabIndex(path);
    const rightTabs = state.value.tabs.slice(index + 1);

    // 右侧是否有标签
    if (rightTabs.length) {
      // 判断右侧是否包含激活标签
      const hasActiveTab = rightTabs.some(item => item.path === state.value.currentTabPath);
      if (hasActiveTab)
        await router.push(path);

      state.value.tabs = state.value.tabs.slice(0, index + 1);

      const KeepAliveList = state.value.tabs.filter(item => item.keepAlive);
      routeStore.handleKeepAlive(KeepAliveList.map(item => item.name));
    }
  };

  // 关闭全部 tag
  const closeAllTabs = async () => {
    if (state.value.tabs.length === 1)
      return;

    await router.push(homePage);

    state.value.tabs = state.value.tabs.filter(item => item.path === homePage);

    routeStore.handleKeepAlive(state.value.tabs.map(item => item.name));
  };

  // 初始化标签-从路由中获取首页路由并添加到标签中
  const initTab = () => {
    const homeRoute = router.getRoutes().find(item => item.path === homePage);
    if (homeRoute && !hasExistTab(homeRoute.path)) {
      addTab({
        icon: homeRoute.meta.icon!,
        title: homeRoute.meta.title,
        path: homeRoute.path,
        name: homeRoute.name as string,
        keepAlive: homeRoute.meta.keepAlive!,
        hideInTag: homeRoute.meta.hideInTag!,
      });
    }
  };

  return {
    ...toRefs(state.value),
    initTab,
    tabLocale,
    addTab,
    closeTab,
    closeOtherTabs,
    closeLeftTabs,
    closeRightTabs,
    closeAllTabs,
    handleReset: reset,
  };
}, {
  persist: {
    storage: sessionStorage,
  },
});
