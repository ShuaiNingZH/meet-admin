<script setup lang="ts">
import { localeList } from '@/constants/locale';
import { useAppStore } from '@/stores';

defineOptions({ name: 'Locale' });

const { t } = useI18n();

const appStore = useAppStore();
const { buttonTip } = storeToRefs(appStore);

const language = computed(() => appStore.locale);
</script>

<template>
  <el-dropdown trigger="click" @command="appStore.setLocale">
    <span>
      <el-tooltip :content="t('tooltip.switchLocale')" placement="left" :disabled="!buttonTip">
        <div class="wrapper">
          <app-icon icon="ion:language" size="16" />
        </div>
      </el-tooltip>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in localeList"
          :key="item.value"
          :command="item.value"
          :disabled="language === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
