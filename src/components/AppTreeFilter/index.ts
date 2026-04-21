import { withInstall } from '@/utils';
import TreeFilter from './src/tree-filter.vue';

export const AppTreeFilter = withInstall<typeof TreeFilter>(TreeFilter);
export default AppTreeFilter;

export * from './src/types.ts';
