<script setup lang="ts">
defineOptions({ name: 'DemoGrid' });

// 可调控制项
const cols = ref(4);
const fieldCount = ref(3);
const collapsedRows = ref(1);
const offset = ref(1);
const collapsed = ref(false);

// 表单数据
const form = reactive<Record<string, string>>({});

// 根据数量动态生成字段
const fields = computed(() =>
  Array.from({ length: fieldCount.value }, (_, i) => `field${i + 1}`),
);

function onSearch() {
  ElMessage.success('触发搜索');
}

function onReset() {
  Object.keys(form).forEach(key => (form[key] = ''));
  ElMessage.info('触发重置');
}

// 场景四：可动态增删的项列表，用于验证「按 DOM 顺序折叠」
let seq = 4;
const dynamicItems = ref(
  Array.from({ length: seq }, (_, i) => ({ id: i + 1, label: `项 ${i + 1}` })),
);

function prependItem() {
  seq++;
  dynamicItems.value.unshift({ id: seq, label: `项 ${seq}（插到开头）` });
}

function appendItem() {
  seq++;
  dynamicItems.value.push({ id: seq, label: `项 ${seq}（追加末尾）` });
}

function removeFirst() {
  dynamicItems.value.shift();
}
</script>

<template>
  <app-flex vertical>
    <!-- 控制面板 -->
    <app-card>
      <el-form inline>
        <el-form-item label="列数 cols">
          <el-input-number v-model="cols" :min="1" :max="6" />
        </el-form-item>
        <el-form-item label="字段数量">
          <el-input-number v-model="fieldCount" :min="1" :max="12" />
        </el-form-item>
        <el-form-item label="折叠行数 collapsedRows">
          <el-input-number v-model="collapsedRows" :min="1" :max="3" />
        </el-form-item>
        <el-form-item label="偏移 offset">
          <el-input-number v-model="offset" :min="0" :max="6" />
        </el-form-item>
        <el-form-item label="折叠 collapsed">
          <el-switch v-model="collapsed" />
        </el-form-item>
      </el-form>
    </app-card>

    <!-- 场景一：搜索表单（suffix = 操作按钮） -->
    <app-card>
      <h3 class="demo-title">
        场景一：搜索表单（suffix 为操作按钮）—— 单行时按钮紧跟最后一项，多行时右对齐
      </h3>
      <app-form
        :cols="cols"
        :collapsed-rows="collapsedRows"
        show-action
        @search="onSearch"
        @reset="onReset"
      >
        <app-form-item
          v-for="(field, index) in fields"
          :key="field"
          :label="`字段 ${index + 1}`"
        >
          <el-input v-model="form[field]" :placeholder="`请输入字段 ${index + 1}`" clearable />
        </app-form-item>
      </app-form>
    </app-card>

    <!-- 场景二：原始 AppGrid + span > 1 的项 -->
    <app-card>
      <h3 class="demo-title">
        场景二：原始 AppGrid，含 span=2 的项 —— 验证折叠/单行按「列数」而非「项数」计算
      </h3>
      <app-grid :cols="cols" :collapsed="collapsed" :collapsed-rows="collapsedRows" :row-gap="12" :col-gap="12">
        <app-grid-item class="demo-cell">
          普通项 A（span 1）
        </app-grid-item>
        <app-grid-item :span="2" class="demo-cell demo-cell--wide">
          宽项 B（span 2）
        </app-grid-item>
        <app-grid-item class="demo-cell">
          普通项 C（span 1）
        </app-grid-item>
        <app-grid-item class="demo-cell">
          普通项 D（span 1）
        </app-grid-item>
        <app-grid-item class="demo-cell">
          普通项 E（span 1）
        </app-grid-item>
        <app-grid-item suffix class="demo-cell demo-cell--suffix" #="{ hasCollapsible }">
          后缀项 suffix {{ hasCollapsible ? '（可折叠）' : '' }}
        </app-grid-item>
      </app-grid>
    </app-card>

    <!-- 场景三：offset 偏移 -->
    <app-card>
      <h3 class="demo-title">
        场景三：offset 偏移（用顶部「偏移 offset」调节）—— 偏移项被前置空列推开；offset + span 超出列数时自动收口，不会撑出隐式列
      </h3>
      <app-grid :cols="cols" :collapsed="collapsed" :collapsed-rows="collapsedRows" :row-gap="12" :col-gap="12">
        <app-grid-item class="demo-cell">
          普通项 A
        </app-grid-item>
        <app-grid-item :offset="offset" class="demo-cell demo-cell--wide">
          偏移项 B（offset {{ offset }}）
        </app-grid-item>
        <app-grid-item class="demo-cell">
          普通项 C
        </app-grid-item>
        <app-grid-item class="demo-cell">
          普通项 D
        </app-grid-item>
        <app-grid-item suffix class="demo-cell demo-cell--suffix" #="{ hasCollapsible }">
          后缀项 suffix {{ hasCollapsible ? '（可折叠）' : '' }}
        </app-grid-item>
      </app-grid>
    </app-card>

    <!-- 场景四：动态增删 + 折叠（验证按 DOM 顺序折叠） -->
    <app-card>
      <h3 class="demo-title">
        场景四：动态增删 + 折叠 —— 打开顶部「折叠」开关，再「插到开头」，被隐藏的始终是 DOM 靠后的项（而非最后注册的项）
      </h3>
      <div class="demo-actions">
        <el-button type="primary" @click="prependItem">
          插到开头
        </el-button>
        <el-button @click="appendItem">
          追加末尾
        </el-button>
        <el-button type="danger" plain @click="removeFirst">
          删除第一个
        </el-button>
      </div>
      <app-grid :cols="cols" :collapsed="collapsed" :collapsed-rows="collapsedRows" :row-gap="12" :col-gap="12">
        <app-grid-item v-for="item in dynamicItems" :key="item.id" class="demo-cell">
          {{ item.label }}
        </app-grid-item>
      </app-grid>
    </app-card>
  </app-flex>
</template>

<style scoped lang="scss">
.demo-title {
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.demo-actions {
  margin-bottom: 16px;
}

.demo-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border: 1px dashed var(--el-border-color);
  border-radius: 4px;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-regular);

  &--wide {
    background-color: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-5);
  }

  &--suffix {
    background-color: var(--el-color-success-light-9);
    border-color: var(--el-color-success-light-5);
  }
}
</style>
