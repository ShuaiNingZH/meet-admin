import { withInstall } from '@/utils';
import Upload from './src/upload.vue';

export const AppUpload = withInstall<typeof Upload>(Upload);
export default AppUpload;

export * from './src/upload.ts';
