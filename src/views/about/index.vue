<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { timeFormat } from '@/utils';
import pkg from '../../../package.json';

defineOptions({ name: 'About' });

const { t } = useI18n();

// 项目基础信息，tag 指定需要以 el-tag 高亮展示的类型
const projectInfo = computed(() => [
  { label: t('info.name'), value: pkg.name },
  { label: t('info.version'), value: `v${pkg.version}`, tag: 'primary' as const },
  { label: t('info.description'), value: pkg.description },
  { label: t('info.author'), value: pkg.author?.name },
  { label: t('info.license'), value: pkg.license, tag: 'success' as const },
  { label: t('info.node'), value: pkg.engines?.node, tag: 'info' as const },
  { label: t('info.pnpm'), value: pkg.engines?.pnpm, tag: 'info' as const },
  { label: t('info.buildTime'), value: timeFormat(__BUILD_TIME__, 'YYYY-MM-DD HH:mm:ss') },
  { label: t('info.homepage'), value: pkg.homepage, link: pkg.homepage },
  { label: t('info.repository'), value: pkg.repository?.url?.replace(/\.git$/, ''), link: pkg.repository?.url?.replace(/\.git$/, '') },
]);

// 依赖列表：由 package.json 转换为表格数据
function toDepList(deps: Record<string, string> | undefined) {
  return Object.entries(deps ?? {})
    .map(([name, version]) => ({ name, version }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const prodDeps = toDepList(pkg.dependencies);
const devDeps = toDepList(pkg.devDependencies);

// 依赖搜索过滤
const prodSearch = ref('');
const devSearch = ref('');

const filteredProdDeps = computed(() =>
  prodDeps.filter(item => item.name.includes(prodSearch.value.trim())),
);
const filteredDevDeps = computed(() =>
  devDeps.filter(item => item.name.includes(devSearch.value.trim())),
);

// 顶部速览卡片
const quickStats = computed(() => [
  { key: 'version', label: t('quick.version'), value: `v${pkg.version}`, icon: 'icon-park-outline:tag-one', color: '#409eff' },
  { key: 'prod', label: t('quick.prod'), value: prodDeps.length, icon: 'icon-park-outline:box', color: '#67c23a' },
  { key: 'dev', label: t('quick.dev'), value: devDeps.length, icon: 'icon-park-outline:code', color: '#e6a23c' },
  { key: 'license', label: t('quick.license'), value: pkg.license, icon: 'icon-park-outline:certificate', color: '#9b59b6' },
]);
</script>

<template>
  <app-flex vertical :size="16" class="about">
    <app-grid :cols="{ xs: 2, lg: 4 }" :row-gap="16" :col-gap="16">
      <app-grid-item v-for="item in quickStats" :key="item.key">
        <app-card shadow="hover" class="quick h-full">
          <div class="quick__body">
            <div>
              <p class="quick__label">
                {{ item.label }}
              </p>
              <p class="quick__value">
                {{ item.value }}
              </p>
            </div>
            <div class="quick__icon" :style="{ backgroundColor: `${item.color}1a`, color: item.color }">
              <app-icon :icon="item.icon" :size="24" />
            </div>
          </div>
        </app-card>
      </app-grid-item>
    </app-grid>
    <app-card>
      <h3 class="about__title">
        <app-icon icon="icon-park-outline:application-one" :size="18" />
        {{ t('section.info') }}
      </h3>
      <p class="about__intro">
        {{ t('info.intro') }}
      </p>
      <el-descriptions :column="2" border>
        <el-descriptions-item v-for="item in projectInfo" :key="item.label" :label="item.label">
          <template v-if="item.tag">
            <el-tag :type="item.tag" size="small">
              {{ item.value }}
            </el-tag>
          </template>
          <template v-else-if="item.link">
            <a :href="item.link" target="_blank" rel="noopener noreferrer">{{ item.value }}</a>
          </template>
          <template v-else>
            {{ item.value }}
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </app-card>
    <app-grid :cols="{ xs: 1, lg: 2 }" :row-gap="16" :col-gap="16">
      <app-grid-item>
        <app-card class="h-full">
          <div class="about__section-head">
            <h3 class="about__title">
              <app-icon icon="icon-park-outline:box" :size="18" />
              {{ t('section.prod') }}
              <el-tag size="small" round>
                {{ prodDeps.length }}
              </el-tag>
            </h3>
            <el-input v-model="prodSearch" :placeholder="t('search')" clearable class="about__search">
              <template #prefix>
                <app-icon icon="icon-park-outline:search" />
              </template>
            </el-input>
          </div>
          <el-table :data="filteredProdDeps" height="360" size="small">
            <el-table-column type="index" width="56" />
            <el-table-column prop="name" :label="t('table.name')" show-overflow-tooltip />
            <el-table-column prop="version" :label="t('table.version')" width="120" align="right" />
          </el-table>
        </app-card>
      </app-grid-item>
      <app-grid-item>
        <app-card class="h-full">
          <div class="about__section-head">
            <h3 class="about__title">
              <app-icon icon="icon-park-outline:code" :size="18" />
              {{ t('section.dev') }}
              <el-tag size="small" round>
                {{ devDeps.length }}
              </el-tag>
            </h3>
            <el-input v-model="devSearch" :placeholder="t('search')" clearable class="about__search">
              <template #prefix>
                <app-icon icon="icon-park-outline:search" />
              </template>
            </el-input>
          </div>
          <el-table :data="filteredDevDeps" height="360" size="small">
            <el-table-column type="index" width="56" />
            <el-table-column prop="name" :label="t('table.name')" show-overflow-tooltip />
            <el-table-column prop="version" :label="t('table.version')" width="120" align="right" />
          </el-table>
        </app-card>
      </app-grid-item>
    </app-grid>
  </app-flex>
</template>

<i18n lang="yaml">
zh-CN:
  search: 搜索包名
  quick:
    version: 当前版本
    prod: 生产依赖
    dev: 开发依赖
    license: 开源协议
  section:
    info: 项目信息
    prod: 生产依赖
    dev: 开发依赖
  info:
    intro: Meet-Admin 是一个基于 Vue 3.5 + TypeScript + Vite 8 打造的中后台管理框架，集成 Element Plus、Pinia、UnoCSS 与 Vue I18n，内置动态路由、权限菜单、国际化等能力，帮助团队快速搭建后台管理系统。
    name: 项目名称
    version: 版本号
    description: 项目描述
    author: 作者
    license: 开源协议
    node: Node 版本要求
    pnpm: pnpm 版本要求
    buildTime: 构建时间
    homepage: 项目主页
    repository: 仓库地址
  table:
    name: 包名
    version: 版本号
en-US:
  search: Search package
  quick:
    version: Version
    prod: Dependencies
    dev: Dev Dependencies
    license: License
  section:
    info: Project Info
    prod: Dependencies
    dev: Dev Dependencies
  info:
    intro: Meet-Admin is an admin management framework built with Vue 3.5, TypeScript and Vite 8, integrating Element Plus, Pinia, UnoCSS and Vue I18n. It ships with dynamic routing, permission-based menus and i18n out of the box, helping teams quickly build admin systems.
    name: Name
    version: Version
    description: Description
    author: Author
    license: License
    node: Node Requirement
    pnpm: pnpm Requirement
    buildTime: Build Time
    homepage: Homepage
    repository: Repository
  table:
    name: Package
    version: Version
</i18n>

<style scoped lang="scss">
.quick {
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
  }

  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__label {
    margin: 0;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__value {
    margin: var(--spacing-sm) 0 0;
    font-size: 22px;
    font-weight: 700;
    color: var(--el-text-color-primary);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }
}

.about {
  &__title {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    margin: 0 0 var(--spacing-base);
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  &__intro {
    margin: 0 0 var(--spacing-base);
    font-size: 13px;
    line-height: 1.6;
    color: var(--el-text-color-secondary);
  }

  &__section-head {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-base);

    .about__title {
      margin-bottom: 0;
    }
  }

  &__search {
    width: 200px;
  }
}
</style>
