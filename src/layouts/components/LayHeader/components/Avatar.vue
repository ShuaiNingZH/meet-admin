<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores';
import { renderIcon } from '@/utils';

defineOptions({ name: 'Avatar' });

const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();

function handleSelect(val: string) {
  if (val === 'loginOut') {
    ElMessageBox.confirm(t('confirm.content'), t('confirm.title'), {
      confirmButtonText: t('confirm.confirm'),
      cancelButtonText: t('confirm.cancel'),
      type: 'warning',
    }).then(async () => {
      userStore.handleLogout();
      await router.push('/login');
    });
  }
}
</script>

<template>
  <el-dropdown trigger="click" :disabled="true" @command="handleSelect">
    <el-avatar class="cursor-pointer" round :src="userStore.userInfo.avatar" alt="头像" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          :icon="renderIcon('icon-park-outline:user')"
          command="userCenter"
        >
          {{ t('userCenter') }}
        </el-dropdown-item>
        <el-dropdown-item
          :icon="renderIcon('teenyicons:password-outline')"
          command="editPassword"
          divided
        >
          {{ t('editPassword') }}
        </el-dropdown-item>
        <el-dropdown-item
          :icon="renderIcon('icon-park-outline:logout')"
          command="loginOut"
          divided
        >
          {{ t('loginOut') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<i18n lang="yaml">
zh-CN:
  userCenter: 个人中心
  editPassword: 修改密码
  loginOut: 退出登录
  confirm:
    title: 温馨提示
    content: 您是否确定退出登录?
    confirm: 确定
    cancel: 取消
en-US:
  userCenter: User Center
  editPassword: Edit Password
  loginOut: Login Out
  confirm:
    title: Warm Tips
    content: Are you sure you want to log out?
    confirm: Sure
    cancel: Cancel
</i18n>
