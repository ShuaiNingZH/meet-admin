import { withInstall } from '@/utils';
import Tabs from './src/tabs.vue';

export const AppTabs = withInstall<typeof Tabs>(Tabs);
export default AppTabs;

export * from './src/types.ts';
