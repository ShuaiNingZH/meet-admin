import type { Property } from 'csstype';

export type FlexAlign = Property.AlignItems;
export type FlexJustify = Property.JustifyContent;
export type FlexDirection = Property.FlexDirection;
export type FlexWrap = Property.FlexWrap;

export interface AppFlexProps {
  // 垂直排列方式，参考 align-items
  align?: FlexAlign;
  // 水平排列方式，参考 justify-content
  justify?: FlexJustify;
  // 是否为行内元素
  inline?: boolean;
  // 是否垂直布局
  vertical?: boolean;
  // 是否反向
  reverse?: boolean;
  // 水平和垂直间距；为数组时，是 [水平间距, 垂直间距]
  size?: number | [number, number];
  // 是否换行
  wrap?: boolean;
}

export interface AppFlexMargin {
  horizontal: number;
  vertical: number;
}
