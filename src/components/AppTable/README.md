# AppTable 表格组件

## 组件简介

AppTable 是一个基于 Element Plus 的表格组件封装，提供了更丰富的功能和更简洁的使用方式。该组件支持列配置管理、分页、表头管理、卡片式布局等功能，特别适合用于后台管理系统的数据展示。通常与 useTable 钩子函数配合使用，可以大大简化表格数据的获取和管理。

## 功能特点

- 列配置管理：支持动态显示/隐藏列，可设置列固定等功能
- 分页集成：内置分页组件，简化分页操作
- 卡片式布局：支持卡片式容器包裹表格
- 数据格式化：内置货币、日期等特殊类型的格式化
- 加载状态：支持表格加载状态显示
- 刷新功能：支持表格数据刷新
- 插槽丰富：提供多种插槽满足自定义需求
- 表格钩子：通过 useTable 钩子函数简化数据加载和状态管理

## 使用方法

### 基本使用方式

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';

const loading = ref(false);
const tableData = ref([]);

// 定义列配置
const columns: TableColumns = [
  { type: 'selection', width: 50 },
  { type: 'index', width: 60, label: '序号' },
  { prop: 'name', label: '用户名', width: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 160,
    type: 'dateTime',
    show: false,
  },
  {
    prop: 'balance',
    label: '余额',
    width: 120,
    type: 'money'
  },
  {
    prop: 'operation',
    label: '操作',
    width: 150,
    fixed: 'right',
    align: 'center',
    renderContent: ({ row }) => (
      <div class="flex gap-2">
        <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </div>
    )
  }
];

// 分页配置
const pagination = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  background: true,
  layout: 'total, sizes, prev, pager, next, jumper',
  currentChange: (page: number) => fetchData(page),
  sizeChange: (size: number) => {
    pagination.pageSize = size;
    fetchData(1);
  }
});

// 获取表格数据
async function fetchData(page = 1) {
  loading.value = true;
  pagination.currentPage = page;

  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };

    const res = await fetchUserList(params);
    tableData.value = res.data.list;
    pagination.total = res.data.total;
  }
  catch (error) {
    console.error('获取数据失败', error);
  }
  finally {
    loading.value = false;
  }
}

// 操作方法
function handleAdd() {
  // 新增用户逻辑
}

function handleEdit(row) {
  // 编辑用户逻辑
}

function handleDelete(row) {
  // 删除用户逻辑
}

// 初始化加载数据
onMounted(() => {
  fetchData();
});
</script>

<template>
  <!-- 基础用法 -->
  <AppTable
    v-model:data="tableData"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    @refresh="fetchData"
  >
    <!-- 自定义表格标题 -->
    <template #title>
      <span>用户列表</span>
    </template>

    <!-- 自定义表格按钮 -->
    <template #button="{ data }">
      <el-button type="primary" @click="handleAdd">
        新增用户
      </el-button>
      <el-button type="danger" :disabled="!data.length">
        批量删除
      </el-button>
    </template>

    <!-- 自定义空数据显示 -->
    <template #empty>
      <el-empty description="暂无数据" />
    </template>
  </AppTable>
</template>
```

### 使用 useTable 钩子函数

为了简化表格数据的获取和管理，推荐使用 useTable 钩子函数：

```vue
<script setup lang="ts">
import { getUserList } from '@/api/user';
import { useTable } from '@/hooks/useTable';

// 定义搜索参数
const defaultParams = {
  keyword: '',
  status: '',
  date: null
};

