<script setup lang="ts">
import type { InputInstance } from 'element-plus';
import type {
  APIv2CollectionResponse,
  APIv2CollectionsList,
  AppSelectIconProps,
} from './select-icon.ts';
import { renderIcon } from '@/utils/icon';
import TabIconContent from './components/TabIconContent.vue';
import { fetchAllIconCollections, fetchIconsByCollection } from './select-icon.ts';

defineOptions({ name: 'AppSelectIcon' });

const props = defineProps<AppSelectIconProps>();

const { t } = useI18n();

const placeholder = computed(() => props.placeholder || t('components.selectIcon.placeholder'));
const title = computed(() => props.title || t('components.selectIcon.title'));

const isShow = ref(false);
const activeName = ref('all');
const iconValue = defineModel({
  type: String,
  default: '',
});

// 获取所有图标库
const allIconCollections = shallowRef<APIv2CollectionsList[]>([]);
async function getAllIconCollections() {
  const res = await fetchAllIconCollections();
  const list: APIv2CollectionsList[] = [];
  Object.entries(res).forEach(([key, value]) => {
    list.push({ ...value, key });
  });
  allIconCollections.value = list;
}

// 获取所有图标库图标
const iconsByCollection = shallowRef<APIv2CollectionResponse[]>([]);
async function fetchIconAllList(nameList: APIv2CollectionsList[]) {
  const namePromises = nameList.map(item => fetchIconsByCollection(item.key));
  const targets = await Promise.all(namePromises);
  const list: APIv2CollectionResponse[] = [];

  targets.forEach((item) => {
    list.push({
      ...item,
      icons: getVisibleIconsCorrected(item),
    });
  });
  iconsByCollection.value = list;
}

// 获取处理后的图标数据
function getVisibleIconsCorrected(iconData: APIv2CollectionResponse) {
  const icons = new Set<string>();

  // 处理未分类图标
  if (iconData.uncategorized) {
    iconData.uncategorized.forEach(icon => icons.add(`${iconData.prefix}:${icon}`));
  }

  // 处理分类图标
  if (iconData.categories) {
    Object.values(iconData.categories).forEach((category) => {
      category.forEach(icon => icons.add(`${iconData.prefix}:${icon}`));
    });
  }

  return Array.from(icons);
}

const inputRef = ref<InputInstance>();
function handleIcon(val: string) {
  iconValue.value = val;
  isShow.value = false;
  nextTick(() => {
    inputRef.value!.blur();
  });
}

function handleShow() {
  isShow.value = true;
}

onMounted(async () => {
  await getAllIconCollections();
  await fetchIconAllList(allIconCollections.value);
});
</script>

<template>
  <el-input
    ref="inputRef" v-model="iconValue" :placeholder clearable @click="handleShow"
    @keyup.enter="handleShow"
  >
    <template #append>
      <el-button :icon="renderIcon(iconValue, { size: 18 })" @click="handleShow" />
    </template>
  </el-input>
  <app-popup v-model="isShow" class="app-icon-popup" :title width="650" max-height="400" :show-footer="false">
    <el-tabs v-model="activeName" class="h-360" tab-position="left">
      <el-tab-pane label="All" name="all">
        <TabIconContent v-if="activeName === 'all'" :data="iconsByCollection" :active-name="activeName" @select-icon="handleIcon" />
      </el-tab-pane>
      <el-tab-pane v-for="item of allIconCollections" :key="item.key" :label="item.name" :name="item.name">
        <TabIconContent v-if="activeName === item.name" :data="iconsByCollection" :active-name="activeName" @select-icon="handleIcon" />
      </el-tab-pane>
    </el-tabs>
  </app-popup>
</template>

<style lang="scss">
@use '../style/index';
</style>
