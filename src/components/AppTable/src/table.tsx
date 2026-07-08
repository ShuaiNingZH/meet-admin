import type { AppTableProps, RenderScope, TableColumn, TableColumns } from './types.ts';
import { ElTableColumn } from 'element-plus';
import { omit } from 'lodash-es';
import { AppHelpInfo } from '@/components';
import { $t } from '@/utils/i18n';
import { dateFormatter, getColumnChecks, renderDefault, setColumns } from './utils.ts';

/**
 * 表格列配置的组合式函数（列的显示/隐藏、排序等列设置能力）
 * @param props 表格属性配置
 * @returns 列配置相关的响应式状态
 */
export function useColumns(props: AppTableProps) {
  // 配置可选列
  const columnChecks = ref(getColumnChecks(props.columns));

  // 初始列配置（列设置弹窗的重置功能使用）
  const initColumns = computed(() => props.columns);

  // 列配置变化时（如父组件重建了列数组），重新生成可选列
  watch(initColumns, (val) => {
    columnChecks.value = getColumnChecks(val);
  });

  // 获取经过处理后的列配置
  const columns = computed(() =>
    setColumns(initColumns.value.map(column => ({ ...column })), columnChecks.value),
  );

  return {
    columns,
    initColumns,
    columnChecks,
  };
}

/**
 * 渲染整个表格的所有列
 * @param columns 表格列配置数组
 * @returns 渲染后的表格列组件集合
 */
export function renderColumns(columns: TableColumns) {
  return (
    <>
      {columns.map(renderColumn)}
    </>
  );
}

/**
 * 根据表格列配置渲染表格列组件
 * @param column 表格列配置对象
 * @returns 渲染后的表格列组件
 */
function renderColumn(column: TableColumn) {
  const props = omit(column, ['children', 'renderHeader', 'renderContent']);
  props.headerAlign = props.headerAlign || 'left';

  if (column.type === 'index') {
    props.label = props.label || $t('hooks.table.index');
    props.width = props.width || 60;
    props.align = props.align || 'center';
  }

  if (column.type === 'money') {
    props.minWidth = props.minWidth || 120;
    props.align = props.align || 'right';
  }

  if (column.type === 'date') {
    props.minWidth = props.minWidth || 100;
    props.formatter = (row: any, column: any) => dateFormatter(row, column);
  }

  if (column.type === 'dateTime') {
    props.minWidth = props.minWidth || 160;
    props.formatter = (row: any, column: any) => dateFormatter(row, column, 'YYYY-MM-DD HH:mm:ss');
  }

  const render = {
    header: (scope: any) => {
      if (column.renderHeader) {
        return column.renderHeader(scope);
      }

      // 列的提示信息
      if (column.helpInfo) {
        return (
          <>
            <span class="vertical-mid">{column.label}</span>
            {typeof column.helpInfo === 'string'
              ? <AppHelpInfo content={column.helpInfo}></AppHelpInfo>
              : (
                  <AppHelpInfo>
                    {{
                      default: column.helpInfo,
                    }}
                  </AppHelpInfo>
                )}
          </>
        );
      }

      return null;
    },
    default: (scope: RenderScope<any>) => renderDefault(scope, column),
  };

  if (column.children) {
    return (
      <ElTableColumn {...props}>
        {{
          header: render.header,
          default: () => renderColumns(column.children!), // 递归渲染子列
        }}
      </ElTableColumn>
    );
  }

  return (
    <ElTableColumn {...props}>
      {render}
    </ElTableColumn>
  );
}

/**
 * 展平嵌套的表格列配置
 * 将具有层级关系的表格列配置展平为一维数组
 *
 * @param columns 表格列配置数组
 * @returns 展平后的表格列配置数组
 */
export function flattenColumns(columns: TableColumns): TableColumns {
  const result: TableColumns = [];

  columns.forEach((column) => {
    if (column.children && column.children.length > 0) {
      // 如果有 children，将其 children 展开并替代当前项
      result.push(...flattenColumns(column.children));
    }
    else {
      // 如果没有 children，直接加入结果
      result.push(column);
    }
  });

  return result;
}
