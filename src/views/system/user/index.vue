<script setup lang="tsx">
import { deleteUser, fetchUserList, updateUserStatus } from '@/api/system/user';
import { useTable } from '@/components/AppTable';
import { useConfirm } from '@/hooks/useConfirm';
import { renderIcon } from '@/utils/icon';
import UserForm from '@/views/system/user/components/userForm.vue';
import { useState } from '@/views/system/user/components/useState.ts';

defineOptions({ name: 'SystemUser' });

const { showForm, setState } = useState();

const GENDER_MAP = {
  0: { label: '未知', type: 'info' },
  1: { label: '男', type: 'primary' },
  2: { label: '女', type: 'danger' },
} as const;

const { tableProps, params, resetParams, getTableData } = useTable({
  apiFunc: fetchUserList,
  apiParams: {
    username: '',
    status: undefined,
    gender: undefined,
  },
  isPagination: true,
  columns: () => [
    { type: 'index', fixed: 'left' },
    { prop: 'username', label: '用户名', minWidth: 120 },
    { prop: 'nickname', label: '昵称', minWidth: 120 },
    { prop: 'phone', label: '手机号', width: 130 },
    { prop: 'email', label: '邮箱', minWidth: 160, showOverflowTooltip: true },
    {
      prop: 'gender',
      label: '性别',
      width: 70,
      align: 'center',
      renderContent: ({ row }) => {
        const g = GENDER_MAP[row.gender as keyof typeof GENDER_MAP];
        return <ElTag type={g.type}>{g.label}</ElTag>;
      },
    },
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
                await updateUserStatus({
                  id: row.id,
                  status: !row.status,
                });
                await getTableData();
              }}
            >
              {row.status ? '禁用' : '启用'}
            </ElButton>
            <ElButton
              type="danger"
              icon={renderIcon('Delete')}
              link
              onClick={async () => {
                await useConfirm(deleteUser, row.id, '删除用户');
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
        <app-form-item label="用户名">
          <el-input v-model="params.username" placeholder="请输入用户名" clearable />
        </app-form-item>
        <app-form-item label="状态">
          <el-select v-model="params.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </app-form-item>
        <app-form-item label="性别">
          <el-select v-model="params.gender" placeholder="请选择状态" clearable>
            <el-option v-for="(value, key) in GENDER_MAP" :key="key" :label="value.label" :value="key" />
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
    <UserForm @confirm="getTableData" />
  </div>
</template>
