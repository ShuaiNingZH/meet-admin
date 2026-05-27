import type { ImageViewerAction, TableColumnCtx, TableProps } from 'element-plus';
import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults';

export type TypeProps = 'index' | 'selection' | 'expand' | 'money' | 'date' | 'dateTime' | 'img';
export type FixedProps = 'left' | 'right' | boolean;

export interface RenderScope<T extends DefaultRow = DefaultRow> {
  row: T;
  column: TableColumnCtx<T>;
  $index: number;
}

// 扩展后的表格列
export interface TableColumn<T extends DefaultRow = DefaultRow>
  extends Partial<Omit<TableColumnCtx<T>, 'type' | 'fixed' | 'children'>> {
  type?: TypeProps;
  renderContent?: (scope: RenderScope<T>) => VNode | string;
  children?: TableColumn<T>[];
  fixed?: FixedProps;
  show?: boolean;
  money?: Money<T>;
  helpInfo?: string | (() => VNode | string);
  summary?: (data: T) => VNode | string;
}

export type TableColumns<T extends DefaultRow = DefaultRow> = TableColumn<T>[];

// 列设置的数据
export interface TableColumnCheck {
  prop: string;
  label: string;
  checked: boolean;
  fixed?: FixedProps;
}

export type TableColumnChecks = TableColumnCheck[];

// 分页配置
export interface Pagination {
  background?: boolean;
  pageSize?: number;
  total?: number;
  currentPage?: number;
  layout?: string;
  pageSizes?: number[];
  sizeChange?: (value: number) => void;
  currentChange?: (value: number) => void;
}

/**
 * 提取 ApiFunc 函数返回的列表元素类型，并附加行索引字段
 * 推导链：ReturnType => UnwrapPromise => UnwrapResponseData => ElementType => & { rowIndex? }
 * @example
 * type MyApi = (params: { page: number }) => Promise<ResponseData<User[]>>;
 * TableData<MyApi> => User & { rowIndex?: number }
 */
export type TableData<T extends ApiFunc> = ApiData<T> & {
  rowIndex?: number;
};

/**
 * 合并单元格方法的参数类型，对应 Element Plus 表格 span-method 的回调参数
 * @template T 表格请求函数类型
 */
export interface SpanMethodParams<T extends ApiFunc> {
  row: TableData<T>;
  column: TableColumnCtx<TableData<T>>;
  rowIndex: number;
  columnIndex: number;
}

export interface TableConfig<T extends ApiFunc> {
  /**
   * 请求接口函数，用于获取表格数据。
   * T 是一个泛型，表示与表格数据相关的 API 请求函数类型。
   */
  apiFunc?: T;

  /**
   * API 请求的参数，通常是 API 请求所需的查询参数。
   * 该参数的类型由 `TableApiParams<T>` 定义，通常是根据 `apiFunc` 的类型来生成的。
   */
  apiParams?: ApiParams<T>;

  /**
   * 格式化 API 请求参数的函数。
   * 用于在发送请求之前对参数进行处理，例如添加、修改或者删除某些字段。
   */
  formatParams?: (params: ApiParams<T>) => ApiParams<T>;

  /**
   * 是否需要合并单元格及其配置。
   * `isSpan` 方法会接收行数据，并返回是否需要合并当前行单元格。
   * `spanKey` 基于哪些 key 进行合并。
   */
  spanOptions?: {
    // 判断是否需要合并单元格
    isSpan: (params: SpanMethodParams<T>) => boolean;
    // 基于哪些 key 进行合并
    spanKey: string | string[];
  };

  /**
   * 列定义函数，返回一个表格列配置的数组。
   * `TableColumn<TableData<T>>[]` 是列的配置对象数组。
   */
  columns: () => TableColumn<TableData<T>>[];

  /**
   * 是否启用分页功能。
   * 默认为 false，表示是否在 app-table 中显示分页器。
   */
  isPagination?: boolean;

  /**
   * 分页配置，包括当前页数、每页数量等信息。
   * `Pagination` 类型定义了分页的参数，例如页码、每页显示的条数等。
   */
  pagination?: Pagination;

  /**
   * 格式化表格数据的函数，用于在渲染表格数据之前处理数据。
   * 通常用于格式化日期、数字或其他显示数据的格式。
   */
  formatData?: (data: TableData<T>[]) => TableData<T>[];

  /**
   * 初始化数据时是否自动请求数据。
   * 默认为 true，表示在组件初始化时会自动触发数据请求。
   */
  initData?: boolean;

  /**
   * 自定义汇总方法，用于计算表格的总计、合计等汇总数据。
   * `columns` 是列的配置，`data` 是当前表格的数据。
   */
  summaryMethod?: (params: { columns: TableColumnCtx<TableData<T>>[]; data: TableData<T>[] }) => any;

  /**
   * 行加载方法，当表格使用树形结构时，点击展开某一行时会触发此方法。
   * `row` 是当前行的数据，`treeNode` 是树节点的相关信息，`resolve` 是用于返回加载数据的回调函数。
   */
  load?: (row: TableData<T>, treeNode: AnyObj, resolve: (data: TableData<T>[]) => void) => void;
}

/**
 * 合并单元格方法的返回值类型，对应 Element Plus 表格的 span-method 属性
 * - number[]：数组形式 [rowspan, colspan]
 * - { rowspan, colspan }：对象形式
 * - undefined：不做合并处理
 */
export type SpanMethodReturn = (number[] | { rowspan: number; colspan: number } | undefined);

export interface Money<T extends DefaultRow = DefaultRow> {
  value?: (scope: RenderScope<T>) => void;
  highlightNegativeAmounts?: boolean;
  link?: boolean | ((scope: RenderScope<T>) => boolean);
  callBack?: (scope: RenderScope<T>) => void;
  auth?: boolean;
}

export interface AppBaseTableProps extends TableProps<any> {
  columns: TableColumns<any>;
}

export interface AppTableProps extends AppBaseTableProps {
  title?: string;
  loading: boolean;
  loadingText?: string;
  card?: boolean;
  pagination?: Pagination | boolean;
}

interface ImageViewerActionOptions {
  enableTransition?: boolean;
  zoomRate?: number;
  rotateDeg?: number;
}

export interface ImageToolbar {
  actions: (action: ImageViewerAction, options?: ImageViewerActionOptions) => void;
  reset: () => void;
  activeIndex: number;
}
