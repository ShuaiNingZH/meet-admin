export interface Props {
  name: string;
}

export interface AppBatchImportProps {
  title?: string;
  fileType?: string[];
  fileSize?: number;
  fileName?: string;
  params?: AnyObj;
  templateApi: (...args: any[]) => Promise<any>;
  importApi: (...args: any[]) => Promise<any>;
  props?: Props;
}
