<script setup>
import Loading from './components/common/Loading.vue'
import ToastContainer from './components/common/ToastContainer.vue'
</script>

<template>
  <RouterView />
  <Loading />
  <ToastContainer />
</template>
