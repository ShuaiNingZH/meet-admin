import type {
  Pagination,
  SpanMethodParams,
  SpanMethodReturn,
  TableConfig,
  TableData,
} from '@/components';
import { cloneDeep, has, isNumber } from 'lodash-es';
import { AppText } from '@/components';
import { useTableSpan } from '@/hooks';
import { useReset } from '@/hooks/useReset';
import { isPageData, moneyThousand, renderMoney } from '@/utils';

/** 分页参数字段名，导出数据时可用于 omit 过滤分页参数 */
export const PAGINATION_KEYS = ['page', 'pageSize'] as const;

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
    ...{
      background: false,
      pageSize: 20,
      total: 0,
      currentPage: 1,
      layout: 'sizes, total, slot, ->, prev, pager, next, jumper',
      pageSizes: [20, 50, 100, 200],
      sizeChange: () => {
        getTableData().then();
      },
      currentChange: () => {
        getTableData(pagination.currentPage).then();
      },
    },
    ...config.pagination,
  });

  // 表格数据
  const tableData = ref<TableData<A>[]>([]);

  // 表格请求参数
  const params = computed(() => {
    const { formatParams } = config;
    // 格式化请求参数
    return formatParams ? formatParams(apiParams.value) : apiParams.value;
  });

  // 合计数据
  const totalData = ref<AnyObj>({});

  // 请求表格数据
  async function getTableData(pageIndex?: any) {
    // 不存在时直接返回，不执行
    if (!config.apiFunc)
      return;

    loading.value = true;

    // 需要分页时
    if (config.isPagination) {
      // pageIndex 存在且是数字时
      if (pageIndex && isNumber(pageIndex))
        pagination.currentPage = pageIndex;

      apiParams.value[PAGINATION_KEYS[1]] = pagination.pageSize;
      apiParams.value[PAGINATION_KEYS[0]] = pagination.currentPage;
    }

    try {
      const { data } = await config.apiFunc(params.value);

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
    finally {
      loading.value = false;
    }
  }

  // 是否初始化数据
  if (config.apiFunc && initData) {
    onMounted(() => {
      getTableData().then();

      // 被激活时重新获取数据   嵌套的原因是是因为首次加载时会触发 activated
      onActivated(() => {
        getTableData().then();
      });
    });
  }

  // 合并单元格
  function spanMethod(params: SpanMethodParams<A>): SpanMethodReturn {
    // 没有合并单元格配置或者不需要合并单元格时
    if (!config.spanOptions || !config.spanOptions.isSpan!(params)) {
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
        return '合计';
      }

      const property = totalData.value[item.prop!] ?? '';

      // 自定义了合计方法
      if (item.summary)
        return item.summary(property);

      // 处理金额类型
      if (item.type === 'money') {
        if (!property)
          return '';

        // 没有金额查看权限是返回 ***
        if (has(item.money, 'auth') && !item.money.auth) {
          return '***';
        }

        // 对金额类型进行高亮处理
        if (item.money?.highlightNegativeAmounts) {
          return renderMoney({
            value: property,
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
