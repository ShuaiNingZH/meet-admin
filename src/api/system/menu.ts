import request from '@/utils/axios';

export interface MenuListParams {
  name: string;
}

export type MenuCreateForm = Omit<Menu.Item, 'id'>;
export type MenuUpdateForm = Menu.Item;
export interface MenuUpdateStatus {
  id: number;
  status: boolean;
}

// 获取菜单列表
export function fetchMenuList(params?: MenuListParams) {
  return request<Menu.Tree[]>({
    url: '/api/menus',
    params,
  });
}

// 创建菜单
export function createMenu(data: MenuCreateForm) {
  return request({
    url: '/api/menus',
    method: 'post',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 编辑菜单
export function updateMenu(data: MenuUpdateForm) {
  return request({
    url: `/api/menus/${data.id}`,
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 删除菜单
export function deleteMenu(id: number) {
  return request({
    url: `/api/menus/${id}`,
    method: 'delete',
  }, {
    loading: true,
  });
}

// 更新菜单状态
export function updateMenuStatus(data: MenuUpdateStatus) {
  return request({
    url: `/api/menus/${data.id}/status`,
    method: 'patch',
    data: {
      status: data.status,
    },
  }, {
    loading: true,
    successMessage: true,
  });
}
