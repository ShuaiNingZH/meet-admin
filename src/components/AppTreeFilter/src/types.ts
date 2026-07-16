import type { TreeData, TreeOptionProps } from 'element-plus';

export interface AppTreeFilterProps {
  data: TreeData[];
  props?: TreeOptionProps;
  placeholder?: string;
  emptyText?: string;
  nodeKey?: string;
  valueObject?: boolean;
  multiple?: boolean;
  defaultExpandAll?: boolean;
  checkStrictly?: boolean;
  card?: boolean;
  width?: number;
}
