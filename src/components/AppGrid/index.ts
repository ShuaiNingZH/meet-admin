import { withInstall, withNoopInstall } from '@/utils';
import GridItem from './src/grid-item.vue';
import Grid from './src/grid.vue';

export const AppGrid = withInstall<typeof Grid, {
  GridItem: typeof GridItem;
}>(Grid, { GridItem });
export const AppGridItem = withNoopInstall<typeof GridItem>(GridItem);
export default AppGrid;

export * from './src/constants.ts';
export * from './src/types.ts';
