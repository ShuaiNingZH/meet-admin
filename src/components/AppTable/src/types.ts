import type { ImageViewerAction, TableColumnCtx, TableProps } from 'element-plus';
import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults';

export type TypeProps = 'index' | 'selection' | 'expand' | 'money' | 'date' | 'dateTime' | 'img';

export interface RenderScope<T extends DefaultRow = DefaultRow> {
  row: T;
  column: TableColumnCtx<T>;
  $index: number;
}

export type ElementType<T> = T extends Array<infer U> ? U : T;
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type UnwrapResponseData<T> = T extends AppAxios.ResponseData<infer U> ? U : never;

export interface TableColumn<T extends DefaultRow = DefaultRow> extends Partial<
  Omit<TableColumnCtx<T>, 'type' | 'children' | 'renderCell' | 'fixed' | 'formatter'>
> {
  type?: TypeProps;
  renderContent?: (scope: RenderScope<T>) => VNode | any;
  formatter?: (row: T, column: TableColumnCtx<T>, cellValue: any, index: number) => VNode | any;
  children?: TableColumns<T>;
  fixed?: 'left' | 'right' | boolean;
  show?: boolean;
  money?: Money<T>;
  helpInfo?: string | (() => VNode | any);
  summary?: (data: any) => VNode | any;
}

export type TableColumns<T extends DefaultRow = DefaultRow> = TableColumn<T>[];

export interface TableColumnCheck {
  prop: string;
  label: string;
  checked: boolean;
  fixed?: 'left' | 'right' | boolean;
}

export type TableColumnChecks = TableColumnCheck[];

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

export type TableApiFn = (params: any) => Promise<any>;

export type TableApiParams<T extends TableApiFn> = NonNullable<Parameters<T>[0]>;

export type TableData<T extends TableApiFn> = ElementType<UnwrapResponseData<UnwrapPromise<ReturnType<T>>>> & {
  rowIndex?: number;
};

export interface SpanMethodParams<T extends TableApiFn> {
  row: any;
  column: TableColumnCtx<TableData<T>>;
  rowIndex: number;
  columnIndex: number;
}

export interface TableConfig<T extends TableApiFn> {
  /**
   * 请求接口函数，用于获取表格数据。
   * T 是一个泛型，表示与表格数据相关的 API 请求函数类型。
   */
  apiFnc?: T;

  /**
   * API 请求的参数，通常是 API 请求所需的查询参数。
   * 该参数的类型由 `TableApiParams<T>` 定义，通常是根据 `apiFnc` 的类型来生成的。
   */
  apiParams?: TableApiParams<T>;

  /**
   * 格式化 API 请求参数的函数。
   * 用于在发送请求之前对参数进行处理，例如添加、修改或者删除某些字段。
   */
  formatParams?: (params: TableApiParams<T>) => TableApiParams<T>;

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

export type SpanMethodReturn = (number[] | { rowspan: number; colspan: number } | undefined);

export interface Money<T extends DefaultRow = DefaultRow> {
  value?: (scope: RenderScope<T>) => void;
  highlightNegativeAmounts?: boolean;
  link?: boolean | ((scope: RenderScope<T>) => boolean);
  callBack?: (scope: RenderScope<T>) => void;
  auth?: boolean;
}

export interface AppBaseTableProps extends TableProps<any> {
  columns: TableColumns;
}

export interface AppTableProps extends AppBaseTableProps {
  title?: string;
  loading?: boolean;
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
