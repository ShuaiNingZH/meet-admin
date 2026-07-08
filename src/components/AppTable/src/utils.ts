import type { TableInstance } from 'element-plus';
import type { ShallowRef } from 'vue';
import type { RenderScope, TableColumn, TableColumnChecks, TableColumns } from './types.ts';
import dayjs from 'dayjs';
import { timeFormat } from '@/utils/date';
import { $t } from '@/utils/i18n';
import { moneyThousand } from '@/utils/money';
import { handleImgRender, handleMoneyRender } from './render.tsx';

/**
 * 处理日期和时间格式的函数
 * @param row 表格行数据
 * @param column 表格列配置
 * @param format 日期格式化的格式，默认为 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export function dateFormatter(row: any, column: any, format: string = 'YYYY-MM-DD') {
  const value = row[column.property];

  if (value == null || value === '')
    return value;

  return dayjs(value).isValid() ? timeFormat(value, format) : value;
}

/**
 * 渲染货币内容的函数
 * @param param 渲染内容参数对象
 * @param param.row 表格行数据
 * @param param.column 表格列配置
 * @returns 货币格式化后的字符串
 */
export function moneyContent({ row, column }: RenderScope<any>) {
  return moneyThousand(row[column.property]);
}

/**
 * 设置表格的列
 * @param columns 表格的列配置数组
 * @param columnChecks 可操作的列配置检查数组
 * @returns 返回根据 columnChecks 配置好地列配置数组
 * @template T 表格数据的类型
 */
export function setColumns(columns: TableColumns, columnChecks: TableColumnChecks) {
  const columnMap = new Map();

  // 遍历 columns，将每一列以唯一键存储
  columns.forEach((column) => {
    const key = column.prop || column.type || column.label;
    if (key) {
      columnMap.set(key, column);
    }
  });

  // 根据 columnChecks 过滤出选中的列配置数组
  const columnsList: TableColumns = columnChecks
    .filter(item => item.checked)
    .map((check) => {
      const column = columnMap.get(check.prop);
      if (column) {
        column.fixed = check.fixed;
      }
      return column;
    })
    .filter(Boolean); // 过滤掉可能的 undefined 值

  return columnsList;
}

/**
 * 根据表格列的配置数组生成可操作的列配置检查数组。
 * @param columns 表格的列配置数组。
 * @returns 返回配置好地可操作列配置数组。
 */
export function getColumnChecks(columns: TableColumns): TableColumnChecks {
  return columns.map((column) => {
    const label = column.label || getColumnDefaultLabel(column.type);
    const prop = column.prop || column.type || label;

    return {
      prop,
      label,
      checked: column.show ?? true,
      fixed: column.fixed,
    };
  });
}

/**
 * 获取列的默认标签名。
 * @param type 列的类型。
 * @returns 返回列的默认标签名。
 */
export function getColumnDefaultLabel(type?: string): string {
  switch (type) {
    case 'index': return $t('hooks.table.index');
    case 'selection': return $t('hooks.table.selection');
    case 'expand': return $t('hooks.table.expand');
    default: return '';
  }
}

/**
 * 创建透传内部表格实例的 expose 代理
 * @param tableRef 内部表格实例的模板引用
 * @returns 代理对象，属性访问会转发到内部表格实例
 */
export function createTableExpose(tableRef: Readonly<ShallowRef<TableInstance | null>>) {
  return new Proxy({}, {
    get(_target, key) {
      return tableRef.value?.[key as keyof TableInstance];
    },
    has(_target, key) {
      return tableRef.value ? key in tableRef.value : false;
    },
  });
}

/**
 * 渲染表格单元格默认内容
 * @param scope 表格渲染作用域
 * @param column 表格列配置
 * @returns 渲染后的表格单元格内容
 */
export function renderDefault(scope: RenderScope<AnyObj>, column: TableColumn) {
  const { type, prop } = column;

  // 自定义渲染
  if (column.renderContent)
    return column.renderContent(scope);

  // 处理金额类型
  if (type === 'money') {
    return handleMoneyRender(scope, column.money, prop);
  }

  // 处理图片类型
  if (type === 'img') {
    return handleImgRender(scope, prop);
  }
}
