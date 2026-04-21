import { withInstall, withNoopInstall } from '@/utils';
import BaseTable from './src/base-table.vue';
import Table from './src/table.vue';

export const AppTable = withInstall<typeof Table, {
  BaseTable: typeof BaseTable;
}>(Table, { BaseTable });
export const AppBaseTable = withNoopInstall<typeof BaseTable>(BaseTable);
export default AppTable;

export * from './src/table.tsx';
export * from './src/types.ts';
export * from './src/utils.ts';
