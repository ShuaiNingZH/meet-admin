import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { useReset } from '@/hooks/useReset';

// 同时保留的 iframe 数量上限，超出后淘汰最久未访问的（LRU）
const MAX_CACHED_IFRAMES = 5;

export interface IframeItem {
  // 路由完整路径（与 tab 的 path 一致，用于显示切换与关闭标签时的清理）
  path: string;
  // iframe 地址
  link: string;
  // 是否在切走后保留（对应 meta.keepAlive）
  keepAlive: boolean;
  // 是否隐藏标签（无标签的 iframe 不参与关标签清理，仅靠 LRU 上限兜底）
  hideInTag: boolean;
  // 加载状态
  loading: boolean;
}

/**
 * 已打开的 iframe 列表：iframe 节点一旦从文档中移除再插回就会重新加载，
 * 无法用 keep-alive 缓存，因此由 LayIframe 常驻渲染列表中的全部 iframe，用 v-show 切换显示
 */
export const useIframeStore = defineStore('iframe-store', () => {
  const [state, reset] = useReset<{ iframes: IframeItem[] }>(() => ({
    iframes: [],
  }));

  /**
   * 激活 iframe：已存在则移到队尾（LRU 记录访问顺序），不存在则创建，超出上限从队首淘汰
   * @param route 当前 iframe 页面的路由
   */
  const activateIframe = (route: RouteLocationNormalizedLoaded) => {
    const { fullPath, meta } = route;
    const list = state.value.iframes;
    const index = list.findIndex(item => item.path === fullPath);

    if (index > -1) {
      list.push(...list.splice(index, 1));
      return;
    }

    list.push({
      path: fullPath,
      link: meta.link!,
      keepAlive: meta.keepAlive ?? false,
      hideInTag: meta.hideInTag ?? false,
      loading: true,
    });

    // 超出上限，淘汰最久未访问的（跳过当前激活的）
    while (list.length > MAX_CACHED_IFRAMES) {
      const evictIndex = list.findIndex(item => item.path !== fullPath);
      if (evictIndex === -1)
        break;
      list.splice(evictIndex, 1);
    }
  };

  /**
   * 清理无需保留的 iframe：未开启 keepAlive 且不是当前页面的直接销毁
   * @param activePath 当前路由完整路径
   */
  const pruneInactive = (activePath: string) => {
    state.value.iframes = state.value.iframes.filter(
      item => item.keepAlive || item.path === activePath,
    );
  };

  /**
   * 标签关闭后销毁对应 iframe（hideInTag 的页面没有标签，不参与此清理）
   * @param tabPaths 当前所有标签的路径
   * @param activePath 当前路由完整路径
   */
  const pruneByTabs = (tabPaths: string[], activePath: string) => {
    state.value.iframes = state.value.iframes.filter(
      item => item.hideInTag || item.path === activePath || tabPaths.includes(item.path),
    );
  };

  /**
   * 销毁指定 iframe（用于「重新加载」：移除后由路由监听重建）
   * @param path 路由完整路径
   */
  const removeIframe = (path: string) => {
    state.value.iframes = state.value.iframes.filter(item => item.path !== path);
  };

  return {
    ...toRefs(state.value),
    activateIframe,
    pruneInactive,
    pruneByTabs,
    removeIframe,
    handleReset: reset,
  };
});
