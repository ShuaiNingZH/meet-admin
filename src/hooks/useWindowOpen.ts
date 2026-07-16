import { onUnmounted, ref } from 'vue';

/**
 * 自定义 Hook：用来打开一个新窗口并监听窗口关闭状态
 * @param timeout 检测窗口是否关闭的轮询间隔，默认 500ms
 */
export function useWindowOpen(timeout = 500) {
  // 保存新打开的窗口对象
  const win = ref<Window | null>(null);

  // null：未初始化，false：已打开，true：已关闭
  const isClosed = ref<boolean | null>(null);

  // 定时器引用，用于轮询检测窗口关闭
  let timer: number | null;

  /** 清理定时器，防止内存泄漏 */
  function cleanup() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  /**
   * 打开一个新窗口，并开始检测它的关闭状态
   * @param url      要打开的 URL 地址
   * @param target   窗口目标（_blank、_self、窗口名称等），默认 '_blank'
   * @param features 窗口特性参数（如宽高、位置等），格式同 window.open 第三个参数
   */
  function openWindow(url: string | URL, target = '_blank', features = '') {
    // 打开新窗口
    win.value = window.open(url, target, features);

    // 如果打开失败（可能是被浏览器拦截），给出警告
    if (!win.value) {
      console.warn('[useWindowOpen] 弹窗可能被浏览器拦截');
      isClosed.value = true;
      return;
    }

    // 打开成功，设置关闭状态为 false
    isClosed.value = false;

    // 开启轮询，定期检测窗口是否已关闭
    timer = setInterval(() => {
      // 如果窗口对象为空或已关闭，则更新状态并清理定时器
      if (!win.value || win.value.closed) {
        isClosed.value = true;
        cleanup();
      }
    }, timeout);
  }

  // 组件卸载时，清理定时器
  onUnmounted(() => cleanup());

  return {
    win,
    isClosed,
    openWindow,
  };
}
