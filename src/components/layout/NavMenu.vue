<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-logo">
        <img src="@/assets/image/logo.png" alt="Logo" class="login-logo-image" />
      </div>

      <div class="brand-text">
        QLGPLX
        <span class="brand-sub"> Website administrator </span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{
          active: isMenuItemActive(item, route.path),
          'no-permission': !hasPermission(item),
        }"
        @click="handleMenuClick($event, item)"
      >
        <lord-icon
          :src="item.icon"
          trigger="hover"
          delay="100"
          stroke="bold"
          :state="item.state"
          colors="primary:#242424,secondary:#e83a30"
          class="nav-icon"
        >
        </lord-icon>

        <span class="nav-label">
          {{ item.label }}
        </span>

        <i
          v-if="!hasPermission(item)"
          class="bi bi-lock-fill nav-lock"
          title="Bạn không có quyền truy cập chức năng này"
        ></i>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useSidebarStore } from '@/stores/sidebarStore'
import { useAuthStore } from '@/stores/authStore'
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isMenuItemActive, menuItems } from '@/utils/navItems'

const sidebarStore = useSidebarStore()
const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()

const hasPermission = (item) => {
  if (!item.permission && !item.permissions) return true

  if (item.permission) {
    return authStore.hasPermission(item.permission)
  }

  if (item.permissions) {
    return item.permissions.some((permission) => authStore.hasPermission(permission))
  }

  return true
}

const handleMenuClick = (event, item) => {
  if (!hasPermission(item)) {
    event.preventDefault()
    return
  }

  router.push(item.path)
}

onMounted(() => {
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (item.classList.contains('no-permission')) return

      const icon = item.querySelector('lord-icon')
      if (icon?.playerInstance) {
        icon.playerInstance.playFromBeginning()
      }
    })
  })
})

watch(
  () => route.path,
  () => {
    setTimeout(() => {
      document.querySelectorAll('.nav-item lord-icon').forEach((icon) => {
        if (icon?.playerInstance) {
          icon.playerInstance.pause()
        }
      })

      const activeItem = document.querySelector('.nav-item.active')
      if (activeItem && !activeItem.classList.contains('no-permission')) {
        const icon = activeItem.querySelector('lord-icon')
        if (icon?.playerInstance) {
          icon.setAttribute('trigger', 'loop')
          icon.playerInstance.playFromBeginning()
        }
      }
    }, 100)
  },
  { immediate: true },
)
</script>
