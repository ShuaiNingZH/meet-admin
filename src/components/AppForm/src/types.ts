import type { FormItemProps, FormProps } from 'element-plus';
import type { GridProps } from '@/components/AppGrid';

// FormProps
export interface AppFormProps extends Partial<FormProps>, GridProps {
  loading?: boolean;
  showAction?: boolean;
}

// FormItemProps
export interface AppFormItemProps extends Partial<FormItemProps> {
  span?: number;
  offset?: number;
  suffix?: boolean;
  helpInfo?: string;
}
