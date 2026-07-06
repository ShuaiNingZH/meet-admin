import { withInstall } from '@/utils/withInstall';
import HelpInfo from './src/help-info.vue';

export const AppHelpInfo = withInstall<typeof HelpInfo>(HelpInfo);
export default AppHelpInfo;

export * from './src/types.ts';
