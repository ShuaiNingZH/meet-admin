import type { Placement } from 'element-plus';

export interface AppHelpInfoProps {
  content?: string;
  placement?: Placement;
  color?: string;
  left?: string;
  right?: string;
  trigger?: 'hover' | 'click' | 'focus' | 'contextmenu';
  effect?: 'dark' | 'light';
}
