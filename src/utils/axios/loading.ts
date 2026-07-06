let loadingInstance: ReturnType<typeof ElLoading.service> | undefined;
let requestCount = 0;

// 创建 Loading（引用计数，并发请求共用同一个遮罩，最后一个请求结束时才关闭）
export function createLoading(text?: string) {
  if (requestCount === 0) {
    loadingInstance = ElLoading.service({
      text,
      background: 'rgba(0, 0, 0, 0.7)',
    });
  }
  requestCount++;
}

// 关闭 Loading
export function closeLoading() {
  requestCount--;
  if (requestCount === 0)
    loadingInstance?.close();
}
