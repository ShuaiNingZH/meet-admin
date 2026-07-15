<script setup lang="ts">
import type { Placement } from 'element-plus';

defineOptions({ name: 'DemoText' });

// 可调控制项
const containerWidth = ref(240);
const lineClamp = ref(2);
const tooltipDisabled = ref(false);
const placement = ref<Placement>('top');
const effect = ref<'dark' | 'light'>('dark');

const placements: Placement[] = ['top', 'bottom', 'left', 'right', 'top-start', 'bottom-end'];

const longText = '这是一段非常长的文本，用于演示 AppText 的溢出检测能力：当容器宽度不足以完整展示内容时，文本会自动省略，并在鼠标悬停时通过 tooltip 展示完整内容；未溢出时则不会出现 tooltip，避免无意义的打扰。';

function handleClick() {
  ElMessage.success('文本被点击了');
}
</script>

<template>
  <app-flex vertical>
    <!-- 控制面板 -->
    <app-card>
      <el-form inline>
        <el-form-item label="容器宽度">
          <el-slider v-model="containerWidth" :min="100" :max="600" class="demo-slider" />
        </el-form-item>
        <el-form-item label="lineClamp">
          <el-input-number v-model="lineClamp" :min="1" :max="5" />
        </el-form-item>
        <el-form-item label="tooltipDisabled">
          <el-switch v-model="tooltipDisabled" />
        </el-form-item>
        <el-form-item label="placement">
          <el-select v-model="placement" class="demo-select">
            <el-option v-for="item in placements" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="effect">
          <el-select v-model="effect" class="demo-select">
            <el-option label="dark" value="dark" />
            <el-option label="light" value="light" />
          </el-select>
        </el-form-item>
      </el-form>
    </app-card>

    <!-- 场景一：类型与尺寸 -->
    <app-card>
      <h3 class="demo-title">
        场景一：类型与尺寸 —— type / size 透传给 el-text
      </h3>
      <app-flex vertical :size="8">
        <app-flex :size="16">
          <app-text>默认文本</app-text>
          <app-text type="primary">
            主要文本
          </app-text>
          <app-text type="success">
            成功文本
          </app-text>
          <app-text type="warning">
            警告文本
          </app-text>
          <app-text type="danger">
            危险文本
          </app-text>
          <app-text type="info">
            信息文本
          </app-text>
        </app-flex>
        <app-flex :size="16" align="center">
          <app-text size="large">
            大号文本
          </app-text>
          <app-text>默认大小</app-text>
          <app-text size="small">
            小号文本
          </app-text>
          <app-text content="通过 content 属性设置的文本" type="primary" />
        </app-flex>
      </app-flex>
    </app-card>

    <!-- 场景二：单行省略 + 溢出检测 -->
    <app-card>
      <h3 class="demo-title">
        场景二：单行省略 —— 拖动顶部「容器宽度」，溢出时 hover 才出 tooltip，未溢出时无 tooltip
      </h3>
      <app-flex vertical :size="8">
        <div class="demo-box" :style="{ width: `${containerWidth}px` }">
          <app-text :tooltip-disabled :placement :effect>
            {{ longText }}
          </app-text>
        </div>
        <div class="demo-box" :style="{ width: `${containerWidth}px` }">
          <app-text :tooltip-disabled :placement :effect>
            短文本不会出 tooltip
          </app-text>
        </div>
      </app-flex>
    </app-card>

    <!-- 场景三：多行省略 -->
    <app-card>
      <h3 class="demo-title">
        场景三：多行省略 —— lineClamp 控制最大行数，超出行数才出 tooltip
      </h3>
      <div class="demo-box" :style="{ width: `${containerWidth}px` }">
        <app-text :line-clamp :tooltip-disabled :placement :effect>
          {{ longText }}
        </app-text>
      </div>
    </app-card>

    <!-- 场景四：插槽含子元素 -->
    <app-card>
      <h3 class="demo-title">
        场景四：插槽含子元素 —— 鼠标悬停在 em/strong 子元素上时，溢出检测依然生效
      </h3>
      <div class="demo-box" :style="{ width: `${containerWidth}px` }">
        <app-text :tooltip-disabled :placement :effect>
          合同编号：<em>HT-2026-000123</em>，签约主体：<strong>某某科技（深圳）有限公司</strong>，本行文本包含嵌套元素，悬停在斜体或加粗部分同样能触发 tooltip。
        </app-text>
      </div>
    </app-card>

    <!-- 场景五：点击事件 -->
    <app-card>
      <h3 class="demo-title">
        场景五：点击事件 —— @click 事件回调
      </h3>
      <app-text type="primary" @click="handleClick">
        点我触发 click 事件
      </app-text>
    </app-card>
  </app-flex>
</template>

<style scoped lang="scss">
.demo-title {
  margin: 0 0 var(--spacing-base);
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.demo-slider {
  width: 200px;
}

.demo-select {
  width: 140px;
}

.demo-box {
  padding: var(--spacing-sm);
  border: 1px dashed var(--el-border-color);
  border-radius: 4px;
  background-color: var(--el-fill-color-light);
}
</style>