// 使用useTable钩子
const { tableProps, getTableData, resetParams } = useTable({
  // 表格列配置
  columns: () => [
    { type: 'selection', width: 50 },
    { type: 'index', width: 60, label: '序号' },
    { prop: 'name', label: '用户名', width: 120 },
    { prop: 'age', label: '年龄', width: 80 },
    { prop: 'email', label: '邮箱', minWidth: 180 },
    {
      prop: 'createTime',
      label: '创建时间',
      width: 160,
      type: 'dateTime'
    },
    {
      prop: 'balance',
      label: '余额',
      width: 120,
      type: 'money'
    },
    {
      prop: 'operation',
      label: '操作',
      width: 150,
      fixed: 'right',
      align: 'center',
      renderContent: ({ row }) => (
        <div class="flex gap-2">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </div>
      )
    }
  ],
  // API请求函数
  apiFnc: getUserList,
  // 初始化参数
  apiParams: defaultParams,
  // 是否启用分页
  isPagination: true,
  // 分页配置
  pagination: {
    background: true,
    pageSize: 20,
    pageSizes: [10, 20, 50, 100]
  },
  // 请求参数转换函数
  formatParams: (params) => {
    // 转换日期等特殊参数
    const { date } = params;
    if (date) {
      params.startDate = date[0];
      params.endDate = date[1];
    }
    return params;
  },
  // 格式化返回数据
  formatData: (data) => {
    return data.map(item => ({
      ...item,
      // 可以在这里对数据进行额外处理
    }));
  }
});

// 新增用户
function handleAdd() {
  // 实现新增逻辑
}

// 编辑用户
function handleEdit(row) {
  // 实现编辑逻辑
}

// 删除用户
function handleDelete(row) {
  // 实现删除逻辑
}

// 重置搜索条件
function handleReset() {
  resetParams();
  getTableData();
}
</script>

<template>
  <AppTable
    v-bind="tableProps"
    @refresh="getTableData"
  >
    <template #button>
      <el-button type="primary" @click="handleAdd">
        新增用户
      </el-button>
    </template>
  </AppTable>
