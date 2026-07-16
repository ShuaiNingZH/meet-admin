import type { IEditorConfig, IToolbarConfig } from '@wangeditor-next/editor';

export type ToolbarConfig = Partial<IToolbarConfig>;
export type EditorConfig = Partial<IEditorConfig>;

export interface AppEditorProps {
  toolbarConfig?: ToolbarConfig;
  editorConfig?: EditorConfig;
  height?: string;
  mode?: 'default' | 'simple';
  hideToolBar?: boolean;
  disabled?: boolean;
}
