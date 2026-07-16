import { withInstall } from '@/utils/withInstall';
import Flex from './src/flex.vue';

export const AppFlex = withInstall<typeof Flex>(Flex);
export default AppFlex;

export * from './src/types.ts';
