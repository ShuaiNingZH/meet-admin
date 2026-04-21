import { withInstall } from '@/utils';
import Card from './src/card.vue';

export const AppCard = withInstall<typeof Card>(Card);
export default AppCard;

export * from './src/type.ts';
