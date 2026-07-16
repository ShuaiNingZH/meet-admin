<script setup lang="ts">
import dayjs from 'dayjs';

defineOptions({ name: 'LayFooter' });

const appName = import.meta.env.VITE_APP_NAME;
</script>

<template>
  <el-footer>
    Copyright © 2024-{{ dayjs().format('YYYY') }}
    <el-link href="https://github.com/wjp980108/meet-admin" target="_blank" underline="never">
      &nbsp;{{ appName }}
    </el-link>
  </el-footer>
</template>

<style scoped lang="scss">
.el-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  --el-footer-height: 35px;
}
</style>
