import { withInstall } from '@/utils/withInstall';
import Icon from './src/icon.vue';

export const AppIcon = withInstall<typeof Icon>(Icon);
export default AppIcon;

export * from './src/render.ts';
export * from './src/types.ts';
