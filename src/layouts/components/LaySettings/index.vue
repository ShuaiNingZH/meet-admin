<script setup lang="ts">
import { localeList } from '@/constants/locale.ts';
import { useTheme } from '@/hooks';
import ColorSettings from '@/layouts/components/LaySettings/components/Color.vue';
import { useAppStore } from '@/stores';

defineOptions({ name: 'LaySettings' });

const { t } = useI18n();

const appStore = useAppStore();

const {
  size,
  asideInverted,
  breadcrumbShow,
  breadcrumbIconShow,
  transitionAnimation,
  tabStyle,
  watermark,
  locale,
  footer,
  buttonTip,
} = storeToRefs(appStore);

const showSetting = ref(false);

const colorModeOptions = [
  { label: 'light', value: 'light', icon: 'icon-park-outline:sun-one' },
  { label: 'dark', value: 'dark', icon: 'icon-park-outline:moon' },
  { label: 'auto', value: 'auto', icon: 'icon-park-outline:laptop-computer' },
];

const layoutOptions = ['default', 'large', 'small'];

const { colorStore, resetTheme, setAsideInverted } = useTheme();

function handleReset() {
  ElMessageBox.confirm(t('systemSettings.isReset'), t('common.kindTips'), {
    confirmButtonText: t('common.sure'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
    draggable: true,
  }).then(() => {
    appStore.handleAppReset();
    resetTheme();
  });
}
</script>

<template>
  <div class="app-setting">
    <el-tooltip :content="t('systemSettings.title')" :disabled="!buttonTip">
      <div class="wrapper" @click="showSetting = true">
        <app-icon icon="icon-park-outline:setting" />
      </div>
    </el-tooltip>
    <el-drawer v-model="showSetting" class="text-14" :title="t('systemSettings.title')" :size="350">
      <el-scrollbar>
        <!-- 布局样式 -->
        <el-divider>{{ t('systemSettings.layout.title') }}</el-divider>
        <el-segmented v-model="size" :options="layoutOptions" block>
          <template #default="{ item }">
            {{ t(`systemSettings.layout.${item}`) }}
          </template>
        </el-segmented>
        <!-- 主题模式 -->
        <el-divider>{{ t('systemSettings.themeMode.title') }}</el-divider>
        <app-flex vertical>
          <!-- 切换主题 -->
          <el-segmented v-model="colorStore" :options="colorModeOptions" block>
            <template #default="{ item }">
              <app-flex justify="center">
                <app-icon :icon="(item as any).icon" />
              </app-flex>
            </template>
          </el-segmented>
          <!-- 侧边栏反转颜色 -->
          <app-flex align="center">
            <app-flex :size="0" align="center">
              {{ t('systemSettings.themeMode.sidebar') }}
              <app-help-info :content="t('systemSettings.themeMode.sidebarHelpInfo')" />
            </app-flex>
            <el-switch v-model="asideInverted" @change="setAsideInverted" />
          </app-flex>
        </app-flex>
        <!-- 主题颜色 -->
        <el-divider>{{ t('systemSettings.themeColor.title') }}</el-divider>
        <ColorSettings />
        <!-- 页面设置 -->
        <el-divider>{{ t('systemSettings.pageConfig.title') }}</el-divider>
        <app-flex vertical>
          <app-flex justify="space-between" align="center">
            {{ t('systemSettings.pageConfig.locale') }}
            <el-select v-model="locale" class="!w-155" @change="appStore.setLocale">
              <el-option v-for="item of localeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </app-flex>
          <app-flex justify="space-between" align="center">
            {{ t('systemSettings.pageConfig.pageSwitching') }}
            <el-select v-model="transitionAnimation" class="!w-155">
              <el-option :label="t('systemSettings.pageConfig.effect.fade')" value="fade" />
              <el-option :label="t('systemSettings.pageConfig.effect.fade-slide')" value="fade-slide" />
              <el-option :label="t('systemSettings.pageConfig.effect.fade-bottom')" value="fade-bottom" />
              <el-option :label="t('systemSettings.pageConfig.effect.fade-scale')" value="fade-scale" />
              <el-option :label="t('systemSettings.pageConfig.effect.zoom-fade')" value="zoom-fade" />
              <el-option :label="t('systemSettings.pageConfig.effect.zoom-out')" value="zoom-out" />
              <el-option :label="t('systemSettings.pageConfig.effect.no')" value="none" />
            </el-select>
          </app-flex>
          <app-flex justify="space-between" align="center">
            {{ t('systemSettings.breadcrumbs.title') }}
            <el-switch
              v-model="breadcrumbShow" :active-text="t('common.show')" :inactive-text="t('common.hide')"
              inline-prompt
            />
          </app-flex>
          <app-flex justify="space-between" align="center">
            {{ t('systemSettings.breadcrumbs.icon') }}
            <el-switch
              v-model="breadcrumbIconShow" :active-text="t('common.show')" :inactive-text="t('common.hide')"
              inline-prompt
            />
          </app-flex>
          <app-flex justify="space-between" align="center">
            {{ t('systemSettings.tabStyle.title') }}
            <el-select v-model="tabStyle" class="!w-155">
              <el-option :label="t('systemSettings.tabStyle.dynamic')" value="dynamic" />
              <el-option :label="t('systemSettings.tabStyle.card')" value="card" />
              <el-option :label="t('systemSettings.tabStyle.simple')" value="simple" />
            </el-select>
          </app-flex>
          <app-flex justify="space-between" align="center">
            {{ t('systemSettings.watermark') }}
            <el-switch
              v-model="watermark" :active-text="t('common.show')" :inactive-text="t('common.hide')"
              inline-prompt
            />
          </app-flex>
          <app-flex justify="space-between" align="center">
            {{ t('systemSettings.footer') }}
            <el-switch
              v-model="footer" :active-text="t('common.show')" :inactive-text="t('common.hide')"
              inline-prompt
            />
          </app-flex>
          <app-flex justify="space-between" align="center">
            {{ t('systemSettings.buttonTip') }}
            <el-switch
              v-model="buttonTip" :active-text="t('common.show')" :inactive-text="t('common.hide')"
              inline-prompt
            />
          </app-flex>
        </app-flex>
      </el-scrollbar>
      <template #footer>
        <el-button type="danger" @click="handleReset">
          {{ t('common.reset') }}
        </el-button>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.app-setting {
  :deep(.el-overlay) {
    .el-drawer {
      --el-drawer-padding-primary: 0px;

      .el-drawer__header {
        margin: 0;
        padding: 15px;
        border-bottom: 1px solid var(--el-border-color);
        color: var(--el-text-color-primary);
      }

      .el-drawer__footer {
        padding: 15px;
        border-top: 1px solid var(--el-border-color);
      }

      .el-scrollbar {
        .el-scrollbar__wrap {
          padding: 15px;
        }
      }
    }
  }
}
</style>
