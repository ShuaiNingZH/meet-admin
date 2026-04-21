import { withInstall } from '@/utils';
import HelpInfo from './src/help-info.vue';

export const AppHelpInfo = withInstall<typeof HelpInfo>(HelpInfo);
export default AppHelpInfo;

export * from './src/types.ts';
