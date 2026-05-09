<script setup>
import { useLoadingStore } from '@/stores/loadingStore'

const loadingStore = useLoadingStore()
</script>

<template>
  <div v-if="loadingStore.isLoading" class="loading">
    <div class="loader-wrapper">
      <img src="/src/assets/icon/gif/loading.gif" class="loader" />
      <div class="loading-text">Đang tải...</div>
    </div>
  </div>
</template>
