import { withInstall } from '@/utils/withInstall';
import SelectIcon from './src/select-icon.vue';

export const AppSelectIcon = withInstall<typeof SelectIcon>(SelectIcon);
export default AppSelectIcon;

export * from './src/select-icon.ts';
