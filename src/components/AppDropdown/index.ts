import { withInstall } from '@/utils';
import Dropdown from './src/dropdown.vue';

export const AppDropdown = withInstall<typeof Dropdown>(Dropdown);
export default AppDropdown;

export * from './src/dropdown.ts';
