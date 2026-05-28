// 初始化组件默认值
import { ElSelectV2 } from 'element-plus';

export function initElementPlus() {
  ElDatePicker.setPropsDefaults({
    unlinkPanels: true,
  });

  ElInput.setPropsDefaults({
    clearable: true,
  });

  ElSelect.setPropsDefaults({
    clearable: true,
  });

  ElSelectV2.setPropsDefaults({
    clearable: true,
    filterable: true,
  });

  ElTreeSelect.setPropsDefaults({
    clearable: true,
    filterable: true,
  });
}
