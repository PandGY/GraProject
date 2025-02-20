<script setup lang="ts">
import type { zhCn } from 'element-plus/es/locale/index.mjs';
import { useContractStore } from './stores/useContractStore';
import { storeToRefs } from 'pinia';

window.global = window

const contractStore = useContractStore()
const { isLoading } = storeToRefs(contractStore)
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
    <el-loading 
      v-model:fullscreen="isLoading"
      text="拼命加载中..."
    />
  </el-config-provider>
</template>

<style scoped>

</style>
