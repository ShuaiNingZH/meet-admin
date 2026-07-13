<script setup lang="ts">
import dayjs from 'dayjs';

defineOptions({ name: '403' });

const { t } = useI18n();
const router = useRouter();
const appName = import.meta.env.VITE_APP_NAME;

// 跳转首页, 并清空历史记录
function backToHome() {
  router.replace('/');
}

// 返回上一页, 无历史记录时兜底回首页
function goBack() {
  if (window.history.length > 1)
    router.back();
  else
    router.replace('/');
}
</script>

<template>
  <div class="error-page">
    <!-- 背景装饰图案 -->
    <div class="background-pattern">
      <div class="pattern-circle circle-1" />
      <div class="pattern-circle circle-2" />
      <div class="pattern-square square-1" />
    </div>

    <div class="error-content">
      <!-- 403 数字插画 -->
      <div class="digits">
        <span class="digit">4</span>
        <div class="digit-icon">
          <app-icon icon="tabler:shield-lock" />
        </div>
        <span class="digit">3</span>

        <app-icon class="float-icon icon-key" icon="tabler:key-off" />
        <app-icon class="float-icon icon-ban" icon="tabler:ban" />
        <app-icon class="float-icon icon-print" icon="tabler:fingerprint" />
      </div>

      <h1 class="title">
        {{ t('page.403.title') }}
      </h1>
      <p class="description">
        {{ t('page.403.content') }}
      </p>
      <p class="hint">
        {{ t('page.403.info') }}
      </p>

      <div class="actions">
        <el-button type="warning" round size="large" @click="backToHome">
          <app-icon icon="tabler:home" />
          {{ t('page.403.button') }}
        </el-button>
        <el-button round size="large" @click="goBack">
          <app-icon icon="tabler:arrow-left" />
          {{ t('page.403.goBack') }}
        </el-button>
      </div>

      <div class="footer">
        {{ t('page.403.subtitle') }} © {{ dayjs().year() }}
        <el-link type="primary" href="https://blog.wjp.plus" target="_blank" underline="never">
          {{ appName }}
        </el-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  position: relative;
  flex: 1;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  // 背景装饰图案
  .background-pattern {
    position: absolute;
    inset: 0;
    pointer-events: none;

    .pattern-circle {
      position: absolute;
      border: 1px solid var(--el-color-warning-light-5);
      border-radius: 50%;
      animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;

      &.circle-1 {
        left: 10%;
        top: 15%;
        height: 96px;
        width: 96px;
      }

      &.circle-2 {
        right: 12%;
        bottom: 18%;
        height: 64px;
        width: 64px;
        animation-delay: 1000ms;
      }
    }

    .pattern-square {
      position: absolute;
      border: 1px solid var(--el-color-warning-light-5);
      border-radius: 8px;
      animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;

      &.square-1 {
        right: 18%;
        top: 22%;
        height: 40px;
        width: 40px;
        transform: rotate(20deg);
        animation-delay: 600ms;
      }
    }
  }

  .error-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 480px;
    padding: var(--spacing-xl);

    .digits {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);

      .digit {
        font-size: 96px;
        font-weight: 700;
        line-height: 1;
        background: linear-gradient(135deg, var(--el-color-warning), var(--el-color-warning-light-5));
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .digit-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 88px;
        width: 88px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--el-color-warning), var(--el-color-warning-light-5));
        animation: float 3s ease-in-out infinite;

        :deep(.app-icon) {
          font-size: 48px;
          color: #fff;
        }
      }

      .float-icon {
        position: absolute;
        color: var(--el-color-warning-light-3);
        animation: float 3s ease-in-out infinite;

        &.icon-key {
          left: -32px;
          top: -8px;
          font-size: 28px;
          animation-delay: 300ms;
        }

        &.icon-ban {
          right: -28px;
          top: 4px;
          font-size: 22px;
          color: var(--el-color-danger);
          animation-delay: 900ms;
        }

        &.icon-print {
          right: 8px;
          bottom: -28px;
          font-size: 24px;
          animation-delay: 1500ms;
        }
      }
    }

    .title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 var(--spacing-md);
      color: var(--el-text-color-primary);
    }

    .description {
      font-size: 15px;
      margin: 0 0 var(--spacing-xs);
      color: var(--el-text-color-regular);
    }

    .hint {
      font-size: 14px;
      margin: 0 0 var(--spacing-xl);
      color: var(--el-text-color-secondary);
    }

    .actions {
      display: flex;
      gap: var(--spacing-base);
    }

    .footer {
      margin-top: var(--spacing-xxl);
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.6;
    }

    50% {
      opacity: 0.2;
    }
  }
}
</style>
