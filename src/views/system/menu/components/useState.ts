import { pick } from 'lodash-es';
import { useReset } from '@/hooks/useReset';

export const useState = createSharedComposable(() => {
  const [state, reset] = useReset<Menu.Item>(() => ({
    id: 0,
    parentId: 0,
    name: '',
    path: '',
    routeName: '',
    componentPath: '',
    icon: '',
    sort: 0,
    type: 0,
    perm: '',
    activeMenu: '',
    link: '',
    iframe: false,
    keepAlive: false,
    hideInMenu: false,
    hideInTag: false,
    hideParent: false,
    status: true,
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
