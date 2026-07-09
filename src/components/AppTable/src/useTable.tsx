import type {
  Pagination,
  SpanMethodParams,
  SpanMethodReturn,
  TableConfig,
  TableData,
} from './types.ts';
import { cloneDeep, isNumber } from 'lodash-es';
import { AppText } from '@/components/AppText';
import { useReset } from '@/hooks/useReset';
import { isPageData } from '@/utils/common';
import { $t } from '@/utils/i18n';
import { moneyThousand } from '@/utils/money';
import { isMoneyHidden, renderMoney } from './render.tsx';
import { useTableSpan } from './useTableSpan.ts';

/** 分页参数字段名，导出数据时可用于 omit 过滤分页参数 */
export const PAGINATION_KEYS = ['page', 'pageSize'] as const;

const [PAGE_KEY, PAGE_SIZE_KEY] = PAGINATION_KEYS;

/**
 * 创建一个表格使用的函数
 *
 * @template T 表格数据的类型
 * @param config 表格配置对象
 * @param config.columns 表格的列配置数组
 * @returns 返回表格相关的响应式属性和方法
 */
export function useTable<A extends ApiFunc>(config: TableConfig<A>) {
  const { initData = true } = config;

  // 加载状态
  const loading = ref(false);

  const response = ref<AnyObj>({});

  // 表格列
  const columns = computed(() => config.columns());

  // 接口请求参数
  const [apiParams, resetParams] = useReset<ApiParams<A>>(() => cloneDeep(config.apiParams || {} as ApiParams<A>));

  // 合并单元格
  const { spanList, setSpanList } = useTableSpan();

  // 分页配置
  const pagination = reactive<Pagination>({
    background: false,
    pageSize: 20,
    total: 0,
    currentPage: 1,
    layout: 'sizes, total, slot, ->, prev, pager, next, jumper',
    pageSizes: [20, 50, 100, 200],
    sizeChange: () => {
      getTableData();
    },
    currentChange: () => {
      getTableData(pagination.currentPage);
    },
    ...config.pagination,
  });

  // 表格数据
  const tableData = ref<TableData<A>[]>([]);

  // 表格请求参数
  const params = computed(() => {
    const { formatParams } = config;
    // 传入浅拷贝，避免 formatParams 内部修改参数（如追加派生字段）污染搜索表单的原始参数
    return formatParams ? formatParams({ ...apiParams.value }) : apiParams.value;
  });

  // 合计数据
  const totalData = ref<AnyObj>({});

  // 请求序号，用于丢弃过期响应（如快速翻页时旧请求晚于新请求返回）
  let requestId = 0;

  // 请求表格数据
  async function getTableData(pageIndex?: unknown) {
    // 不存在时直接返回，不执行
    if (!config.apiFunc)
      return;

    const currentId = ++requestId;
    loading.value = true;

    // 需要分页时
    if (config.isPagination) {
      // pageIndex 存在且是数字时
      if (pageIndex && isNumber(pageIndex))
        pagination.currentPage = pageIndex;

      apiParams.value[PAGE_SIZE_KEY] = pagination.pageSize;
      apiParams.value[PAGE_KEY] = pagination.currentPage;
    }

    try {
      const { data } = await config.apiFunc(params.value);

      // 期间已发起新请求，丢弃本次过期响应
      if (currentId !== requestId)
        return;

      response.value = data;

      let list: TableData<A>[];

      if (isPageData<TableData<A>>(data)) {
        list = data.list;
        // 分页数据
        pagination.total = data.total;

        // 合计数据
        totalData.value = data.summary || {};
      }
      else {
        list = data as TableData<A>[];
      }

      // 格式化返回数据
      tableData.value = config.formatData ? config.formatData(list) : list;

      // 处理单元格合并, 传入根据那些 key 进行合并
      if (config.spanOptions)
        setSpanList(tableData.value, config.spanOptions.spanKey);
    }
    catch {
      // 错误提示已由 axios 请求层统一处理，这里吞掉异常避免 unhandled rejection
    }
    finally {
      // 存在更新的请求时，loading 交由新请求管理
      if (currentId === requestId)
        loading.value = false;
    }
  }

  // 是否初始化数据
  if (config.apiFunc && initData) {
    onMounted(() => {
      getTableData();

      // 嵌套注册是因为首次加载时也会触发 activated，避免重复请求
      onActivated(() => {
        getTableData();
      });
    });
  }

  // 合并单元格
  function spanMethod(params: SpanMethodParams<A>): SpanMethodReturn {
    // 没有合并单元格配置或者不需要合并单元格时
    if (!config.spanOptions || !config.spanOptions.isSpan(params)) {
      return;
    }

    const { rowIndex } = params;
    const rowSpan = spanList.value[rowIndex] ?? 0;
    return {
      rowspan: rowSpan > 0 ? rowSpan : 0,
      colspan: rowSpan > 0 ? 1 : 0,
    };
  }

  // 默认合计方法
  function summaryMethod(params: AnyObj) {
    const { columns } = params;
    return columns.map((item: any, index: number) => {
      if (index === 0) {
        return $t('hooks.table.total');
      }

      const property = totalData.value[item.prop!] ?? '';

      // 自定义了合计方法
      if (item.summary)
        return item.summary(property);

      // 处理金额类型
      if (item.type === 'money') {
        // 后端未返回该列的合计时显示为空；0 是合法的合计值，需正常展示
        if (property === '')
          return '';

        // 没有金额查看权限时返回 ***
        if (isMoneyHidden(item.money)) {
          return '***';
        }

        // 对金额类型进行高亮处理
        if (item.money?.highlightNegativeAmounts) {
          return renderMoney({
            value: property,
            highlightNegativeAmounts: true,
          });
        }

        return <AppText>{moneyThousand(property)}</AppText>;
      }

      return property;
    });
  }

  return {
    loading,
    params: apiParams,
    resetParams,
    getTableData,
    response,
    tableProps: computed(() => ({
      loading: loading.value,
      data: tableData.value,
      columns: columns.value,
      pagination: config.isPagination ? pagination : false,
      spanMethod,
      summaryMethod: config.summaryMethod ?? summaryMethod,
      load: config.load,
    })),
  };
}
