import { withInstall } from '@/utils';
import Icon from './src/icon.vue';

export const AppIcon = withInstall<typeof Icon>(Icon);
export default AppIcon;

export * from './src/types.ts';
