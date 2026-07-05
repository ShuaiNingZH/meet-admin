<script setup lang="ts">
import { openPopup } from '@/components/AppPopup';

defineOptions({ name: 'DemoPopup' });

// 场景一：基础用法
const showBasic = ref(false);
function handleBasicConfirm() {
  ElMessage.success('确认操作');
  showBasic.value = false;
}

// 场景二：自定义底部按钮
const showCustom = ref(false);
const buttonReverse = ref(false);
const footerPosition = ref<'left' | 'center' | 'right' | 'space-between'>('right');
function handleCustomConfirm() {
  ElMessage.success('提交成功');
  showCustom.value = false;
}

// 场景三：无底部弹窗
const showNoFooter = ref(false);

// 场景四：自定义头部和底部
const showCustomHeaderFooter = ref(false);
function handleCustomAction() {
  ElMessage.success('自定义操作触发');
  showCustomHeaderFooter.value = false;
}

// 场景五：命令式调用
function openSimplePopup() {
  openPopup({
    title: '提示',
    content: '这是一个命令式弹窗，onOk 正常返回后会自动关闭。',
    onOk: () => {
      ElMessage.success('确认操作');
    },
  });
}

// 第一次点击确认时保持打开，第二次才真正关闭，用于演示 onOk 返回 false 的效果
let dangerConfirmed = false;
function openDangerPopup() {
  dangerConfirmed = false;
  openPopup({
    title: '危险操作',
    content: '确认执行该操作吗？（首次点击确认会保持弹窗打开，再次点击才真正执行）',
    confirmText: '执行',
    onOk: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!dangerConfirmed) {
        dangerConfirmed = true;
        ElMessage.warning('请再次点击确认以真正执行');
        return false;
      }
      ElMessage.success('操作已执行');
    },
  });
}

function openComponentPopup() {
  openPopup({
    title: '组件内容（h() 构造 VNode）',
    width: 420,
    showFooter: false,
    content: h('div', { class: 'popup-vnode-content' }, [
      h('p', null, '这段内容通过 h() 构造的 VNode 传入 openPopup。'),
      h('p', { style: 'color: var(--el-color-success)' }, '无需预先在模板中声明弹窗即可展示。'),
    ]),
  });
}
</script>

<template>
  <app-flex vertical>
    <app-card>
      <h3 class="demo-title">
        场景一：基础用法 —— 确认按钮不会自动关闭，需在 confirm 事件中手动关闭
      </h3>
      <el-button type="primary" @click="showBasic = true">
        打开基础弹窗
      </el-button>
      <app-popup v-model="showBasic" title="基础弹窗" @confirm="handleBasicConfirm">
        <div>这是一个基础弹窗，点击「保存」会触发 confirm 事件。</div>
      </app-popup>
    </app-card>
    <app-card>
      <h3 class="demo-title">
        场景二：自定义底部按钮 —— confirmText / cancelText / buttonReverse / footerPosition
      </h3>
      <div class="demo-actions">
        <el-form inline>
          <el-form-item label="按钮位置对调">
            <el-switch v-model="buttonReverse" />
          </el-form-item>
          <el-form-item label="对齐方式">
            <el-select v-model="footerPosition" style="width: 160px">
              <el-option label="left" value="left" />
              <el-option label="center" value="center" />
              <el-option label="right" value="right" />
              <el-option label="space-between" value="space-between" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="showCustom = true">
          打开自定义按钮弹窗
        </el-button>
      </div>
      <app-popup
        v-model="showCustom"
        title="自定义按钮"
        confirm-text="提交"
        cancel-text="关闭"
        :button-reverse="buttonReverse"
        :footer-position="footerPosition"
        @confirm="handleCustomConfirm"
      >
        <div>自定义按钮文本、顺序与对齐方式的弹窗内容。</div>
      </app-popup>
    </app-card>
    <app-card>
      <h3 class="demo-title">
        场景三：无底部按钮 —— showFooter 设为 false
      </h3>
      <el-button type="primary" @click="showNoFooter = true">
        打开无底部弹窗
      </el-button>

      <app-popup v-model="showNoFooter" title="无底部弹窗" :show-footer="false">
        <div>这个弹窗没有底部按钮区域，通常配合点击遮罩层或右上角关闭按钮使用。</div>
      </app-popup>
    </app-card>
    <app-card>
      <h3 class="demo-title">
        场景四：自定义头部和底部 —— 通过 header / footer 插槽完全接管
      </h3>
      <el-button type="primary" @click="showCustomHeaderFooter = true">
        打开自定义头尾弹窗
      </el-button>

      <app-popup v-model="showCustomHeaderFooter">
        <template #header="{ close }">
          <div class="custom-header">
            <h3>自定义头部</h3>
            <app-icon icon="Close" class="custom-header-close" @click="close" />
          </div>
        </template>

        <div>弹窗主体内容，头部和底部均由插槽自定义。</div>

        <template #footer>
          <div class="custom-footer">
            <el-button type="success" @click="handleCustomAction">
              自定义操作
            </el-button>
            <el-button @click="showCustomHeaderFooter = false">
              关闭
            </el-button>
          </div>
        </template>
      </app-popup>
    </app-card>
    <app-card>
      <h3 class="demo-title">
        场景五：命令式调用 —— openPopup，无需预先在模板中声明弹窗
      </h3>
      <div class="demo-actions">
        <el-button type="primary" @click="openSimplePopup">
          简单文本弹窗
        </el-button>
        <el-button type="danger" plain @click="openDangerPopup">
          onOk 返回 false 保持打开
        </el-button>
        <el-button @click="openComponentPopup">
          h() 构造的 VNode 内容
        </el-button>
      </div>
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;

  h3 {
    margin: 0;
    font-size: 16px;
  }

  &-close {
    cursor: pointer;
  }
}

.custom-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
