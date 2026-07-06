import { withInstall, withNoopInstall } from '@/utils/withInstall';
import FormItem from './src/form-item.vue';
import Form from './src/form.vue';

export const AppForm = withInstall<typeof Form, {
  FormItem: typeof FormItem;
}>(Form, { FormItem });
export const AppFormItem = withNoopInstall<typeof FormItem>(FormItem);
export default AppForm;

export * from './src/types.ts';
