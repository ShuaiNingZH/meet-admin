import type { FormInstance } from 'element-plus';
import type { AppPopupProps } from '@/components/AppPopup';
import { ElConfigProvider } from 'element-plus';
import { AppPopup } from '@/components';
import { installI18n } from '@/config/i18n.ts';
import { elLocale } from '@/constants/locale.ts';
import { useAppStore } from '@/stores';

interface PopupFormInstance extends FormInstance {
  getData: () => void;
}

type OnOk = (helpers: { instance?: PopupFormInstance; close: () => void; formData: any }) => any | Promise<any>;

interface AppPopupOptions extends AppPopupProps {
  content: any;
  onOk?: OnOk;
  onClose?: () => void;
}

export function addPopup(options: AppPopupOptions) {
  const { content, onOk, ...props } = options;
  const showPopup = ref(true);

  // 获取实例
  const instance = ref<PopupFormInstance>();

  const closePopup = () => {
    showPopup.value = false;
  };

  // 创建弹窗内容
  const renderContent = () => {
    if (typeof content === 'string') {
      return content;
    }

    if (typeof content === 'function')
      return h(content(), { ref: instance });

    return h(content, { ref: instance });
  };

  const appStore = useAppStore();

  const locale = computed(() => {
    return elLocale[appStore.locale];
  });

  const app = createApp(() => (
    <ElConfigProvider locale={locale.value} size={appStore.size} message={{ max: 1 }}>
      <AppPopup
        v-model={showPopup.value}
        {...props}
        onClose={props.onClose}
        onClosed={handleClosed}
        onConfirm={() => handleConfirmAction(closePopup, onOk, instance.value)}
      >
        {renderContent()}
      </AppPopup>
    </ElConfigProvider>
  ));

  const div = document.createElement('div');

  document.body.appendChild(div);

  // 注册国际化
  installI18n(app);

  app.mount(div);

  function handleClosed() {
    app.unmount();
    document.body.removeChild(div);
  }
}

// 处理确认操作的函数
async function handleConfirmAction(closePopup: () => void, onOk?: OnOk, instance?: PopupFormInstance) {
  try {
    if (instance?.validate) {
      await instance.validate();
    }

    const formData = instance?.getData?.() || null;

    if (onOk) {
      const result = onOk({ close: closePopup, formData, instance });
      if (result instanceof Promise) {
        const res = await result;
        // 如果异步操作返回 undefined，表示成功，则关闭弹窗
        if (res === undefined)
          closePopup();
      }
    }
    else {
      closePopup();
    }
  }
  catch (error) {
    console.error('验证或提交失败:', error);
  }
}
