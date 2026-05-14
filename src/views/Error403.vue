<script setup>
import { useRouter } from 'vue-router'

import MainLayout from '@/components/layout/MainLayout.vue'

const router = useRouter()
</script>

<template>
  <MainLayout>
    <div class="error-page">
      <div class="error-card">
        <lord-icon
          src="https://cdn.lordicon.com/txecmeic.json"
          trigger="loop"
          style="width: 150px; height: 150px"
        >
        </lord-icon>
        <h1>403</h1>
        <h2>Không có quyền truy cập</h2>
        <p>Bạn không được cấp quyền thao tác chức năng này.</p>

        <button @click="router.push('/')">Quay về trang chủ</button>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-h));
  padding: 24px;
}

.error-card {
  width: min(520px, 100%);
  padding: 42px;
  border: 1px solid var(--border);
  border-radius: 24px;
  background: var(--bg-surface);
  box-shadow: var(--shadow-md);
  text-align: center;
}

.error-card i {
  font-size: 58px;
  color: var(--danger);
}

.error-card h1 {
  margin-top: 16px;
  font-family: var(--font-display);
  font-size: 58px;
}

.error-card h2 {
  margin-top: 8px;
  font-size: 24px;
}

.error-card p {
  margin-top: 10px;
  color: var(--text-secondary);
}

.error-card button {
  margin-top: 24px;
  min-height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 14px;
  color: white;
  background: var(--accent-hover);
  font-weight: 700;
  cursor: pointer;
}
</style>
