<script setup lang="tsx">
import { deleteMenu, fetchMenuList, updateMenuStatus } from '@/api/system/menu';
import { renderIcon, useTable } from '@/components';
import { useConfirm } from '@/hooks/useConfirm';
import MenuForm from '@/views/system/menu/components/menuForm.vue';
import { useState } from '@/views/system/menu/components/useState.ts';

defineOptions({ name: 'SystemMenu' });

const { showForm, setState } = useState();

const { tableProps, params, resetParams, getTableData } = useTable({
  apiFunc: fetchMenuList,
  apiParams: {
    name: '',
  },
  columns: () => [
    { type: 'index', fixed: 'left' },
    { prop: 'name', label: '菜单名称', minWidth: 160 },
    {
      prop: 'type',
      label: '类型',
      width: 80,
      align: 'center',
      renderContent: ({ row }) => {
        const MENU_TYPE_MAP = {
          0: { label: '目录', type: 'primary' },
          1: { label: '菜单', type: 'success' },
          2: { label: '按钮', type: 'warning' },
        } as const;

        const t = MENU_TYPE_MAP[row.type as keyof typeof MENU_TYPE_MAP];
        return t ? <ElTag type={t.type}>{t.label}</ElTag> : '-';
      },
    },
    {
      prop: 'icon',
      label: '图标',
      width: 70,
      align: 'center',
      renderContent: ({ row }) => {
        return row.icon ? <AppIcon icon={row.icon} size="16px" /> : '-';
      },
    },
    { prop: 'path', label: '路由路径', minWidth: 160, showOverflowTooltip: true },
    { prop: 'sort', label: '排序', width: 70 },
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
    {
      label: '操作',
      type: 'operation',
      fixed: 'right',
      width: 190,
      align: 'center',
      buttons: [
        {
          label: '编辑',
          icon: 'EditPen',
          onClick: ({ row }) => setState(row),
        },
        {
          label: ({ row }) => (row.status ? '禁用' : '启用'),
          type: 'warning',
          icon: ({ row }) => `healthicons:${row.status ? 'no' : 'yes'}-outline`,
          onClick: async ({ row }) => {
            await updateMenuStatus({ id: row.id, status: !row.status });
            await getTableData();
          },
        },
        {
          label: '删除',
          type: 'danger',
          icon: 'Delete',
          onClick: async ({ row }) => {
            await useConfirm(deleteMenu, row.id, '删除菜单');
            await getTableData();
          },
        },
      ],
    },
  ],
});
</script>

<template>
  <div class="main-container">
    <app-card>
      <app-form show-action inline :loading="tableProps.loading" @search="getTableData" @reset="resetParams">
        <app-form-item label="菜单名称">
          <el-input v-model="params.name" placeholder="请输入菜单名称" clearable />
        </app-form-item>
      </app-form>
    </app-card>
    <app-table v-bind="tableProps" :data="tableProps.data" card @refresh="getTableData">
      <template #button>
        <el-button v-auth="'system:menu:add'" type="primary" :icon="renderIcon('CirclePlus')" plain @click="showForm = true">
          新增
        </el-button>
      </template>
    </app-table>
    <MenuForm @confirm="getTableData" />
  </div>
</template>
