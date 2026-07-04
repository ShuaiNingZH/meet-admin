import { withInstall } from '@/utils';
import Drawer from './src/drawer.vue';

export const AppDrawer = withInstall<typeof Drawer>(Drawer);
export default AppDrawer;

export { appDrawerEmits } from './src/drawer.ts';
export type { AppDrawerProps } from './src/drawer.ts';
