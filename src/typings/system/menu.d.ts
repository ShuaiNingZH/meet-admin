declare namespace Menu {
  interface Item {
    id: number;
    parentId: number;
    name: string;
    path: string;
    routeName: string;
    componentPath: string;
    icon: string;
    sort: number;
    type: 0 | 1 | 2;
    perm: string;
    activeMenu: string;
    link: string;
    iframe: boolean;
    keepAlive: boolean;
    hideInMenu: boolean;
    hideInTag: boolean;
    hideParent: boolean;
    status: boolean;
  }

  interface Tree extends Item {
    children: Tree[];
  }
}