</template>
```

## useTable 钩子函数说明

useTable 钩子函数是为了简化表格数据加载和状态管理而设计的，它封装了常见的表格操作，如数据加载、分页、排序、筛选等。

### 参数说明

| 参数名           | 类型                                                                | 默认值  | 必填 | 说明             |
|---------------|-------------------------------------------------------------------|------|----|----------------|
| columns       | () => TableColumn[]                                               | -    | 是  | 返回表格列配置数组的函数   |
| apiFnc        | (params: any) => Promise<any>                                     | -    | 是  | 获取表格数据的API函数   |
| apiParams     | object                                                            | {}   | 否  | 请求参数初始值        |
| isPagination  | boolean                                                           | true | 否  | 是否启用分页         |
| pagination    | object                                                            | -    | 否  | 分页配置           |
| initData      | boolean                                                           | true | 否  | 是否在组件挂载时自动加载数据 |
| formatParams  | (params: any) => any                                              | -    | 否  | 请求参数格式化函数      |
| formatData    | (data: any[]) => any[]                                            | -    | 否  | 响应数据格式化函数      |
| summaryMethod | (params: {columns: any[], data: any[]}) => string[]               | -    | 否  | 自定义合计行计算方法     |
| spanOptions   | object                                                            | -    | 否  | 单元格合并配置        |
| load          | (row: any, treeNode: any, resolve: (data: any[]) => void) => void | -    | 否  | 树形表格懒加载函数      |

### 返回值说明

| 名称           | 类型                               | 说明                       |
|--------------|----------------------------------|--------------------------|
| loading      | Ref<boolean>                     | 表格加载状态                   |
| params       | Ref<object>                      | 当前请求参数                   |
| resetParams  | () => void                       | 重置请求参数的函数                |
| getTableData | (page?: number) => Promise<void> | 获取表格数据的函数，可传入页码参数        |
| tableProps   | ComputedRef<object>              | 可直接传递给AppTable组件的props对象 |

## 参数说明

### Props

| 参数名         | 类型                | 默认值   | 必填 | 说明                 |
|-------------|-------------------|-------|----|--------------------|
| columns     | TableColumn[]     | []    | 是  | 表格列配置数组            |
| title       | string            | -     | 否  | 表格标题               |
| loading     | boolean           | false | 否  | 表格加载状态             |
| loadingText | string            | '加载中' | 否  | 加载状态文本             |
| card        | boolean           | true  | 否  | 是否使用卡片式布局          |
| border      | boolean           | true  | 否  | 是否带有边框             |
| fit         | boolean           | true  | 否  | 列的宽度是否自撑开          |
| data        | any[]             | -     | 否  | 表格数据               |
| pagination  | object \| boolean | -     | 否  | 分页配置，设为false时不显示分页 |

### 列配置(Column)参数

| 参数名           | 类型                                                        | 默认值 | 必填 | 说明                                                                         |
|---------------|-----------------------------------------------------------|-----|----|----------------------------------------------------------------------------|
| type          | string                                                    | -   | 否  | 列类型，可选值：'index', 'selection', 'expand', 'money', 'date', 'dateTime', 'img' |
| prop          | string                                                    | -   | 否  | 对应列内容的字段名                                                                  |
| label         | string                                                    | -   | 否  | 显示的标题                                                                      |
| width         | string \| number                                          | -   | 否  | 列宽度                                                                        |
| minWidth      | string \| number                                          | -   | 否  | 列最小宽度                                                                      |
| fixed         | string \| boolean                                         | -   | 否  | 列是否固定，可选值：true/'left'/'right'                                              |
| show          | boolean                                                   | -   | 否  | 列是否显示                                                                      |
| renderContent | (scope: {row: any, column: any, $index: number}) => VNode | -   | 否  | 自定义列渲染函数                                                                   |

### 分页(Pagination)参数

| 参数名           | 类型                     | 默认值                                       | 必填 | 说明             |
|---------------|------------------------|-------------------------------------------|----|----------------|
| total         | number                 | 0                                         | 否  | 总条目数           |
| pageSize      | number                 | 10                                        | 否  | 每页显示条目个数       |
| currentPage   | number                 | 1                                         | 否  | 当前页数           |
| pageSizes     | number[]               | [10, 20, 50, 100]                         | 否  | 每页显示个数选择器的选项设置 |
| background    | boolean                | false                                     | 否  | 是否为分页按钮添加背景色   |
| layout        | string                 | 'total, sizes, prev, pager, next, jumper' | 否  | 组件布局，子组件名用逗号分隔 |
| currentChange | (page: number) => void | -                                         | 否  | 当前页改变时触发的函数    |
| sizeChange    | (size: number) => void | -                                         | 否  | 每页条数改变时触发的函数   |

### Events

| 事件名     | 类型                     | 说明                        |
|---------|------------------------|---------------------------|
| refresh | (page: number) => void | 刷新按钮点击时触发，参数为期望跳转的页码，通常为1 |

### Slots

| 插槽名    | 说明                     |
|--------|------------------------|
| title  | 自定义表格标题                |
| button | 自定义表格按钮区域，参数为 { data } |
| header | 表格主体上方区域               |
| append | 插入至表格最后一行之后的内容         |
| empty  | 当数据为空时自定义的内容           |
| foot   | 表格主体下方、分页上方区域          |

## 高级用法

### 单元格合并

useTable 支持配置单元格合并功能，适用于需要按照特定规则合并行或列的场景：

```ts
const { tableProps } = useTable({
  // 其他配置...
  spanOptions: {
    // 指定用于合并的字段
    spanKey: ['department'],
    // 判断是否需要合并的函数
    isSpan: ({ column }) => {
      // 仅当列属性为department时进行合并
      return column.property === 'department';
    }
  }
});
```

### 自定义合计行

useTable 支持配置自定义合计行计算方法：

```ts
const { tableProps } = useTable({
  // 其他配置...
  summaryMethod: (params) => {
    const { columns, data } = params;
    const sums: string[] = [];
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = '自定义合计';
        return;
      }

      // 计算特定列的合计值
      if (column.property === 'amount') {
        const values = data.map(item => Number(item.amount));
        const sum = values.reduce((prev, curr) => prev + curr, 0);
        sums[index] = `¥${sum.toFixed(2)}`;
      }
      else {
        sums[index] = '';
      }
    });
    return sums;
  }
});
```

## 注意事项

- 使用 useTable 钩子函数时，需要确保 apiFnc 函数返回的数据格式与组件预期一致
- 建议将列配置提取到单独的文件中，以便于维护和重用
- 对于需要自定义合并单元格的场景，确保正确配置 spanOptions 参数
- 在树形表格场景下，需要正确配置 load 参数实现懒加载功能
- 当使用 formatData 函数处理返回数据时，确保保持原始数据结构或按照表格预期格式进行转换
