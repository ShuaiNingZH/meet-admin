/**
 * 统一的请求失败错误。无论失败源自网络异常、HTTP 状态码还是业务状态码，
 * 调用方都用同一种形状 catch，不需要再判断这次失败具体来自哪一层。
 */
export class RequestError extends Error {
  /** 业务 status，或 HTTP 状态码；无法归为具体状态码时是 'NETWORK_ERROR' */
  readonly code: number | string;
  /** 原始的业务响应体 / AxiosError，兜底场景下使用 */
  readonly raw: unknown;

  constructor(message: string, code: number | string, raw?: unknown) {
    super(message);
    this.name = 'RequestError';
    this.code = code;
    this.raw = raw;
  }
}
