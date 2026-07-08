import type { ImageToolbar, Money, RenderScope } from './types.ts';
import { ElImage } from 'element-plus';
import { has, isArray } from 'lodash-es';
import { AppFlex, AppIcon } from '@/components';
import { downloadFile } from '@/utils/download';
import { renderMoney } from '@/utils/render';

/**
 * 判断金额是否无查看权限（需要打码显示为 ***）
 * @param money 金额配置对象
 */
export function isMoneyHidden(money?: Money<AnyObj>) {
  return has(money, 'auth') && !money.auth;
}

/**
 * 处理金额数据的渲染
 * @param scope 渲染作用域对象
 * @param money 金额配置对象
 * @param prop 数据属性名
 * @returns 格式化后的金额或特殊显示内容
 */
export function handleMoneyRender(scope: RenderScope<AnyObj>, money?: Money<AnyObj>, prop?: string) {
  if (isMoneyHidden(money))
    return '***';

  const linkResult = typeof money?.link === 'function' ? money.link(scope) : money?.link;

  return renderMoney({
    value: money?.value ? money.value(scope) : scope.row[prop!],
    highlightNegativeAmounts: money?.highlightNegativeAmounts || false,
    link: !!linkResult,
    callBack: money?.callBack ? () => money.callBack!(scope) : undefined,
  });
}

/**
 * 处理图片数据的渲染
 * @param scope 渲染作用域对象
 * @param prop 数据属性名
 * @returns 统一处理图片
 */
export function handleImgRender(scope: RenderScope<AnyObj>, prop?: string) {
  const src = scope.row[prop!];

  if (!src)
    return null;

  if (isArray(src)) {
    return (
      <AppFlex wrap>
        {src.map((item, index) => {
          return imageComponent(item, src, index);
        })}
      </AppFlex>
    );
  }

  return imageComponent(src, [src]);
}

// 图片组件
function imageComponent(src: string, previewSrcList: string[], index = 0) {
  let className: string | string[] = 'wh-full';

  // 如果是多图预览，限制最大宽高
  if (previewSrcList.length > 1) {
    className = ['max-h-75', 'max-w-75'];
  }

  return (
    <ElImage
      class={className}
      src={src || ''}
      initialIndex={index}
      preview-src-list={previewSrcList}
      showProgress={previewSrcList.length > 1}
      fit="cover"
      lazy
      preview-teleported
    >
      {
        { toolbar: ({ actions, reset, activeIndex }: ImageToolbar) => {
          return (
            <>
              <AppIcon icon="ZoomOut" onClick={() => actions('zoomOut')}></AppIcon>
              <AppIcon icon="ZoomIn" onClick={() => actions('zoomIn')}></AppIcon>
              <AppIcon icon="Download" onClick={() => handleDownload(previewSrcList, activeIndex)}></AppIcon>
              <AppIcon icon="RefreshLeft" onClick={() => actions('anticlockwise')}></AppIcon>
              <AppIcon icon="RefreshRight" onClick={() => actions('clockwise')}></AppIcon>
              <AppIcon icon="Refresh" onClick={reset}></AppIcon>
            </>
          );
        } }
      }
    </ElImage>
  );
}

// 点击下载图片
function handleDownload(src: string[], index: number) {
  const url = src[index];
  if (!url)
    return;

  const fileName = new URL(url).pathname.split('/').pop()?.split('?')[0];
  downloadFile(url, fileName || `图${index}`);
}
