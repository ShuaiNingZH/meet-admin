import { pick } from 'lodash-es';
import { useReset } from '@/hooks/useReset';

export const useState = createSharedComposable(() => {
  const [state, reset] = useReset<Role.Item>(() => ({
    id: 0,
    name: '',
    status: true,
    remark: '',
    menuIds: [],
  }));

  const showForm = ref(false);

  function setState(val: AnyObj) {
    Object.assign(state.value, pick(val, Object.keys(state.value)));
    showForm.value = true;
  }

  return {
    state,
    reset,
    showForm,
    setState,
  };
});
