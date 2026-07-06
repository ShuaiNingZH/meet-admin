<script setup lang="ts">
import type { ScrollbarInstance } from 'element-plus';
import type { APIv2CollectionResponse } from '../select-icon.ts';
import { Icon } from '@iconify/vue';
import { renderIcon } from '@/utils/icon';

defineOptions({ name: 'TabIconContent' });
const props = defineProps<Props>();

const emits = defineEmits(['selectIcon']);
interface Props {
  data: APIv2CollectionResponse[];
  activeName: string;
}

const { t } = useI18n();

const scrollbarRef = ref<ScrollbarInstance>();
const searchIcon = ref('');
const currentPage = ref(1);
const pageSize = ref(120);

// 处理搜索图标
const filterIcons = computed(() => {
  let list: any[];
  if (props.activeName === 'all') {
    list = props.data.map(item => item.icons).flat();
  }
  else {
    list = props.data.filter(item => item.title === props.activeName).map(item => item.icons).flat();
  }

  if (!searchIcon.value)
    return list;

  return list.filter(item => item!.includes(searchIcon.value.toLowerCase()));
});

// 分页图标
const paginatedIcons = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filterIcons.value.slice(start, end);
});

watch(currentPage, () => {
  nextTick(() => scrollbarRef.value?.setScrollTop(0));
});

function handleIcon(val: string) {
  emits('selectIcon', val);
}
</script>

<template>
  <app-flex vertical :size="4">
    <app-flex>
      <el-input
        v-model="searchIcon" :placeholder="t('components.selectIcon.searchPlaceholder')"
        :prefix-icon="renderIcon('line-md:search')" clearable
      />
      <el-text class="text-nowrap" type="primary">
        {{ t('components.selectIcon.common') }} {{ filterIcons.length }}
      </el-text>
    </app-flex>
    <el-scrollbar ref="scrollbarRef" height="calc(360px - 32px - 32px - 8px)">
      <app-flex :size="0" wrap>
        <div v-for="(icon, index) of paginatedIcons" :key="index" class="wrapper !p-8" @click="handleIcon(icon!)">
          <app-flex justify="center" align="center" class="h-26 w-26">
            <Icon :icon="icon!" class="text-26" />
          </app-flex>
        </div>
        <el-empty v-if="!paginatedIcons.length" class="w-full" size="280" description="暂无图标" />
      </app-flex>
    </el-scrollbar>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      class="self-center"
      layout="prev, pager, next"
      :total="filterIcons.length"
      hide-on-single-page
    />
  </app-flex>
</template>
