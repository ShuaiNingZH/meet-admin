import { withInstall } from '@/utils';
import Flex from './src/flex.vue';

export const AppFlex = withInstall<typeof Flex>(Flex);
export default AppFlex;

export * from './src/types.ts';
