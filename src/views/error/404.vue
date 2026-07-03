<script setup lang="ts">
defineOptions({ name: '404' });

const { t } = useI18n();
const router = useRouter();

// 跳转首页, 并清空历史记录
function backToHome() {
  router.replace('/');
}
</script>

<template>
  <app-flex class="error-page" align="center" justify="center">
    <img alt="404" class="pic-404" src="@/assets/images/404-Error-amico.svg">
    <div class="bullshit">
      <div class="bullshit__oops">
        {{ t('page.404.title') }}
      </div>
      <div class="bullshit__info">
        {{ t('page.404.subtitle') }}
        <el-link type="primary" href="https://blog.wjp.plus" target="_blank">
          Meet you
        </el-link>
      </div>
      <div class="bullshit__headline">
        {{ t('page.404.content') }}
      </div>
      <div class="bullshit__info">
        {{ t('page.404.info') }}
      </div>
      <el-button type="primary" round @click="backToHome">
        {{ t('page.404.button') }}
      </el-button>
    </div>
  </app-flex>
</template>

<style scoped lang="scss">
.error-page {
  flex: 1;
  height: 100%;

  .pic-404 {
    max-width: 500px;
    width: 60%;
    min-width: 255px;
    opacity: 0;
    animation-name: slideUpImage;
    animation-duration: 0.8s;
    animation-fill-mode: forwards;
  }

  .bullshit {
    width: 300px;

    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: var(--el-color-primary);
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }

    &__headline {
      font-size: 20px;
      line-height: 24px;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }

    &__info {
      line-height: 21px;
      color: var(--el-text-color-secondary);
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }

    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }

  @keyframes slideUpImage {
    0% {
      transform: translateY(30px); // 从下往上
      opacity: 0;
    }
    100% {
      transform: translateY(0); // 正常位置
      opacity: 1;
    }
  }
}
</style>
