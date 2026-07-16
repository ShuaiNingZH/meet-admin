import type { IconProps } from 'element-plus';
import type { HTMLAttributes } from 'vue';

export interface AppIconProps extends IconProps, /* @vue-ignore */ HTMLAttributes {
  icon: string;
}
