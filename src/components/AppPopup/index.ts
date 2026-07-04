import { withInstall } from '@/utils';
import Popup from './src/popup.vue';

export const AppPopup = withInstall<typeof Popup>(Popup);
export default AppPopup;

export * from './src/popup.ts';
export { default as AppPopupHost } from './src/popupHost.vue';
