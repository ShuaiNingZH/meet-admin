import { withInstall } from '@/utils/withInstall';
import BatchImport from './src/batch-import.vue';

export const AppBatchImport = withInstall<typeof BatchImport>(BatchImport);
export default AppBatchImport;

export * from './src/type.ts';
