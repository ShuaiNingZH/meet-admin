// 初始化组件默认值

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

  ElDropdown.setPropsDefaults({
    popperOptions: () => ({
      // 使用 fixed 定位，避免下拉菜单在滚动容器中被裁剪或跟随错位
      strategy: 'fixed',
      modifiers: [
        // 微调下拉菜单相对触发元素的偏移量 [横向, 纵向]
        { name: 'offset', options: { offset: [-8, 15] } },
        // 空间不足时的候选翻转位置（按顺序优先尝试）
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['top-start', 'bottom-end', 'top-end', 'right-start', 'left-start'],
          },
        },
      ],
    }),
  });
}
