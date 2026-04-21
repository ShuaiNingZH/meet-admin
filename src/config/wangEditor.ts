import type { IDomEditor, ISelectMenu } from '@wangeditor-next/editor';
import { Boot } from '@wangeditor-next/editor';

class InsertVarMenu implements ISelectMenu {
  title = '插入云商城页面';
  tag = 'select';
  iconSvg = `
    <svg width="16" height="16" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#333"/>
      <path d="M686.6 357.4c-24.7-24.7-64.8-24.7-89.5 0l-99.2 99.2-99.2-99.2c-24.7-24.7-64.8-24.7-89.5 0s-24.7 64.8 0 89.5l143.5 143.6c12.3 12.3 28.6 18.5 44.8 18.5s32.5-6.2 44.8-18.5l143.5-143.6c24.7-24.8 24.7-64.8 0-89.5z" fill="#333"/>
    </svg>
  `;

  selectPanelWidth = 120;

  getOptions() {
    return [
      { value: 'home', text: '云商城首页' },
      { value: 'center', text: '领券中心' },
      { value: 'details', text: '商品详情' },
    ];
  }

  getValue(): string | boolean {
    return 'home';
  }

  isActive(): boolean {
    return false;
  }

  isDisabled(): boolean {
    return false;
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (typeof value === 'string' && value) {
      editor.dangerouslyInsertHtml(
        `<span contentEditable="false">{{{${value}}}}</span>`,
      );
    }
  }
}

Boot.registerMenu({
  key: 'insertVar',
  factory() {
    return new InsertVarMenu();
  },
});
