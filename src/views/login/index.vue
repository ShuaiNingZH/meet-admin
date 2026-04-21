<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import * as ww from '@wecom/jssdk';
import { ColorScheme, WWLoginRedirectType, WWLoginType } from '@wecom/jssdk';
import dayjs from 'dayjs';
import logo from '@/assets/images/logo.svg';
import sign from '@/assets/images/sign.svg';
import { Constant } from '@/enums/common';
import Locale from '@/layouts/components/LayHeader/components/Locale.vue';
import ThemeSwitch from '@/layouts/components/LayHeader/components/ThemeSwitch.vue';
import { useUserStore } from '@/stores';
import { renderIcon, storage } from '@/utils';

defineOptions({ name: 'Login' });

const { t } = useI18n();
const { VITE_AGENT_ID, VITE_ENTERPRISE_ID } = import.meta.env;
const userStore = useUserStore();

const loading = ref(false);
const checked = ref(false);
const disabled = ref(false);

const rules: FormRules = {
  userName: [
    { required: true, message: t('page.login.usernameError'), trigger: 'blur' },
  ],
  userPwd: [
    { required: true, message: t('page.login.passwordError'), trigger: 'blur' },
  ],
};

interface State {
  userName: string;
  userPwd: string;
}

const state = reactive({
  userName: '',
  userPwd: '',
});

// 获取用户账号
async function getUserConfig() {
  try {
    const rss = await storage.getItem<State>(Constant.LoginAccount, '');

    if (!rss)
      return;

    state.userName = rss.userName;
    state.userPwd = rss.userPwd;
    checked.value = true;
  }
  catch (e) {
    console.error('获取账号失败：', e);
  }
}

onMounted(getUserConfig);

const appName = import.meta.env.VITE_APP_NAME;

const router = useRouter();
const formRef = ref<FormInstance>();

// 点击登录
async function handleLogin() {
  await formRef.value?.validate();

  loading.value = true;
  disabled.value = true;

  try {
    await userStore.handleLogin(state.userName);

    await router.push('/');
    ElNotification.success({
      title: t('page.login.loginSuccessful'),
      message: t('page.login.welcomeBack'),
      duration: 2500,
    });

    if (checked.value) {
      await storage.setItem(Constant.LoginAccount, state);
    }
    else {
      await storage.removeItem(Constant.LoginAccount);
    }
  }
  finally {
    loading.value = false;
    disabled.value = false;
  }
}

// 回车登录
useEventListener('keypress', ({ code }) => {
  if (['Enter', 'NumpadEnter'].includes(code) && !disabled.value && !loading.value)
    handleLogin();
});

const isQwCode = ref(false);

onMounted(() => {
  ww.createWWLoginPanel({
    el: '#qw-login-container',
    params: {
      login_type: WWLoginType.corpApp,
      appid: VITE_ENTERPRISE_ID,
      agentid: VITE_AGENT_ID,
      redirect_uri: location.href,
      redirect_type: WWLoginRedirectType.callback,
      color_scheme: ColorScheme.Auto,
    },
    async onLoginSuccess(res) {
      await userStore.handleLogin(res.code);
      await router.push('/');
      ElNotification.success({
        title: t('page.login.loginSuccessful'),
        message: t('page.login.welcomeBack'),
        duration: 2500,
      });
    },
  });
});
</script>

