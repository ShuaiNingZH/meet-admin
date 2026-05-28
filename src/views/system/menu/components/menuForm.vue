<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { omit } from 'lodash-es';
import { createMenu, fetchMenuList, updateMenu } from '@/api/system/menu.ts';
import { useState } from '@/views/system/menu/components/useState.ts';

defineOptions({ name: 'MenuForm' });

const emit = defineEmits(['confirm']);

const { showForm, state, reset } = useState();

const title = computed(() => {
  return state.value.id ? '编辑菜单' : '新增菜单';
});

// 获取菜单 --- start
const menuList = ref<Menu.Tree[]>([]);
async function getMenuList() {
  const res = await fetchMenuList();
  menuList.value = [{ id: 0, name: '主类目', children: res.data } as Menu.Tree];
}
// 获取菜单 --- end

watch(showForm, (value) => {
  if (value)
    getMenuList();
  else
    reset();
});

const formRef = useTemplateRef<FormInstance>('formRef');
const rules: FormRules = {
  name: { required: true, message: '请输入菜单名称', trigger: 'blur' },
  path: { required: true, message: '请输入路由路径', trigger: 'blur' },
  routeName: { required: true, message: '请输入路由名称', trigger: 'blur' },
  sort: { required: true, message: '请输入显示顺序', trigger: 'blur' },
};

async function handleConfirm() {
  try {
    await formRef.value?.validate();

    if (state.value.id)
      await updateMenu(state.value);
    else
      await createMenu(omit(state.value, 'id'));

    showForm.value = false;
    emit('confirm');
  }
  catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <app-popup v-model="showForm" :title @confirm="handleConfirm">
    <app-form ref="formRef" :model="state" :rules :cols="2">
      <app-form-item label="上级菜单" :span="2">
        <el-tree-select
          v-model="state.parentId" :data="menuList" :props="{ label: 'name' }" placeholder="请选择上级菜单"
          node-key="id" check-strictly
        />
      </app-form-item>
      <app-form-item label="菜单类型" :span="2">
        <el-radio-group v-model="state.type">
          <el-radio label="目录" :value="0" />
          <el-radio label="菜单" :value="1" />
          <el-radio label="按钮" :value="2" />
        </el-radio-group>
      </app-form-item>
      <app-form-item label="菜单名称" prop="name">
        <el-input v-model="state.name" placeholder="请输入菜单名称" />
      </app-form-item>
      <app-form-item label="显示顺序" prop="sort">
        <el-input-number
          v-model="state.sort" :min="0" controls-position="right" placeholder="请输入显示顺序"
        />
      </app-form-item>
      <app-form-item v-if="state.type !== 2" label="菜单图标" prop="icon" :span="2">
        <app-select-icon v-model="state.icon" placeholder="请选择菜单图标" />
      </app-form-item>
      <template v-if="state.type === 1">
        <app-form-item label="路由路径" prop="path">
          <el-input v-model="state.path" placeholder="请输入路由路径" />
        </app-form-item>
        <app-form-item label="路由名称" prop="routeName">
          <el-input v-model="state.routeName" placeholder="请输入路由名称" />
        </app-form-item>
        <app-form-item label="组件路径" prop="componentPath" :span="2" help-info="例：system/menu/index">
          <el-input v-model="state.componentPath" placeholder="请输入组件路径" />
        </app-form-item>
        <app-form-item label="高亮菜单" prop="activeMenu" :span="2">
          <el-input v-model="state.activeMenu" placeholder="无需高亮时留空" />
        </app-form-item>
      </template>
      <app-form-item
        v-if="state.type === 2" label="权限标识" prop="perm" :span="2"
        help-info="例：system:menu:add"
      >
        <el-input v-model="state.perm" placeholder="请输入权限标识" />
      </app-form-item>
      <app-form-item label="菜单状态" prop="status">
        <el-radio-group v-model="state.status">
          <el-radio label="启用" :value="true" />
          <el-radio label="禁用" :value="false" />
        </el-radio-group>
      </app-form-item>
      <app-form-item v-if="state.type === 1" label="页面缓存" prop="keepAlive">
        <el-switch v-model="state.keepAlive" />
      </app-form-item>
      <app-form-item v-if="state.type !== 2" label="隐藏菜单" prop="hideInMenu">
        <el-switch v-model="state.hideInMenu" />
      </app-form-item>
      <app-form-item v-if="state.type === 1" label="隐藏标签" prop="hideInTag">
        <el-switch v-model="state.hideInTag" />
      </app-form-item>
      <app-form-item v-if="state.type === 1" label="隐藏父级" prop="hideParent">
        <el-switch v-model="state.hideParent" />
      </app-form-item>
    </app-form>
  </app-popup>
</template>
