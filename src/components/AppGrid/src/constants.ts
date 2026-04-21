import type { ComputedRef } from 'vue';
import type { GridContext } from './types.ts';

export const gridContextKey: InjectionKey<GridContext> = Symbol('gridContext');
export const gridCollapsibleKey: InjectionKey<ComputedRef<boolean>> = Symbol('gridCollapsible');
