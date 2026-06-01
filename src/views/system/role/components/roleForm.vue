<script setup lang="ts">
import type { ElTree, FormInstance, FormRules } from 'element-plus';
import { omit } from 'lodash-es';
import { createRole, fetchMenuList, updateRole } from '@/api/system/role.ts';
import { useState } from '@/views/system/role/components/useState.ts';

defineOptions({ name: 'RoleForm' });

const emit = defineEmits(['confirm']);

const { showForm, state, reset } = useState();

const title = computed(() => {
  return state.value.id ? '编辑角色' : '新增角色';
});

// 获取菜单
const menuList = ref<Menu.Tree[]>([]);
async function getMenuList() {
  const res = await fetchMenuList();
  menuList.value = res.data;
}

watch(showForm, (value) => {
  if (value)
    getMenuList();
  else
    reset();
});

const formRef = useTemplateRef<FormInstance>('formRef');
const rules: FormRules = {
  name: { required: true, message: '请输入角色名称', trigger: 'blur' },
  code: { required: true, message: '请输入角色编码', trigger: 'blur' },
};

// 权限树
const treeRef = useTemplateRef<InstanceType<typeof ElTree>>('treeRef');
const isExpanded = ref(true);
const isCheckedAll = ref(false);

function collectAllIds(list: Menu.Tree[]): number[] {
  return list.flatMap(node => [node.id, ...collectAllIds(node.children ?? [])]);
}

function handleCheckAll() {
  if (isCheckedAll.value) {
    treeRef.value?.setCheckedKeys([]);
  }
  else {
    treeRef.value?.setCheckedKeys(collectAllIds(menuList.value));
  }
  isCheckedAll.value = !isCheckedAll.value;
}

function handleExpandAll() {
  isExpanded.value = !isExpanded.value;
  const nodesMap = (treeRef.value as any)?.store?.nodesMap;
  if (!nodesMap)
    return;
  Object.values(nodesMap).forEach((node: any) => {
    node.expanded = isExpanded.value;
  });
}

async function handleConfirm() {
  try {
    await formRef.value?.validate();
    state.value.menuIds = treeRef.value?.getCheckedKeys() as number[] ?? [];

    if (state.value.id)
      await updateRole(state.value);
    else
      await createRole(omit(state.value, 'id'));

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
    <app-form ref="formRef" :model="state" :rules :cols="1">
      <app-form-item label="角色名称" prop="name">
        <el-input v-model="state.name" placeholder="请输入角色名称" />
      </app-form-item>
      <app-form-item label="权限" :span="2">
        <app-flex justify="space-between" class="mb-8px">
          <app-flex :size="4">
            <el-button link type="primary" @click="handleCheckAll">
              {{ isCheckedAll ? '取消' : '全选' }}
            </el-button>
            <el-divider direction="vertical" />
            <el-button link type="primary" @click="handleExpandAll">
              {{ isExpanded ? '折叠' : '展开' }}
            </el-button>
          </app-flex>
        </app-flex>
        <el-tree
          ref="treeRef" :data="menuList" :props="{ label: 'name' }" :default-checked-keys="state.menuIds"
          node-key="id" show-checkbox default-expand-all
        />
      </app-form-item>
      <app-form-item label="角色状态" prop="status">
        <el-radio-group v-model="state.status">
          <el-radio label="启用" :value="true" />
          <el-radio label="禁用" :value="false" />
        </el-radio-group>
      </app-form-item>
      <app-form-item label="备注" prop="remark" :span="2">
        <el-input v-model="state.remark" type="textarea" :rows="3" placeholder="请输入备注" />
      </app-form-item>
    </app-form>
  </app-popup>
</template>
