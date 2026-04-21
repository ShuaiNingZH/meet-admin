interface TabItem {
  label: string;
  value: string;
  component: Component;
  disabled?: boolean;
}
export type TabItems = TabItem[];

export interface AppTabsProps {
  tabList: TabItem[];
}
