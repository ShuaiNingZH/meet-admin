import type { ImageToolbar, Money, OperationButton, RenderScope, TableColumn } from './types.ts';
import { ElButton, ElImage, ElPopover } from 'element-plus';
import { has, isArray } from 'lodash-es';
import { AppFlex, AppIcon } from '@/components';
import { downloadFile } from '@/utils/download';
import { $t } from '@/utils/i18n';
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

/**
 * 渲染单个操作按钮
 * @param scope 渲染作用域对象
 * @param button 操作按钮配置
 * @returns 渲染后的按钮内容
 */
function renderOperationButton(scope: RenderScope<AnyObj>, button: OperationButton<AnyObj>) {
  // 完全自定义渲染，优先级最高
  if (button.render)
    return button.render(scope);

  const label = typeof button.label === 'function' ? button.label(scope) : button.label;
  const disabled = typeof button.disabled === 'function' ? button.disabled(scope) : button.disabled;
  const icon = typeof button.icon === 'function' ? button.icon(scope) : button.icon;

  return (
    <ElButton
      link
      type={button.type ?? 'primary'}
      disabled={disabled}
      icon={icon ? () => <AppIcon icon={icon}></AppIcon> : undefined}
      onClick={() => button.onClick?.(scope)}
    >
      {label}
    </ElButton>
  );
}

/**
 * 处理操作列的渲染
 *
 * 渲染规则：先按 `show` 过滤掉无权限的按钮，再判断剩余数量——未超过
 * `maxButtons`（默认 3）时全部直接展示；超过时只直接展示前 `maxButtons` 个，
 * 其余收进「更多」下拉，鼠标悬浮三个点即可展开。由于过滤发生在截断之前，
 * 某个按钮因权限消失时，会自动由后面的按钮补位，始终展示满 `maxButtons` 个。
 *
 * @param scope 渲染作用域对象
 * @param column 表格列配置
 * @returns 渲染后的操作列内容
 */
export function handleOperationRender(scope: RenderScope<AnyObj>, column: TableColumn) {
  const rawButtons = (typeof column.buttons === 'function'
    ? column.buttons(scope)
    : column.buttons ?? []) as OperationButton<AnyObj>[];

  // 权限过滤：show 显式为 false（或函数返回 false）的按钮不渲染
  const visibleButtons = rawButtons.filter((button) => {
    const show = typeof button.show === 'function' ? button.show(scope) : button.show;
    return show !== false;
  });

  if (!visibleButtons.length)
    return null;

  const max = column.maxButtons ?? 3;
  const isOverflow = visibleButtons.length > max;
  const inlineButtons = isOverflow ? visibleButtons.slice(0, max) : visibleButtons;
  const moreButtons = isOverflow ? visibleButtons.slice(max) : [];

  return (
    <AppFlex size={8} justify="center" align="center">
      {inlineButtons.map(button => renderOperationButton(scope, button))}
      {moreButtons.length > 0 && (
        <ElPopover
          trigger="hover"
          placement="bottom"
          width="auto"
          show-arrow={false}
          popper-class="app-table-operation-popper"
        >
          {{
            reference: () => (
              <ElButton link type="primary" class="app-table-operation-more" {...{ title: $t('components.table.more') }}>
                <AppIcon icon="More"></AppIcon>
              </ElButton>
            ),
            default: () => (
              <div class="app-table-operation-menu">
                {moreButtons.map(button => renderOperationButton(scope, button))}
              </div>
            ),
          }}
        </ElPopover>
      )}
    </AppFlex>
  );
}
