import { withInstall } from '@/utils';
import Text from './src/text.vue';

export const AppText = withInstall<typeof Text>(Text);
export default AppText;

export * from './src/types.ts';
