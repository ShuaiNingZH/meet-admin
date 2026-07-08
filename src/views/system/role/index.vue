<script setup lang="tsx">
import { deleteRole, fetchRoleList, updateRoleStatus } from '@/api/system/role';
import { useTable } from '@/components/AppTable';
import { useConfirm } from '@/hooks/useConfirm';
import { renderIcon } from '@/utils/icon';
import RoleForm from '@/views/system/role/components/roleForm.vue';
import { useState } from '@/views/system/role/components/useState.ts';

defineOptions({ name: 'SystemRole' });

const { showForm, setState } = useState();

const { tableProps, params, resetParams, getTableData } = useTable({
  apiFunc: fetchRoleList,
  apiParams: {
    name: '',
    status: undefined,
  },
  isPagination: true,
  columns: () => [
    { type: 'index', fixed: 'left' },
    { prop: 'name', label: '角色名称', minWidth: 120 },
    {
      prop: 'status',
      label: '状态',
      width: 80,
      align: 'center',
      renderContent: ({ row }) => {
        return (
          <ElTag type={row.status ? 'success' : 'danger'}>
            {row.status ? '启用' : '禁用'}
          </ElTag>
        );
      },
    },
    { prop: 'remark', label: '备注', minWidth: 160, showOverflowTooltip: true },
    {
      label: '操作',
      fixed: 'right',
      width: 190,
      align: 'center',
      renderContent: ({ row }) => {
        return (
          <>
            <ElButton
              type="primary"
              icon={renderIcon('EditPen')}
              link
              onClick={() => setState(row)}
            >
              编辑
            </ElButton>
            <ElButton
              type="warning"
              icon={renderIcon(`healthicons:${row.status ? 'no' : 'yes'}-outline`)}
              link
              onClick={async () => {
                await updateRoleStatus({
                  id: row.id,
                  status: !row.status,
                });
                await getTableData();
              }}
            >
              { row.status ? '禁用' : '启用' }
            </ElButton>
            <ElButton
              type="danger"
              icon={renderIcon('Delete')}
              link
              onClick={async () => {
                await useConfirm(deleteRole, row.id, '删除角色');
                await getTableData();
              }}
            >
              删除
            </ElButton>
          </>
        );
      },
    },
  ],
});
</script>

<template>
  <div class="main-container">
    <app-card>
      <app-form show-action inline :loading="tableProps.loading" @search="getTableData" @reset="resetParams">
        <app-form-item label="角色名称">
          <el-input v-model="params.name" placeholder="请输入角色名称" clearable />
        </app-form-item>
        <app-form-item label="状态">
          <el-select v-model="params.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </app-form-item>
      </app-form>
    </app-card>
    <app-table v-bind="tableProps" :data="tableProps.data" card @refresh="getTableData">
      <template #button>
        <el-button type="primary" :icon="renderIcon('CirclePlus')" plain @click="showForm = true">
          新增
        </el-button>
      </template>
    </app-table>
    <RoleForm @confirm="getTableData" />
  </div>
</template>
