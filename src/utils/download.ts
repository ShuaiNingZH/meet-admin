import { saveAs } from 'file-saver';

/**
 * @description 下载文件
 * @param url {Blob | String} 下载文件的地址或者文件流
 * @param fileName {String} 下载文件的名字
 */
export function downloadFile(url: Blob | string, fileName?: string) {
  saveAs(url, fileName);
}
