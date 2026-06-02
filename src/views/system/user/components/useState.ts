import { pick } from 'lodash-es';
import { useReset } from '@/hooks';

export const useState = createSharedComposable(() => {
  const [state, reset] = useReset<User.Item>(() => ({
    id: 0,
    username: '',
    password: '',
    nickname: '',
    phone: '',
    avatar: '',
    email: '',
    gender: 0,
    roleIds: [],
    status: true,
    remark: '',
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
