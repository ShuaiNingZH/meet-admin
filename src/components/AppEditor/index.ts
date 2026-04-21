import { withInstall } from '@/utils';
import Editor from './src/editor.vue';

export const AppEditor = withInstall<typeof Editor>(Editor);
export default AppEditor;

export * from './src/editor.ts';
