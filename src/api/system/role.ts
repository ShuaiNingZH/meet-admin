import request from '@/utils/axios';

export interface RoleListParams {
  name: string;
  status?: boolean;
}

export type RoleCreateForm = Omit<Role.Item, 'id'>;
export type RoleUpdateForm = Role.Item;
export interface RoleUpdateStatus {
  id: number;
  status: boolean;
}

// 获取角色列表
export function fetchRoleList(params?: RoleListParams) {
  return request<AppAxios.PageData<Role.Item>>({
    url: '/api/roles',
    params,
  });
}

// 获取菜单列表
export function fetchMenuList() {
  return request<Menu.Tree[]>({
    url: '/api/menus',
    params: {
      status: true,
    },
  });
}

// 创建角色
export function createRole(data: RoleCreateForm) {
  return request({
    url: '/api/roles',
    method: 'post',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 编辑角色
export function updateRole(data: RoleUpdateForm) {
  return request({
    url: `/api/roles/${data.id}`,
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 删除角色
export function deleteRole(id: number) {
  return request({
    url: `/api/roles/${id}`,
    method: 'delete',
  }, {
    loading: true,
  });
}

// 更新角色状态
export function updateRoleStatus(data: RoleUpdateStatus) {
  return request({
    url: `/api/roles/${data.id}/status`,
    method: 'patch',
    data: {
      status: data.status,
    },
  }, {
    loading: true,
    successMessage: true,
  });
}