<template>
  <div class="login-page">
    <!-- 左侧插图 -->
    <div class="illustrations">
      <!-- 背景装饰图案 -->
      <div class="background-pattern">
        <div class="circle-1 pattern-circle" />
        <div class="pattern-circle circle-2" />
        <div class="pattern-circle circle-3" />
        <div class="square-1 pattern-square" />
        <div class="pattern-square square-2" />
      </div>
      <!-- 插图内容 -->
      <div class="illustrations-content">
        <!-- 签名 -->
        <div class="sign">
          <img :src="sign" alt="签名">
        </div>
        <!-- 仪表板预览 -->
        <div class="dashboard-preview">
          <!-- 仪表板框架 -->
          <div class="dashboard-frame">
            <!-- 仪表板头部 -->
            <div class="dashboard-header">
              <div class="header-controls">
                <div class="control-dot red" />
                <div class="control-dot yellow" />
                <div class="control-dot green" />
              </div>
              <div class="header-nav">
                <div class="nav-item item-1" />
                <div class="nav-item item-2" />
                <div class="nav-item item-3" />
              </div>
              <div class="header-notification">
                <div class="notification-icon">
                  <div class="notification-dot" />
                </div>
              </div>
            </div>
            <!-- 仪表板主体 -->
            <div class="dashboard-body">
              <!-- 侧边栏 -->
              <div class="sidebar">
                <div class="sidebar-item active">
                  <app-icon class="sidebar-icon" icon="tabler:layout-dashboard" />
                </div>
                <div class="sidebar-item">
                  <app-icon class="sidebar-icon" icon="material-symbols:package-2-outline" />
                </div>
                <div class="sidebar-item">
                  <app-icon class="sidebar-icon" icon="ci:shopping-cart-01" />
                </div>
                <div class="sidebar-item">
                  <app-icon class="sidebar-icon" icon="tabler:users" />
                </div>
                <div class="sidebar-item">
                  <app-icon class="sidebar-icon" icon="ix:barchart" />
                </div>
              </div>
              <!-- 主内容区 -->
              <div class="login-main-content">
                <!-- 统计卡片行 -->
                <div class="stats-grid">
                  <div class="stats-card">
                    <div class="stats-content">
                      <div class="stats-data">
                        <div class="stats-bar one" />
                        <div class="stats-text" />
                      </div>
                      <app-icon class="one stats-icon" icon="material-symbols:trending-up" />
                    </div>
                  </div>
                  <div class="stats-card card-2">
                    <div class="stats-content">
                      <div class="stats-data">
                        <div class="stats-bar two" />
                        <div class="stats-text small" />
                      </div>
                      <app-icon class="stats-icon two" icon="material-symbols:package-2-outline" />
                    </div>
                  </div>
                  <div class="stats-card card-3">
                    <div class="stats-content">
                      <div class="stats-data">
                        <div class="stats-bar three" />
                        <div class="stats-text medium" />
                      </div>
                      <app-icon class="stats-icon three" icon="tabler:users" />
                    </div>
                  </div>
                </div>
                <!-- 图表 -->
                <div class="charts-grid">
                  <!-- 柱状图容器 -->
                  <div class="chart-container">
                    <div class="bar-chart">
                      <div class="chart-bar bar-1" />
                      <div class="chart-bar bar-2" />
                      <div class="chart-bar bar-3" />
                      <div class="chart-bar bar-4" />
                      <div class="chart-bar bar-5" />
                      <div class="chart-bar bar-6" />
                    </div>
                  </div>
                  <!-- 饼图容器 -->
                  <div class="pie-chart-container">
                    <div class="pie-chart">
                      <div class="pie-background" />
                      <div class="blue pie-slice" />
                      <div class="pie-slice green" />
                      <div class="pie-center" />
                      <div class="dot-1 pie-dot" />
                      <div class="pie-dot dot-2" />
                    </div>
                  </div>
                </div>
                <!-- 数据表格 -->
                <div class="data-table">
                  <div class="table-content">
                    <div class="table-header">
                      <div class="cell-1 header-cell" />
                      <div class="header-cell cell-2" />
                      <div class="header-cell cell-3" />
                      <div class="header-cell cell-4" />
                    </div>
                    <div class="table-row">
                      <div class="cell-1 table-cell" />
                      <div class="cell-2 table-cell" />
                      <div class="status success table-cell" />
                      <div class="cell-3 table-cell" />
                    </div>
                    <div class="table-row">
                      <div class="cell-1 table-cell" />
                      <div class="cell-2 table-cell" />
                      <div class="status error table-cell" />
                      <div class="cell-3 table-cell" />
                    </div>
                    <div class="table-row">
                      <div class="cell-1 table-cell" />
                      <div class="cell-2 table-cell" />
                      <div class="status warning table-cell" />
                      <div class="cell-3 table-cell" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 浮动元素 -->
          <div class="float-element top">
            <app-icon class="float-icon" icon="material-symbols:trending-up" size="24" />
          </div>
          <div class="float-element bottom">
            <app-icon class="float-icon" icon="material-symbols:package-2-outline" size="24" />
          </div>
          <div class="float-element corner">
            <app-icon class="float-icon" icon="ix:barchart" size="24" />
          </div>
        </div>
        <!-- 底部装饰 -->
        <div class="bottom-decoration">
          <div class="decoration-item">
            <div class="one decoration-dot" />
          </div>
          <div class="decoration-item">
            <div class="decoration-dot two" />
          </div>
          <div class="decoration-item">
            <div class="decoration-dot three" />
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧登录 -->
    <div class="login">
      <div class="app-settings">
        <ThemeSwitch />
        <Locale />
      </div>
      <div class="login-wrapper">
        <!-- Logo -->
        <div class="logo">
          <img class="logo-icon" :src="logo" alt="logo">
          <h1 class="logo-title">
            {{ appName }}
          </h1>
        </div>
        <!-- 登录表单 -->
        <el-form v-if="!isQwCode" ref="formRef" class="login-form" :model="state" :rules="rules" size="large" label-position="top">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="state.userName" clearable :placeholder="t('page.login.username')" :prefix-icon="renderIcon('UserFilled')" />
          </el-form-item>
          <el-form-item label="密码" prop="userPwd">
            <el-input
              v-model="state.userPwd" :placeholder="t('page.login.password')" :prefix-icon="renderIcon('bxs:lock')" clearable
              show-password
            />
          </el-form-item>
          <el-form-item>
            <div class="h-[20px] w-full flex items-center justify-between">
              <el-checkbox v-model="checked">
                {{ t('page.login.rememberMe') }}
              </el-checkbox>
              <el-link type="primary" underline="never">
                {{ t('page.login.forget') }}
              </el-link>
            </div>
            <el-button class="mt-16 w-full" type="primary" size="default" :loading :disabled @click="handleLogin">
              {{ t('page.login.login') }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-divider>第三方登录</el-divider>
            <app-flex class="third-party" justify="center">
              <app-icon icon="tdesign:logo-wechat" />
              <app-icon icon="tdesign:logo-wecom" @click="isQwCode = true;" />
            </app-flex>
          </el-form-item>
        </el-form>
        <!-- 企业微信扫码登录 -->
        <div v-show="isQwCode" class="qrcode-panel">
          <app-card class="w-full !p-0">
            <div id="qw-login-container" />
          </app-card>
          <el-link :icon="renderIcon('ep:arrow-left')" underline="never" @click="isQwCode = false">
            返回账号密码登录
          </el-link>
        </div>
        <!-- 登录页脚 -->
        <div class="login-footer">
          Copyright © 2024-{{ dayjs().year() }}
          <el-link href="https://blog.wjp.plus" target="_blank" underline="never">
            &nbsp;{{ appName }}
          </el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'index';
</style>
